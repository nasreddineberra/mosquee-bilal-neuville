'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserCheck, Check, X, Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type Demande = {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  telephone: string | null;
  adresse: string | null;
  statut: 'en_attente' | 'validee' | 'refusee';
  created_at: string;
  traite_at: string | null;
};

type Filter = 'en_attente' | 'validee' | 'refusee';

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function VisiteursAdminPage() {
  const supabase = createClient();
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('en_attente');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ type: 'valider' | 'refuser'; demande: Demande } | null>(null);
  const [resent, setResent] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchDemandes = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('demandes_acces')
      .select('id, email, nom, prenom, telephone, adresse, statut, created_at, traite_at')
      .eq('statut', filter)
      .order('created_at', { ascending: false });
    if (err) {
      setError('Impossible de charger les demandes.');
    } else {
      setDemandes((data ?? []) as Demande[]);
      setError('');
    }
    setLoading(false);
  }, [supabase, filter]);

  useEffect(() => {
    fetchDemandes();
  }, [fetchDemandes]);

  const handleValider = async (demande: Demande) => {
    setProcessingId(demande.id);
    setError('');
    const res = await fetch('/api/admin/validate-demande', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ demandeId: demande.id }),
    });
    const json = await res.json();
    setProcessingId(null);
    setConfirm(null);
    if (!res.ok) {
      setError(json.error || 'Erreur lors de la validation.');
      return;
    }
    fetchDemandes();
  };

  const handleResend = async (demande: Demande) => {
    setProcessingId(demande.id);
    setError('');
    setResent(null);
    const res = await fetch('/api/admin/resend-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ demandeId: demande.id }),
    });
    const json = await res.json();
    setProcessingId(null);
    if (!res.ok) {
      setError(json.error || 'Erreur lors du renvoi du mail.');
      return;
    }
    setResent(demande.email);
    setTimeout(() => setResent(null), 4000);
  };

  const handleRefuser = async (demande: Demande) => {
    setProcessingId(demande.id);
    setError('');
    const res = await fetch('/api/admin/refuse-demande', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ demandeId: demande.id }),
    });
    const json = await res.json();
    setProcessingId(null);
    setConfirm(null);
    if (!res.ok) {
      setError(json.error || 'Erreur lors du refus.');
      return;
    }
    fetchDemandes();
  };

  const filters: { key: Filter; label: string }[] = [
    { key: 'en_attente', label: 'En attente' },
    { key: 'validee', label: 'Validées' },
    { key: 'refusee', label: 'Refusées' },
  ];

  return (
    <div>
      <div className="flex items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-serif text-on-surface mb-2 flex items-center gap-3">
            <UserCheck className="w-8 h-8 text-primary" />
            Gestion des visiteurs
          </h1>
          <p className="text-on-surface/60 font-medium">
            Validez ou refusez les demandes d&apos;accès visiteur.
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl shadow-sm overflow-hidden">
        <div className="px-8 py-6 flex items-center justify-between gap-4 border-b border-outline-variant/10">
          <h3 className="text-lg font-bold text-on-surface">Demandes</h3>
          <div className="flex gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
                  filter === f.key
                    ? 'bg-primary text-on-primary'
                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mx-8 mt-4 bg-error-container/20 border border-error/20 rounded-xl p-3">
            <p className="text-error text-sm text-center">{error}</p>
          </div>
        )}

        {resent && (
          <div className="mx-8 mt-4 bg-primary/10 border border-primary/20 rounded-xl p-3">
            <p className="text-primary text-sm text-center">
              Email renvoyé à <strong>{resent}</strong>.
            </p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low text-[10px] uppercase tracking-widest font-extrabold text-on-surface/40">
              <tr>
                <th className="px-8 py-4">Demandeur</th>
                <th className="px-4 py-4">Contact</th>
                <th className="px-4 py-4">Adresse</th>
                <th className="px-4 py-4">Date demande</th>
                {filter !== 'en_attente' && <th className="px-4 py-4">Date traitement</th>}
                {(filter === 'en_attente' || filter === 'validee') && <th className="px-8 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {loading ? (
                <tr>
                  <td colSpan={filter === 'validee' ? 6 : 5} className="px-8 py-8 text-center text-sm text-on-surface/60">
                    Chargement…
                  </td>
                </tr>
              ) : demandes.length === 0 ? (
                <tr>
                  <td colSpan={filter === 'validee' ? 6 : 5} className="px-8 py-8 text-center text-sm text-on-surface/60">
                    Aucune demande.
                  </td>
                </tr>
              ) : (
                demandes.map((d) => (
                  <tr key={d.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-on-surface">{d.prenom} {d.nom}</p>
                      <p className="text-xs text-on-surface/60 flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3 h-3" /> {d.email}
                      </p>
                    </td>
                    <td className="px-4 py-5">
                      {d.telephone ? (
                        <p className="text-xs text-on-surface/70 flex items-center gap-1.5">
                          <Phone className="w-3 h-3" /> {d.telephone}
                        </p>
                      ) : (
                        <span className="text-xs text-on-surface/30">—</span>
                      )}
                    </td>
                    <td className="px-4 py-5">
                      {d.adresse ? (
                        <p className="text-xs text-on-surface/70 flex items-start gap-1.5">
                          <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" /> {d.adresse}
                        </p>
                      ) : (
                        <span className="text-xs text-on-surface/30">—</span>
                      )}
                    </td>
                    <td className="px-4 py-5">
                      <p className="text-xs text-on-surface/70 flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> {formatDate(d.created_at)}
                      </p>
                    </td>
                    {filter !== 'en_attente' && (
                      <td className="px-4 py-5">
                        <p className="text-xs text-on-surface/70">{formatDate(d.traite_at)}</p>
                      </td>
                    )}
                    {filter === 'en_attente' && (
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setConfirm({ type: 'valider', demande: d })}
                            disabled={processingId === d.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-primary text-on-primary hover:opacity-90 transition-all disabled:opacity-50"
                          >
                            <Check className="w-3.5 h-3.5" /> Valider
                          </button>
                          <button
                            onClick={() => setConfirm({ type: 'refuser', demande: d })}
                            disabled={processingId === d.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-error/10 text-error hover:bg-error hover:text-on-error transition-all disabled:opacity-50"
                          >
                            <X className="w-3.5 h-3.5" /> Refuser
                          </button>
                        </div>
                      </td>
                    )}
                    {filter === 'validee' && (
                      <td className="px-8 py-5 text-right">
                        <button
                          onClick={() => handleResend(d)}
                          disabled={processingId === d.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary hover:bg-primary hover:text-on-primary transition-all disabled:opacity-50 ml-auto"
                        >
                          <Send className="w-3.5 h-3.5" />
                          {processingId === d.id ? 'Envoi…' : 'Renvoyer le mail'}
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {confirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !processingId && setConfirm(null)} />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md overflow-y-auto animate-slide-up border border-primary">
            <div className="bg-primary rounded-t-2xl p-5 flex items-center justify-between">
              <h2 className="text-sm font-bold text-on-primary uppercase tracking-wider">
                {confirm.type === 'valider' ? 'Valider la demande' : 'Refuser la demande'}
              </h2>
              {!processingId && (
                <button onClick={() => setConfirm(null)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-on-primary transition-colors" aria-label="Fermer">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-on-surface/80 leading-relaxed">
                {confirm.type === 'valider' ? (
                  <>
                    Confirmer la validation de la demande de <strong>{confirm.demande.prenom} {confirm.demande.nom}</strong> ?
                    <br /><br />
                    Un compte sera créé et un email d&apos;invitation sera envoyé à <strong>{confirm.demande.email}</strong>.
                  </>
                ) : (
                  <>
                    Confirmer le refus de la demande de <strong>{confirm.demande.prenom} {confirm.demande.nom}</strong> ?
                  </>
                )}
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setConfirm(null)}
                  disabled={!!processingId}
                  className="px-4 py-2 text-xs font-medium text-on-surface/60 hover:text-on-surface transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={() => confirm.type === 'valider' ? handleValider(confirm.demande) : handleRefuser(confirm.demande)}
                  disabled={!!processingId}
                  className={`px-5 py-2 rounded-full text-xs font-bold shadow-sm transition-all active:scale-95 ${
                    confirm.type === 'valider'
                      ? 'bg-primary text-on-primary hover:opacity-90'
                      : 'bg-error text-on-error hover:opacity-90'
                  } disabled:opacity-50`}
                >
                  {processingId ? 'Traitement…' : (confirm.type === 'valider' ? 'Valider' : 'Refuser')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
