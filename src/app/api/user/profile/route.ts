// ─── API utilisateur : profil (GET/PUT) ────────────────────────────────────
// GET  → renvoie le profil de l'utilisateur connecté (depuis table `profiles`)
// PUT  → met à jour les champs autorisés du profil (prenom, nom, telephone, adresse, newsletter)

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/user/profile
 * Retourne le profil de l'utilisateur connecté (côté serveur, RLS protégé).
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 });

    const { data, error } = await supabase
      .from('profiles')
      .select('email, role, prenom, nom, telephone, adresse, newsletter_opt_in')
      .eq('id', user.id)
      .maybeSingle();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (e) {
    console.error('[api/user/profile] GET error:', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/**
 * PUT /api/user/profile
 * Met à jour le profil de l'utilisateur connecté.
 */
export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 });

    const body = await request.json();
    // Seuls ces champs sont autorisés — pas de mass-assignment
    const allowedFields: Record<string, unknown> = {};
    const fields = ['prenom', 'nom', 'telephone', 'adresse', 'newsletter_opt_in'] as const;
    for (const f of fields) {
      if (body[f] !== undefined) allowedFields[f] = body[f];
    }
    // Nettoyage : vider les chaînes → null
    if (allowedFields.telephone === '') allowedFields.telephone = null;
    if (allowedFields.adresse === '') allowedFields.adresse = null;

    const { error } = await supabase
      .from('profiles')
      .update(allowedFields)
      .eq('id', user.id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('[api/user/profile] PUT error:', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
