// ─── Logger serveur structuré ──────────────────────────────────────────────
// En développement : affiche dans la console
// En production  : enregistre dans la table admin_logs (via l'admin client)
//                 + filtre les stacks d'erreur pour éviter les fuites

type LogLevel = 'info' | 'warn' | 'error';

const IS_DEV = process.env.NODE_ENV === 'development';

/**
 * Nettoie un meta objet des clés potentiellement sensibles (stacks, tokens, etc.)
 */
function sanitize(meta: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(meta)) {
    if (key === 'error' && value instanceof Error) {
      sanitized[key] = IS_DEV
        ? { message: value.message, stack: value.stack }
        : { message: value.message };
    } else if (key === 'error' && typeof value === 'object' && value !== null) {
      const err = value as Record<string, unknown>;
      sanitized[key] = IS_DEV ? err : { message: err.message ?? 'Unknown error' };
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

/**
 * Logger structuré pour les routes API.
 * En dev : écrit dans la console avec le niveau et le contexte.
 * En prod : tente d'écrire dans admin_logs (silent fail si erreur).
 */
export async function serverLog(
  level: LogLevel,
  context: string,
  message: string,
  meta?: Record<string, unknown>,
): Promise<void> {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] ${context}`;

  if (IS_DEV) {
    const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    if (meta) {
      fn(`${prefix} ${message}`, sanitize(meta).error ?? meta);
    } else {
      fn(`${prefix} ${message}`);
    }
    return;
  }

  // Production : log silencieux vers admin_logs (fail open)
  try {
    const { createAdminClient } = await import('@/lib/supabase/server');
    const admin = await createAdminClient();
    const { data: { user } } = await admin.auth.getUser();
    await admin.from('admin_logs').insert({
      admin_id: user?.id ?? '00000000-0000-0000-0000-000000000000',
      action: `log:${level}:${context}`,
      cible_type: 'server_log',
      details: sanitize({
        message,
        level,
        context,
        ...(meta ?? {}),
      }),
    });
  } catch {
    // Fail total : on ne bloque jamais l'app à cause du logger
  }
}
