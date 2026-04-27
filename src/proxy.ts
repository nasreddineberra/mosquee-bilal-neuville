// ─── Middleware proxy : protection des routes admin ─────────────────────────
// Vérifie la présence d'un cookie 'admin-session' pour les routes /admin/dashboard/*
// Note : la vraie vérification d'authentification est faite côté serveur
// (via les appels à getUser). Ce middleware est une protection en surface.
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protéger toutes les routes /admin/dashboard/*
  if (pathname.startsWith('/admin/dashboard')) {
    const session = request.cookies.get('admin-session');
    if (!session?.value) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
};
