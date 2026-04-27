// ─── API utilisateur : adhésion obsèques (GET) ─────────────────────────────
// Renvoie le dossier complet d'adhésion obsèques de l'utilisateur connecté :
// adhésion, ayants droit, contacts d'urgence, paiements et documents.

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/user/adhesion
 * Retourne les données d'adhésion obsèques de l'utilisateur connecté.
 * Appels Supabase protégés côté serveur — pas exposés dans le bundle JS.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 });

    const { data: adhesion, error: adhErr } = await supabase
      .from('adhesions_obseques')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (adhErr) throw adhErr;
    if (!adhesion) return NextResponse.json({ adhesion: null });

    // Charger toutes les sous-données en parallèle
    const [ayantsDroit, contacts, paiements, documents] = await Promise.all([
      supabase.from('adhesions_obseques_ayants_droit')
        .select('*').eq('adhesion_id', adhesion.id).order('id'),
      supabase.from('adhesions_obseques_contacts_urgence')
        .select('*').eq('adhesion_id', adhesion.id).order('ordre_priorite'),
      supabase.from('adhesions_obseques_paiements')
        .select('*').eq('adhesion_id', adhesion.id).order('annee_concernee', { ascending: false }),
      supabase.from('adhesions_obseques_documents')
        .select('*').eq('adhesion_id', adhesion.id).order('created_at', { ascending: false }),
    ]);

    return NextResponse.json({
      adhesion,
      ayantsDroit: ayantsDroit.data ?? [],
      contacts: contacts.data ?? [],
      paiements: paiements.data ?? [],
      documents: documents.data ?? [],
    });
  } catch (e) {
    console.error('[api/user/adhesion] GET error:', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
