import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    if (!userId) return NextResponse.json({ error: 'userId requis.' }, { status: 400 });

    const userClient = await createClient();
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

    if (user.id === userId) {
      return NextResponse.json({ error: 'Impossible de supprimer votre propre compte.' }, { status: 400 });
    }

    const admin = await createAdminClient();
    const { data: me } = await admin.from('profiles').select('role').eq('id', user.id).single();
    if (me?.role !== 'administrateur') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const { error: deleteErr } = await admin.auth.admin.deleteUser(userId);
    if (deleteErr) {
      return NextResponse.json({ error: deleteErr.message || 'Erreur lors de la suppression.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('[delete-user]', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
