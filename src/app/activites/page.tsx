'use client';

import { useState, useEffect } from 'react';
import { BookOpenCheck, NotebookPen, Users, Handshake, Info, X } from 'lucide-react';
import CardCtaButton from '@/components/CardCtaButton';
import AideSocialeModal from '@/components/AideSocialeModal';
import InscriptionCoursMosqueeModal from '@/components/InscriptionCoursMosqueeModal';
import InscriptionEcoleArabeModal from '@/components/InscriptionEcoleArabeModal';
import InscriptionSortieModal from '@/components/InscriptionSortieModal';
import { createClient } from '@/lib/supabase/client';

type Statut = 'ouvert' | 'complet' | 'bientot';

type CoursMosquee = {
  id: string; titre: string; description: string | null;
  type: string; niveau: string; horaire: string;
  tarif: number | null; places_max: number; places_prises: number;
  statut: Statut; actif: boolean; position: number;
};
type EcoleArabe = {
  id: string; titre: string; description: string | null;
  categorie: string; horaire: string;
  tarif: number | null; places_max: number; places_prises: number;
  statut: Statut; actif: boolean; position: number;
};
type Sortie = {
  id: string; titre: string; description: string | null;
  date_sortie: string | null; lieu: string;
  tarif: number | null; places_max: number; places_prises: number;
  statut: Statut; actif: boolean; position: number;
};

type DetailItem = { titre: string; description: string | null };

const STATUT_META: Record<Statut, { label: string; badge: string }> = {
  ouvert:  { label: 'Ouvert',  badge: 'badge-open' },
  complet: { label: 'Complet', badge: 'badge-full' },
  bientot: { label: 'Bientôt', badge: 'badge-soon' },
};

function formatTarif(tarif: number | null, freeWhenZero = false): string {
  if (tarif == null) return '-';
  if (freeWhenZero && tarif === 0) return 'Gratuit';
  return `${tarif} €`;
}

function formatDateShort(d: string | null): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}

function StatutBadge({ statut }: { statut: Statut }) {
  const meta = STATUT_META[statut];
  return (
    <span className={`text-[10px] font-bold ${meta.badge} px-2 py-0.5 rounded-full uppercase`}>
      {meta.label}
    </span>
  );
}

function InscriptionCell({ statut, isLoggedIn, onClick, label = 'S\u2019inscrire' }: { statut: Statut; isLoggedIn: boolean; onClick?: () => void; label?: string }) {
  if (statut !== 'ouvert') return <span className="text-on-surface/30">-</span>;
  if (!isLoggedIn) return <span className="text-xs font-bold text-on-surface/30 cursor-not-allowed">{label}</span>;
  return (
    <button type="button" onClick={onClick} className="text-xs font-bold text-primary hover:underline">
      {label}
    </button>
  );
}

function InfoButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-on-surface/40 hover:text-primary transition-colors"
      aria-label="Voir les détails"
    >
      <Info className="w-3.5 h-3.5" />
    </button>
  );
}

function DetailModal({ item, onClose }: { item: DetailItem | null; onClose: () => void }) {
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="bg-surface-container-lowest rounded-2xl shadow-xl max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-on-surface/50 hover:text-on-surface transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-base font-bold font-serif text-primary uppercase tracking-wider mb-3 pr-6">
          {item.titre}
        </h3>
        <p className="text-sm text-on-surface/80 whitespace-pre-wrap">
          {item.description || <span className="italic text-on-surface/40">Aucune description.</span>}
        </p>
      </div>
    </div>
  );
}

