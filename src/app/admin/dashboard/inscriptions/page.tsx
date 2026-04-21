'use client';

import { useState, useEffect, useCallback, Fragment } from 'react';
import {
  ClipboardList, Check, X, Mail, Phone, MapPin, Users as UsersIcon,
  BookOpenCheck, NotebookPen, Baby, MessageSquare, ChevronDown, ChevronRight,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type ActiviteType = 'cours_mosquee' | 'ecole_arabe' | 'sorties';
type StatutInsc = 'en_attente' | 'validee' | 'refusee' | 'annulee';

type Enfant = { prenom: string; nom: string; date_naissance: string; niveau: string | null };

type Inscription = {
  id: string;
  activite_type: ActiviteType;
  activite_id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  adresse: string | null;
  message: string | null;
  enfants: Enfant[] | null;
  nb_participants: number | null;
  statut: StatutInsc;
  created_at: string;
};

type ActiviteInfo = { id: string; titre: string };

const TYPE_META: Record<ActiviteType, { label: string; icon: typeof BookOpenCheck }> = {
  cours_mosquee: { label: 'Cours Mosquée', icon: BookOpenCheck },
  ecole_arabe: { label: 'École Arabe', icon: NotebookPen },
  sorties: { label: 'Sorties', icon: UsersIcon },
};

const STATUT_META: Record<StatutInsc, { label: string; badge: string }> = {
  en_attente: { label: 'En attente', badge: 'badge-soon' },
  validee: { label: 'Validée', badge: 'badge-open' },
  refusee: { label: 'Refusée', badge: 'badge-full' },
  annulee: { label: 'Annulée', badge: 'bg-on-surface/10 text-on-surface/60' },
};

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function InscriptionsAdminPage() {
  const supabase = createClient();
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [activites, setActivites] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<'all' | ActiviteType>('all');
  const [statutFilter, setStatutFilter] = useState<'all' | StatutInsc>('en_attente');
  const [activiteFilter, setActiviteFilter] = useState<string>('all');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchActivites = useCallback(async () => {
    const [cm, ea, so] = await Promise.all([
      supabase.from('activites_cours_mosquee').select('id, titre'),
      supabase.from('activites_ecole_arabe').select('id, titre'),
      supabase.from('activites_sorties').select('id, titre'),
    ]);
    const map: Record<string, string> = {};
    [...((cm.data ?? []) as ActiviteInfo[]), ...((ea.data ?? []) as ActiviteInfo[]), ...((so.data ?? []) as ActiviteInfo[])]
      .forEach((a) => { map[a.id] = a.titre; });
    setActivites(map);
  }, [supabase]);

  const fetchInscriptions = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('inscriptions').select('*').order('created_at', { ascending: false });
    if (typeFilter !== 'all') query = query.eq('activite_type', typeFilter);
    if (statutFilter !== 'all') query = query.eq('statut', statutFilter);
    if (activiteFilter !== 'all') query = query.eq('activite_id', activiteFilter);
    const { data, error: err } = await query;
    if (err) {
      setError('Impossible de charger les inscriptions.');
    } else {
      setInscriptions((data ?? []) as Inscription[]);
      setError('');
    }
    setLoading(false);
  }, [supabase, typeFilter, statutFilter, activiteFilter]);

  useEffect(() => { fetchActivites(); }, [fetchActivites]);
  useEffect(() => { fetchInscriptions(); }, [fetchInscriptions]);

  const updateStatut = async (id: string, statut: StatutInsc) => {
    setProcessingId(id);
    setError('');
    const { error: err } = await supabase
      .from('inscriptions')
      .update({ statut })
      .eq('id', id);
    setProcessingId(null);
    if (err) {
      setError('Erreur lors de la mise à jour.');
      return;
    }
    fetchInscriptions();
  };

  const toggleExpand = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpanded(next);
  };

  const activiteOptions = Object.entries(activites)
    .filter(() => {
      return true;
    })
    .sort((a, b) => a[1].localeCompare(b[1]));

  return (
    <div>
      <div className="flex items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-serif text-on-surface mb-2 flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-primary" />
            Inscriptions
          </h1>
          <p className="text-on-surface/60 font-medium">
            Validez les inscriptions aux activités (cours, école arabe, sorties).
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl shadow-sm overflow-hidden">
        <div className="px-8 py-5 border-b border-outline-variant/10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface/40 mr-2">Type :</span>
            {(['all', 'cours_mosquee', 'ecole_arabe', 'sorties'] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTypeFilter(t); setActiviteFilter('all'); }}
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all ${
                  typeFilter === t ? 'bg-primary text-on-primary' : 'bg-primary/10 text-primary hover:bg-primary/20'
                }`}
              >
                {t === 'all' ? 'Tous' : TYPE_META[t].label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface/40 mr-2">Statut :</span>
            {(['all', 'en_attente', 'validee', 'refusee', 'annulee'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatutFilter(s)}
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all ${
                  statutFilter === s ? 'bg-primary text-on-primary' : 'bg-primary/10 text-primary hover:bg-primary/20'
                }`}
              >
                {s === 'all' ? 'Tous' : STATUT_META[s].label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface/40 mr-2">Activité :</span>
            <select
              value={activiteFilter}
              onChange={(e) => setActiviteFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-medium rounded-full bg-surface-container border border-outline-variant/20 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Toutes</option>
              {activiteOptions.map(([id, titre]) => (
                <option key={id} value={id}>{titre}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mx-8 mt-4 bg-error-container/20 border border-error/20 rounded-xl p-3">
            <p className="text-error text-sm text-center">{error}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low text-[10px] uppercase tracking-widest font-extrabold text-on-surface/40">
              <tr>
                <th className="w-8"></th>
                <th className="px-4 py-4">Demandeur</th>
                <th className="px-4 py-4">Activité</th>
                <th className="px-4 py-4">Détails</th>
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4">Statut</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {loading ? (
                <tr><td colSpan={7} className="px-8 py-8 text-center text-sm text-on-surface/60">Chargement…</td></tr>
              ) : inscriptions.length === 0 ? (
                <tr><td colSpan={7} className="px-8 py-8 text-center text-sm text-on-surface/60">Aucune inscription.</td></tr>
              ) : (
                inscriptions.map((i) => {
                  const Icon = TYPE_META[i.activite_type].icon;
                  const isOpen = expanded.has(i.id);
                  const hasDetails = !!(i.message || (i.enfants && i.enfants.length > 0));
                  return (
                    <Fragment key={i.id}>
                      <tr className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="px-2 py-4">
                          {hasDetails && (
                            <button
                              onClick={() => toggleExpand(i.id)}
                              className="w-6 h-6 flex items-center justify-center text-on-surface/40 hover:text-primary"
                            >
                              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm font-bold text-on-surface">{i.prenom} {i.nom}</p>
                          <p className="text-xs text-on-surface/60 flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3 h-3" /> {i.email}
                          </p>
                          {i.telephone && (
                            <p className="text-xs text-on-surface/60 flex items-center gap-1.5 mt-0.5">
                              <Phone className="w-3 h-3" /> {i.telephone}
                            </p>
                          )}
                          {i.adresse && (
                            <p className="text-xs text-on-surface/60 flex items-start gap-1.5 mt-0.5">
                              <MapPin className="w-3 h-3 mt-0.5" /> {i.adresse}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-xs text-on-surface/70 flex items-center gap-1.5">
                            <Icon className="w-3.5 h-3.5 text-primary" /> {TYPE_META[i.activite_type].label}
                          </p>
                          <p className="text-xs font-bold text-on-surface mt-0.5">
                            {activites[i.activite_id] ?? '—'}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          {i.activite_type === 'ecole_arabe' && i.enfants && (
                            <p className="text-xs text-on-surface/70 flex items-center gap-1.5">
                              <Baby className="w-3 h-3" /> {i.enfants.length} enfant{i.enfants.length > 1 ? 's' : ''}
                            </p>
                          )}
                          {i.activite_type === 'sorties' && i.nb_participants && (
                            <p className="text-xs text-on-surface/70 flex items-center gap-1.5">
                              <UsersIcon className="w-3 h-3" /> {i.nb_participants} participant{i.nb_participants > 1 ? 's' : ''}
                            </p>
                          )}
                          {i.activite_type === 'cours_mosquee' && (
                            <span className="text-xs text-on-surface/40">—</span>
                          )}
                          {i.message && (
                            <p className="text-xs text-on-surface/60 flex items-center gap-1.5 mt-0.5">
                              <MessageSquare className="w-3 h-3" /> Message
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-xs text-on-surface/70">{formatDate(i.created_at)}</p>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`text-[10px] font-bold ${STATUT_META[i.statut].badge} px-2 py-0.5 rounded-full uppercase`}>
                            {STATUT_META[i.statut].label}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-right">
                          {i.statut === 'en_attente' ? (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => updateStatut(i.id, 'validee')}
                                disabled={processingId === i.id}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-primary text-on-primary hover:opacity-90 transition-all disabled:opacity-50"
                              >
                                <Check className="w-3.5 h-3.5" /> Valider
                              </button>
                              <button
                                onClick={() => updateStatut(i.id, 'refusee')}
                                disabled={processingId === i.id}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-error/10 text-error hover:bg-error hover:text-on-error transition-all disabled:opacity-50"
                              >
                                <X className="w-3.5 h-3.5" /> Refuser
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-on-surface/30">—</span>
                          )}
                        </td>
                      </tr>
                      {isOpen && hasDetails && (
                        <tr className="bg-surface-container-low/30">
                          <td></td>
                          <td colSpan={6} className="px-4 py-4 space-y-3">
                            {i.message && (
                              <div className="bg-surface-container rounded-xl p-3">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface/50 mb-1">Message</p>
                                <p className="text-xs text-on-surface/80 whitespace-pre-wrap">{i.message}</p>
                              </div>
                            )}
                            {i.enfants && i.enfants.length > 0 && (
                              <div className="bg-surface-container rounded-xl p-3">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface/50 mb-2">Enfants</p>
                                <div className="space-y-1.5">
                                  {i.enfants.map((e, idx) => (
                                    <div key={idx} className="text-xs text-on-surface/80 flex flex-wrap gap-x-4 gap-y-1">
                                      <span><strong>{e.prenom} {e.nom}</strong></span>
                                      <span className="text-on-surface/60">né(e) le {formatDate(e.date_naissance)}</span>
                                      {e.niveau && <span className="text-on-surface/60">— {e.niveau}</span>}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
