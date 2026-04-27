'use client';

// ─── Gestion de l'assurance obsèques (dashboard admin) ──────────────────────
// Liste et recherche des adhérents obsèques.
// Consultation des fiches, paiements, ayants droit et documents.
// Export des données et suivi des cotisations.

import { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, Plus, Pencil, Trash2, X, Building2, Archive, FolderOpen, ChevronUp, ChevronDown, FileText, Download, Upload } from 'lucide-react';
import { FloatInput, FloatTextarea, FloatSelect } from '@/components/FloatField';
import { createClient } from '@/lib/supabase/client';

// ─── Types ────────────────────────────────────────────────────────────────────

type Organisme = {
  id: string;
  nom: string;
  adresse: string | null;
  telephone: string | null;
  email: string | null;
  numero_identification: string | null;
  numero_contrat: string | null;
  contact_referent_nom: string | null;
  contact_referent_telephone: string | null;
  contact_referent_email: string | null;
  notes: string | null;
  date_debut_collaboration: string;
  date_fin_collaboration: string | null;
};

type Adhesion = {
  id: string;
  user_id: string | null;
  organisme_id: string | null;
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
  notes: string | null;
};

type AyantDroit = {
  id: string;
  nom: string;
  prenom: string;
  date_naissance: string | null;
  lien_parente: 'conjoint' | 'enfant' | 'parent';
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
  moyen_paiement: 'especes' | 'cheque' | 'virement' | 'cb';
  reference_externe: string | null;
  notes: string | null;
};

type DocObseques = {
  id: string;
  url: string;
  type: 'cni' | 'passeport' | 'domicile' | 'autre';
  nom_fichier: string;
};

type Visiteur = { id: string; nom: string | null; prenom: string | null; email: string };

type Tab = 'adhesions' | 'organismes';
type StatutFilter = 'Tous' | 'Actifs' | 'Suspendus' | 'Résiliés' | 'Décès';
const STATUT_FILTERS: StatutFilter[] = ['Tous', 'Actifs', 'Suspendus', 'Résiliés', 'Décès'];

const today = () => new Date().toISOString().split('T')[0];
const currentYear = new Date().getFullYear();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(d: string | null) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatMontant(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);
}

// ─── Valeurs initiales ────────────────────────────────────────────────────────

const emptyAdhesion = {
  user_id: null as string | null,
  reference_contrat: '',
  type_contrat: 'individuel' as 'individuel' | 'familial',
  nom: '', prenom: '',
  date_naissance: '', lieu_naissance: '', nationalite: '',
  telephone: '', email: '', adresse: '',
  formule: 'inhumation_france' as 'inhumation_france' | 'rapatriement' | 'autre',
  pays_inhumation: '', cimetiere_souhaite: '', instructions_specifiques: '',
  cotisation_annuelle: 0,
  date_adhesion: today(),
  statut: 'actif' as 'actif' | 'suspendu' | 'resilie' | 'deces',
  notes: '',
};

const emptyOrganisme = {
  nom: '',
  adresse: '', telephone: '', email: '',
  numero_identification: '', numero_contrat: '',
  contact_referent_nom: '', contact_referent_telephone: '', contact_referent_email: '',
  notes: '',
  date_debut_collaboration: today(),
};

const emptyAd = { prenom: '', nom: '', date_naissance: '', lien_parente: 'enfant' as 'conjoint' | 'enfant' | 'parent' };
const emptyCu = { prenom: '', nom: '', telephone: '', lien_parente: '' };
const emptyP = { annee_concernee: currentYear, montant: 0, date_paiement: today(), moyen_paiement: 'especes' as 'especes' | 'cheque' | 'virement' | 'cb', reference_externe: '', notes: '' };

// ─── Composant principal ──────────────────────────────────────────────────────

