// ─── POST /api/admin/delete-user ────────────────────────────────────────────
// Supprime un utilisateur de la base auth Supabase.
// Réservé administrateur. Protection CSRF (checkOrigin).
// Log l'action dans admin_logs.
import { serverLog } from '@/lib/logger';
import { logAdminAction } from '@/lib/admin-logger';
import { checkOrigin } from '@/lib/csrf';
import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const originCheck = checkOrigin(request);
    if (originCheck) return originCheck;

    const { userId } = await request.json();
    if (!userId) return NextResponse.json({ error: 'userId requis.' }, { status: 400 });

    const admin = await createAdminClient();
    const { data: { user } } = await admin.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

    // Empêcher l'auto-suppression
    if (user.id === userId) {
      return NextResponse.json({ error: 'Impossible de supprimer votre propre compte.' }, { status: 400 });
    }
    const { data: me } = await admin.from('profiles').select('role').eq('id', user.id).single();
    if (me?.role !== 'administrateur') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const { error: deleteErr } = await admin.auth.admin.deleteUser(userId);
    if (deleteErr) {
      return NextResponse.json({ error: deleteErr.message || 'Erreur lors de la suppression.' }, { status: 500 });
    }

    await logAdminAction(user.id, 'delete_user', 'user', userId, { cible: userId });

    return NextResponse.json({ success: true });
  } catch (e) {
    await serverLog('error', '[delete-user]', 'Erreur', { error: e });
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