export default function ActivitesPage() {
  const [aideSocialeOpen, setAideSocialeOpen] = useState(false);
  const [coursMosquee, setCoursMosquee] = useState<CoursMosquee[]>([]);
  const [ecoleArabe, setEcoleArabe] = useState<EcoleArabe[]>([]);
  const [sorties, setSorties] = useState<Sortie[]>([]);
  const [detail, setDetail] = useState<DetailItem | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [inscCoursMosquee, setInscCoursMosquee] = useState<CoursMosquee | null>(null);
  const [inscEcoleArabe, setInscEcoleArabe] = useState<EcoleArabe | null>(null);
  const [inscSortie, setInscSortie] = useState<Sortie | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const fetchAll = async () => {
      const [cm, ea, so, session] = await Promise.all([
        supabase.from('activites_cours_mosquee').select('*').eq('actif', true).order('position', { ascending: true }),
        supabase.from('activites_ecole_arabe').select('*').eq('actif', true).order('position', { ascending: true }),
        supabase.from('activites_sorties').select('*').eq('actif', true).order('position', { ascending: true }),
        supabase.auth.getSession(),
      ]);
      setCoursMosquee((cm.data ?? []) as CoursMosquee[]);
      setEcoleArabe((ea.data ?? []) as EcoleArabe[]);
      setSorties((so.data ?? []) as Sortie[]);
      setIsLoggedIn(!!session.data.session);
    };
    fetchAll();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setIsLoggedIn(!!session));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <>
      <div className="bg-background pt-8 pb-2 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <BookOpenCheck className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold font-serif text-primary uppercase tracking-wider">Activités communautaires</h1>
            </div>
            <p className="text-on-surface/60 text-sm">
              Cours, sorties, services sociaux et programmes éducatifs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Cours Mosquée - Tajwid */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <BookOpenCheck className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Cours Mosquée - Tajwid</h3>
              </div>
              <p className="text-on-surface/60 text-sm mb-4">
                Apprenez la récitation coranique avec un enseignant qualifié.
              </p>
              <div className="overflow-hidden rounded-xl border border-outline-variant/20">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-surface-container">
                      <th className="w-8 py-2 px-2"></th>
                      <th className="text-left py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Type</th>
                      <th className="text-left py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Niveau</th>
                      <th className="text-left py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Créneau</th>
                      <th className="text-center py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Tarif</th>
                      <th className="text-center py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Places</th>
                      <th className="text-center py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Statut</th>
                      <th className="text-center py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Inscription</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {coursMosquee.map((c) => (
                      <tr key={c.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-0.5 px-2 text-center">
                          <InfoButton onClick={() => setDetail({ titre: c.titre, description: c.description })} />
                        </td>
                        <td className="py-0.5 px-3 text-on-surface">{c.type}</td>
                        <td className="py-0.5 px-3 text-on-surface">{c.niveau}</td>
                        <td className="py-0.5 px-3 text-on-surface/70">{c.horaire}</td>
                        <td className={`py-0.5 px-3 text-center ${c.tarif == null ? 'text-on-surface/30' : 'text-on-surface/70'}`}>{formatTarif(c.tarif)}</td>
                        <td className="py-0.5 px-3 text-center text-on-surface/70">{c.places_prises}/{c.places_max}</td>
                        <td className="py-0.5 px-3 text-center"><StatutBadge statut={c.statut} /></td>
                        <td className="py-0.5 px-3 text-center"><InscriptionCell statut={c.statut} isLoggedIn={isLoggedIn} onClick={() => setInscCoursMosquee(c)} /></td>
                      </tr>
                    ))}
                    {coursMosquee.length === 0 && (
                      <tr><td colSpan={8} className="py-4 px-3 text-center text-on-surface/40 text-xs">Aucune activité</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cours école Arabe */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <NotebookPen className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Cours école Arabe</h3>
              </div>
              <p className="text-on-surface/60 text-sm mb-4">
                Cours pour enfants et adultes, tous niveaux.
              </p>
              <div className="overflow-hidden rounded-xl border border-outline-variant/20">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-surface-container">
                      <th className="w-8 py-2 px-2"></th>
                      <th className="text-left py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Catégorie</th>
                      <th className="text-left py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Créneau</th>
                      <th className="text-center py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Tarif</th>
                      <th className="text-center py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Places</th>
                      <th className="text-center py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Statut</th>
                      <th className="text-center py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Préinscription</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {ecoleArabe.map((e) => (
                      <tr key={e.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-0.5 px-2 text-center">
                          <InfoButton onClick={() => setDetail({ titre: e.titre, description: e.description })} />
                        </td>
                        <td className="py-0.5 px-3 text-on-surface">{e.categorie}</td>
                        <td className="py-0.5 px-3 text-on-surface/70">{e.horaire}</td>
                        <td className={`py-0.5 px-3 text-center ${e.tarif == null ? 'text-on-surface/30' : 'text-on-surface/70'}`}>{formatTarif(e.tarif)}</td>
                        <td className="py-0.5 px-3 text-center text-on-surface/70">{e.places_prises}/{e.places_max}</td>
                        <td className="py-0.5 px-3 text-center"><StatutBadge statut={e.statut} /></td>
                        <td className="py-0.5 px-3 text-center"><InscriptionCell statut={e.statut} isLoggedIn={isLoggedIn} onClick={() => setInscEcoleArabe(e)} label="Préinscrire" /></td>
                      </tr>
                    ))}
                    {ecoleArabe.length === 0 && (
                      <tr><td colSpan={7} className="py-4 px-3 text-center text-on-surface/40 text-xs">Aucune activité</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sorties */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Sorties</h3>
              </div>
              <p className="text-on-surface/60 text-sm mb-4">
                Activités récréatives et éducatives pour toute la famille.
              </p>
              <div className="overflow-hidden rounded-xl border border-outline-variant/20">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-surface-container">
                      <th className="w-8 py-2 px-2"></th>
                      <th className="text-left py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Sortie</th>
                      <th className="text-left py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Date</th>
                      <th className="text-left py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Lieu</th>
                      <th className="text-center py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Tarif</th>
                      <th className="text-center py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Places</th>
                      <th className="text-center py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Statut</th>
                      <th className="text-center py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Inscription</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {sorties.map((s) => (
                      <tr key={s.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-0.5 px-2 text-center">
                          <InfoButton onClick={() => setDetail({ titre: s.titre, description: s.description })} />
                        </td>
                        <td className="py-0.5 px-3 text-on-surface">{s.titre}</td>
                        <td className="py-0.5 px-3 text-on-surface/70">{formatDateShort(s.date_sortie)}</td>
                        <td className="py-0.5 px-3 text-on-surface/70">{s.lieu}</td>
                        <td className="py-0.5 px-3 text-center text-on-surface/70">{formatTarif(s.tarif, true)}</td>
                        <td className="py-0.5 px-3 text-center text-on-surface/70">{s.places_prises}/{s.places_max}</td>
                        <td className="py-0.5 px-3 text-center"><StatutBadge statut={s.statut} /></td>
                        <td className="py-0.5 px-3 text-center"><InscriptionCell statut={s.statut} isLoggedIn={isLoggedIn} onClick={() => setInscSortie(s)} /></td>
                      </tr>
                    ))}
                    {sorties.length === 0 && (
                      <tr><td colSpan={8} className="py-4 px-3 text-center text-on-surface/40 text-xs">Aucune activité</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Aide Sociale-Green card */}
            <button
              onClick={() => setAideSocialeOpen(true)}
              className="text-left card-green card-green-link rounded-2xl p-5 shadow-sm group relative self-start"
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Handshake className="w-5 h-5 text-white" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Aide Sociale</h3>
                </div>
                <p className="text-white/80 text-sm mb-6">
                  Accompagnement et soutien pour les membres de la communauté en difficulté. Notre cellule d&apos;aide sociale est à votre écoute.
                </p>
              </div>
              <CardCtaButton label="Oui je veux" />
            </button>
          </div>
        </div>
      </div>

      <AideSocialeModal
        open={aideSocialeOpen}
        onClose={() => setAideSocialeOpen(false)}
      />

      <InscriptionCoursMosqueeModal
        open={!!inscCoursMosquee}
        activite={inscCoursMosquee}
        onClose={() => setInscCoursMosquee(null)}
      />
      <InscriptionEcoleArabeModal
        open={!!inscEcoleArabe}
        activite={inscEcoleArabe}
        onClose={() => setInscEcoleArabe(null)}
      />
      <InscriptionSortieModal
        open={!!inscSortie}
        activite={inscSortie}
        onClose={() => setInscSortie(null)}
      />

      <DetailModal item={detail} onClose={() => setDetail(null)} />
    </>
  );
}
