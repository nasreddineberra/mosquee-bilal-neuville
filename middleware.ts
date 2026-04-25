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

  // /mon-adhesion : authentification requise (redirige vers login si non connecté)
  if (pathname === '/mon-adhesion' && !user) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Page login : redirige vers dashboard si déjà connecté
  if (pathname === '/admin' && user) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // Routes admin protégées : authentification requise
  if (pathname.startsWith('/admin/') && !user) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Vérification du rôle pour les routes admin
  if (pathname.startsWith('/admin/') && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // Visiteur : pas d'accès admin, mais on NE déconnecte pas (session conservée pour /mon-adhesion)
    if (!profile || profile.role === 'visiteur') {
      return NextResponse.redirect(new URL('/', request.url));
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
  matcher: ['/admin', '/admin/:path*', '/mon-adhesion'],
};
