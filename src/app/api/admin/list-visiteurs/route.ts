import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const userClient = await createClient();
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

    const admin = await createAdminClient();
    const { data: me } = await admin.from('profiles').select('role').eq('id', user.id).single();
    if (me?.role !== 'administrateur') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    // Fetch confirmed_at pour tous les utilisateurs auth (pagination 1000/page)
    const confirmedMap: Record<string, boolean> = {};
    let page = 1;
    const perPage = 1000;
    while (true) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      for (const u of data.users) {
        confirmedMap[u.id] = !!u.email_confirmed_at;
      }
      if (data.users.length < perPage) break;
      page++;
    }

    const { data: profiles, error: profErr } = await admin
      .from('profiles')
      .select('id, email, nom, prenom, telephone, adresse, created_at')
      .eq('role', 'visiteur')
      .order('created_at', { ascending: false });
    if (profErr) return NextResponse.json({ error: profErr.message }, { status: 500 });

    const visiteurs = (profiles ?? []).map((p) => ({
      ...p,
      est_actif: confirmedMap[p.id] ?? false,
    }));

    return NextResponse.json({ visiteurs });
  } catch (e) {
    console.error('[list-visiteurs]', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
