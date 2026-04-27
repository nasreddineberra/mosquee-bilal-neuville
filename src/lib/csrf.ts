// ─── Protection CSRF : vérification de l'en-tête Origin ─────────────────────
// Compare l'en-tête Origin/Referer de la requête avec l'URL d'origine.
// Retourne une réponse 403 si l'origine est invalide (null en dev).

import { NextResponse } from 'next/server';

/**
 * Vérifie que la requête provient de notre propre domaine (protection CSRF).
 * Retourne une réponse 403 si l'origine est invalide, ou null si OK.
 */
export function checkOrigin(request: Request): NextResponse | null {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  // En production, on vérifie l'origine
  if (process.env.NODE_ENV === 'production') {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    if (origin && siteUrl && !origin.startsWith(siteUrl)) {
      return NextResponse.json({ error: 'Origine non autorisée' }, { status: 403 });
    }

    // Fallback sur le Referer si Origin est absent
    if (!origin && referer && siteUrl && !referer.startsWith(siteUrl)) {
      return NextResponse.json({ error: 'Origine non autorisée' }, { status: 403 });
    }
  }

  return null;
}
