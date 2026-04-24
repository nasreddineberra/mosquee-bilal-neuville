import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, role } = await request.json();
    if (!email || !role) {
      return NextResponse.json({ error: 'Email et rôle requis.' }, { status: 400 });
    }
    if (!['administrateur', 'editeur', 'gestionnaire_obseques'].includes(role)) {
      return NextResponse.json({ error: 'Rôle invalide.' }, { status: 400 });
    }

    const userClient = await createClient();
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

    const admin = await createAdminClient();
    const { data: me } = await admin.from('profiles').select('role').eq('id', user.id).single();
    if (me?.role !== 'administrateur') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const origin = new URL(request.url).origin;
    const { data: invited, error: inviteErr } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${origin}/auth/set-password`,
    });
    if (inviteErr) {
      return NextResponse.json({ error: inviteErr.message || 'Erreur lors de l\'invitation.' }, { status: 500 });
    }

    await admin.from('profiles').update({ role }).eq('id', invited.user.id);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('[invite-user]', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
