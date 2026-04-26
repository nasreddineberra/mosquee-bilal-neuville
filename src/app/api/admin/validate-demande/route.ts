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

    const { data: demande, error: fetchErr } = await admin
      .from('demandes_acces')
      .select('id, email, nom, prenom, telephone, adresse, statut, newsletter_opt_in')
      .eq('id', demandeId)
      .single();

    if (fetchErr || !demande) {
      return NextResponse.json({ error: 'Demande introuvable' }, { status: 404 });
    }

    if (demande.statut !== 'en_attente') {
      return NextResponse.json({ error: 'Demande déjà traitée' }, { status: 400 });
    }

    const origin = new URL(request.url).origin;
    const { data: invited, error: inviteErr } = await admin.auth.admin.inviteUserByEmail(
      demande.email,
      { redirectTo: `${origin}/auth/set-password` }
    );

    if (inviteErr || !invited?.user) {
      return NextResponse.json({ error: inviteErr?.message || 'Erreur invitation' }, { status: 500 });
    }

    const { error: updateProfileErr } = await admin
      .from('profiles')
      .update({
        prenom: demande.prenom,
        nom: demande.nom,
        telephone: demande.telephone,
        adresse: demande.adresse,
        newsletter_opt_in: demande.newsletter_opt_in,
      })
      .eq('id', invited.user.id);

    if (updateProfileErr) {
      return NextResponse.json({ error: 'Erreur mise à jour profil' }, { status: 500 });
    }

    await admin
      .from('demandes_acces')
      .update({
        statut: 'validee',
        traite_par: user.id,
        traite_at: new Date().toISOString(),
      })
      .eq('id', demandeId);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('[validate-demande] exception:', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
