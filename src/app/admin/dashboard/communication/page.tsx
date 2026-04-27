'use client';

// ─── Gestion de la newsletter (dashboard admin) ─────────────────────────────
// Composer et envoyer des emails à tous les abonnés newsletter.
// Historique des envois et gestion des brouillons.

import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Send, X, Eye, Users, Mail, Clock, CheckCircle2 } from 'lucide-react';
import { FloatInput, FloatTextarea } from '@/components/FloatField';
import { createClient } from '@/lib/supabase/client';

type Newsletter = {
  id: string;
  sujet: string;
  corps: string;
  date_envoi: string;
  nb_destinataires: number;
  expediteur_id: string | null;
};

type Tab = 'composer' | 'historique';

function formatDateTime(d: string) {
  return new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Convertit texte en HTML (meme logique que cote serveur, pour l'apercu)
function textToParagraphs(text: string): string {
  return text
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>'))
    .map((p) => `<p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#111C2D;">${p}</p>`)
    .join('');
}

// Apercu HTML d'une newsletter (mock du template)
function NewsletterPreview({ sujet, corps }: { sujet: string; corps: string }) {
  const corpsHtml = textToParagraphs(corps);
  return (
    <div className="bg-[#F9F9FF] p-6 rounded-xl">
      <div className="max-w-[560px] mx-auto bg-white rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-[#064E3B] py-7 px-8 text-center">
          <h1 className="m-0 font-serif text-[22px] font-bold text-white tracking-wider">
            Mosquée Bilal - Neuville-sur-Saone
          </h1>
        </div>
        <div className="px-8 pt-10 pb-6">
          <h2 className="font-serif text-[20px] font-bold text-[#064E3B] mb-6 m-0">
            {sujet || '(Sujet)'}
          </h2>
          <div className="text-[#111C2D]" dangerouslySetInnerHTML={{ __html: corpsHtml || '<p style="margin:0;font-size:14px;color:#999">(Corps du message)</p>' }} />
        </div>
        <div className="px-8 py-6 border-t border-[#E7EEFF] text-center">
          <p className="text-[11px] text-[#707974] leading-relaxed m-0 mb-3">
            Association ACM — Mosquée Bilal, Neuville-sur-Saône
          </p>
          <p className="text-[11px] text-[#707974] leading-relaxed m-0">
            Vous recevez cet email car vous êtes abonné à notre newsletter.<br />
            <span className="text-[#064E3B] underline">Gérer mon abonnement</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CommunicationPage() {
  const supabase = createClient();
  const [tab, setTab] = useState<Tab>('composer');

  // Composer
  const [sujet, setSujet] = useState('');
  const [corps, setCorps] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [sendResult, setSendResult] = useState<{ sent: number; failed: number; total: number } | null>(null);

  // Compteur abonnes
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);

  // Historique
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loadingHistorique, setLoadingHistorique] = useState(false);
  const [readNewsletter, setReadNewsletter] = useState<Newsletter | null>(null);

  // Fetch compteur abonnes
  useEffect(() => {
    supabase.from('profiles').select('id', { count: 'exact', head: true })
      .eq('newsletter_opt_in', true)
      .then(({ count }) => setSubscriberCount(count ?? 0));
  }, [supabase]);

  // Fetch historique (uniquement si onglet ouvert)
  const fetchHistorique = useCallback(async () => {
    setLoadingHistorique(true);
    const { data } = await supabase.from('newsletters').select('*').order('date_envoi', { ascending: false });
    setNewsletters((data ?? []) as Newsletter[]);
    setLoadingHistorique(false);
  }, [supabase]);

  useEffect(() => { if (tab === 'historique') fetchHistorique(); }, [tab, fetchHistorique]);

  const isValid = sujet.trim().length > 0 && corps.trim().length > 0;

  const handleSend = async () => {
    setSending(true);
    setSendError('');
    setSendResult(null);
    try {
      const res = await fetch('/api/admin/send-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sujet: sujet.trim(), corps: corps.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        setSendError(json.error ?? 'Erreur lors de l\'envoi.');
        setSending(false);
        return;
      }
      setSendResult({ sent: json.sent, failed: json.failed, total: json.total });
      setSujet('');
      setCorps('');
      setConfirmOpen(false);
    } catch (e) {
      setSendError((e as Error).message ?? 'Erreur reseau.');
    }
    setSending(false);
  };

  return (
    <div className="space-y-6">

      <div className="flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold font-serif text-primary uppercase tracking-wider">Communication</h1>
      </div>

      {/* Onglets */}
      <div className="flex gap-2">
        {([['composer', 'Composer'], ['historique', 'Historique']] as [Tab, string][]).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
              tab === key ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container-lowest text-on-surface/60 hover:text-primary border border-[var(--color-card-border)]'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* ══════════════ ONGLET COMPOSER ══════════════ */}
      {tab === 'composer' && (
        <div className="space-y-4">

          {/* Compteur abonnes */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl card-green flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-on-surface/60 uppercase tracking-wider font-bold mb-0.5">Destinataires</p>
              <p className="text-sm text-on-surface">
                <strong className="text-primary text-lg">{subscriberCount ?? '...'}</strong>{' '}
                {subscriberCount === 1 ? 'abonné recevra' : 'abonnés recevront'} cette newsletter
              </p>
            </div>
          </div>

          {/* Formulaire */}
          <div className="bg-surface-container-lowest rounded-2xl border border-[var(--color-card-border)] shadow-sm p-6 space-y-4">
            <FloatInput id="news-sujet" label="Sujet de l'email" value={sujet} onChange={setSujet} maxLength={120} required />
            <FloatTextarea id="news-corps" label="Message" value={corps} onChange={setCorps} rows={12} required />
            <p className="text-xs text-on-surface/50">
              Astuce : laissez une <strong>ligne vide</strong> entre deux paragraphes. Pas de mise en forme (gras/italique).
            </p>
          </div>

          {/* Resultat envoi */}
          {sendResult && (
            <div className="bg-primary/10 border border-primary/30 rounded-2xl p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-bold text-primary">Newsletter envoyée</p>
                <p className="text-xs text-on-surface/70 mt-0.5">
                  {sendResult.sent}/{sendResult.total} envois réussis
                  {sendResult.failed > 0 && ` (${sendResult.failed} échecs)`}
                </p>
              </div>
            </div>
          )}

          {/* Erreur */}
          {sendError && (
            <div className="bg-error-container/20 border border-error/20 rounded-2xl p-4">
              <p className="text-sm text-error">{sendError}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button onClick={() => setPreviewOpen(true)} disabled={!isValid}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border border-[var(--color-card-border)] text-on-surface hover:bg-surface-container transition-all disabled:opacity-40">
              <Eye className="w-4 h-4" /> Aperçu
            </button>
            <button onClick={() => setConfirmOpen(true)} disabled={!isValid || !subscriberCount}
              className="flex items-center gap-2 card-green text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:opacity-90 transition-all active:scale-95 disabled:opacity-40">
              <Send className="w-4 h-4" /> Envoyer la newsletter
            </button>
          </div>
        </div>
      )}

      {/* ══════════════ ONGLET HISTORIQUE ══════════════ */}
      {tab === 'historique' && (
        <div className="bg-surface-container-lowest rounded-2xl border border-[var(--color-card-border)] shadow-sm overflow-hidden">
          {loadingHistorique ? (
            <p className="text-center text-on-surface/40 text-sm py-12">Chargement...</p>
          ) : newsletters.length === 0 ? (
            <p className="text-center text-on-surface/40 text-sm py-12">Aucune newsletter envoyée.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="card-green text-white/70 text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 font-bold">Date</th>
                    <th className="px-6 py-3 font-bold">Sujet</th>
                    <th className="px-6 py-3 font-bold text-right">Destinataires</th>
                    <th className="px-6 py-3 font-bold text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {newsletters.map((n) => (
                    <tr key={n.id} className="hover:bg-surface-container/50 transition-colors cursor-pointer" onClick={() => setReadNewsletter(n)}>
                      <td className="px-6 py-3 text-xs text-on-surface/60 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5"><Clock className="w-3 h-3" /> {formatDateTime(n.date_envoi)}</span>
                      </td>
                      <td className="px-6 py-3 font-semibold text-on-surface">{n.sujet}</td>
                      <td className="px-6 py-3 text-right text-on-surface/80">
                        <span className="inline-flex items-center gap-1 text-xs"><Mail className="w-3 h-3" /> {n.nb_destinataires}</span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary hover:bg-primary hover:text-on-primary transition-all">
                          Lire
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ══════════════ Modale apercu ══════════════ */}
      {previewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up border border-primary">
            <div className="card-green rounded-t-2xl p-5 flex items-center justify-between sticky top-0 z-10">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Aperçu de la newsletter</h2>
              <button onClick={() => setPreviewOpen(false)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors" aria-label="Fermer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5">
              <NewsletterPreview sujet={sujet} corps={corps} />
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ Modale confirmation envoi ══════════════ */}
      {confirmOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md p-6 text-center border border-primary">
            <Send className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-serif text-on-surface mb-2">Envoyer la newsletter ?</h3>
            <p className="text-sm text-on-surface/60 mb-6">
              Le mail sera envoyé immédiatement à <strong className="text-primary">{subscriberCount}</strong> abonné{subscriberCount !== 1 ? 's' : ''}.
            </p>
            {sendError && (
              <div className="bg-error-container/20 border border-error/20 rounded-xl p-3 mb-4">
                <p className="text-error text-xs">{sendError}</p>
              </div>
            )}
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setConfirmOpen(false)} disabled={sending}
                className="px-5 py-2.5 rounded-full text-sm font-bold text-on-surface/60 hover:bg-surface-container transition-colors disabled:opacity-50">
                Annuler
              </button>
              <button onClick={handleSend} disabled={sending}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold card-green text-white hover:opacity-90 transition-all active:scale-95 disabled:opacity-50">
                <Send className="w-4 h-4" />
                {sending ? 'Envoi en cours...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ Modale relecture historique ══════════════ */}
      {readNewsletter && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up border border-primary">
            <div className="card-green rounded-t-2xl p-5 flex items-center justify-between sticky top-0 z-10">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">{readNewsletter.sujet}</h2>
                <p className="text-white/70 text-xs mt-0.5">Envoyée le {formatDateTime(readNewsletter.date_envoi)} à {readNewsletter.nb_destinataires} abonné{readNewsletter.nb_destinataires !== 1 ? 's' : ''}</p>
              </div>
              <button onClick={() => setReadNewsletter(null)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors flex-shrink-0" aria-label="Fermer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5">
              <NewsletterPreview sujet={readNewsletter.sujet} corps={readNewsletter.corps} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
