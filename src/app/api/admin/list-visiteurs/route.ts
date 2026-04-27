// ─── GET /api/admin/list-visiteurs ──────────────────────────────────────────
// Liste tous les visiteurs (role = 'visiteur') avec leurs données personnelles
// déchiffrées. Réservé administrateur.
// Pagination auth : 1000 utilisateurs par page (boucle jusqu'à épuisement).
import { decrypt } from '@/lib/encryption';
import { serverLog } from '@/lib/logger';
import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const admin = await createAdminClient();
    const { data: { user } } = await admin.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    const { data: me } = await admin.from('profiles').select('role').eq('id', user.id).single();
    if (me?.role !== 'administrateur') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    // Récupérer les emails confirmés de tous les utilisateurs auth (pagination)
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

    // Récupérer les profils visiteurs
    const { data: profiles, error: profErr } = await admin
      .from('profiles')
      .select('id, email, nom, prenom, telephone, adresse, telephone_encrypted, adresse_encrypted, created_at, newsletter_opt_in')
      .eq('role', 'visiteur')
      .order('created_at', { ascending: false });
    if (profErr) return NextResponse.json({ error: profErr.message }, { status: 500 });

    // Déchiffrer les données personnelles
    const visiteurs = (profiles ?? []).map((p) => ({
      ...p,
      telephone: decrypt(p.telephone_encrypted) ?? p.telephone,
      adresse: decrypt(p.adresse_encrypted) ?? p.adresse,
      telephone_encrypted: undefined,
      adresse_encrypted: undefined,
      email_confirme: confirmedMap[p.id] ?? false,
    }));

    return NextResponse.json({ visiteurs });
  } catch (e) {
    await serverLog('error', '[list-visiteurs]', 'Erreur', { error: e });
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
