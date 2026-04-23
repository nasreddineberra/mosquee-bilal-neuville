'use client';

import { useState, useEffect, useCallback } from 'react';
import { HeartHandshake, Plus, Pencil, Trash2, Star, Eye, EyeOff, X, ChevronUp, ChevronDown, Image as ImageIcon } from 'lucide-react';
import { FloatInput, FloatTextarea } from '@/components/FloatField';
import { createClient } from '@/lib/supabase/client';
import ImagePicker, { LibraryImage } from '@/components/ImagePicker';

type AdminDon = {
  id: string;
  titre: string;
  resume: string | null;
  description: string | null;
  lien_externe: string | null;
  date_parution: string | null;
  actif: boolean;
  a_la_une: boolean;
  position: number | null;
  image_id: string | null;
  image_url: string | null;
};

type FormState = Omit<AdminDon, 'id' | 'position'>;

const today = () => new Date().toISOString().split('T')[0];

const emptyForm: FormState = {
  titre: '',
  resume: '',
  description: '',
  lien_externe: '',
  date_parution: today(),
  actif: true,
  a_la_une: false,
  image_id: null,
  image_url: null,
};

type Filter = 'Tous' | 'Actifs' | 'Inactifs' | 'À la une';
const FILTERS: Filter[] = ['Tous', 'Actifs', 'Inactifs', 'À la une'];

