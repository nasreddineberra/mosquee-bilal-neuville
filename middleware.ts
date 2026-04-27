// ─── Middleware Next.js : rafraîchissement session Supabase ─────────────────
// Exécuté sur toutes les routes. Rafraîchit le cookie de session à chaque requête
// pour maintenir la session active côté serveur.
// Ignore les assets statiques et les appels API Supabase internes.

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // /mon-profil et /mon-adhesion : authentification requise (tous roles)
  if ((pathname === '/mon-profil' || pathname === '/mon-adhesion') && !user) {
    const next = encodeURIComponent(pathname);
    return NextResponse.redirect(new URL(`/connexion?next=${next}`, request.url));
  }

  // Page /connexion : redirige vers la home selon role si deja connecte
  if (pathname === '/connexion' && user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    const role = profile?.role ?? 'visiteur';
    if (role === 'visiteur') return NextResponse.redirect(new URL('/mon-profil', request.url));
    if (role === 'gestionnaire_obseques') return NextResponse.redirect(new URL('/admin/dashboard/obseques', request.url));
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // Routes admin protégées : authentification requise
  if (pathname.startsWith('/admin/') && !user) {
    return NextResponse.redirect(new URL('/connexion', request.url));
  }

  // Vérification du rôle pour les routes admin/dashboard/*
  if (pathname.startsWith('/admin/') && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // Visiteur : pas d'accès aux routes admin (session conservee)
    if (!profile || profile.role === 'visiteur') {
      return NextResponse.redirect(new URL('/mon-profil', request.url));
    }

    // Gestionnaire obsèques : accès uniquement à /admin/dashboard (home) + /admin/dashboard/obseques/*
    if (profile.role === 'gestionnaire_obseques') {
      const isHome = pathname === '/admin/dashboard';
      const isObseques = pathname.startsWith('/admin/dashboard/obseques');
      if (!isHome && !isObseques) {
        return NextResponse.redirect(new URL('/admin/dashboard/obseques', request.url));
      }
    }

    // Editeur : accès home + routes édition (articles, hadiths, bibliothèque, communication)
    if (profile.role === 'editeur') {
      const allowedPrefixes = ['/admin/dashboard/articles', '/admin/dashboard/hadiths', '/admin/dashboard/bibliotheque', '/admin/dashboard/communication'];
      const isHome = pathname === '/admin/dashboard';
      const isAllowed = allowedPrefixes.some((p) => pathname.startsWith(p));
      if (!isHome && !isAllowed) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/connexion', '/mon-adhesion', '/mon-profil'],
};
