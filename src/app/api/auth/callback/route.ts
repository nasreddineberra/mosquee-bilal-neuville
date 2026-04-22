import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/admin/dashboard';

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('[auth/callback] exchangeCodeForSession error:', error);
      return NextResponse.redirect(`${origin}/auth/error?reason=${encodeURIComponent(error.message)}`);
    }
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (error) {
      console.error('[auth/callback] verifyOtp error:', error);
      return NextResponse.redirect(`${origin}/auth/error?reason=${encodeURIComponent(error.message)}`);
    }
  } else {
    console.error('[auth/callback] no code nor token_hash in query', Object.fromEntries(searchParams));
    return NextResponse.redirect(`${origin}/auth/error?reason=missing_params`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
