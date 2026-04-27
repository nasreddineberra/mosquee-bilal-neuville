'use client';

// ─── Gestion des articles (dashboard admin) ─────────────────────────────────
// CRUD complet pour les actualités publiées sur le site.
// Gère le statut, la mise en avant (à la une), l'image, la position.

import { useState, useEffect, useCallback } from 'react';
import { FileText, Plus, Pencil, Trash2, Star, Eye, EyeOff, X, ScanEye, Image as ImageIcon, ChevronUp, ChevronDown } from 'lucide-react';
import { FloatInput, FloatTextarea, FloatSelect } from '@/components/FloatField';
import { createClient } from '@/lib/supabase/client';
import ArticleModal, { Article } from '@/components/ArticleModal';
import ImagePicker, { LibraryImage } from '@/components/ImagePicker';
import { getArticleImage, fetchCategoryDefaults } from '@/lib/images';

const CATEGORIES = ['Vie de la mosquée', 'Événements', 'Cours', 'Communauté'];

type AdminArticle = {
  id: string;
  titre: string;
  summary: string;
  contenu: string;
  category: string;
  actif: boolean;
  a_la_une: boolean;
  date_parution: string;
  date_expiration: string | null;
  position: number;
  image_id: string | null;
  image_url: string | null;
};

type FormState = Omit<AdminArticle, 'id' | 'position'>;

const emptyForm: FormState = {
  titre: '', summary: '', contenu: '', category: '',
  actif: true, a_la_une: false,
  date_parution: new Date().toISOString().split('T')[0],
  date_expiration: '',
  image_id: null,
  image_url: null,
};

