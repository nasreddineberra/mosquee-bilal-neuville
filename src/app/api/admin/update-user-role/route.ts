import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

type Role = 'administrateur' | 'editeur' | 'visiteur';

export async function POST(request: Request) {
  try {
    const { userId, role } = await request.json();
    if (!userId || !role) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
    }
    if (!['administrateur', 'editeur', 'visiteur'].includes(role)) {
      return NextResponse.json({ error: 'Rôle invalide' }, { status: 400 });
    }

    const userClient = await createClient();
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const admin = await createAdminClient();

    const { data: me } = await admin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (me?.role !== 'administrateur') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    if (userId === user.id) {
      return NextResponse.json({ error: 'Vous ne pouvez pas modifier votre propre rôle.' }, { status: 400 });
    }

    const { error: err } = await admin
      .from('profiles')
      .update({ role: role as Role })
      .eq('id', userId);

    if (err) {
      return NextResponse.json({ error: 'Erreur mise à jour rôle' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('[update-user-role] exception:', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
