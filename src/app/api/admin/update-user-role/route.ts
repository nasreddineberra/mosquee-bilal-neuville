// ─── POST /api/admin/update-user-role ───────────────────────────────────────
// Modifie le rôle d'un utilisateur dans la table profiles.
// Réservé administrateur. Protection CSRF.
// L'admin ne peut pas modifier son propre rôle.
// Log l'action dans admin_logs.
import { serverLog } from '@/lib/logger';
import { logAdminAction } from '@/lib/admin-logger';
import { checkOrigin } from '@/lib/csrf';
import { ALL_ROLES } from '@/lib/roles';
import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const originCheck = checkOrigin(request);
    if (originCheck) return originCheck;

    const { userId, role } = await request.json();
    if (!userId || !role) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
    }
    if (!ALL_ROLES.includes(role)) {
      return NextResponse.json({ error: 'Rôle invalide' }, { status: 400 });
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

    // Empêcher l'auto-rétrogradation
    if (userId === user.id) {
      return NextResponse.json({ error: 'Vous ne pouvez pas modifier votre propre rôle.' }, { status: 400 });
    }

    const { error: updateErr } = await admin
      .from('profiles')
      .update({ role })
      .eq('id', userId);

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message || 'Erreur lors de la mise à jour.' }, { status: 500 });
    }

    await logAdminAction(user.id, 'update_user_role', 'user', userId, { nouveau_role: role });

    return NextResponse.json({ success: true });
  } catch (e) {
    await serverLog('error', '[update-user-role]', 'Erreur', { error: e });
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
