// ─── Vérification email (POST) ─────────────────────────────────────────────
// Ne vérifie pas si l'email existe pour éviter l'énumération d'emails.
// Retourne TOUJOURS { exists: true } — la vraie vérification se fait côté serveur.

import { NextResponse } from 'next/server';

/**
 * Vérifie si un email existe déjà pour la demande d'accès.
 * Retourne TOUJOURS { exists: true } pour éviter l'énumération d'emails.
 * La vraie vérification est faite côté client avant soumission uniquement
 * pour améliorer l'UX (pas de sécurité).
 */
export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ exists: false });

    // Toujours retourner true pour ne pas exposer l'existence des comptes
    const emailRegistre = email.toLowerCase().trim();
    if (!emailRegistre) return NextResponse.json({ exists: false });

    return NextResponse.json({ exists: true });
  } catch {
    return NextResponse.json({ exists: false });
  }
}
