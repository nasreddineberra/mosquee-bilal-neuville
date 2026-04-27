// ─── Clients Supabase côté serveur ──────────────────────────────────────────
// createClient()    → client utilisateur connecté (respecte RLS)
// createAdminClient() → client service_role (bypass RLS, nécessite un admin connecté)
// Les deux lisent/écrivent les cookies via le helper `cookies()` de Next.js.
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Client Supabase côté serveur avec la session de l'utilisateur connecté.
 * Respecte les politiques RLS. Utilise l'anonymous key (NEXT_PUBLIC_SUPABASE_ANON_KEY).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}

/**
 * Client Supabase côté serveur avec le rôle service_role (bypass RLS).
 * Attention : ne pas exposer au client. Réservé aux endpoints admin.
 * Vérifie toujours manuellement les droits (role === 'administrateur') avant utilisation.
 */
export async function createAdminClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,  // service_role key (bypass RLS)
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}