export default function ObsequesAdminPage() {
  const supabase = createClient();
  const [tab, setTab] = useState<Tab>('adhesions');

  // Données principales
  const [organismes, setOrganismes] = useState<Organisme[]>([]);
  const [adhesions, setAdhesions] = useState<Adhesion[]>([]);
  const [visiteurs, setVisiteurs] = useState<Visiteur[]>([]);
  const [loading, setLoading] = useState(true);

  // Modale adhésion (create/edit)
  const [adhModalOpen, setAdhModalOpen] = useState(false);
  const [adhEditingId, setAdhEditingId] = useState<string | null>(null);
  const [adhForm, setAdhForm] = useState(emptyAdhesion);
  const [adhSubmitting, setAdhSubmitting] = useState(false);
  const [adhDeleteId, setAdhDeleteId] = useState<string | null>(null);
  const [adhError, setAdhError] = useState('');
  const [adhSearch, setAdhSearch] = useState('');
  const [adhFilter, setAdhFilter] = useState<StatutFilter>('Tous');

  // Modale organisme
  const [orgModalOpen, setOrgModalOpen] = useState(false);
  const [orgEditingId, setOrgEditingId] = useState<string | null>(null);
  const [orgForm, setOrgForm] = useState(emptyOrganisme);
  const [orgSubmitting, setOrgSubmitting] = useState(false);
  const [orgResilierId, setOrgResilierId] = useState<string | null>(null);
  const [orgDeleteId, setOrgDeleteId] = useState<string | null>(null);
  const [orgError, setOrgError] = useState('');

  // Modale dossier (Phase 2)
  const [dossierAdhesion, setDossierAdhesion] = useState<Adhesion | null>(null);
  const [loadingDossier, setLoadingDossier] = useState(false);
  const [ayantsDroit, setAyantsDroit] = useState<AyantDroit[]>([]);
  const [contactsUrgence, setContactsUrgence] = useState<ContactUrgence[]>([]);
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  // Forms dossier
  const [adForm, setAdForm] = useState(emptyAd);
  const [adSaving, setAdSaving] = useState(false);
  const [cuForm, setCuForm] = useState(emptyCu);
  const [cuSaving, setCuSaving] = useState(false);
  const [pForm, setPForm] = useState(emptyP);
  const [pSaving, setPSaving] = useState(false);
  const [pDeleteId, setPDeleteId] = useState<string | null>(null);
  // Documents
  const [documents, setDocuments] = useState<DocObseques[]>([]);
  const [docUploading, setDocUploading] = useState(false);
  const [docType, setDocType] = useState<DocObseques['type']>('cni');
  const [docDeleteId, setDocDeleteId] = useState<string | null>(null);

  const organismeActif = organismes.find((o) => !o.date_fin_collaboration) ?? null;

  // ── Fetch principal ──────────────────────────────────────────────────────────

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [orgRes, adhRes, visRes] = await Promise.all([
      supabase.from('organismes_obseques')
        .select('*')
        .order('date_fin_collaboration', { ascending: true, nullsFirst: true })
        .order('date_debut_collaboration', { ascending: false }),
      supabase.from('adhesions_obseques')
        .select('*')
        .order('statut', { ascending: true })
        .order('nom', { ascending: true }),
      supabase.from('profiles')
        .select('id, nom, prenom, email')
        .eq('role', 'visiteur')
        .order('nom', { ascending: true }),
    ]);
    setOrganismes((orgRes.data ?? []) as Organisme[]);
    setAdhesions((adhRes.data ?? []) as Adhesion[]);
    setVisiteurs((visRes.data ?? []) as Visiteur[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Fetch dossier ────────────────────────────────────────────────────────────

  const fetchDossier = async (id: string) => {
    setLoadingDossier(true);
    const [adRes, cuRes, pRes, docRes] = await Promise.all([
      supabase.from('adhesions_obseques_ayants_droit').select('*').eq('adhesion_id', id).order('id'),
      supabase.from('adhesions_obseques_contacts_urgence').select('*').eq('adhesion_id', id).order('ordre_priorite'),
      supabase.from('adhesions_obseques_paiements').select('*').eq('adhesion_id', id).order('annee_concernee', { ascending: false }),
      supabase.from('adhesions_obseques_documents').select('*').eq('adhesion_id', id).order('created_at', { ascending: false }),
    ]);
    setAyantsDroit((adRes.data ?? []) as AyantDroit[]);
    setContactsUrgence((cuRes.data ?? []) as ContactUrgence[]);
    setPaiements((pRes.data ?? []) as Paiement[]);
    setDocuments((docRes.data ?? []) as DocObseques[]);
    setLoadingDossier(false);
  };

  const openDossier = (a: Adhesion) => {
    setDossierAdhesion(a);
    setAdForm(emptyAd);
    setCuForm(emptyCu);
    setPForm(emptyP);
    setPDeleteId(null);
    setDocDeleteId(null);
    setDocType('cni');
    fetchDossier(a.id);
  };

  // ── Handlers adhésion ────────────────────────────────────────────────────────

  const openAdhCreate = () => {
    if (!organismeActif) {
      setAdhError('Aucun organisme tiers actif. Créez-en un dans l\'onglet Organismes avant d\'ajouter une adhésion.');
      setAdhModalOpen(true);
      return;
    }
    setAdhEditingId(null);
    setAdhForm({ ...emptyAdhesion, date_adhesion: today() });
    setAdhError('');
    setAdhModalOpen(true);
  };

  const openAdhEdit = (a: Adhesion) => {
    setAdhEditingId(a.id);
    setAdhForm({
      user_id: a.user_id,
      reference_contrat: a.reference_contrat ?? '',
      type_contrat: a.type_contrat,
      nom: a.nom, prenom: a.prenom,
      date_naissance: a.date_naissance ?? '',
      lieu_naissance: a.lieu_naissance ?? '',
      nationalite: a.nationalite ?? '',
      telephone: a.telephone ?? '',
      email: a.email ?? '',
      adresse: a.adresse ?? '',
      formule: a.formule,
      pays_inhumation: a.pays_inhumation ?? '',
      cimetiere_souhaite: a.cimetiere_souhaite ?? '',
      instructions_specifiques: a.instructions_specifiques ?? '',
      cotisation_annuelle: a.cotisation_annuelle,
      date_adhesion: a.date_adhesion,
      statut: a.statut,
      notes: a.notes ?? '',
    });
    setAdhError('');
    setAdhModalOpen(true);
  };

  const handleAdhSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAdhError('');
    if (!adhForm.nom.trim() || !adhForm.prenom.trim()) { setAdhError('Nom et prénom obligatoires.'); return; }
    if (!adhEditingId && !organismeActif) { setAdhError('Aucun organisme actif.'); return; }
    setAdhSubmitting(true);
    const payload = {
      user_id: adhForm.user_id,
      reference_contrat: adhForm.reference_contrat.trim() || null,
      type_contrat: adhForm.type_contrat,
      nom: adhForm.nom.trim(), prenom: adhForm.prenom.trim(),
      date_naissance: adhForm.date_naissance || null,
      lieu_naissance: adhForm.lieu_naissance.trim() || null,
      nationalite: adhForm.nationalite.trim() || null,
      telephone: adhForm.telephone.trim() || null,
      email: adhForm.email.trim() || null,
      adresse: adhForm.adresse.trim() || null,
      formule: adhForm.formule,
      pays_inhumation: adhForm.pays_inhumation.trim() || null,
      cimetiere_souhaite: adhForm.cimetiere_souhaite.trim() || null,
      instructions_specifiques: adhForm.instructions_specifiques.trim() || null,
      cotisation_annuelle: Number(adhForm.cotisation_annuelle) || 0,
      date_adhesion: adhForm.date_adhesion,
      statut: adhForm.statut,
      notes: adhForm.notes.trim() || null,
      updated_at: new Date().toISOString(),
    };
    if (adhEditingId) {
      await supabase.from('adhesions_obseques').update(payload).eq('id', adhEditingId);
    } else {
      await supabase.from('adhesions_obseques').insert({
        ...payload,
        organisme_id: organismeActif!.id,
        organisme_nom_historique: organismeActif!.nom,
      });
    }
    setAdhModalOpen(false);
    setAdhSubmitting(false);
    fetchAll();
  };

  const handleAdhDelete = async () => {
    if (!adhDeleteId) return;
    await supabase.from('adhesions_obseques').delete().eq('id', adhDeleteId);
    setAdhDeleteId(null);
    fetchAll();
  };

  // ── Handlers organisme ───────────────────────────────────────────────────────

  const openOrgCreate = () => {
    setOrgEditingId(null);
    setOrgForm({ ...emptyOrganisme, date_debut_collaboration: today() });
    setOrgError('');
    setOrgModalOpen(true);
  };

  const openOrgEdit = (o: Organisme) => {
    setOrgEditingId(o.id);
    setOrgForm({
      nom: o.nom, adresse: o.adresse ?? '', telephone: o.telephone ?? '', email: o.email ?? '',
      numero_identification: o.numero_identification ?? '', numero_contrat: o.numero_contrat ?? '',
      contact_referent_nom: o.contact_referent_nom ?? '',
      contact_referent_telephone: o.contact_referent_telephone ?? '',
      contact_referent_email: o.contact_referent_email ?? '',
      notes: o.notes ?? '',
      date_debut_collaboration: o.date_debut_collaboration,
    });
    setOrgError('');
    setOrgModalOpen(true);
  };

  const handleOrgSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOrgError('');
    if (!orgForm.nom.trim()) { setOrgError('Nom de l\'organisme obligatoire.'); return; }
    setOrgSubmitting(true);
    const payload = {
      nom: orgForm.nom.trim(), adresse: orgForm.adresse.trim() || null,
      telephone: orgForm.telephone.trim() || null, email: orgForm.email.trim() || null,
      numero_identification: orgForm.numero_identification.trim() || null,
      numero_contrat: orgForm.numero_contrat.trim() || null,
      contact_referent_nom: orgForm.contact_referent_nom.trim() || null,
      contact_referent_telephone: orgForm.contact_referent_telephone.trim() || null,
      contact_referent_email: orgForm.contact_referent_email.trim() || null,
      notes: orgForm.notes.trim() || null,
      date_debut_collaboration: orgForm.date_debut_collaboration,
      updated_at: new Date().toISOString(),
    };
    if (orgEditingId) {
      await supabase.from('organismes_obseques').update(payload).eq('id', orgEditingId);
    } else {
      if (organismeActif) {
        await supabase.from('organismes_obseques').update({ date_fin_collaboration: today() }).eq('id', organismeActif.id);
      }
      await supabase.from('organismes_obseques').insert(payload);
    }
    setOrgModalOpen(false);
    setOrgSubmitting(false);
    fetchAll();
  };

  const handleOrgResilier = async () => {
    if (!orgResilierId) return;
    await supabase.from('organismes_obseques').update({ date_fin_collaboration: today() }).eq('id', orgResilierId);
    setOrgResilierId(null);
    fetchAll();
  };

  const handleOrgDelete = async () => {
    if (!orgDeleteId) return;
    await supabase.from('organismes_obseques').delete().eq('id', orgDeleteId);
    setOrgDeleteId(null);
    fetchAll();
  };

  // ── Handlers dossier - Ayants droit ─────────────────────────────────────────

  const handleAdAdd = async () => {
    if (!dossierAdhesion || !adForm.prenom.trim() || !adForm.nom.trim()) return;
    setAdSaving(true);
    await supabase.from('adhesions_obseques_ayants_droit').insert({
      adhesion_id: dossierAdhesion.id,
      nom: adForm.nom.trim(),
      prenom: adForm.prenom.trim(),
      date_naissance: adForm.date_naissance || null,
      lien_parente: adForm.lien_parente,
    });
    setAdForm(emptyAd);
    setAdSaving(false);
    fetchDossier(dossierAdhesion.id);
  };

  const handleAdDelete = async (id: string) => {
    if (!dossierAdhesion) return;
    await supabase.from('adhesions_obseques_ayants_droit').delete().eq('id', id);
    fetchDossier(dossierAdhesion.id);
  };

  // ── Handlers dossier - Contacts urgence ─────────────────────────────────────

  const handleCuAdd = async () => {
    if (!dossierAdhesion || !cuForm.nom.trim() || !cuForm.telephone.trim()) return;
    setCuSaving(true);
    const nextOrdre = contactsUrgence.length > 0
      ? Math.max(...contactsUrgence.map((c) => c.ordre_priorite)) + 1
      : 1;
    await supabase.from('adhesions_obseques_contacts_urgence').insert({
      adhesion_id: dossierAdhesion.id,
      nom: cuForm.nom.trim(),
      prenom: cuForm.prenom.trim(),
      telephone: cuForm.telephone.trim(),
      lien_parente: cuForm.lien_parente.trim(),
      ordre_priorite: nextOrdre,
    });
    setCuForm(emptyCu);
    setCuSaving(false);
    fetchDossier(dossierAdhesion.id);
  };

  const handleCuDelete = async (id: string) => {
    if (!dossierAdhesion) return;
    await supabase.from('adhesions_obseques_contacts_urgence').delete().eq('id', id);
    const remaining = contactsUrgence.filter((c) => c.id !== id);
    if (remaining.length > 0) {
      await Promise.all(remaining.map((c, i) =>
        supabase.from('adhesions_obseques_contacts_urgence').update({ ordre_priorite: i + 1 }).eq('id', c.id)
      ));
    }
    fetchDossier(dossierAdhesion.id);
  };

  const handleCuReorder = async (id: string, direction: 'up' | 'down') => {
    if (!dossierAdhesion) return;
    const idx = contactsUrgence.findIndex((c) => c.id === id);
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === contactsUrgence.length - 1) return;
    const otherIdx = direction === 'up' ? idx - 1 : idx + 1;
    const curr = contactsUrgence[idx];
    const other = contactsUrgence[otherIdx];
    await Promise.all([
      supabase.from('adhesions_obseques_contacts_urgence').update({ ordre_priorite: other.ordre_priorite }).eq('id', curr.id),
      supabase.from('adhesions_obseques_contacts_urgence').update({ ordre_priorite: curr.ordre_priorite }).eq('id', other.id),
    ]);
    fetchDossier(dossierAdhesion.id);
  };

  // ── Handlers dossier - Paiements ─────────────────────────────────────────────

  const handlePAdd = async () => {
    if (!dossierAdhesion || !pForm.montant || !pForm.date_paiement) return;
    setPSaving(true);
    await supabase.from('adhesions_obseques_paiements').insert({
      adhesion_id: dossierAdhesion.id,
      montant: Number(pForm.montant),
      date_paiement: pForm.date_paiement,
      annee_concernee: Number(pForm.annee_concernee),
      moyen_paiement: pForm.moyen_paiement,
      reference_externe: pForm.reference_externe.trim() || null,
      notes: pForm.notes.trim() || null,
    });
    setPForm(emptyP);
    setPSaving(false);
    fetchDossier(dossierAdhesion.id);
  };

  const handlePDelete = async () => {
    if (!dossierAdhesion || !pDeleteId) return;
    await supabase.from('adhesions_obseques_paiements').delete().eq('id', pDeleteId);
    setPDeleteId(null);
    fetchDossier(dossierAdhesion.id);
  };

  // ── Handlers dossier - Documents ─────────────────────────────────────────────

  const ALLOWED_MIME = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!dossierAdhesion || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    if (!ALLOWED_MIME.includes(file.type)) {
      alert('Type de fichier non autorisé. Formats acceptés : PDF, JPG, PNG, WebP.');
      e.target.value = '';
      return;
    }
    setDocUploading(true);
    const ext = file.name.split('.').pop() ?? 'bin';
    const path = `${dossierAdhesion.id}/${Date.now()}.${ext}`;
    const { error: uploadErr } = await supabase.storage.from('obseques-documents').upload(path, file);
    if (!uploadErr) {
      await supabase.from('adhesions_obseques_documents').insert({
        adhesion_id: dossierAdhesion.id,
        url: path,
        type: docType,
        nom_fichier: file.name,
      });
      fetchDossier(dossierAdhesion.id);
    }
    setDocUploading(false);
    e.target.value = '';
  };

  const handleDocDownload = async (path: string, nom: string) => {
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

  const handleDocDelete = async () => {
    if (!dossierAdhesion || !docDeleteId) return;
    const doc = documents.find((d) => d.id === docDeleteId);
    if (doc) await supabase.storage.from('obseques-documents').remove([doc.url]);
    await supabase.from('adhesions_obseques_documents').delete().eq('id', docDeleteId);
    setDocDeleteId(null);
    fetchDossier(dossierAdhesion.id);
  };

  // ── Filtres ──────────────────────────────────────────────────────────────────

  const qAdh = adhSearch.toLowerCase().trim();
  const filteredAdhesions = adhesions.filter((a) => {
    if (adhFilter === 'Actifs' && a.statut !== 'actif') return false;
    if (adhFilter === 'Suspendus' && a.statut !== 'suspendu') return false;
    if (adhFilter === 'Résiliés' && a.statut !== 'resilie') return false;
    if (adhFilter === 'Décès' && a.statut !== 'deces') return false;
    if (qAdh && !`${a.prenom} ${a.nom} ${a.email ?? ''} ${a.reference_contrat ?? ''}`.toLowerCase().includes(qAdh)) return false;
    return true;
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold font-serif text-primary uppercase tracking-wider">Assurance obsèques</h1>
      </div>

      {/* Onglets */}
      <div className="flex gap-2">
        {([['adhesions', 'Adhésions'], ['organismes', 'Organismes']] as [Tab, string][]).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
              tab === key ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container-lowest text-on-surface/60 hover:text-primary border border-[var(--color-card-border)]'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* ══════════════ ONGLET ADHESIONS ══════════════ */}
      {tab === 'adhesions' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {STATUT_FILTERS.map((f) => (
                <button key={f} onClick={() => setAdhFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    adhFilter === f ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container-lowest text-on-surface/60 hover:text-primary border border-[var(--color-card-border)]'
                  }`}>
                  {f}
                </button>
              ))}
            </div>
            <div className="w-full max-w-xs">
              <FloatInput id="adh-search" label="Rechercher..." value={adhSearch} onChange={setAdhSearch} compact />
            </div>
            <button onClick={openAdhCreate}
              className="ml-auto flex items-center gap-2 card-green text-white px-5 py-2 rounded-full font-bold text-sm shadow-md hover:opacity-90 transition-all active:scale-95">
              <Plus className="w-4 h-4" /> Nouvelle adhésion
            </button>
          </div>

          {!organismeActif && !loading && (
            <div className="bg-tertiary/10 border border-tertiary/30 rounded-xl p-4">
              <p className="text-sm text-on-surface">Aucun organisme tiers actif. Créez-en un dans l&apos;onglet <strong>Organismes</strong> avant d&apos;ajouter une adhésion.</p>
            </div>
          )}

          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
            {loading ? (
              <p className="text-center text-on-surface/40 text-sm py-12">Chargement...</p>
            ) : filteredAdhesions.length === 0 ? (
              <p className="text-center text-on-surface/40 text-sm py-12">Aucune adhésion.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="card-green text-white/70 text-[10px] uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-2 font-bold">Adhérent</th>
                      <th className="px-4 py-2 font-bold">Type</th>
                      <th className="px-4 py-2 font-bold">Statut</th>
                      <th className="px-4 py-2 font-bold text-right">Cotisation</th>
                      <th className="px-4 py-2 font-bold">Adhésion</th>
                      <th className="px-4 py-2 font-bold">Référence</th>
                      <th className="px-4 py-2 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {filteredAdhesions.map((a) => (
                      <tr key={a.id} className="hover:bg-surface-container/50 transition-colors">
                        <td className="px-4 py-2">
                          <p className="font-semibold text-on-surface">{a.prenom} {a.nom}</p>
                          {a.email && <p className="text-xs text-on-surface/50">{a.email}</p>}
                        </td>
                        <td className="px-4 py-2 text-xs text-on-surface/70 uppercase tracking-wider">{a.type_contrat}</td>
                        <td className="px-4 py-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            a.statut === 'actif' ? 'bg-primary/10 text-primary' :
                            a.statut === 'suspendu' ? 'bg-tertiary/10 text-tertiary' :
                            a.statut === 'resilie' ? 'bg-on-surface/10 text-on-surface/60' :
                            'bg-error/10 text-error'
                          }`}>{a.statut}</span>
                        </td>
                        <td className="px-4 py-2 text-right text-on-surface/80">{formatMontant(a.cotisation_annuelle)}</td>
                        <td className="px-4 py-2 text-xs text-on-surface/60">{formatDate(a.date_adhesion)}</td>
                        <td className="px-4 py-2 text-xs text-on-surface/60">{a.reference_contrat ?? '-'}</td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => openAdhEdit(a)} className="w-8 h-8 rounded-xl flex items-center justify-center text-on-surface/40 hover:bg-primary/10 hover:text-primary transition-colors" title="Modifier les infos"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => openDossier(a)} className="w-8 h-8 rounded-xl flex items-center justify-center text-on-surface/40 hover:bg-primary/10 hover:text-primary transition-colors" title="Dossier complet"><FolderOpen className="w-4 h-4" /></button>
                            <button onClick={() => setAdhDeleteId(a.id)} className="w-8 h-8 rounded-xl flex items-center justify-center text-on-surface/40 hover:bg-error/10 hover:text-error transition-colors" title="Supprimer"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════ ONGLET ORGANISMES ══════════════ */}
      {tab === 'organismes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-on-surface/60">Historique des organismes tiers partenaires. Un seul organisme peut être actif à la fois.</p>
            <button onClick={openOrgCreate}
              className="flex items-center gap-2 card-green text-white px-5 py-2 rounded-full font-bold text-sm shadow-md hover:opacity-90 transition-all active:scale-95">
              <Plus className="w-4 h-4" /> Nouvel organisme
            </button>
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
            {loading ? (
              <p className="text-center text-on-surface/40 text-sm py-12">Chargement...</p>
            ) : organismes.length === 0 ? (
              <p className="text-center text-on-surface/40 text-sm py-12">Aucun organisme enregistré.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="card-green text-white/70 text-[10px] uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-2 font-bold">Organisme</th>
                      <th className="px-4 py-2 font-bold">Référent</th>
                      <th className="px-4 py-2 font-bold">Statut</th>
                      <th className="px-4 py-2 font-bold">Début</th>
                      <th className="px-4 py-2 font-bold">Fin</th>
                      <th className="px-4 py-2 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {organismes.map((o) => {
                      const actif = !o.date_fin_collaboration;
                      return (
                        <tr key={o.id} className={`${actif ? 'bg-primary/5' : ''} hover:bg-surface-container/50 transition-colors`}>
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-on-surface/40 flex-shrink-0" />
                              <div>
                                <p className="font-semibold text-on-surface">{o.nom}</p>
                                {o.email && <p className="text-xs text-on-surface/50">{o.email}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2 text-xs text-on-surface/70">
                            {o.contact_referent_nom ?? '-'}
                            {o.contact_referent_telephone && <p className="text-on-surface/50">{o.contact_referent_telephone}</p>}
                          </td>
                          <td className="px-4 py-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${actif ? 'bg-primary/10 text-primary' : 'bg-on-surface/10 text-on-surface/60'}`}>
                              {actif ? 'Actif' : 'Archivé'}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-xs text-on-surface/60">{formatDate(o.date_debut_collaboration)}</td>
                          <td className="px-4 py-2 text-xs text-on-surface/60">{formatDate(o.date_fin_collaboration)}</td>
                          <td className="px-4 py-2 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => openOrgEdit(o)} className="w-8 h-8 rounded-xl flex items-center justify-center text-on-surface/40 hover:bg-primary/10 hover:text-primary transition-colors"><Pencil className="w-4 h-4" /></button>
                              {actif && (
                                <button onClick={() => setOrgResilierId(o.id)} className="w-8 h-8 rounded-xl flex items-center justify-center text-on-surface/40 hover:bg-tertiary/10 hover:text-tertiary transition-colors" title="Résilier">
                                  <Archive className="w-4 h-4" />
                                </button>
                              )}
                              <button onClick={() => setOrgDeleteId(o.id)} className="w-8 h-8 rounded-xl flex items-center justify-center text-on-surface/40 hover:bg-error/10 hover:text-error transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════ MODALE DOSSIER ══════════════ */}
      {dossierAdhesion && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-slide-up border border-primary">

            {/* Header */}
            <div className="card-green rounded-t-2xl p-5 flex items-center justify-between sticky top-0 z-10">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Dossier complet</h2>
                <p className="text-white/70 text-xs mt-0.5">{dossierAdhesion.prenom} {dossierAdhesion.nom} — {dossierAdhesion.organisme_nom_historique}</p>
              </div>
              <button onClick={() => setDossierAdhesion(null)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors" aria-label="Fermer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {loadingDossier ? (
              <p className="text-center text-on-surface/40 text-sm py-12">Chargement...</p>
            ) : (
              <div className="p-6 space-y-8">

                {/* ── Section 1 : Ayants droit ── */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Ayants droit</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      dossierAdhesion.type_contrat === 'familial' ? 'bg-primary/10 text-primary' : 'bg-on-surface/10 text-on-surface/40'
                    }`}>{dossierAdhesion.type_contrat}</span>
                  </div>

                  {dossierAdhesion.type_contrat === 'familial' ? (
                    <>
                      {ayantsDroit.length > 0 && (
                        <div className="mb-4 space-y-1.5">
                          {ayantsDroit.map((ad) => (
                            <div key={ad.id} className="flex items-center gap-3 px-4 py-2.5 bg-surface-container-low rounded-xl">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-on-surface">{ad.prenom} {ad.nom}</p>
                                <p className="text-xs text-on-surface/50 capitalize">{ad.lien_parente}{ad.date_naissance ? ` — né(e) le ${formatDate(ad.date_naissance)}` : ''}</p>
                              </div>
                              <button onClick={() => handleAdDelete(ad.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface/30 hover:bg-error/10 hover:text-error transition-colors flex-shrink-0">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2 flex-wrap items-end">
                        <div className="w-36"><FloatInput id="ad-prenom" label="Prénom" value={adForm.prenom} onChange={(v) => setAdForm({ ...adForm, prenom: v })} transform="capitalize" compact /></div>
                        <div className="w-36"><FloatInput id="ad-nom" label="Nom" value={adForm.nom} onChange={(v) => setAdForm({ ...adForm, nom: v })} transform="uppercase" compact /></div>
                        <div className="w-40"><FloatInput id="ad-naiss" label="Date de naissance" type="date" value={adForm.date_naissance} onChange={(v) => setAdForm({ ...adForm, date_naissance: v })} compact /></div>
                        <select value={adForm.lien_parente} onChange={(e) => setAdForm({ ...adForm, lien_parente: e.target.value as 'conjoint' | 'enfant' | 'parent' })}
                          className="bg-surface-container-low border border-[var(--color-card-border)] rounded-xl py-1.5 px-3 text-xs focus:outline-none">
                          <option value="conjoint">Conjoint(e)</option>
                          <option value="enfant">Enfant</option>
                          <option value="parent">Parent</option>
                        </select>
                        <button onClick={handleAdAdd} disabled={adSaving || !adForm.prenom.trim() || !adForm.nom.trim()}
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary hover:bg-primary hover:text-on-primary transition-all disabled:opacity-40">
                          <Plus className="w-3.5 h-3.5" /> Ajouter
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-on-surface/40 italic">Non applicable pour un contrat individuel.</p>
                  )}
                </div>

                <hr className="border-outline-variant/15" />

                {/* ── Section 2 : Contacts d'urgence ── */}
                <div>
                  <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-4">Contacts d&apos;urgence</h3>

                  {contactsUrgence.length > 0 && (
                    <div className="mb-4 space-y-1.5">
                      {contactsUrgence.map((cu, idx) => (
                        <div key={cu.id} className="flex items-center gap-3 px-4 py-2.5 bg-surface-container-low rounded-xl">
                          <span className="w-5 h-5 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0">{cu.ordre_priorite}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-on-surface">{cu.prenom} {cu.nom}{cu.lien_parente ? <span className="text-on-surface/50 font-normal text-xs"> — {cu.lien_parente}</span> : null}</p>
                            <p className="text-xs text-on-surface/50">{cu.telephone}</p>
                          </div>
                          <div className="flex items-center gap-0.5 flex-shrink-0">
                            <button onClick={() => handleCuReorder(cu.id, 'up')} disabled={idx === 0} className="w-6 h-6 rounded flex items-center justify-center text-on-surface/30 hover:text-primary disabled:opacity-20 transition-colors">
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleCuReorder(cu.id, 'down')} disabled={idx === contactsUrgence.length - 1} className="w-6 h-6 rounded flex items-center justify-center text-on-surface/30 hover:text-primary disabled:opacity-20 transition-colors">
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleCuDelete(cu.id)} className="w-6 h-6 rounded flex items-center justify-center text-on-surface/30 hover:bg-error/10 hover:text-error transition-colors ml-1">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 flex-wrap items-end">
                    <div className="w-32"><FloatInput id="cu-prenom" label="Prénom" value={cuForm.prenom} onChange={(v) => setCuForm({ ...cuForm, prenom: v })} transform="capitalize" compact /></div>
                    <div className="w-32"><FloatInput id="cu-nom" label="Nom" value={cuForm.nom} onChange={(v) => setCuForm({ ...cuForm, nom: v })} transform="uppercase" compact /></div>
                    <div className="w-36"><FloatInput id="cu-tel" label="Téléphone" type="tel" value={cuForm.telephone} onChange={(v) => setCuForm({ ...cuForm, telephone: v })} transform="phone" compact /></div>
                    <div className="w-36"><FloatInput id="cu-lien" label="Lien (fils, épouse...)" value={cuForm.lien_parente} onChange={(v) => setCuForm({ ...cuForm, lien_parente: v })} compact /></div>
                    <button onClick={handleCuAdd} disabled={cuSaving || !cuForm.nom.trim() || !cuForm.telephone.trim()}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary hover:bg-primary hover:text-on-primary transition-all disabled:opacity-40">
                      <Plus className="w-3.5 h-3.5" /> Ajouter
                    </button>
                  </div>
                </div>

                <hr className="border-outline-variant/15" />

                {/* ── Section 3 : Paiements ── */}
                <div>
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Paiements</h3>
                    {paiements.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {[...new Set(paiements.map((p) => p.annee_concernee))].sort((a, b) => b - a).map((year) => (
                          <span key={year} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{year}</span>
                        ))}
                      </div>
                    )}
                    {paiements.length > 0 && (
                      <span className="ml-auto text-xs text-on-surface/60 font-semibold">
                        Total : {formatMontant(paiements.reduce((s, p) => s + p.montant, 0))}
                      </span>
                    )}
                  </div>

                  {paiements.length > 0 && (
                    <div className="mb-4 overflow-x-auto rounded-xl border border-outline-variant/10">
                      <table className="w-full text-left text-xs">
                        <thead className="card-green text-white/70 text-[9px] uppercase tracking-wider">
                          <tr>
                            <th className="px-3 py-2 font-bold">Année</th>
                            <th className="px-3 py-2 font-bold">Date</th>
                            <th className="px-3 py-2 font-bold text-right">Montant</th>
                            <th className="px-3 py-2 font-bold">Moyen</th>
                            <th className="px-3 py-2 font-bold">Référence</th>
                            <th className="px-3 py-2"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                          {paiements.map((p) => (
                            <tr key={p.id} className="hover:bg-surface-container/50">
                              <td className="px-3 py-2 font-bold text-primary">{p.annee_concernee}</td>
                              <td className="px-3 py-2 text-on-surface/60">{formatDate(p.date_paiement)}</td>
                              <td className="px-3 py-2 text-right font-semibold text-on-surface">{formatMontant(p.montant)}</td>
                              <td className="px-3 py-2 text-on-surface/60 uppercase tracking-wider">{p.moyen_paiement}</td>
                              <td className="px-3 py-2 text-on-surface/60">{p.reference_externe ?? '-'}</td>
                              <td className="px-3 py-2 text-right">
                                <button onClick={() => setPDeleteId(p.id)} className="w-6 h-6 rounded flex items-center justify-center text-on-surface/30 hover:bg-error/10 hover:text-error transition-colors">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="flex gap-2 flex-wrap items-end">
                    <div className="w-20"><FloatInput id="p-annee" label="Année" type="number" value={String(pForm.annee_concernee)} onChange={(v) => setPForm({ ...pForm, annee_concernee: Number(v) })} compact /></div>
                    <div className="w-28"><FloatInput id="p-montant" label="Montant (€)" type="number" value={String(pForm.montant || '')} onChange={(v) => setPForm({ ...pForm, montant: Number(v) })} compact /></div>
                    <div className="w-36"><FloatInput id="p-date" label="Date de paiement" type="date" value={pForm.date_paiement} onChange={(v) => setPForm({ ...pForm, date_paiement: v })} compact /></div>
                    <select value={pForm.moyen_paiement} onChange={(e) => setPForm({ ...pForm, moyen_paiement: e.target.value as 'especes' | 'cheque' | 'virement' | 'cb' })}
                      className="bg-surface-container-low border border-[var(--color-card-border)] rounded-xl py-1.5 px-3 text-xs focus:outline-none">
                      <option value="especes">Espèces</option>
                      <option value="cheque">Chèque</option>
                      <option value="virement">Virement</option>
                      <option value="cb">Carte bancaire</option>
                    </select>
                    <div className="w-32"><FloatInput id="p-ref" label="Référence" value={pForm.reference_externe} onChange={(v) => setPForm({ ...pForm, reference_externe: v })} compact /></div>
                    <button onClick={handlePAdd} disabled={pSaving || !pForm.montant || !pForm.date_paiement}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary hover:bg-primary hover:text-on-primary transition-all disabled:opacity-40">
                      <Plus className="w-3.5 h-3.5" /> Enregistrer
                    </button>
                  </div>
                </div>

                <hr className="border-outline-variant/15" />

                {/* ── Section 4 : Documents ── */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Documents</h3>
                    <span className="text-[10px] text-on-surface/40 uppercase tracking-wider font-medium">Bucket privé - accès sécurisé</span>
                  </div>

                  {documents.length > 0 && (
                    <div className="mb-4 space-y-1.5">
                      {documents.map((doc) => (
                        <div key={doc.id} className="flex items-center gap-3 px-4 py-2.5 bg-surface-container-low rounded-xl">
                          <FileText className="w-4 h-4 text-on-surface/40 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-on-surface truncate">{doc.nom_fichier}</p>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase tracking-wider">{doc.type}</span>
                          </div>
                          <button onClick={() => handleDocDownload(doc.url, doc.nom_fichier)} title="Télécharger"
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface/40 hover:bg-primary/10 hover:text-primary transition-colors flex-shrink-0">
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDocDeleteId(doc.id)} title="Supprimer"
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface/30 hover:bg-error/10 hover:text-error transition-colors flex-shrink-0">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 items-center flex-wrap">
                    <select value={docType} onChange={(e) => setDocType(e.target.value as DocObseques['type'])}
                      className="bg-surface-container-low border border-[var(--color-card-border)] rounded-xl py-1.5 px-3 text-xs focus:outline-none">
                      <option value="cni">CNI</option>
                      <option value="passeport">Passeport</option>
                      <option value="domicile">Justificatif domicile</option>
                      <option value="autre">Autre</option>
                    </select>
                    <label className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
                      docUploading ? 'bg-on-surface/10 text-on-surface/30 cursor-not-allowed' : 'bg-primary/10 text-primary hover:bg-primary hover:text-on-primary'
                    }`}>
                      <Upload className="w-3.5 h-3.5" />
                      {docUploading ? 'Envoi...' : 'Choisir un fichier'}
                      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={handleDocUpload} disabled={docUploading} />
                    </label>
                    <span className="text-[10px] text-on-surface/40">PDF, JPG, PNG, WebP</span>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirm suppression document */}
      {docDeleteId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center border border-[var(--color-card-border)]">
            <Trash2 className="w-10 h-10 text-error mx-auto mb-3" />
            <h3 className="text-lg font-serif text-on-surface mb-2">Supprimer ce document ?</h3>
            <p className="text-sm text-on-surface/60 mb-6">Le fichier sera supprimé du stockage sécurisé. Cette action est irréversible.</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setDocDeleteId(null)} className="px-5 py-2.5 rounded-full text-sm font-bold text-on-surface/60 hover:bg-surface-container transition-colors">Annuler</button>
              <button onClick={handleDocDelete} className="px-6 py-2.5 rounded-full text-sm font-bold bg-error text-white hover:opacity-90 transition-all active:scale-95">Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm suppression paiement */}
      {pDeleteId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center border border-[var(--color-card-border)]">
            <Trash2 className="w-10 h-10 text-error mx-auto mb-3" />
            <h3 className="text-lg font-serif text-on-surface mb-2">Supprimer ce paiement ?</h3>
            <p className="text-sm text-on-surface/60 mb-6">Cette action est irréversible.</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setPDeleteId(null)} className="px-5 py-2.5 rounded-full text-sm font-bold text-on-surface/60 hover:bg-surface-container transition-colors">Annuler</button>
              <button onClick={handlePDelete} className="px-6 py-2.5 rounded-full text-sm font-bold bg-error text-white hover:opacity-90 transition-all active:scale-95">Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ MODALE ADHESION ══════════════ */}
      {adhModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-slide-up border border-primary">
            <div className="card-green rounded-t-2xl p-5 flex items-center justify-between sticky top-0 z-10">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">{adhEditingId ? 'Modifier l\'adhésion' : 'Nouvelle adhésion'}</h2>
              <button onClick={() => !adhSubmitting && setAdhModalOpen(false)} disabled={adhSubmitting} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors disabled:opacity-50" aria-label="Fermer"><X className="w-4 h-4" /></button>
            </div>

            {!organismeActif && !adhEditingId ? (
              <div className="p-6"><p className="text-sm text-on-surface">{adhError}</p></div>
            ) : (
              <form onSubmit={handleAdhSubmit} className="p-6 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                  <Building2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-on-surface/60 uppercase tracking-wider">Organisme tiers</p>
                    <p className="text-sm font-semibold text-on-surface truncate">
                      {adhEditingId ? adhesions.find((a) => a.id === adhEditingId)?.organisme_nom_historique ?? '-' : organismeActif?.nom ?? '-'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <FloatInput id="adh-prenom" label="Prénom" value={adhForm.prenom} onChange={(v) => setAdhForm({ ...adhForm, prenom: v })} transform="capitalize" required />
                  <FloatInput id="adh-nom" label="Nom" value={adhForm.nom} onChange={(v) => setAdhForm({ ...adhForm, nom: v })} transform="uppercase" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FloatInput id="adh-naiss" label="Date de naissance" type="date" value={adhForm.date_naissance} onChange={(v) => setAdhForm({ ...adhForm, date_naissance: v })} />
                  <FloatInput id="adh-lieu" label="Lieu de naissance" value={adhForm.lieu_naissance} onChange={(v) => setAdhForm({ ...adhForm, lieu_naissance: v })} transform="sentence" />
                </div>
                <FloatInput id="adh-nat" label="Nationalité" value={adhForm.nationalite} onChange={(v) => setAdhForm({ ...adhForm, nationalite: v })} transform="sentence" />
                <div className="grid grid-cols-2 gap-3">
                  <FloatInput id="adh-tel" label="Téléphone" type="tel" value={adhForm.telephone} onChange={(v) => setAdhForm({ ...adhForm, telephone: v })} transform="phone" />
                  <FloatInput id="adh-email" label="Email" type="email" value={adhForm.email} onChange={(v) => setAdhForm({ ...adhForm, email: v })} transform="lowercase" />
                </div>
                <FloatInput id="adh-adr" label="Adresse" value={adhForm.adresse} onChange={(v) => setAdhForm({ ...adhForm, adresse: v })} />

                <FloatSelect id="adh-user" label="Lier à un compte visiteur (optionnel)"
                  value={adhForm.user_id ?? ''}
                  onChange={(v) => setAdhForm({ ...adhForm, user_id: v || null })}
                  options={[
                    { value: '', label: 'Aucun compte lié' },
                    ...visiteurs.map((v) => ({ value: v.id, label: `${v.prenom ?? ''} ${v.nom ?? ''} - ${v.email}`.trim() })),
                  ]}
                />

                <div className="grid grid-cols-2 gap-3">
                  <FloatSelect id="adh-type" label="Type de contrat" value={adhForm.type_contrat}
                    onChange={(v) => setAdhForm({ ...adhForm, type_contrat: v as 'individuel' | 'familial' })}
                    options={[{ value: 'individuel', label: 'Individuel' }, { value: 'familial', label: 'Familial' }]}
                    required />
                  <FloatInput id="adh-ref" label="Référence contrat" value={adhForm.reference_contrat} onChange={(v) => setAdhForm({ ...adhForm, reference_contrat: v })} />
                </div>

                <FloatSelect id="adh-form" label="Formule" value={adhForm.formule}
                  onChange={(v) => setAdhForm({ ...adhForm, formule: v as 'inhumation_france' | 'rapatriement' | 'autre' })}
                  options={[
                    { value: 'inhumation_france', label: 'Inhumation en France' },
                    { value: 'rapatriement', label: 'Rapatriement' },
                    { value: 'autre', label: 'Autre' },
                  ]}
                  required />
                <div className="grid grid-cols-2 gap-3">
                  <FloatInput id="adh-pays" label="Pays d'inhumation" value={adhForm.pays_inhumation} onChange={(v) => setAdhForm({ ...adhForm, pays_inhumation: v })} transform="sentence" />
                  <FloatInput id="adh-cim" label="Cimetière souhaité" value={adhForm.cimetiere_souhaite} onChange={(v) => setAdhForm({ ...adhForm, cimetiere_souhaite: v })} transform="sentence" />
                </div>
                <FloatTextarea id="adh-instr" label="Instructions spécifiques" value={adhForm.instructions_specifiques} onChange={(v) => setAdhForm({ ...adhForm, instructions_specifiques: v })} rows={2} />

                <div className="grid grid-cols-3 gap-3">
                  <FloatInput id="adh-cot" label="Cotisation annuelle (€)" type="number" value={String(adhForm.cotisation_annuelle)} onChange={(v) => setAdhForm({ ...adhForm, cotisation_annuelle: Number(v) || 0 })} />
                  <FloatInput id="adh-date" label="Date d'adhésion" type="date" value={adhForm.date_adhesion} onChange={(v) => setAdhForm({ ...adhForm, date_adhesion: v })} required />
                  <FloatSelect id="adh-statut" label="Statut" value={adhForm.statut}
                    onChange={(v) => setAdhForm({ ...adhForm, statut: v as 'actif' | 'suspendu' | 'resilie' | 'deces' })}
                    options={[
                      { value: 'actif', label: 'Actif' },
                      { value: 'suspendu', label: 'Suspendu' },
                      { value: 'resilie', label: 'Résilié' },
                      { value: 'deces', label: 'Décès' },
                    ]}
                    required />
                </div>

                <FloatTextarea id="adh-notes" label="Notes internes" value={adhForm.notes} onChange={(v) => setAdhForm({ ...adhForm, notes: v })} rows={2} />

                {adhError && (
                  <div className="bg-error-container/20 border border-error/20 rounded-xl p-3">
                    <p className="text-error text-xs">{adhError}</p>
                  </div>
                )}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setAdhModalOpen(false)} disabled={adhSubmitting} className="px-4 py-2 text-xs font-medium text-on-surface/60 hover:text-on-surface transition-colors disabled:opacity-50">Annuler</button>
                  <button type="submit" disabled={adhSubmitting} className="px-5 py-2 rounded-full text-xs font-bold shadow-sm bg-primary text-on-primary hover:opacity-90 transition-all active:scale-95 disabled:opacity-50">
                    {adhSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Confirm suppression adhésion */}
      {adhDeleteId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center border border-[var(--color-card-border)]">
            <Trash2 className="w-10 h-10 text-error mx-auto mb-3" />
            <h3 className="text-lg font-serif text-on-surface mb-2">Supprimer cette adhésion ?</h3>
            <p className="text-sm text-on-surface/60 mb-6">Tous les ayants droit, contacts, paiements et documents liés seront supprimés. Cette action est irréversible.</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setAdhDeleteId(null)} className="px-5 py-2.5 rounded-full text-sm font-bold text-on-surface/60 hover:bg-surface-container transition-colors">Annuler</button>
              <button onClick={handleAdhDelete} className="px-6 py-2.5 rounded-full text-sm font-bold bg-error text-white hover:opacity-90 transition-all active:scale-95">Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ MODALE ORGANISME ══════════════ */}
      {orgModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up border border-primary">
            <div className="card-green rounded-t-2xl p-5 flex items-center justify-between sticky top-0 z-10">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">{orgEditingId ? 'Modifier l\'organisme' : 'Nouvel organisme'}</h2>
              <button onClick={() => !orgSubmitting && setOrgModalOpen(false)} disabled={orgSubmitting} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors disabled:opacity-50" aria-label="Fermer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleOrgSubmit} className="p-6 space-y-4">
              {!orgEditingId && organismeActif && (
                <div className="bg-tertiary/10 border border-tertiary/30 rounded-xl p-3">
                  <p className="text-xs text-on-surface">L&apos;organisme actuel <strong>{organismeActif.nom}</strong> sera automatiquement clôturé (date de fin = aujourd&apos;hui) lors de la création du nouveau.</p>
                </div>
              )}
              <FloatInput id="org-nom" label="Nom de l'organisme" value={orgForm.nom} onChange={(v) => setOrgForm({ ...orgForm, nom: v })} transform="sentence" required />
              <FloatInput id="org-adr" label="Adresse" value={orgForm.adresse} onChange={(v) => setOrgForm({ ...orgForm, adresse: v })} />
              <div className="grid grid-cols-2 gap-3">
                <FloatInput id="org-tel" label="Téléphone" type="tel" value={orgForm.telephone} onChange={(v) => setOrgForm({ ...orgForm, telephone: v })} transform="phone" />
                <FloatInput id="org-email" label="Email" type="email" value={orgForm.email} onChange={(v) => setOrgForm({ ...orgForm, email: v })} transform="lowercase" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FloatInput id="org-ni" label="N° d'identification / SIRET" value={orgForm.numero_identification} onChange={(v) => setOrgForm({ ...orgForm, numero_identification: v })} />
                <FloatInput id="org-contrat" label="N° de contrat (mosquée ↔ organisme)" value={orgForm.numero_contrat} onChange={(v) => setOrgForm({ ...orgForm, numero_contrat: v })} />
              </div>
              <div className="pt-2 border-t border-outline-variant/10">
                <p className="text-xs font-bold text-on-surface/60 uppercase tracking-wider mb-3">Contact référent</p>
                <div className="space-y-3">
                  <FloatInput id="org-ref-nom" label="Nom du référent" value={orgForm.contact_referent_nom} onChange={(v) => setOrgForm({ ...orgForm, contact_referent_nom: v })} transform="capitalize" />
                  <div className="grid grid-cols-2 gap-3">
                    <FloatInput id="org-ref-tel" label="Téléphone référent" type="tel" value={orgForm.contact_referent_telephone} onChange={(v) => setOrgForm({ ...orgForm, contact_referent_telephone: v })} transform="phone" />
                    <FloatInput id="org-ref-email" label="Email référent" type="email" value={orgForm.contact_referent_email} onChange={(v) => setOrgForm({ ...orgForm, contact_referent_email: v })} transform="lowercase" />
                  </div>
                </div>
              </div>
              <FloatInput id="org-debut" label="Date de début de collaboration" type="date" value={orgForm.date_debut_collaboration} onChange={(v) => setOrgForm({ ...orgForm, date_debut_collaboration: v })} required />
              <FloatTextarea id="org-notes" label="Notes" value={orgForm.notes} onChange={(v) => setOrgForm({ ...orgForm, notes: v })} rows={2} />
              {orgError && (
                <div className="bg-error-container/20 border border-error/20 rounded-xl p-3">
                  <p className="text-error text-xs">{orgError}</p>
                </div>
              )}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOrgModalOpen(false)} disabled={orgSubmitting} className="px-4 py-2 text-xs font-medium text-on-surface/60 hover:text-on-surface transition-colors disabled:opacity-50">Annuler</button>
                <button type="submit" disabled={orgSubmitting} className="px-5 py-2 rounded-full text-xs font-bold shadow-sm bg-primary text-on-primary hover:opacity-90 transition-all active:scale-95 disabled:opacity-50">
                  {orgSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm résiliation organisme */}
      {orgResilierId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center border border-[var(--color-card-border)]">
            <Archive className="w-10 h-10 text-tertiary mx-auto mb-3" />
            <h3 className="text-lg font-serif text-on-surface mb-2">Résilier cet organisme ?</h3>
            <p className="text-sm text-on-surface/60 mb-6">La date de fin de collaboration sera fixée à aujourd&apos;hui. L&apos;historique est conservé.</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setOrgResilierId(null)} className="px-5 py-2.5 rounded-full text-sm font-bold text-on-surface/60 hover:bg-surface-container transition-colors">Annuler</button>
              <button onClick={handleOrgResilier} className="px-6 py-2.5 rounded-full text-sm font-bold bg-tertiary text-white hover:opacity-90 transition-all active:scale-95">Résilier</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm suppression organisme */}
      {orgDeleteId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center border border-[var(--color-card-border)]">
            <Trash2 className="w-10 h-10 text-error mx-auto mb-3" />
            <h3 className="text-lg font-serif text-on-surface mb-2">Supprimer cet organisme ?</h3>
            <p className="text-sm text-on-surface/60 mb-6">Les adhésions existantes conserveront le nom de l&apos;organisme en historique (snapshot). Préférez la résiliation pour garder l&apos;historique complet.</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setOrgDeleteId(null)} className="px-5 py-2.5 rounded-full text-sm font-bold text-on-surface/60 hover:bg-surface-container transition-colors">Annuler</button>
              <button onClick={handleOrgDelete} className="px-6 py-2.5 rounded-full text-sm font-bold bg-error text-white hover:opacity-90 transition-all active:scale-95">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
