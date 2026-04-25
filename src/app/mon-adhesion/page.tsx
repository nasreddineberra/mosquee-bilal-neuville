'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, LogOut, Download, User, Phone, MapPin, Mail, FileText } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────

type Adhesion = {
  id: string;
  organisme_nom_historique: string;
  reference_contrat: string | null;
  type_contrat: 'individuel' | 'familial';
  nom: string;
  prenom: string;
  date_naissance: string | null;
  lieu_naissance: string | null;
  nationalite: string | null;
  telephone: string | null;
  email: string | null;
  adresse: string | null;
  formule: 'inhumation_france' | 'rapatriement' | 'autre';
  pays_inhumation: string | null;
  cimetiere_souhaite: string | null;
  instructions_specifiques: string | null;
  cotisation_annuelle: number;
  date_adhesion: string;
  statut: 'actif' | 'suspendu' | 'resilie' | 'deces';
};

type AyantDroit = {
  id: string;
  nom: string;
  prenom: string;
  date_naissance: string | null;
  lien_parente: string;
};

type ContactUrgence = {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  lien_parente: string;
  ordre_priorite: number;
};

type Paiement = {
  id: string;
  montant: number;
  date_paiement: string;
  annee_concernee: number;
  moyen_paiement: string;
  reference_externe: string | null;
};

type Document = {
  id: string;
  url: string;
  type: string;
  nom_fichier: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(d: string | null) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatMontant(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);
}

const STATUT_STYLE: Record<string, string> = {
  actif: 'bg-white/20 text-white',
  suspendu: 'bg-tertiary/20 text-white',
  resilie: 'bg-on-surface/20 text-white/70',
  deces: 'bg-error/20 text-white',
};