function formatDate(d: string | null) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function Toggle({ value, onChange, disabled, light }: { value: boolean; onChange: (v: boolean) => void; disabled?: boolean; light?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!value)}
      disabled={disabled}
      className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${
        value
          ? light ? 'bg-white/90' : 'bg-primary'
          : light ? 'bg-transparent border border-white/50' : 'bg-transparent border border-on-surface/30'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full shadow transition-transform ${
        value
          ? light ? 'bg-primary translate-x-4' : 'bg-white translate-x-4'
          : light ? 'bg-white/50' : 'bg-on-surface/30'
      }`} />
    </button>
  );
}

export default function DonsAdminPage() {
  const supabase = createClient();
  const [dons, setDons] = useState<AdminDon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('Tous');
  const [error, setError] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);

  const fetchDons = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('dons')
      .select('id, titre, resume, description, lien_externe, date_parution, actif, a_la_une, position, image_id, images(url)')
      .order('a_la_une', { ascending: false })
      .order('actif', { ascending: false })
      .order('position', { ascending: true, nullsFirst: false })
      .order('date_parution', { ascending: false });
    type Row = Omit<AdminDon, 'image_url'> & { images: { url: string } | { url: string }[] | null };
    const mapped: AdminDon[] = (data ?? []).map((r: Row) => {
      const img = Array.isArray(r.images) ? r.images[0] : r.images;
      return { ...r, image_url: img?.url ?? null };
    });
    setDons(mapped);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchDons(); }, [fetchDons]);

  const filtered = dons.filter((d) => {
    if (filter === 'Actifs') return d.actif;
    if (filter === 'Inactifs') return !d.actif;
    if (filter === 'À la une') return d.a_la_une;
    return true;
  });

  const openCreate = () => { setEditingId(null); setForm({ ...emptyForm, date_parution: today() }); setError(''); setModalOpen(true); };
  const openEdit = (d: AdminDon) => {
    setEditingId(d.id);
    setForm({
      titre: d.titre,
      resume: d.resume ?? '',
      description: d.description ?? '',
      lien_externe: d.lien_externe ?? '',
      date_parution: d.date_parution ?? today(),
      actif: d.actif,
      a_la_une: d.a_la_une,
      image_id: d.image_id,
      image_url: d.image_url,
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.titre.trim() || !(form.resume ?? '').trim() || !(form.description ?? '').trim()) {
      setError('Titre, résumé et description sont obligatoires.');
      return;
    }
    if (form.titre.length > 70) {
      setError('Le titre doit faire 70 caractères maximum.');
      return;
    }
    if ((form.resume ?? '').length > 70) {
      setError('Le résumé doit faire 70 caractères maximum.');
      return;
    }
    setIsSubmitting(true);

    if (form.a_la_une) {
      await supabase.from('dons').update({ a_la_une: false }).eq('a_la_une', true);
    }

    const payload = {
      titre: form.titre.trim(),
      resume: (form.resume ?? '').trim(),
      description: (form.description ?? '').trim(),
      lien_externe: (form.lien_externe ?? '').trim() || null,
      date_parution: form.date_parution || today(),
      actif: form.actif,
      a_la_une: form.a_la_une,
      image_id: form.image_id,
    };
    if (editingId) {
      await supabase.from('dons').update(payload).eq('id', editingId);
    } else {
      await supabase.from('dons').insert(payload);
    }
    setModalOpen(false);
    fetchDons();
    setIsSubmitting(false);
  };

  const handleToggleActif = async (d: AdminDon) => {
    await supabase.from('dons').update({ actif: !d.actif }).eq('id', d.id);
    fetchDons();
  };

  const handleToggleUne = async (d: AdminDon) => {
    const otherFeatured = dons.some((x) => x.a_la_une && x.id !== d.id);
    if (!d.a_la_une && otherFeatured) return;
    await supabase.from('dons').update({ a_la_une: !d.a_la_une }).eq('id', d.id);
    fetchDons();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from('dons').delete().eq('id', deleteId);
    setDeleteId(null);
    fetchDons();
  };

  const handleMove = async (d: AdminDon, direction: 'up' | 'down') => {
    const group = dons.filter((x) => x.actif && !x.a_la_une);
    const idx = group.findIndex((x) => x.id === d.id);
    const neighborIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (neighborIdx < 0 || neighborIdx >= group.length) return;
    const reordered = [...group];
    [reordered[idx], reordered[neighborIdx]] = [reordered[neighborIdx], reordered[idx]];
    await Promise.all(
      reordered.map((item, i) => supabase.from('dons').update({ position: i }).eq('id', item.id))
    );
    fetchDons();
  };

  const uneCount = dons.filter((d) => d.a_la_une && d.id !== editingId).length;
  const isFormValid = form.titre.trim() !== '' && form.titre.length <= 70 && (form.resume ?? '').trim() !== '' && (form.resume ?? '').length <= 70 && (form.description ?? '').trim() !== '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold font-serif text-primary uppercase tracking-wider">Dons</h1>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 card-green text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md hover:opacity-90 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Nouveau don
        </button>
      </div>

      {/* Filtres */}
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

      {/* Légende */}
      <div className="flex items-center gap-6 text-xs text-on-surface/40 font-medium px-1">
        <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-tertiary" /> À la une ({uneCount}/1)</span>
        <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Actif</span>
      </div>

      {/* Liste */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-center text-on-surface/40 text-sm py-12">Chargement...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-on-surface/40 text-sm py-12">Aucun don.</p>
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {filtered.map((d) => (
              <div key={d.id} className={`flex items-center gap-4 px-5 py-4 transition-colors ${d.a_la_une ? 'card-green' : 'hover:bg-surface-container/50'}`}>
                {/* Reorder (actifs non-a-la-une) */}
                <div className="flex flex-col items-center flex-shrink-0">
                  {(() => {
                    if (!d.actif || d.a_la_une) return <div className="w-7 h-14" />;
                    const group = dons.filter((x) => x.actif && !x.a_la_une);
                    const idx = group.findIndex((x) => x.id === d.id);
                    const canUp = idx > 0;
                    const canDown = idx < group.length - 1;
                    const iconCls = 'text-on-surface/40 hover:bg-primary/10 hover:text-primary';
                    const disabledCls = 'text-on-surface/15 cursor-not-allowed';
                    return (
                      <>
                        <button onClick={() => canUp && handleMove(d, 'up')} disabled={!canUp} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${canUp ? iconCls : disabledCls}`} aria-label="Monter"><ChevronUp className="w-4 h-4" /></button>
                        <button onClick={() => canDown && handleMove(d, 'down')} disabled={!canDown} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${canDown ? iconCls : disabledCls}`} aria-label="Descendre"><ChevronDown className="w-4 h-4" /></button>
                      </>
                    );
                  })()}
                </div>

                {/* Image */}
                {d.image_url ? (
                  <div
                    className="w-12 h-12 rounded-xl flex-shrink-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${d.image_url})` }}
                  />
                ) : (
                  <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center ${d.a_la_une ? 'bg-white/10' : 'bg-surface-container'}`}>
                    <ImageIcon className={`w-4 h-4 ${d.a_la_une ? 'text-white/40' : 'text-on-surface/30'}`} />
                  </div>
                )}

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {d.a_la_une && <span className="text-[10px] font-bold text-white bg-white/20 px-2 py-0.5 rounded-full">À la une</span>}
                    {!d.actif && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${d.a_la_une ? 'text-white/60 bg-white/10' : 'text-on-surface/40 bg-on-surface/5'}`}>Inactif</span>}
                  </div>
                  <p className={`text-sm font-semibold truncate ${d.a_la_une ? 'text-white' : 'text-on-surface'}`}>{d.titre}</p>
                  <p className={`text-xs mt-0.5 ${d.a_la_une ? 'text-white/60' : 'text-on-surface/40'}`}>
                    Parution : {formatDate(d.date_parution)}
                  </p>
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="flex flex-col items-center gap-1">
                    <Star className={`w-3 h-3 ${d.a_la_une ? 'text-white/60' : 'text-on-surface/30'}`} />
                    <Toggle value={d.a_la_une} onChange={() => handleToggleUne(d)} disabled={!d.a_la_une && dons.some((x) => x.a_la_une && x.id !== d.id)} light={d.a_la_une} />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    {d.actif ? <Eye className={`w-3 h-3 ${d.a_la_une ? 'text-white/60' : 'text-on-surface/30'}`} /> : <EyeOff className={`w-3 h-3 ${d.a_la_une ? 'text-white/60' : 'text-on-surface/30'}`} />}
                    <Toggle value={d.actif} onChange={() => handleToggleActif(d)} light={d.a_la_une} />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(d)} className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${d.a_la_une ? 'text-white/60 hover:bg-white/20 hover:text-white' : 'text-on-surface/40 hover:bg-primary/10 hover:text-primary'}`}>
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteId(d.id)} className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${d.a_la_une ? 'text-white/60 hover:bg-white/20 hover:text-white' : 'text-on-surface/40 hover:bg-error/10 hover:text-error'}`}>
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
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">{editingId ? 'Modifier le don' : 'Nouveau don'}</h2>
              <button onClick={() => !isSubmitting && setModalOpen(false)} disabled={isSubmitting} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors disabled:opacity-50" aria-label="Fermer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <FloatInput id="don-titre" label="Titre (max 70 car.)" value={form.titre} onChange={(v) => setForm({ ...form, titre: v })} transform="upperall" maxLength={70} required />
                <p className="text-[10px] text-on-surface/40 mt-1 text-right">{form.titre.length}/70</p>
              </div>

              <div>
                <FloatInput
                  id="don-resume"
                  label="Résumé (max 70 car.)"
                  value={form.resume ?? ''}
                  onChange={(v) => setForm({ ...form, resume: v })}
                  transform="sentence"
                  maxLength={70}
                  required
                />
                <p className="text-[10px] text-on-surface/40 mt-1 text-right">{(form.resume ?? '').length}/70</p>
              </div>

              <FloatTextarea
                id="don-description"
                label="Description"
                value={form.description ?? ''}
                onChange={(v) => setForm({ ...form, description: v })}
                transform="sentence"
                required
                rows={4}
              />

              <FloatInput
                id="don-lien"
                label="Lien externe (plateforme sécurisée)"
                type="url"
                value={form.lien_externe ?? ''}
                onChange={(v) => setForm({ ...form, lien_externe: v })}
              />

              <FloatInput
                id="don-date"
                label="Date de parution"
                type="date"
                value={form.date_parution ?? today()}
                onChange={(v) => setForm({ ...form, date_parution: v })}
                required
              />

              {/* Image associée */}
              <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                {form.image_url ? (
                  <div
                    className="w-16 h-16 rounded-xl bg-cover bg-center flex-shrink-0 border border-[var(--color-card-border)]"
                    style={{ backgroundImage: `url(${form.image_url})` }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-surface-container flex items-center justify-center flex-shrink-0 border border-[var(--color-card-border)]">
                    <ImageIcon className="w-5 h-5 text-on-surface/30" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-on-surface/60 uppercase tracking-wider mb-0.5">Image associée</p>
                  <p className="text-xs text-on-surface/50 truncate">
                    {form.image_id ? 'Image personnalisée' : 'Aucune image'}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-primary text-primary hover:bg-primary/5 transition-colors"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    Choisir
                  </button>
                  {form.image_id && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image_id: null, image_url: null })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-on-surface/60 hover:bg-surface-container transition-colors"
                    >
                      Retirer
                    </button>
                  )}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <Toggle value={form.actif} onChange={(v) => setForm({ ...form, actif: v })} />
                  <span className="text-sm text-on-surface/70 font-medium">Actif</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <Toggle value={form.a_la_une} onChange={(v) => setForm({ ...form, a_la_une: v })} disabled={!form.a_la_une && uneCount >= 1} />
                  <span className="text-sm text-on-surface/70 font-medium">
                    À la une {!form.a_la_une && uneCount >= 1 && <span className="text-on-surface/40 text-xs">(un don déjà à la une)</span>}
                  </span>
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

      {/* Sélecteur d'images */}
      <ImagePicker
        open={pickerOpen}
        selectedId={form.image_id}
        onSelect={(img: LibraryImage) => {
          setForm({ ...form, image_id: img.id, image_url: img.url });
          setPickerOpen(false);
        }}
        onClose={() => setPickerOpen(false)}
      />

      {/* Modale suppression */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md overflow-y-auto animate-slide-up border border-primary">
            <div className="bg-primary rounded-t-2xl p-5 flex items-center justify-between">
              <h2 className="text-sm font-bold text-on-primary uppercase tracking-wider">Supprimer le don</h2>
              <button onClick={() => setDeleteId(null)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-on-primary transition-colors" aria-label="Fermer"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-on-surface/80 leading-relaxed">Confirmer la suppression de ce don ? Cette action est irréversible.</p>
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
