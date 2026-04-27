// ─── Logger d'actions administrateur ───────────────────────────────────────
// Insère une entrée dans la table `admin_logs` pour tracer les actions
// sensibles (validation demande, changement rôle, suppression).

import { createAdminClient } from '@/lib/supabase/server';

type LogAction =
  | 'delete_user'
  | 'invite_user'
  | 'validate_demande'
  | 'refuse_demande'
  | 'update_user_role';

type LogDetails = Record<string, unknown>;

/**
 * Enregistre une action administrateur dans la table admin_logs.
 * À appeler après une action réussie dans les endpoints admin.
 */
export async function logAdminAction(
  adminId: string,
  action: LogAction,
  cibleType: string | null,
  cibleId: string | null,
  details: LogDetails | null = null
): Promise<void> {
  try {
    const admin = await createAdminClient();
    await admin.from('admin_logs').insert({
      admin_id: adminId,
      action,
      cible_type: cibleType,
      cible_id: cibleId,
      details,
    });
  } catch (e) {
    // Fail open : ne jamais bloquer l'action utilisateur à cause du logging
    console.error('[admin-logger] echec enregistrement log:', e);
  }
}
