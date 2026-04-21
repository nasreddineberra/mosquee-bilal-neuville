'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  BookOpenCheck, NotebookPen, Users, Plus, Pencil, Trash2,
  Eye, EyeOff, X, ChevronUp, ChevronDown, BookOpen,
} from 'lucide-react';
import { FloatInput, FloatSelect, FloatTextarea } from '@/components/FloatField';
import { createClient } from '@/lib/supabase/client';

type Statut = 'ouvert' | 'complet' | 'bientot';
type TabKey = 'cours_mosquee' | 'ecole_arabe' | 'sorties';

const STATUT_OPTIONS: { value: Statut; label: string }[] = [
  { value: 'ouvert', label: 'Ouvert' },
  { value: 'complet', label: 'Complet' },
  { value: 'bientot', label: 'Bientôt' },
];

const statutClass = (s: Statut) =>
  s === 'ouvert' ? 'badge-open' : s === 'complet' ? 'badge-full' : 'badge-soon';
const statutLabel = (s: Statut) => STATUT_OPTIONS.find((x) => x.value === s)?.label ?? s;

const TABS: { key: TabKey; label: string; icon: typeof BookOpenCheck; table: string }[] = [
  { key: 'cours_mosquee', label: 'Cours Mosquée', icon: BookOpenCheck, table: 'activites_cours_mosquee' },
  { key: 'ecole_arabe', label: 'École Arabe', icon: NotebookPen, table: 'activites_ecole_arabe' },
  { key: 'sorties', label: 'Sorties', icon: Users, table: 'activites_sorties' },
];

type Common = {
  id: string;
  titre: string;
  description: string | null;
  places_max: number;
  places_prises: number;
  statut: Statut;
  actif: boolean;
  position: number;
  tarif: number | null;
};

type CoursMosqueeRow = Common & { type: string; niveau: string; horaire: string; date_debut_cours: string | null };
type EcoleArabeRow = Common & { categorie: string; horaire: string; date_debut_cours: string | null };
type SortieRow = Common & { date_sortie: string | null; lieu: string };
type AnyRow = CoursMosqueeRow | EcoleArabeRow | SortieRow;

type FormState = {
  titre: string;
  description: string;
  places_max: number;
  places_prises: number;
  statut: Statut;
  actif: boolean;
  // cours mosquée
  type: string;
  niveau: string;
  horaire: string;
  date_debut_cours: string;
  // école arabe
  categorie: string;
  // sorties
  date_sortie: string;
  lieu: string;
  tarif: string;
};

const emptyForm: FormState = {
  titre: '', description: '', places_max: 15, places_prises: 0, statut: 'ouvert', actif: true,
  type: '', niveau: '', horaire: '', date_debut_cours: '',
  categorie: '',
  date_sortie: '', lieu: '', tarif: '',
};

