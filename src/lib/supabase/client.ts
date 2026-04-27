// ─── Client Supabase côté navigateur ────────────────────────────────────────
// Utilise createBrowserClient de @supabase/ssr pour la gestion des cookies.
// Factory function createClient() retourne une instance unique.
// Ne JAMAIS importer côté serveur (préférer server.ts).

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

declare global {
  var __supabaseBrowserClient: SupabaseClient | undefined;
}

// no-op lock : evite le warning "Lock was not released within 5000ms" en dev avec React Strict Mode
// (les locks GoTrue sont orphelines par les remounts rapides). Acceptable car admin single-tab.
const noOpLock = async <T>(_name: string, _timeout: number, fn: () => Promise<T>): Promise<T> => fn();

const authOptions = { detectSessionInUrl: false, lock: noOpLock };

export function createClient() {
  if (typeof window === 'undefined') {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: authOptions }
    );
  }
  if (!globalThis.__supabaseBrowserClient) {
    globalThis.__supabaseBrowserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: authOptions }
    );
  }
  return globalThis.__supabaseBrowserClient;
}
