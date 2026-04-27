// ─── POST /api/admin/invite-user ────────────────────────────────────────────
// Invite un utilisateur par email via Supabase Auth (admin).
// Réservé administrateur. Protection CSRF + rate-limit (10/heure).
// Log l'action dans admin_logs.
import { serverLog } from '@/lib/logger';
import { INVITABLE_ROLES } from '@/lib/roles';
import { logAdminAction } from '@/lib/admin-logger';
import { checkOrigin } from '@/lib/csrf';
import { createAdminClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const originCheck = checkOrigin(request);
    if (originCheck) return originCheck;

    const { email, role } = await request.json();
    if (!email || !role) {
      return NextResponse.json({ error: 'Email et rôle requis.' }, { status: 400 });
    }
    if (!INVITABLE_ROLES.includes(role)) {
      return NextResponse.json({ error: 'Rôle invalide.' }, { status: 400 });
    }

    const admin = await createAdminClient();
    const { data: { user } } = await admin.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    const { data: me } = await admin.from('profiles').select('role').eq('id', user.id).single();
    if (me?.role !== 'administrateur') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    // Rate-limit : max 10 invitations par heure
    const allowed = await checkRateLimit(user.id, 'invite_user', 10, 3600000);
    if (!allowed) {
      return NextResponse.json({ error: 'Trop d\'invitations. Réessaye dans une heure.' }, { status: 429 });
    }

    const origin = new URL(request.url).origin;
    const { data: invited, error: inviteErr } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${origin}/auth/set-password`,
    });
    if (inviteErr) {
      return NextResponse.json({ error: inviteErr.message || 'Erreur lors de l\'invitation.' }, { status: 500 });
    }

    // Créer le profil et assigner le rôle
    const { error: profileErr } = await admin.from('profiles').insert({
      id: invited.user.id,
      email: email.toLowerCase().trim(),
      role,
    });
    if (profileErr) {
      return NextResponse.json({ error: profileErr.message || 'Erreur lors de la création du profil.' }, { status: 500 });
    }

    await logAdminAction(user.id, 'invite_user', 'user', invited.user.id, { email, role });

    return NextResponse.json({ success: true });
  } catch (e) {
    await serverLog('error', '[invite-user]', 'Erreur', { error: e });
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