function Toggle({ value, onChange, disabled }: { value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!value)}
      disabled={disabled}
      className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${
        value ? 'bg-primary' : 'bg-transparent border border-on-surface/30'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full shadow transition-transform ${
        value ? 'bg-white translate-x-4' : 'bg-on-surface/30'
      }`} />
    </button>
  );
}

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ActivitesAdminPage() {
  const supabase = createClient();
  const [tab, setTab] = useState<TabKey>('cours_mosquee');
  const [rows, setRows] = useState<AnyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [initialForm, setInitialForm] = useState<FormState>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [statutMenu, setStatutMenu] = useState<{ id: string; top: number; left: number; width: number } | null>(null);

  useEffect(() => {
    if (!statutMenu) return;
    const close = () => setStatutMenu(null);
    document.addEventListener('click', close);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('click', close);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [statutMenu]);

  const toggleStatutMenu = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    if (statutMenu?.id === id) { setStatutMenu(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    const menuHeight = 80; // ~3 options compacts
    const spaceBelow = window.innerHeight - rect.bottom;
    const upward = spaceBelow < menuHeight + 4 && rect.top > menuHeight + 4;
    const top = upward ? rect.top - menuHeight + 24 : rect.bottom - 24;
    setStatutMenu({ id, top, left: rect.left, width: rect.width });
  };

  const currentTab = TABS.find((t) => t.key === tab)!;

  const fetchRows = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from(currentTab.table)
      .select('*')
      .order('actif', { ascending: false })
      .order('position', { ascending: true });
    setRows((data ?? []) as AnyRow[]);
    setLoading(false);
  }, [supabase, currentTab.table]);

  useEffect(() => { fetchRows(); }, [fetchRows]);

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setInitialForm(emptyForm); setError(''); setModalOpen(true); };

  const openEdit = (r: AnyRow) => {
    setEditingId(r.id);
    const base = {
      titre: r.titre,
      description: r.description ?? '',
      places_max: r.places_max,
      places_prises: r.places_prises,
      statut: r.statut,
      actif: r.actif,
    };
    let next: FormState;
    if (tab === 'cours_mosquee') {
      const c = r as CoursMosqueeRow;
      next = { ...emptyForm, ...base, type: c.type, niveau: c.niveau, horaire: c.horaire, date_debut_cours: c.date_debut_cours ?? '', tarif: c.tarif != null ? String(c.tarif) : '' };
    } else if (tab === 'ecole_arabe') {
      const e = r as EcoleArabeRow;
      next = { ...emptyForm, ...base, categorie: e.categorie, horaire: e.horaire, date_debut_cours: e.date_debut_cours ?? '', tarif: e.tarif != null ? String(e.tarif) : '' };
    } else {
      const s = r as SortieRow;
      next = { ...emptyForm, ...base, date_sortie: s.date_sortie ?? '', lieu: s.lieu, tarif: s.tarif != null ? String(s.tarif) : '' };
    }
    setForm(next);
    setInitialForm(next);
    setError('');
    setModalOpen(true);
  };

  const buildPayload = () => {
    const common = {
      titre: form.titre.trim(),
      description: form.description.trim() || null,
      places_max: form.places_max,
      places_prises: form.places_prises,
      statut: form.statut,
      actif: form.actif,
    };
    const tarif = form.tarif ? parseFloat(form.tarif) : null;
    if (tab === 'cours_mosquee') {
      return { ...common, type: form.type.trim(), niveau: form.niveau.trim(), horaire: form.horaire.trim(), date_debut_cours: form.date_debut_cours || null, tarif };
    }
    if (tab === 'ecole_arabe') {
      return { ...common, categorie: form.categorie.trim(), horaire: form.horaire.trim(), date_debut_cours: form.date_debut_cours || null, tarif };
    }
    return { ...common, date_sortie: form.date_sortie || null, lieu: form.lieu.trim(), tarif };
  };

  const validate = (): string => {
    if (!form.titre.trim()) return 'Le titre est obligatoire.';
    if (form.places_max < 0 || form.places_prises < 0) return 'Les places doivent être positives.';
    if (form.places_prises > form.places_max) return 'Places prises > places max.';
    if (tab === 'cours_mosquee') {
      if (!form.type.trim() || !form.niveau.trim() || !form.horaire.trim()) return 'Type, niveau et horaire sont obligatoires.';
    } else if (tab === 'ecole_arabe') {
      if (!form.categorie.trim() || !form.horaire.trim()) return 'Catégorie et horaire sont obligatoires.';
    } else {
      if (!form.lieu.trim()) return 'Le lieu est obligatoire.';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setIsSubmitting(true);
    const payload = buildPayload();
    if (editingId) {
      await supabase.from(currentTab.table).update(payload).eq('id', editingId);
    } else {
      const nextPos = rows.length;
      await supabase.from(currentTab.table).insert({ ...payload, position: nextPos });
    }
    setModalOpen(false);
    fetchRows();
    setIsSubmitting(false);
  };

  const handleToggleActif = async (r: AnyRow) => {
    await supabase.from(currentTab.table).update({ actif: !r.actif }).eq('id', r.id);
    fetchRows();
  };

  const handleChangeStatut = async (r: AnyRow, statut: Statut) => {
    await supabase.from(currentTab.table).update({ statut }).eq('id', r.id);
    fetchRows();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from(currentTab.table).delete().eq('id', deleteId);
    setDeleteId(null);
    fetchRows();
  };

  const handleMove = async (r: AnyRow, direction: 'up' | 'down') => {
    const group = rows.filter((x) => x.actif);
    const idx = group.findIndex((x) => x.id === r.id);
    const neighborIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (neighborIdx < 0 || neighborIdx >= group.length) return;
    const reordered = [...group];
    [reordered[idx], reordered[neighborIdx]] = [reordered[neighborIdx], reordered[idx]];
    await Promise.all(
      reordered.map((item, i) => supabase.from(currentTab.table).update({ position: i }).eq('id', item.id))
    );
    fetchRows();
  };

  const isFormValid = (() => {
    if (!form.titre.trim()) return false;
    if (form.places_max < 0 || form.places_prises < 0) return false;
    if (form.places_prises > form.places_max) return false;
    if (tab === 'cours_mosquee') return !!form.type.trim() && !!form.niveau.trim() && !!form.horaire.trim();
    if (tab === 'ecole_arabe') return !!form.categorie.trim() && !!form.horaire.trim();
    return !!form.lieu.trim();
  })();

  const isDirty = JSON.stringify(form) !== JSON.stringify(initialForm);
  const canSubmit = isFormValid && (!editingId || isDirty);

  const renderSecondary = (r: AnyRow) => {
    const tarifSuffix = r.tarif != null ? ` · ${r.tarif} €` : '';
    if (tab === 'cours_mosquee') {
      const c = r as CoursMosqueeRow;
      return `${c.type} · ${c.niveau} · ${c.horaire}${tarifSuffix}`;
    }
    if (tab === 'ecole_arabe') {
      const e = r as EcoleArabeRow;
      return `${e.categorie} · ${e.horaire}${tarifSuffix}`;
    }
    const s = r as SortieRow;
    return `${formatDate(s.date_sortie)} · ${s.lieu}${tarifSuffix}`;
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold font-serif text-primary uppercase tracking-wider">Activités</h1>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 card-green text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md hover:opacity-90 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Nouvelle entrée
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                active
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'bg-surface-container-lowest text-on-surface/60 hover:text-primary border border-[var(--color-card-border)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Liste */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-center text-on-surface/40 text-sm py-12">Chargement...</p>
        ) : rows.length === 0 ? (
          <p className="text-center text-on-surface/40 text-sm py-12">Aucune entrée.</p>
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {rows.map((r) => {
              const group = rows.filter((x) => x.actif);
              const idx = group.findIndex((x) => x.id === r.id);
              const canUp = r.actif && idx > 0;
              const canDown = r.actif && idx !== -1 && idx < group.length - 1;
              return (
                <div key={r.id} className="flex items-center gap-4 px-5 py-4 hover:bg-surface-container/50 transition-colors">
                  {/* Reorder */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    {r.actif ? (
                      <>
                        <button
                          onClick={() => canUp && handleMove(r, 'up')}
                          disabled={!canUp}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${canUp ? 'text-on-surface/40 hover:bg-primary/10 hover:text-primary' : 'text-on-surface/15 cursor-not-allowed'}`}
                          aria-label="Monter"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => canDown && handleMove(r, 'down')}
                          disabled={!canDown}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${canDown ? 'text-on-surface/40 hover:bg-primary/10 hover:text-primary' : 'text-on-surface/15 cursor-not-allowed'}`}
                          aria-label="Descendre"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </>
                    ) : <div className="w-7 h-14" />}
                  </div>
                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <button
                        type="button"
                        onClick={(e) => toggleStatutMenu(e, r.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase inline-flex items-center gap-1 cursor-pointer ${statutClass(r.statut)}`}
                        aria-label="Changer le statut"
                      >
                        {statutLabel(r.statut)}
                        <ChevronDown className="w-3 h-3 opacity-60" />
                      </button>
                      {(() => {
                        const d = tab === 'sorties' ? (r as SortieRow).date_sortie : (r as CoursMosqueeRow | EcoleArabeRow).date_debut_cours;
                        return d ? <span className="text-[10px] font-bold text-on-surface/50 uppercase tracking-wider">{formatDate(d)}</span> : null;
                      })()}
                      {!r.actif && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-on-surface/40 bg-on-surface/5">Inactif</span>}
                      <span className="text-[10px] font-bold text-on-surface/40 uppercase tracking-wider">{r.places_prises}/{r.places_max} places</span>
                    </div>
                    <p className="text-sm font-semibold text-on-surface truncate">{r.titre}</p>
                    <p className="text-xs text-on-surface/50 mt-0.5 truncate">{renderSecondary(r)}</p>
                  </div>
                  {/* Actif toggle */}
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    {r.actif ? <Eye className="w-3 h-3 text-on-surface/30" /> : <EyeOff className="w-3 h-3 text-on-surface/30" />}
                    <Toggle value={r.actif} onChange={() => handleToggleActif(r)} />
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => openEdit(r)} className="w-8 h-8 rounded-xl flex items-center justify-center text-on-surface/40 hover:bg-primary/10 hover:text-primary transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteId(r.id)} className="w-8 h-8 rounded-xl flex items-center justify-center text-on-surface/40 hover:bg-error/10 hover:text-error transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Menu statut (position fixed pour ne pas etre clip par overflow) */}
      {statutMenu && (() => {
        const r = rows.find((x) => x.id === statutMenu.id);
        if (!r) return null;
        return (
          <div
            className="fixed z-30 bg-surface-container-lowest rounded-lg shadow-lg border border-[var(--color-card-border)] p-0.5 space-y-0.5"
            style={{ top: statutMenu.top, left: statutMenu.left, width: statutMenu.width }}
            onClick={(e) => e.stopPropagation()}
          >
            {STATUT_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => { handleChangeStatut(r, o.value); setStatutMenu(null); }}
                className={`block w-full text-[10px] font-bold px-2 py-0.5 rounded-full uppercase text-center ${statutClass(o.value)}`}
              >
                {o.label}
              </button>
            ))}
          </div>
        );
      })()}

      {/* Modal CRUD */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up border border-primary">
            <div className="card-green rounded-t-2xl p-5 flex items-center justify-between sticky top-0 z-10">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                {editingId ? 'Modifier' : 'Nouvelle entrée'} — {currentTab.label}
              </h2>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors" aria-label="Fermer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">

              <FloatInput id="act-titre" label="Titre" value={form.titre} onChange={(v) => setForm({ ...form, titre: v })} required />
              <FloatTextarea id="act-desc" label="Description (optionnel)" rows={3} value={form.description} onChange={(v) => setForm({ ...form, description: v })} />

              {/* Champs spécifiques */}
              {tab === 'cours_mosquee' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <FloatInput id="act-type" label="Type (ex: Tajwid, Coran)" value={form.type} onChange={(v) => setForm({ ...form, type: v })} required />
                    <FloatInput id="act-niveau" label="Niveau" value={form.niveau} onChange={(v) => setForm({ ...form, niveau: v })} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FloatInput id="act-horaire" label="Horaire (ex: Samedi 10h-12h)" value={form.horaire} onChange={(v) => setForm({ ...form, horaire: v })} required />
                    <FloatInput id="act-debut" label="Date de début du cours (optionnel)" type="date" value={form.date_debut_cours} onChange={(v) => setForm({ ...form, date_debut_cours: v })} />
                  </div>
                </>
              )}

              {tab === 'ecole_arabe' && (
                <>
                  <FloatInput id="act-categorie" label="Catégorie (ex: Enfants 6-10 ans)" value={form.categorie} onChange={(v) => setForm({ ...form, categorie: v })} required />
                  <div className="grid grid-cols-2 gap-4">
                    <FloatInput id="act-horaire" label="Horaire (ex: Mercredi 14h-16h)" value={form.horaire} onChange={(v) => setForm({ ...form, horaire: v })} required />
                    <FloatInput id="act-debut" label="Date de début du cours (optionnel)" type="date" value={form.date_debut_cours} onChange={(v) => setForm({ ...form, date_debut_cours: v })} />
                  </div>
                </>
              )}

              {tab === 'sorties' && (
                <div className="grid grid-cols-2 gap-4">
                  <FloatInput id="act-sortie" label="Date de sortie" type="date" value={form.date_sortie} onChange={(v) => setForm({ ...form, date_sortie: v })} />
                  <FloatInput id="act-lieu" label="Lieu" value={form.lieu} onChange={(v) => setForm({ ...form, lieu: v })} required />
                </div>
              )}

              {/* Tarif (commun aux 3 onglets) */}
              <FloatInput id="act-tarif" label="Tarif en € (optionnel)" type="number" value={form.tarif} onChange={(v) => setForm({ ...form, tarif: v })} />

              {/* Places */}
              <div className="grid grid-cols-2 gap-4">
                <FloatInput id="act-pmax" label="Places max" type="number" value={String(form.places_max)} onChange={(v) => setForm({ ...form, places_max: parseInt(v || '0', 10) })} required />
                <FloatInput id="act-pprises" label="Places prises" type="number" value={String(form.places_prises)} onChange={(v) => setForm({ ...form, places_prises: parseInt(v || '0', 10) })} />
              </div>

              {/* Statut */}
              <FloatSelect
                id="act-statut"
                label="Statut"
                value={form.statut}
                onChange={(v) => setForm({ ...form, statut: v as Statut })}
                required
                options={STATUT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
              />

              {/* Actif */}
              <div className="flex items-center gap-3 pt-2">
                <Toggle value={form.actif} onChange={(v) => setForm({ ...form, actif: v })} />
                <span className="text-sm text-on-surface/70 font-medium">Actif</span>
              </div>

              {error && (
                <div className="bg-error-container/20 border border-error/20 rounded-xl p-3">
                  <p className="text-error text-sm">{error}</p>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-full text-sm font-bold text-on-surface/60 hover:bg-surface-container transition-colors">
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className={`px-8 py-2.5 rounded-full font-bold text-sm shadow-md transition-all active:scale-95 ${canSubmit && !isSubmitting ? 'card-green text-white hover:opacity-90' : 'bg-on-surface/10 text-on-surface/30 cursor-not-allowed'}`}
                >
                  {isSubmitting ? 'Enregistrement...' : editingId ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation suppression */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm animate-slide-up border border-[var(--color-card-border)] p-6 text-center">
            <Trash2 className="w-10 h-10 text-error mx-auto mb-3" />
            <h3 className="text-lg font-serif text-on-surface mb-2">Supprimer cette entrée ?</h3>
            <p className="text-sm text-on-surface/60 mb-6">Cette action est irréversible.</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setDeleteId(null)} className="px-5 py-2.5 rounded-full text-sm font-bold text-on-surface/60 hover:bg-surface-container transition-colors">Annuler</button>
              <button onClick={handleDelete} className="px-6 py-2.5 rounded-full text-sm font-bold bg-error text-white hover:opacity-90 transition-all active:scale-95">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