const FORMULE_LABEL: Record<string, string> = {
  inhumation_france: 'Inhumation en France',
  rapatriement: 'Rapatriement',
  autre: 'Autre',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MonAdhesionPage() {
  const supabase = createClient();
  const { user, logout } = useAuth();

  const [adhesion, setAdhesion] = useState<Adhesion | null | undefined>(undefined);
  const [ayantsDroit, setAyantsDroit] = useState<AyantDroit[]>([]);
  const [contacts, setContacts] = useState<ContactUrgence[]>([]);
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      const { data: adh } = await supabase
        .from('adhesions_obseques')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!adh) { setAdhesion(null); setLoading(false); return; }
      setAdhesion(adh as Adhesion);

      const [adRes, cuRes, pRes, docRes] = await Promise.all([
        supabase.from('adhesions_obseques_ayants_droit').select('*').eq('adhesion_id', adh.id).order('id'),
        supabase.from('adhesions_obseques_contacts_urgence').select('*').eq('adhesion_id', adh.id).order('ordre_priorite'),
        supabase.from('adhesions_obseques_paiements').select('*').eq('adhesion_id', adh.id).order('annee_concernee', { ascending: false }),
        supabase.from('adhesions_obseques_documents').select('*').eq('adhesion_id', adh.id).order('created_at', { ascending: false }),
      ]);
      setAyantsDroit((adRes.data ?? []) as AyantDroit[]);
      setContacts((cuRes.data ?? []) as ContactUrgence[]);
      setPaiements((pRes.data ?? []) as Paiement[]);
      setDocuments((docRes.data ?? []) as Document[]);
      setLoading(false);
    };
    load();
  }, [user, supabase]);

  const handleDownload = async (path: string, nom: string) => {
    const { data } = await supabase.storage.from('obseques-documents').createSignedUrl(path, 60);
    if (data?.signedUrl) {
      const a = document.createElement('a');
      a.href = data.signedUrl;
      a.download = nom;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="bg-surface-container-lowest border-b border-outline-variant/10 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
              <Image src="/logo.png" alt="Mosquée Bilal" width={32} height={32} className="object-cover logo-invert" />
            </div>
            <div>
              <p className="font-serif font-bold text-primary text-sm leading-none">Mosquée Bilal</p>
              <p className="text-[10px] text-on-surface/40 uppercase tracking-widest mt-0.5">Mon adhésion obsèques</p>
            </div>
          </Link>
          <button onClick={logout}
            className="flex items-center gap-2 text-xs text-on-surface/50 hover:text-error transition-colors">
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">

        {(loading || adhesion === undefined) && (
          <p className="text-center text-on-surface/40 text-sm py-20">Chargement de votre dossier...</p>
        )}

        {/* Aucune adhésion liée */}
        {!loading && adhesion === null && (
          <div className="text-center py-20">
            <ShieldCheck className="w-12 h-12 text-on-surface/20 mx-auto mb-4" />
            <h2 className="text-lg font-serif text-on-surface mb-2">Aucune adhésion trouvée</h2>
            <p className="text-sm text-on-surface/60 max-w-sm mx-auto">
              Votre compte n&apos;est pas encore associé à un dossier d&apos;adhésion. Contactez la mosquée au <strong>04 78 49 85 22</strong>.
            </p>
          </div>
        )}

        {/* Fiche adhésion */}
        {!loading && adhesion && (
          <div className="space-y-6">

            {/* En-tête */}
            <div className="bg-surface-container-lowest rounded-2xl border border-[var(--color-card-border)] shadow-sm overflow-hidden">
              <div className="card-green p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-white/70 text-xs uppercase tracking-widest font-bold mb-1">Adhérent</p>
                    <h2 className="text-2xl font-serif text-white font-bold">{adhesion.prenom} {adhesion.nom}</h2>
                    <p className="text-white/70 text-sm mt-1">{adhesion.organisme_nom_historique}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${STATUT_STYLE[adhesion.statut] ?? 'bg-white/20 text-white'}`}>
                      {adhesion.statut}
                    </span>
                    {adhesion.reference_contrat && (
                      <p className="text-white/60 text-xs mt-2">Réf. {adhesion.reference_contrat}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-on-surface/50 font-medium mb-0.5">Type de contrat</p>
                  <p className="font-semibold capitalize">{adhesion.type_contrat}</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface/50 font-medium mb-0.5">Date d&apos;adhésion</p>
                  <p className="font-semibold">{formatDate(adhesion.date_adhesion)}</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface/50 font-medium mb-0.5">Cotisation annuelle</p>
                  <p className="font-semibold text-primary">{formatMontant(adhesion.cotisation_annuelle)}</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface/50 font-medium mb-0.5">Formule</p>
                  <p className="font-semibold">{FORMULE_LABEL[adhesion.formule] ?? adhesion.formule}</p>
                </div>
              </div>
            </div>

            {/* Identité */}
            <Section title="Identité">
              <InfoGrid>
                <InfoItem label="Date de naissance" value={formatDate(adhesion.date_naissance)} />
                <InfoItem label="Lieu de naissance" value={adhesion.lieu_naissance} />
                <InfoItem label="Nationalité" value={adhesion.nationalite} />
              </InfoGrid>
              <div className="mt-3 space-y-1.5">
                {adhesion.telephone && <InfoRow icon={<Phone className="w-3.5 h-3.5" />} value={adhesion.telephone} />}
                {adhesion.email && <InfoRow icon={<Mail className="w-3.5 h-3.5" />} value={adhesion.email} />}
                {adhesion.adresse && <InfoRow icon={<MapPin className="w-3.5 h-3.5" />} value={adhesion.adresse} />}
              </div>
            </Section>

            {/* Volontés */}
            <Section title="Volontés funéraires">
              <InfoGrid>
                <InfoItem label="Formule" value={FORMULE_LABEL[adhesion.formule]} />
                <InfoItem label="Pays d'inhumation" value={adhesion.pays_inhumation} />
                <InfoItem label="Cimetière souhaité" value={adhesion.cimetiere_souhaite} />
              </InfoGrid>
              {adhesion.instructions_specifiques && (
                <div className="mt-3 p-3 bg-surface-container-low rounded-xl">
                  <p className="text-xs text-on-surface/50 font-medium mb-1">Instructions spécifiques</p>
                  <p className="text-sm text-on-surface/80 whitespace-pre-line">{adhesion.instructions_specifiques}</p>
                </div>
              )}
            </Section>

            {/* Ayants droit */}
            {adhesion.type_contrat === 'familial' && (
              <Section title="Ayants droit">
                {ayantsDroit.length === 0 ? (
                  <p className="text-sm text-on-surface/40 italic">Aucun ayant droit enregistré.</p>
                ) : (
                  <div className="space-y-2">
                    {ayantsDroit.map((ad) => (
                      <div key={ad.id} className="flex items-center gap-3 px-4 py-2.5 bg-surface-container-low rounded-xl">
                        <User className="w-4 h-4 text-on-surface/30 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold">{ad.prenom} {ad.nom}</p>
                          <p className="text-xs text-on-surface/50 capitalize">{ad.lien_parente}{ad.date_naissance ? ` — né(e) le ${formatDate(ad.date_naissance)}` : ''}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            )}

            {/* Contacts d'urgence */}
            <Section title="Contacts d'urgence">
              {contacts.length === 0 ? (
                <p className="text-sm text-on-surface/40 italic">Aucun contact d&apos;urgence enregistré.</p>
              ) : (
                <div className="space-y-2">
                  {contacts.map((c) => (
                    <div key={c.id} className="flex items-center gap-3 px-4 py-2.5 bg-surface-container-low rounded-xl">
                      <span className="w-5 h-5 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0">{c.ordre_priorite}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{c.prenom} {c.nom}{c.lien_parente ? <span className="text-on-surface/50 font-normal text-xs"> — {c.lien_parente}</span> : null}</p>
                        <p className="text-xs text-on-surface/50 flex items-center gap-1"><Phone className="w-3 h-3" /> {c.telephone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* Paiements */}
            <Section title="Historique des paiements">
              {paiements.length === 0 ? (
                <p className="text-sm text-on-surface/40 italic">Aucun paiement enregistré.</p>
              ) : (
                <>
                  <div className="flex gap-1 flex-wrap mb-3">
                    {[...new Set(paiements.map((p) => p.annee_concernee))].sort((a, b) => b - a).map((y) => (
                      <span key={y} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{y} ✓</span>
                    ))}
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-outline-variant/10">
                    <table className="w-full text-left text-xs">
                      <thead className="card-green text-white/70 text-[9px] uppercase tracking-wider">
                        <tr>
                          <th className="px-3 py-2 font-bold">Année</th>
                          <th className="px-3 py-2 font-bold">Date</th>
                          <th className="px-3 py-2 font-bold text-right">Montant</th>
                          <th className="px-3 py-2 font-bold">Moyen</th>
                          <th className="px-3 py-2 font-bold">Référence</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10">
                        {paiements.map((p) => (
                          <tr key={p.id} className="hover:bg-surface-container/50">
                            <td className="px-3 py-2 font-bold text-primary">{p.annee_concernee}</td>
                            <td className="px-3 py-2 text-on-surface/60">{formatDate(p.date_paiement)}</td>
                            <td className="px-3 py-2 text-right font-semibold">{formatMontant(p.montant)}</td>
                            <td className="px-3 py-2 text-on-surface/60 uppercase tracking-wider">{p.moyen_paiement}</td>
                            <td className="px-3 py-2 text-on-surface/60">{p.reference_externe ?? '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-right text-xs font-semibold text-on-surface/60 mt-2">
                    Total versé : {formatMontant(paiements.reduce((s, p) => s + p.montant, 0))}
                  </p>
                </>
              )}
            </Section>

            {/* Documents */}
            <Section title="Mes documents">
              {documents.length === 0 ? (
                <p className="text-sm text-on-surface/40 italic">Aucun document déposé.</p>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-3 px-4 py-2.5 bg-surface-container-low rounded-xl">
                      <FileText className="w-4 h-4 text-on-surface/40 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doc.nom_fichier}</p>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase tracking-wider">{doc.type}</span>
                      </div>
                      <button onClick={() => handleDownload(doc.url, doc.nom_fichier)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary hover:bg-primary hover:text-on-primary transition-all flex-shrink-0">
                        <Download className="w-3.5 h-3.5" /> Télécharger
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-on-surface/40 mt-3">Pour déposer ou mettre à jour vos documents, contactez la mosquée au 04 78 49 85 22.</p>
            </Section>

            <div className="text-center py-4">
              <Link href="/" className="text-xs text-on-surface/40 hover:text-primary transition-colors">
                ← Retour au site
              </Link>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

// ─── Composants locaux ────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-[var(--color-card-border)] shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-outline-variant/10">
        <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">{title}</h3>
      </div>
      <div className="px-6 py-4">{children}</div>
    </div>
  );
}

function InfoGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-x-6 gap-y-3">{children}</div>;
}

function InfoItem({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value || value === '-') return null;
  return (
    <div>
      <p className="text-xs text-on-surface/50 font-medium mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-on-surface">{value}</p>
    </div>
  );
}

function InfoRow({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <p className="text-sm flex items-center gap-2 text-on-surface/70">
      <span className="flex-shrink-0 text-on-surface/40">{icon}</span>
      {value}
    </p>
  );
}