function formatDate(d: string | null) {
  if (!d) return '—';
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

export default function ArticlesAdminPage() {
  const supabase = createClient();
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [preview, setPreview] = useState<Article | null>(null);
  const [filterCat, setFilterCat] = useState('Tous');
  const [error, setError] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [categoryDefaults, setCategoryDefaults] = useState<Record<string, string>>({});

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('articles')
      .select('id,titre,summary,contenu,category,actif,a_la_une,date_parution,date_expiration,position,image_id,images(url)')
      .order('a_la_une', { ascending: false })
      .order('actif', { ascending: false })
      .order('position', { ascending: true })
      .order('date_parution', { ascending: false });
    type Row = Omit<AdminArticle, 'image_url'> & { images: { url: string } | { url: string }[] | null };
    const mapped: AdminArticle[] = (data ?? []).map((r: Row) => {
      const img = Array.isArray(r.images) ? r.images[0] : r.images;
      return { ...r, image_url: img?.url ?? null };
    });
    setArticles(mapped);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchArticles();
    fetchCategoryDefaults(supabase).then(setCategoryDefaults);
  }, [fetchArticles]);

  const uneCount = articles.filter((a) => a.a_la_une && a.id !== editingId).length;

  const filtered = filterCat === 'Tous' ? articles : articles.filter((a) => a.category === filterCat);

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setError(''); setModalOpen(true); };
  const openEdit = (a: AdminArticle) => {
    setEditingId(a.id);
    setForm({
      titre: a.titre, summary: a.summary, contenu: a.contenu, category: a.category,
      actif: a.actif, a_la_une: a.a_la_une,
      date_parution: a.date_parution, date_expiration: a.date_expiration ?? '',
      image_id: a.image_id, image_url: a.image_url,
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.titre.trim() || !form.category || !form.summary.trim() || !form.contenu.trim()) {
      setError('Titre, résumé, contenu et catégorie sont obligatoires.');
      return;
    }
    if (form.a_la_une && uneCount >= 2 && !editingId) {
      setError('Maximum 2 articles "à la une" simultanément.');
      return;
    }
    setIsSubmitting(true);
    const payload = {
      titre: form.titre.trim(),
      summary: form.summary.trim(),
      contenu: form.contenu.trim(),
      category: form.category,
      actif: form.actif,
      a_la_une: form.a_la_une,
      date_parution: form.date_parution,
      date_expiration: form.date_expiration || null,
      image_id: form.image_id,
    };
    if (editingId) {
      await supabase.from('articles').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editingId);
    } else {
      await supabase.from('articles').insert(payload);
    }
    setModalOpen(false);
    fetchArticles();
    setIsSubmitting(false);
  };

  const handleToggleActif = async (a: AdminArticle) => {
    await supabase.from('articles').update({ actif: !a.actif }).eq('id', a.id);
    fetchArticles();
  };

  const handleToggleUne = async (a: AdminArticle) => {
    if (!a.a_la_une && uneCount >= 2) return;
    await supabase.from('articles').update({ a_la_une: !a.a_la_une }).eq('id', a.id);
    fetchArticles();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from('articles').delete().eq('id', deleteId);
    setDeleteId(null);
    fetchArticles();
  };

  const handleMove = async (a: AdminArticle, direction: 'up' | 'down') => {
    const group = articles.filter((x) => x.actif && x.a_la_une === a.a_la_une);
    const idx = group.findIndex((x) => x.id === a.id);
    const neighborIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (neighborIdx < 0 || neighborIdx >= group.length) return;
    const reordered = [...group];
    [reordered[idx], reordered[neighborIdx]] = [reordered[neighborIdx], reordered[idx]];
    await Promise.all(
      reordered.map((item, i) => supabase.from('articles').update({ position: i }).eq('id', item.id))
    );
    fetchArticles();
  };

  const isFormValid = form.titre.trim() !== '' && form.category !== '' && form.summary.trim() !== '' && form.contenu.trim() !== '';

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold font-serif text-primary uppercase tracking-wider">Articles</h1>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 card-green text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md hover:opacity-90 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Nouvel article
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        {['Tous', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              filterCat === cat
                ? 'bg-primary text-on-primary shadow-md'
                : 'bg-surface-container-lowest text-on-surface/60 hover:text-primary border border-[var(--color-card-border)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Légende toggles */}
      <div className="flex items-center gap-6 text-xs text-on-surface/40 font-medium px-1">
        <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-tertiary" /> À la une ({uneCount}/2)</span>
        <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Actif</span>
      </div>

      {/* Liste */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-center text-on-surface/40 text-sm py-12">Chargement...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-on-surface/40 text-sm py-12">Aucun article.</p>
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {filtered.map((a) => (
              <div key={a.id} className={`flex items-center gap-4 px-5 py-4 transition-colors ${a.a_la_une ? 'card-green' : 'hover:bg-surface-container/50'}`}>
                {/* Reorder (actifs uniquement) */}
                <div className="flex flex-col items-center flex-shrink-0">
                  {(() => {
                    if (!a.actif) return <div className="w-7 h-14" />;
                    const group = articles.filter((x) => x.actif && x.a_la_une === a.a_la_une);
                    const idx = group.findIndex((x) => x.id === a.id);
                    const canUp = idx > 0;
                    const canDown = idx < group.length - 1;
                    const iconCls = a.a_la_une ? 'text-white/60 hover:bg-white/20 hover:text-white' : 'text-on-surface/40 hover:bg-primary/10 hover:text-primary';
                    const disabledCls = a.a_la_une ? 'text-white/20 cursor-not-allowed' : 'text-on-surface/15 cursor-not-allowed';
                    return (
                      <>
                        <button
                          onClick={() => canUp && handleMove(a, 'up')}
                          disabled={!canUp}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${canUp ? iconCls : disabledCls}`}
                          aria-label="Monter"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => canDown && handleMove(a, 'down')}
                          disabled={!canDown}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${canDown ? iconCls : disabledCls}`}
                          aria-label="Descendre"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </>
                    );
                  })()}
                </div>
                {/* Image (custom ou catégorie) */}
                <div
                  className="w-12 h-12 rounded-xl flex-shrink-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${getArticleImage({ image_url: a.image_url, category: a.category, categoryDefaults })})` }}
                />
                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${a.a_la_une ? 'text-white/80' : 'text-primary'}`}>{a.category}</span>
                    {a.a_la_une && <span className="text-[10px] font-bold text-white bg-white/20 px-2 py-0.5 rounded-full">À la une</span>}
                    {!a.actif && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.a_la_une ? 'text-white/60 bg-white/10' : 'text-on-surface/40 bg-on-surface/5'}`}>Inactif</span>}
                  </div>
                  <p className={`text-sm font-semibold truncate ${a.a_la_une ? 'text-white' : 'text-on-surface'}`}>{a.titre}</p>
                  <p className={`text-xs mt-0.5 ${a.a_la_une ? 'text-white/60' : 'text-on-surface/40'}`}>
                    Parution : {formatDate(a.date_parution)}
                    {a.date_expiration && <> · Expiration : {formatDate(a.date_expiration)}</>}
                  </p>
                </div>
                {/* Toggles */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="flex flex-col items-center gap-1">
                    <Star className={`w-3 h-3 ${a.a_la_une ? 'text-white/60' : 'text-on-surface/30'}`} />
                    <Toggle value={a.a_la_une} onChange={() => handleToggleUne(a)} disabled={!a.a_la_une && uneCount >= 2} light={a.a_la_une} />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    {a.actif ? <Eye className={`w-3 h-3 ${a.a_la_une ? 'text-white/60' : 'text-on-surface/30'}`} /> : <EyeOff className={`w-3 h-3 ${a.a_la_une ? 'text-white/60' : 'text-on-surface/30'}`} />}
                    <Toggle value={a.actif} onChange={() => handleToggleActif(a)} light={a.a_la_une} />
                  </div>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(a)} className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${a.a_la_une ? 'text-white/60 hover:bg-white/20 hover:text-white' : 'text-on-surface/40 hover:bg-primary/10 hover:text-primary'}`}>
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteId(a.id)} className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${a.a_la_une ? 'text-white/60 hover:bg-white/20 hover:text-white' : 'text-on-surface/40 hover:bg-error/10 hover:text-error'}`}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal formulaire */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up border border-primary">
            <div className="card-green rounded-t-2xl p-5 flex items-center justify-between sticky top-0 z-10">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                {editingId ? 'Modifier l\'article' : 'Nouvel article'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors" aria-label="Fermer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <FloatInput id="art-titre" label="Titre" value={form.titre} onChange={(v) => setForm({ ...form, titre: v })} required transform="upperall" />
              <FloatInput id="art-summary" label="Résumé (affiché sur la carte, 70 car. max)" maxLength={70} value={form.summary} onChange={(v) => setForm({ ...form, summary: v })} required transform="sentence" />
              <FloatTextarea id="art-contenu" label="Contenu complet" rows={6} value={form.contenu} onChange={(v) => setForm({ ...form, contenu: v })} required />
              <FloatSelect
                id="art-category"
                label="Catégorie"
                value={form.category}
                onChange={(v) => setForm({ ...form, category: v })}
                required
                options={CATEGORIES.map((c) => ({ value: c, label: c }))}
              />
              <div className="grid grid-cols-2 gap-4">
                <FloatInput id="art-parution" label="Date de parution" type="date" value={form.date_parution} onChange={(v) => setForm({ ...form, date_parution: v })} required />
                <FloatInput id="art-expiration" label="Date d'expiration (optionnel)" type="date" value={form.date_expiration ?? ''} onChange={(v) => setForm({ ...form, date_expiration: v })} />
              </div>

              {/* Image associée */}
              <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                <div
                  className="w-16 h-16 rounded-xl bg-cover bg-center flex-shrink-0 border border-[var(--color-card-border)]"
                  style={{ backgroundImage: `url(${getArticleImage({ image_url: form.image_url, category: form.category || '', categoryDefaults })})` }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-on-surface/60 uppercase tracking-wider mb-0.5">Image associée</p>
                  <p className="text-xs text-on-surface/50 truncate">
                    {form.image_id ? 'Image personnalisée' : form.category ? `Image par défaut - ${form.category}` : 'Aucune catégorie sélectionnée'}
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
                  <Toggle value={form.a_la_une} onChange={(v) => setForm({ ...form, a_la_une: v })} disabled={!form.a_la_une && uneCount >= 2} />
                  <span className="text-sm text-on-surface/70 font-medium">À la une {!form.a_la_une && uneCount >= 2 && <span className="text-on-surface/40 text-xs">(max 2 atteint)</span>}</span>
                </label>
              </div>

              {error && (
                <div className="bg-error-container/20 border border-error/20 rounded-xl p-3">
                  <p className="text-error text-sm">{error}</p>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  disabled={!isFormValid}
                  onClick={() => setPreview({
                    id: editingId ?? 'preview',
                    title: form.titre,
                    summary: form.summary,
                    content: form.contenu,
                    category: form.category,
                    date: new Date(form.date_parution).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
                    image: getArticleImage({ image_url: form.image_url, category: form.category, categoryDefaults }),
                    featured: form.a_la_une,
                  })}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border transition-colors ${isFormValid ? 'border-primary text-primary hover:bg-primary/5' : 'border-on-surface/20 text-on-surface/30 cursor-not-allowed'}`}
                >
                  <ScanEye className="w-4 h-4" />
                  Aperçu
                </button>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-full text-sm font-bold text-on-surface/60 hover:bg-surface-container transition-colors">
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className={`px-8 py-2.5 rounded-full font-bold text-sm shadow-md transition-all active:scale-95 ${isFormValid && !isSubmitting ? 'card-green text-white hover:opacity-90' : 'bg-on-surface/10 text-on-surface/30 cursor-not-allowed'}`}
                  >
                    {isSubmitting ? 'Enregistrement...' : editingId ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Aperçu public */}
      <ArticleModal article={preview} onClose={() => setPreview(null)} />

      {/* Sélecteur d'images */}
      <ImagePicker
        open={pickerOpen}
        selectedId={form.image_id}
        onSelect={(img: LibraryImage) => {
          setForm({ ...form, image_id: img.id, image_url: img.url });
          setPickerOpen(false);
          fetchCategoryDefaults(supabase).then(setCategoryDefaults);
        }}
        onClose={() => {
          setPickerOpen(false);
          fetchCategoryDefaults(supabase).then(setCategoryDefaults);
        }}
      />

      {/* Modal confirmation suppression */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm animate-slide-up border border-[var(--color-card-border)] p-6 text-center">
            <Trash2 className="w-10 h-10 text-error mx-auto mb-3" />
            <h3 className="text-lg font-serif text-on-surface mb-2">Supprimer cet article ?</h3>
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
