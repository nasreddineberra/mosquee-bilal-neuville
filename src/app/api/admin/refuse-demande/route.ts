import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { demandeId } = await request.json();
    if (!demandeId) {
      return NextResponse.json({ error: 'demandeId manquant' }, { status: 400 });
    }

    const userClient = await createClient();
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const admin = await createAdminClient();

    const { data: me } = await admin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (me?.role !== 'administrateur') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const { error: updateErr } = await admin
      .from('demandes_acces')
      .update({
        statut: 'refusee',
        traite_par: user.id,
        traite_at: new Date().toISOString(),
      })
      .eq('id', demandeId)
      .eq('statut', 'en_attente');

    if (updateErr) {
      return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('[refuse-demande] exception:', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
