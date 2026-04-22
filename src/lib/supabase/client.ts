import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

declare global {
  var __supabaseBrowserClient: SupabaseClient | undefined;
}

export function createClient() {
  if (typeof window === 'undefined') {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { detectSessionInUrl: false } }
    );
  }
  if (!globalThis.__supabaseBrowserClient) {
    globalThis.__supabaseBrowserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { detectSessionInUrl: false } }
    );
  }
  return globalThis.__supabaseBrowserClient;
}
