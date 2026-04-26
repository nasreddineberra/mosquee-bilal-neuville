'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserCheck, Check, X, Mail, Phone, MapPin, Clock, Send, Trash2, Shield, MailCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { FloatInput, FloatSelect } from '@/components/FloatField';

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

type Visiteur = {
  id: string;
  email: string;
  nom: string | null;
  prenom: string | null;
  telephone: string | null;
  adresse: string | null;
  created_at: string;
  est_actif: boolean;
  newsletter_opt_in: boolean;
};

type DemandeFilter = 'en_attente' | 'validee' | 'refusee';
type Tab = 'demandes' | 'comptes';

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function VisiteursAdminPage() {
  const supabase = createClient();
  const [tab, setTab] = useState<Tab>('demandes');

  // --- Onglet Demandes ---
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loadingDemandes, setLoadingDemandes] = useState(true);
  const [demandeFilter, setDemandeFilter] = useState<DemandeFilter>('en_attente');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ type: 'valider' | 'refuser'; demande: Demande } | null>(null);
  const [resent, setResent] = useState<string | null>(null);
  const [errorDemandes, setErrorDemandes] = useState('');
  const [searchDemandes, setSearchDemandes] = useState('');

  // --- Onglet Comptes visiteurs ---
  const [visiteurs, setVisiteurs] = useState<Visiteur[]>([]);
  const [loadingVisiteurs, setLoadingVisiteurs] = useState(true);
  const [searchVisiteurs, setSearchVisiteurs] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorVisiteurs, setErrorVisiteurs] = useState('');
  const [promoteUser, setPromoteUser] = useState<Visiteur | null>(null);
  const [promoteRole, setPromoteRole] = useState<'editeur' | 'gestionnaire_obseques' | 'administrateur'>('gestionnaire_obseques');
  const [promoting, setPromoting] = useState(false);

  const fetchDemandes = useCallback(async () => {
    setLoadingDemandes(true);
    const { data, error } = await supabase
      .from('demandes_acces')
      .select('id, email, nom, prenom, telephone, adresse, statut, created_at, traite_at')
      .eq('statut', demandeFilter)
      .order('created_at', { ascending: false });
    if (error) setErrorDemandes('Impossible de charger les demandes.');
    else { setDemandes((data ?? []) as Demande[]); setErrorDemandes(''); }
    setLoadingDemandes(false);
  }, [supabase, demandeFilter]);

  const fetchVisiteurs = useCallback(async () => {
    setLoadingVisiteurs(true);
    try {
      const res = await fetch('/api/admin/list-visiteurs');
      const json = await res.json();
      if (!res.ok) { setErrorVisiteurs(json.error || 'Impossible de charger les comptes visiteurs.'); }
      else { setVisiteurs((json.visiteurs ?? []) as Visiteur[]); setErrorVisiteurs(''); }
    } catch {
      setErrorVisiteurs('Impossible de charger les comptes visiteurs.');
    }
    setLoadingVisiteurs(false);
  }, []);

  useEffect(() => { if (tab === 'demandes') fetchDemandes(); }, [tab, fetchDemandes]);
  useEffect(() => { if (tab === 'comptes') fetchVisiteurs(); }, [tab, fetchVisiteurs]);

  const handleValider = async (demande: Demande) => {
    setProcessingId(demande.id);
    setErrorDemandes('');
    const res = await fetch('/api/admin/validate-demande', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ demandeId: demande.id }),
    });
    const json = await res.json();
    setProcessingId(null); setConfirm(null);
    if (!res.ok) { setErrorDemandes(json.error || 'Erreur.'); return; }
    fetchDemandes();
  };

  const handleRefuser = async (demande: Demande) => {
    setProcessingId(demande.id);
    setErrorDemandes('');
    const res = await fetch('/api/admin/refuse-demande', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ demandeId: demande.id }),
    });
    const json = await res.json();
    setProcessingId(null); setConfirm(null);
    if (!res.ok) { setErrorDemandes(json.error || 'Erreur.'); return; }
    fetchDemandes();
  };

  const handleResend = async (demande: Demande) => {
    setProcessingId(demande.id); setErrorDemandes(''); setResent(null);
    const res = await fetch('/api/admin/resend-invite', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ demandeId: demande.id }),
    });
    const json = await res.json();
    setProcessingId(null);
    if (!res.ok) { setErrorDemandes(json.error || 'Erreur.'); return; }
    setResent(demande.email);
    setTimeout(() => setResent(null), 4000);
  };

  const handleDeleteVisiteur = async () => {
    if (!deleteId) return;
    setDeletingId(deleteId);
    const res = await fetch('/api/admin/delete-user', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: deleteId }),
    });
    const json = await res.json();
    setDeletingId(null); setDeleteId(null);
    if (!res.ok) { setErrorVisiteurs(json.error || 'Erreur.'); return; }
    fetchVisiteurs();
  };

  const handlePromote = async () => {
    if (!promoteUser) return;
    setPromoting(true);
    setErrorVisiteurs('');
    const res = await fetch('/api/admin/update-user-role', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: promoteUser.id, role: promoteRole }),
    });
    const json = await res.json();
    setPromoting(false);
    if (!res.ok) { setErrorVisiteurs(json.error || 'Erreur.'); return; }
    setPromoteUser(null);
    fetchVisiteurs();
  };

  const demandeFilters: { key: DemandeFilter; label: string }[] = [
    { key: 'en_attente', label: 'En attente' },
    { key: 'validee', label: 'Validées' },
    { key: 'refusee', label: 'Refusées' },
  ];

  const qD = searchDemandes.toLowerCase().trim();
  const filteredDemandes = qD
    ? demandes.filter((d) => `${d.prenom} ${d.nom} ${d.email}`.toLowerCase().includes(qD))
    : demandes;

  const qV = searchVisiteurs.toLowerCase().trim();
  const filteredVisiteurs = qV
    ? visiteurs.filter((v) => `${v.prenom ?? ''} ${v.nom ?? ''} ${v.email}`.toLowerCase().includes(qV))
    : visiteurs;

  return (
    <div>
      <div className="flex items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-serif text-on-surface mb-2 flex items-center gap-3">
            <UserCheck className="w-8 h-8 text-primary" />
            Gestion des visiteurs
          </h1>
          <p className="text-on-surface/60 font-medium">Demandes d&apos;accès et comptes visiteurs.</p>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex gap-2 mb-6">
        {([['demandes', 'Demandes d\'accès'], ['comptes', 'Comptes visiteurs']] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
              tab === key ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container-lowest text-on-surface/60 hover:text-primary border border-[var(--color-card-border)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* --- ONGLET DEMANDES --- */}
      {tab === 'demandes' && (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-[var(--color-card-border)]">
          <div className="px-8 py-6 flex items-center justify-between gap-4 border-b border-outline-variant/10">
            <h3 className="text-lg font-bold text-on-surface">Demandes</h3>
            <div className="w-56">
              <FloatInput id="search-demandes" label="Rechercher…" value={searchDemandes} onChange={setSearchDemandes} compact />
            </div>
            <div className="flex gap-2">
              {demandeFilters.map((f) => (
                <button key={f.key} onClick={() => setDemandeFilter(f.key)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${demandeFilter === f.key ? 'bg-primary text-on-primary' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {errorDemandes && <div className="mx-8 mt-4 bg-error-container/20 border border-error/20 rounded-xl p-3"><p className="text-error text-sm text-center">{errorDemandes}</p></div>}
          {resent && <div className="mx-8 mt-4 bg-primary/10 border border-primary/20 rounded-xl p-3"><p className="text-primary text-sm text-center">Email renvoyé à <strong>{resent}</strong>.</p></div>}

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="card-green text-[10px] uppercase tracking-widest font-extrabold text-white/70">
                <tr>
                  <th className="px-8 py-1.5">Demandeur</th>
                  <th className="px-4 py-1.5">Contact</th>
                  <th className="px-4 py-1.5">Adresse</th>
                  <th className="px-4 py-1.5">Date demande</th>
                  {demandeFilter !== 'en_attente' && <th className="px-4 py-1.5">Date traitement</th>}
                  {(demandeFilter === 'en_attente' || demandeFilter === 'validee') && <th className="px-8 py-1.5 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {loadingDemandes ? (
                  <tr><td colSpan={6} className="px-8 py-8 text-center text-sm text-on-surface/60">Chargement…</td></tr>
                ) : filteredDemandes.length === 0 ? (
                  <tr><td colSpan={6} className="px-8 py-8 text-center text-sm text-on-surface/60">Aucune demande.</td></tr>
                ) : (
                  filteredDemandes.map((d) => (
                    <tr key={d.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-8 py-1.5">
                        <p className="text-sm font-bold text-on-surface">{d.prenom} {d.nom}</p>
                        <p className="text-xs text-on-surface/60 flex items-center gap-1.5 mt-0.5"><Mail className="w-3 h-3" /> {d.email}</p>
                      </td>
                      <td className="px-4 py-1.5">
                        {d.telephone ? <p className="text-xs text-on-surface/70 flex items-center gap-1.5"><Phone className="w-3 h-3" /> {d.telephone}</p> : <span className="text-xs text-on-surface/30">—</span>}
                      </td>
                      <td className="px-4 py-1.5">
                        {d.adresse ? <p className="text-xs text-on-surface/70 flex items-start gap-1.5"><MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" /> {d.adresse}</p> : <span className="text-xs text-on-surface/30">—</span>}
                      </td>
                      <td className="px-4 py-1.5">
                        <p className="text-xs text-on-surface/70 flex items-center gap-1.5"><Clock className="w-3 h-3" /> {formatDate(d.created_at)}</p>
                      </td>
                      {demandeFilter !== 'en_attente' && (
                        <td className="px-4 py-1.5"><p className="text-xs text-on-surface/70">{formatDate(d.traite_at)}</p></td>
                      )}
                      {demandeFilter === 'en_attente' && (
                        <td className="px-8 py-1.5 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setConfirm({ type: 'valider', demande: d })} disabled={processingId === d.id}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-primary text-on-primary hover:opacity-90 transition-all disabled:opacity-50">
                              <Check className="w-3.5 h-3.5" /> Valider
                            </button>
                            <button onClick={() => setConfirm({ type: 'refuser', demande: d })} disabled={processingId === d.id}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-error/10 text-error hover:bg-error hover:text-on-error transition-all disabled:opacity-50">
                              <X className="w-3.5 h-3.5" /> Refuser
                            </button>
                          </div>
                        </td>
                      )}
                      {demandeFilter === 'validee' && (
                        <td className="px-8 py-1.5 text-right">
                          <button onClick={() => handleResend(d)} disabled={processingId === d.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary hover:bg-primary hover:text-on-primary transition-all disabled:opacity-50 ml-auto">
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
      )}

      {/* --- ONGLET COMPTES VISITEURS --- */}
      {tab === 'comptes' && (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-[var(--color-card-border)]">
          <div className="px-8 py-6 flex items-center justify-between gap-4 border-b border-outline-variant/10">
            <h3 className="text-lg font-bold text-on-surface">Comptes visiteurs</h3>
            <div className="w-56">
              <FloatInput id="search-visiteurs" label="Rechercher…" value={searchVisiteurs} onChange={setSearchVisiteurs} compact />
            </div>
          </div>

          {errorVisiteurs && <div className="mx-8 mt-4 bg-error-container/20 border border-error/20 rounded-xl p-3"><p className="text-error text-sm text-center">{errorVisiteurs}</p></div>}

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="card-green text-[10px] uppercase tracking-widest font-extrabold text-white/70">
                <tr>
                  <th className="px-8 py-1.5">Visiteur</th>
                  <th className="px-4 py-1.5">Contact</th>
                  <th className="px-4 py-1.5">Inscrit le</th>
                  <th className="px-4 py-1.5">Newsletter</th>
                  <th className="px-8 py-1.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {loadingVisiteurs ? (
                  <tr><td colSpan={5} className="px-8 py-8 text-center text-sm text-on-surface/60">Chargement…</td></tr>
                ) : filteredVisiteurs.length === 0 ? (
                  <tr><td colSpan={5} className="px-8 py-8 text-center text-sm text-on-surface/60">Aucun compte visiteur.</td></tr>
                ) : (
                  filteredVisiteurs.map((v) => (
                    <tr key={v.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-8 py-1.5">
                        <p className="text-sm font-bold text-on-surface flex items-center gap-2">
                          {v.prenom || v.nom ? `${v.prenom ?? ''} ${v.nom ?? ''}`.trim() : <span className="text-on-surface/40">—</span>}
                          {!v.est_actif && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-tertiary/10 text-tertiary uppercase tracking-wider">En attente</span>}
                        </p>
                        <p className="text-xs text-on-surface/60 flex items-center gap-1.5 mt-0.5"><Mail className="w-3 h-3" /> {v.email}</p>
                      </td>
                      <td className="px-4 py-1.5">
                        {v.telephone && <p className="text-xs text-on-surface/70 flex items-center gap-1.5"><Phone className="w-3 h-3" /> {v.telephone}</p>}
                        {v.adresse && <p className="text-xs text-on-surface/70 flex items-start gap-1.5 mt-0.5"><MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" /> {v.adresse}</p>}
                        {!v.telephone && !v.adresse && <span className="text-xs text-on-surface/30">—</span>}
                      </td>
                      <td className="px-4 py-1.5">
                        <p className="text-xs text-on-surface/70">{formatDate(v.created_at)}</p>
                      </td>
                      <td className="px-4 py-1.5">
                        {v.newsletter_opt_in ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase inline-flex items-center gap-1 bg-primary/10 text-primary">
                            <MailCheck className="w-3 h-3" />
                            Abonné
                          </span>
                        ) : (
                          <span className="text-xs text-on-surface/30">—</span>
                        )}
                      </td>
                      <td className="px-8 py-1.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => { setPromoteUser(v); setPromoteRole('gestionnaire_obseques'); }}
                            disabled={!v.est_actif}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface/40 hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-on-surface/40"
                            aria-label="Promouvoir"
                            title={v.est_actif ? 'Promouvoir (attribuer un rôle)' : 'Compte non activé - en attente de confirmation du mail'}
                          >
                            <Shield className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteId(v.id)}
                            disabled={deletingId === v.id}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface/40 hover:bg-error/10 hover:text-error transition-colors disabled:opacity-50"
                            aria-label="Supprimer le compte"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modale promotion visiteur → role */}
      {promoteUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md animate-slide-up border border-primary">
            <div className="card-green rounded-t-2xl p-5 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Promouvoir le compte</h2>
              {!promoting && (
                <button onClick={() => setPromoteUser(null)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors" aria-label="Fermer">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-on-surface/80 leading-relaxed">
                Attribuer un rôle à <strong>{promoteUser.prenom ?? ''} {promoteUser.nom ?? ''}</strong> ({promoteUser.email}). Le compte sera déplacé dans <strong>Gestion des utilisateurs</strong>.
              </p>
              <FloatSelect
                id="promote-role"
                label="Rôle"
                value={promoteRole}
                onChange={(v) => setPromoteRole(v as 'editeur' | 'gestionnaire_obseques' | 'administrateur')}
                required
                options={[
                  { value: 'editeur', label: 'Éditeur' },
                  { value: 'gestionnaire_obseques', label: 'Gestionnaire obsèques' },
                  { value: 'administrateur', label: 'Administrateur' },
                ]}
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button onClick={() => setPromoteUser(null)} disabled={promoting} className="px-4 py-2 text-xs font-medium text-on-surface/60 hover:text-on-surface transition-colors disabled:opacity-50">Annuler</button>
                <button onClick={handlePromote} disabled={promoting} className="px-5 py-2 rounded-full text-xs font-bold shadow-sm bg-primary text-on-primary hover:opacity-90 transition-all active:scale-95 disabled:opacity-50">
                  {promoting ? 'Traitement…' : 'Promouvoir'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modale confirmation valider/refuser */}
      {confirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md animate-slide-up border border-primary">
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
                  <>Confirmer la validation de la demande de <strong>{confirm.demande.prenom} {confirm.demande.nom}</strong> ?<br /><br />Un compte sera créé et un email d&apos;invitation sera envoyé à <strong>{confirm.demande.email}</strong>.</>
                ) : (
                  <>Confirmer le refus de la demande de <strong>{confirm.demande.prenom} {confirm.demande.nom}</strong> ?</>
                )}
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button onClick={() => setConfirm(null)} disabled={!!processingId} className="px-4 py-2 text-xs font-medium text-on-surface/60 hover:text-on-surface transition-colors disabled:opacity-50">Annuler</button>
                <button
                  onClick={() => confirm.type === 'valider' ? handleValider(confirm.demande) : handleRefuser(confirm.demande)}
                  disabled={!!processingId}
                  className={`px-5 py-2 rounded-full text-xs font-bold shadow-sm transition-all active:scale-95 ${confirm.type === 'valider' ? 'bg-primary text-on-primary hover:opacity-90' : 'bg-error text-on-error hover:opacity-90'} disabled:opacity-50`}
                >
                  {processingId ? 'Traitement…' : (confirm.type === 'valider' ? 'Valider' : 'Refuser')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modale suppression compte visiteur */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-slide-up border border-[var(--color-card-border)]">
            <Trash2 className="w-10 h-10 text-error mx-auto mb-3" />
            <h3 className="text-lg font-serif text-on-surface mb-2">Supprimer ce compte ?</h3>
            <p className="text-sm text-on-surface/60 mb-6">Conformément à la politique de confidentialité (RGPD), toutes les données personnelles associées à ce compte seront définitivement supprimées.</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setDeleteId(null)} disabled={!!deletingId} className="px-5 py-2.5 rounded-full text-sm font-bold text-on-surface/60 hover:bg-surface-container transition-colors">Annuler</button>
              <button onClick={handleDeleteVisiteur} disabled={!!deletingId} className="px-6 py-2.5 rounded-full text-sm font-bold bg-error text-white hover:opacity-90 transition-all active:scale-95 disabled:opacity-50">
                {deletingId ? 'Suppression…' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
