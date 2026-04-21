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
      .select('email, statut')
      .eq('id', demandeId)
      .single();

    if (fetchErr || !demande) {
      return NextResponse.json({ error: 'Demande introuvable' }, { status: 404 });
    }

    if (demande.statut !== 'validee') {
      return NextResponse.json({ error: 'La demande doit être validée pour renvoyer le mail.' }, { status: 400 });
    }

    const origin = new URL(request.url).origin;
    const redirectTo = `${origin}/api/auth/callback?next=/auth/set-password`;

    const { error: resendErr } = await admin.auth.resetPasswordForEmail(demande.email, {
      redirectTo,
    });

    if (resendErr) {
      return NextResponse.json({ error: resendErr.message || 'Erreur lors du renvoi.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('[resend-invite] exception:', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
