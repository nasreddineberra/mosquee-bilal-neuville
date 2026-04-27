// ─── POST /api/admin/send-newsletter ────────────────────────────────────────
// Envoie une newsletter email à tous les abonnés (newsletter_opt_in = true).
// Réservé administrateur et editeur. Protection CSRF.
// Envoi en parallèle avec Promise.allSettled (ne bloque pas sur un échec).
import { serverLog } from '@/lib/logger';
import { checkOrigin } from '@/lib/csrf';
import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { sendMail, buildNewsletterHtml } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const originCheck = checkOrigin(request);
    if (originCheck) return originCheck;

    const { sujet, corps } = await request.json();
    if (!sujet?.trim() || !corps?.trim()) {
      return NextResponse.json({ error: 'Sujet et corps requis.' }, { status: 400 });
    }

    const admin = await createAdminClient();
    const { data: { user } } = await admin.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    const { data: me } = await admin.from('profiles').select('role').eq('id', user.id).single();
    if (!me || !['administrateur', 'editeur'].includes(me.role)) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    // Récupérer les abonnés à la newsletter
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

    // Envoi en parallèle — les échecs individuels ne bloquent pas l'ensemble
    const results = await Promise.allSettled(
      subscribers.map((s) => sendMail(s.email, sujet, html))
    );

    const sent = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.length - sent;

    // Journaliser les erreurs côté serveur
    await Promise.allSettled(
      results.map(async (r, i) => {
        if (r.status === 'rejected') {
          await serverLog('error', '[send-newsletter]', 'Échec envoi', {
            email: subscribers[i].email,
            error: r.reason,
          });
        }
      })
    );

    return NextResponse.json({ sent, failed });
  } catch (e) {
    await serverLog('error', '[send-newsletter]', 'Erreur', { error: e });
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
