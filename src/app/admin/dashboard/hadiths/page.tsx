'use client';

import { useState, useEffect, useCallback } from 'react';
import { ScrollText, Plus, Pencil, Trash2, X } from 'lucide-react';
import { FloatInput, FloatTextarea } from '@/components/FloatField';
import { createClient } from '@/lib/supabase/client';
import type { Hadith } from '@/types/hadith';

type FormState = {
  texte: string;
  narrateur: string;
  source: string;
  actif: boolean;
};

const emptyForm: FormState = { texte: '', narrateur: '', source: '', actif: true };

type Filter = 'Tous' | 'Actifs' | 'Inactifs';
const FILTERS: Filter[] = ['Tous', 'Actifs', 'Inactifs'];

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

export default function HadithsAdminPage() {
  const supabase = createClient();
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('Tous');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchHadiths = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('hadiths')
      .select('id, texte, narrateur, source, actif, created_at, updated_at')
      .order('actif', { ascending: false })
      .order('created_at', { ascending: false });
    setHadiths((data ?? []) as Hadith[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchHadiths(); }, [fetchHadiths]);

  const q = search.toLowerCase().trim();
  const filtered = hadiths
    .filter((h) => {
      if (filter === 'Actifs') return h.actif;
      if (filter === 'Inactifs') return !h.actif;
      return true;
    })
    .filter((h) => !q || `${h.texte} ${h.narrateur ?? ''} ${h.source ?? ''}`.toLowerCase().includes(q));

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setError(''); setModalOpen(true); };
  const openEdit = (h: Hadith) => {
    setEditingId(h.id);
    setForm({
      texte: h.texte,
      narrateur: h.narrateur ?? '',
      source: h.source ?? '',
      actif: h.actif,
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.texte.trim()) {
      setError('Le texte du hadith est obligatoire.');
      return;
    }
    setIsSubmitting(true);
    const payload = {
      texte: form.texte.trim(),
      narrateur: form.narrateur.trim() || null,
      source: form.source.trim() || null,
      actif: form.actif,
      updated_at: new Date().toISOString(),
    };
    if (editingId) {
      await supabase.from('hadiths').update(payload).eq('id', editingId);
    } else {
      await supabase.from('hadiths').insert(payload);
    }
    setModalOpen(false);
    fetchHadiths();
    setIsSubmitting(false);
  };

  const handleToggleActif = async (h: Hadith) => {
    await supabase.from('hadiths').update({ actif: !h.actif, updated_at: new Date().toISOString() }).eq('id', h.id);
    fetchHadiths();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from('hadiths').delete().eq('id', deleteId);
    setDeleteId(null);
    fetchHadiths();
  };

  const isFormValid = form.texte.trim() !== '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ScrollText className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold font-serif text-primary uppercase tracking-wider">Hadiths</h1>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 card-green text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md hover:opacity-90 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Nouveau hadith
        </button>
      </div>

      {/* Filtres + recherche */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                filter === f
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'bg-surface-container-lowest text-on-surface/60 hover:text-primary border border-[var(--color-card-border)]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="w-full max-w-md">
          <FloatInput id="search-hadiths" label="Rechercher…" value={search} onChange={setSearch} compact />
        </div>
      </div>

      {/* Liste */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-center text-on-surface/40 text-sm py-12">Chargement...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-on-surface/40 text-sm py-12">Aucun hadith.</p>
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {filtered.map((h) => (
              <div key={h.id} className="flex items-center gap-4 px-5 py-2 hover:bg-surface-container/50 transition-colors">
                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {!h.actif && (
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full text-on-surface/40 bg-on-surface/5">Inactif</span>
                    )}
                    <p className="text-sm text-on-surface truncate flex-1">
                      &laquo; {h.texte} &raquo;
                    </p>
                  </div>
                  <p className="text-xs text-on-surface/60 truncate">
                    {h.narrateur && <span className="font-medium">{h.narrateur}</span>}
                    {h.narrateur && h.source && <span> - </span>}
                    {h.source && <span>{h.source}</span>}
                  </p>
                </div>

                {/* Toggle actif */}
                <Toggle value={h.actif} onChange={() => handleToggleActif(h)} />

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(h)} className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors text-on-surface/40 hover:bg-primary/10 hover:text-primary">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteId(h.id)} className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors text-on-surface/40 hover:bg-error/10 hover:text-error">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modale CRUD */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up border border-primary">
            <div className="card-green rounded-t-2xl p-5 flex items-center justify-between sticky top-0 z-10">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">{editingId ? 'Modifier le hadith' : 'Nouveau hadith'}</h2>
              <button onClick={() => !isSubmitting && setModalOpen(false)} disabled={isSubmitting} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors disabled:opacity-50" aria-label="Fermer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <FloatTextarea
                id="hadith-texte"
                label="Texte du hadith"
                value={form.texte}
                onChange={(v) => setForm({ ...form, texte: v })}
                transform="sentence"
                required
                rows={4}
              />
              <FloatInput
                id="hadith-narrateur"
                label="Narrateur (ex: Omar ibn Al-Khattab (رضي الله عنه))"
                value={form.narrateur}
                onChange={(v) => setForm({ ...form, narrateur: v })}
              />
              <FloatInput
                id="hadith-source"
                label="Source (ex: Al-Bukhari n°1 & Muslim n°1907)"
                value={form.source}
                onChange={(v) => setForm({ ...form, source: v })}
              />

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <Toggle value={form.actif} onChange={(v) => setForm({ ...form, actif: v })} />
                  <span className="text-sm text-on-surface/70 font-medium">Actif</span>
                </label>
              </div>

              {error && (
                <div className="bg-error-container/20 border border-error/20 rounded-xl p-3">
                  <p className="text-error text-xs text-center">{error}</p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 text-xs font-medium text-on-surface/60 hover:text-on-surface transition-colors disabled:opacity-50">Annuler</button>
                <button type="submit" disabled={!isFormValid || isSubmitting} className={`px-5 py-2 rounded-full text-xs font-bold shadow-sm transition-all active:scale-95 ${
                  isFormValid && !isSubmitting ? 'bg-primary text-on-primary hover:opacity-90' : 'bg-on-surface/10 text-on-surface/30 cursor-not-allowed'
                }`}>{isSubmitting ? 'Enregistrement...' : 'Enregistrer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale suppression */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md overflow-y-auto animate-slide-up border border-primary">
            <div className="bg-primary rounded-t-2xl p-5 flex items-center justify-between">
              <h2 className="text-sm font-bold text-on-primary uppercase tracking-wider">Supprimer le hadith</h2>
              <button onClick={() => setDeleteId(null)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-on-primary transition-colors" aria-label="Fermer"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-on-surface/80 leading-relaxed">Confirmer la suppression de ce hadith ? Cette action est irréversible.</p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-xs font-medium text-on-surface/60 hover:text-on-surface transition-colors">Annuler</button>
                <button onClick={handleDelete} className="px-5 py-2 rounded-full text-xs font-bold bg-error text-on-error hover:opacity-90 transition-all active:scale-95">Supprimer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
