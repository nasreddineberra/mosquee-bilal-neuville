import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { sendMail, buildNewsletterHtml } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const { sujet, corps } = await request.json();
    if (!sujet?.trim() || !corps?.trim()) {
      return NextResponse.json({ error: 'Sujet et corps requis.' }, { status: 400 });
    }

    const userClient = await createClient();
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

    const admin = await createAdminClient();
    const { data: me } = await admin.from('profiles').select('role').eq('id', user.id).single();
    if (!me || !['administrateur', 'editeur'].includes(me.role)) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    // Recupere les abonnes
    const { data: subscribers, error: subErr } = await admin
      .from('profiles')
      .select('email')
      .eq('newsletter_opt_in', true);

    if (subErr) return NextResponse.json({ error: subErr.message }, { status: 500 });
    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ error: 'Aucun abonné à la newsletter.' }, { status: 400 });
    }

    const origin = new URL(request.url).origin;
    const unsubscribeUrl = `${origin}/mon-profil`;
    const html = buildNewsletterHtml(sujet, corps, unsubscribeUrl);

    // Envoie en parallele
    const results = await Promise.allSettled(
      subscribers.map((s) => sendMail(s.email, sujet, html))
    );

    const sent = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.length - sent;

    // Log les erreurs cote serveur
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.error('[send-newsletter] echec pour', subscribers[i].email, r.reason);
      }
    });

    // Insere dans l'historique
    await admin.from('newsletters').insert({
      sujet: sujet.trim(),
      corps: corps.trim(),
      expediteur_id: user.id,
      nb_destinataires: sent,
    });

    return NextResponse.json({ success: true, sent, failed, total: subscribers.length });
  } catch (e) {
    console.error('[send-newsletter] exception:', e);
    return NextResponse.json({ error: (e as Error).message ?? 'Erreur serveur' }, { status: 500 });
  }
}
