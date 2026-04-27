// ─── Rate limiting côté serveur via la table `rate_limits` ──────────────────
// Stocke les tentatives par userId + action, avec un seuil de requêtes
// sur une fenêtre de temps donnée (ex: 10 requêtes/heure).

import { createAdminClient } from './supabase/server';

/**
 * Vérifie le rate limiting pour une action admin.
 *
 * @param adminId - ID de l'admin qui effectue l'action
 * @param actionName - Nom de l'action (ex: 'invite_user', 'validate_demande', 'resend_invite')
 * @param max - Nombre maximum d'actions autorisées dans la fenêtre de temps
 * @param windowMs - Fenêtre de temps en millisecondes (défaut: 1 heure = 3600000ms)
 * @returns true si l'action est autorisée, false si le taux est dépassé
 */
export async function checkRateLimit(
  adminId: string,
  actionName: string,
  max: number = 10,
  windowMs: number = 3600000
): Promise<boolean> {
  try {
    const admin = await createAdminClient();
    const since = new Date(Date.now() - windowMs).toISOString();

    // Compter les actions de cet admin dans la fenêtre de temps
    const { count, error: countError } = await admin
      .from('_rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('admin_id', adminId)
      .eq('action_name', actionName)
      .gte('created_at', since);

    if (countError) {
      console.error(`[rate-limit] Erreur de comptage pour ${actionName}:`, countError);
      return true; // En cas d'erreur, on autorise (fail open) pour ne pas bloquer le site
    }

    if (count !== null && count >= max) {
      console.warn(`[rate-limit] Limite atteinte pour ${adminId} / ${actionName}: ${count}/${max}`);
      return false;
    }

    // Enregistrer cette action
    const { error: insertError } = await admin
      .from('_rate_limits')
      .insert({
        admin_id: adminId,
        action_name: actionName,
      });

    if (insertError) {
      console.error(`[rate-limit] Erreur d'insertion pour ${actionName}:`, insertError);
      // On continue même si l'insertion échoue (fail open)
    }

    // Cleanup des entrées > 24h (toutes les 10 insertions approximativement)
    if (Math.random() < 0.1) {
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      await admin
        .from('_rate_limits')
        .delete()
        .lt('created_at', cutoff);
    }

    return true;
  } catch (e) {
    console.error('[rate-limit] Exception:', e);
    return true; // Fail open
  }
}
