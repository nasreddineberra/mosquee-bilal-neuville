// ─── POST /api/admin/resend-invite ──────────────────────────────────────────
// Renvoie une invitation email à une demande validée mais dont l'utilisateur
// ne s'est pas encore connecté. Réservé administrateur.
// Protection CSRF + rate-limit (10/heure).
import { serverLog } from '@/lib/logger';
import { checkOrigin } from '@/lib/csrf';
import { createAdminClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const originCheck = checkOrigin(request);
    if (originCheck) return originCheck;

    const { demandeId } = await request.json();
    if (!demandeId) {
      return NextResponse.json({ error: 'demandeId manquant' }, { status: 400 });
    }

    const admin = await createAdminClient();
    const { data: { user } } = await admin.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { data: me } = await admin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (me?.role !== 'administrateur') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const allowed = await checkRateLimit(user.id, 'resend_invite', 10, 3600000);
    if (!allowed) {
      return NextResponse.json({ error: 'Trop d\'invitations. Réessaye dans une heure.' }, { status: 429 });
    }

    // Récupérer l'email de la demande validée
    const { data: demande, error: fetchErr } = await admin
      .from('demandes_acces')
      .select('email, statut')
      .eq('id', demandeId)
      .single();

    if (fetchErr || !demande) {
      return NextResponse.json({ error: 'Demande introuvable' }, { status: 404 });
    }
    if (demande.statut !== 'validee') {
      return NextResponse.json({ error: 'Seules les demandes validées peuvent être renvoyées.' }, { status: 400 });
    }

    // Renvoyer l'invitation Supabase (vérifie si l'utilisateur existe déjà)
    const origin = new URL(request.url).origin;
    const { error: inviteErr } = await admin.auth.admin.inviteUserByEmail(demande.email, {
      redirectTo: `${origin}/mon-profil`,
    });

    if (inviteErr) {
      return NextResponse.json({ error: inviteErr.message || 'Erreur lors du renvoi.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    await serverLog('error', '[resend-invite]', 'Erreur', { error: e });
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
