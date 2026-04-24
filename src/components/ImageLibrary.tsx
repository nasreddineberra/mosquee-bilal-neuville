'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Upload, Check, Image as ImageIcon, Trash2, X, Eye } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { optimizeImage } from '@/lib/images';

export type LibraryImage = {
  id: string;
  url: string;
  category: string | null;
  created_at: string;
};

interface ImageLibraryProps {
  selectedId?: string | null;
  onSelect?: (image: LibraryImage) => void;
  columns?: 3 | 5;
}

const BUCKET = 'articles';
const CATEGORIES = ['Vie de la mosquée', 'Événements', 'Cours', 'Communauté', 'Certificat'];

export default function ImageLibrary({ selectedId, onSelect, columns = 3 }: ImageLibraryProps) {
  const gridCls = columns === 5 ? 'grid-cols-5' : 'grid-cols-3';
  const supabase = createClient();
  const [images, setImages] = useState<LibraryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [unassignCat, setUnassignCat] = useState<string | null>(null);
  const [dragOverCat, setDragOverCat] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const libInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('images')
      .select('id,url,category,created_at')
      .order('created_at', { ascending: false });
    setImages(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const handleUpload = async (file: File) => {
    setError('');
    setUploading(true);
    try {
      const blob = await optimizeImage(file);
      const filename = `${crypto.randomUUID()}.webp`;
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filename, blob, { contentType: 'image/webp', cacheControl: '31536000' });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filename);

      const { error: insertError } = await supabase
        .from('images')
        .insert({ url: urlData.publicUrl, category: null });
      if (insertError) throw insertError;

      await fetchImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload.');
    } finally {
      setUploading(false);
      if (libInputRef.current) libInputRef.current.value = '';
    }
  };

  const handleLibFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const img = images.find((i) => i.id === deleteId);
    if (!img) return;
    const path = img.url.split(`/${BUCKET}/`)[1];
    await supabase.from('images').delete().eq('id', deleteId);
    if (path) await supabase.storage.from(BUCKET).remove([path]);
    setDeleteId(null);
    fetchImages();
  };

  const handleAssignCategory = async (category: string, imageId: string) => {
    setError('');
    // 1. libère toute ancienne image de cette catégorie (retourne dans la biblio libre)
    await supabase.from('images').update({ category: null }).eq('category', category);
    // 2. si l'image était dans une autre catégorie, on n'a rien à faire (l'update sur id écrasera)
    // 3. assigne la nouvelle
    await supabase.from('images').update({ category }).eq('id', imageId);
    await fetchImages();
  };

  const handleUnassignCategory = async () => {
    if (!unassignCat) return;
    setError('');
    await supabase.from('images').update({ category: null }).eq('category', unassignCat);
    setUnassignCat(null);
    await fetchImages();
  };

  const categoryDefaults = Object.fromEntries(
    images.filter((i) => i.category).map((i) => [i.category!, i])
  );

  return (
    <>
      {/* Section 1 — Images par défaut des catégories (drop zone) */}
      <div className="p-5 border-b border-[var(--color-card-border)]">
        <p className="text-xs font-bold text-on-surface/50 uppercase tracking-wider mb-3">Images par défaut des catégories</p>
        <p className="text-[10px] text-on-surface/40 mb-3">Glissez une image depuis la bibliothèque vers une catégorie pour l&apos;affecter.</p>
        <div className={`grid ${gridCls} gap-2`}>
          {CATEGORIES.map((cat) => {
            const def = categoryDefaults[cat];
            const isDragOver = dragOverCat === cat;
            return (
              <div key={cat} className="flex flex-col gap-1.5">
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOverCat(cat); }}
                  onDragLeave={() => setDragOverCat((c) => c === cat ? null : c)}
                  onDrop={(e) => {
                    e.preventDefault();
                    const id = e.dataTransfer.getData('text/plain');
                    setDragOverCat(null);
                    if (id) handleAssignCategory(cat, id);
                  }}
                  className={`relative w-full h-20 rounded-xl overflow-hidden bg-surface-container border transition-all ${
                    isDragOver ? 'border-primary ring-2 ring-primary/30' : 'border-[var(--color-card-border)]'
                  }`}
                  style={def ? { backgroundImage: `url(${def.url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                >
                  {!def && (
                    <div className="absolute inset-0 flex items-center justify-center p-1">
                      <p className="text-[10px] text-on-surface/40 text-center leading-tight">Aucune image affectée</p>
                    </div>
                  )}
                  {def && (
                    <button
                      type="button"
                      onClick={() => setUnassignCat(cat)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 hover:bg-error flex items-center justify-center text-white transition-colors opacity-0 hover:opacity-100 focus:opacity-100"
                      aria-label="Retirer l'image"
                      title="Retirer l'image de cette catégorie"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <p className="text-[10px] font-bold text-on-surface/60 uppercase tracking-wider truncate">{cat}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2 — Bibliothèque (draggable) */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-bold text-on-surface/50 uppercase tracking-wider">Bibliothèque</p>
            <p className="text-[10px] text-on-surface/40 mt-0.5">Taille recommandée : 1200 × 400 px</p>
          </div>
          <input ref={libInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleLibFile} className="hidden" />
          <button
            type="button"
            disabled={uploading}
            onClick={() => libInputRef.current?.click()}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              uploading
                ? 'bg-on-surface/10 text-on-surface/30 cursor-not-allowed'
                : 'card-green text-white hover:opacity-90 active:scale-95'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            {uploading ? 'Upload...' : 'Uploader'}
          </button>
        </div>

        {error && (
          <div className="bg-error-container/20 border border-error/20 rounded-xl p-3 mb-3">
            <p className="text-error text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <p className="text-center text-on-surface/40 text-sm py-8">Chargement...</p>
        ) : images.length === 0 ? (
          <div className="text-center py-8">
            <ImageIcon className="w-10 h-10 text-on-surface/20 mx-auto mb-2" />
            <p className="text-on-surface/40 text-sm">Aucune image dans la bibliothèque.</p>
            <p className="text-on-surface/30 text-xs mt-1">Uploadez une image ci-dessus pour l&apos;associer à un article.</p>
          </div>
        ) : (
          <div className={`grid ${gridCls} gap-2`}>
            {images.map((img) => {
              const isSelected = img.id === selectedId;
              const clickable = !!onSelect;
              return (
                <div
                  key={img.id}
                  className="relative group"
                  draggable
                  onDragStart={(e) => { e.dataTransfer.setData('text/plain', img.id); e.dataTransfer.effectAllowed = 'move'; }}
                >
                  <button
                    type="button"
                    onClick={() => onSelect?.(img)}
                    disabled={!clickable}
                    className={`w-full h-20 rounded-lg overflow-hidden bg-cover bg-center transition-all cursor-grab active:cursor-grabbing ${
                      isSelected
                        ? 'ring-4 ring-tertiary shadow-lg'
                        : clickable
                          ? 'ring-1 ring-[var(--color-card-border)] hover:ring-2 hover:ring-primary'
                          : 'ring-1 ring-[var(--color-card-border)]'
                    }`}
                    style={{ backgroundImage: `url(${img.url})` }}
                  >
                    {isSelected && (
                      <span className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-tertiary flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </span>
                    )}
                  </button>
                  {img.category && (
                    <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-black/60 text-white uppercase tracking-wider truncate max-w-[calc(100%-48px)] pointer-events-none">
                      {img.category}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setPreviewUrl(img.url)}
                    className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-black/60 hover:bg-primary flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Aperçu"
                    title="Aperçu"
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(img.id)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 hover:bg-error flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Preview lightbox */}
      {previewUrl && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4" onClick={() => setPreviewUrl(null)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setPreviewUrl(null)}
              className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-on-surface flex items-center justify-center shadow-lg z-10"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
            { /* eslint-disable-next-line @next/next/no-img-element */ }
            <img src={previewUrl} alt="Aperçu" className="h-60 w-auto max-w-[90vw] rounded-2xl shadow-2xl" />
          </div>
        </div>
      )}

      {/* Unassign category confirmation */}
      {unassignCat && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center border border-[var(--color-card-border)]">
            <X className="w-10 h-10 text-error mx-auto mb-3" />
            <h3 className="text-lg font-serif text-on-surface mb-2">Retirer l&apos;image ?</h3>
            <p className="text-sm text-on-surface/60 mb-6">
              L&apos;image de la catégorie <strong>{unassignCat}</strong> sera supprimée.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setUnassignCat(null)} className="px-5 py-2.5 rounded-full text-sm font-bold text-on-surface/60 hover:bg-surface-container transition-colors">Annuler</button>
              <button onClick={handleUnassignCategory} className="px-6 py-2.5 rounded-full text-sm font-bold bg-error text-white hover:opacity-90 transition-all active:scale-95">Retirer</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center border border-[var(--color-card-border)]">
            <Trash2 className="w-10 h-10 text-error mx-auto mb-3" />
            <h3 className="text-lg font-serif text-on-surface mb-2">Supprimer cette image ?</h3>
            <p className="text-sm text-on-surface/60 mb-6">Les articles qui l&apos;utilisaient reviendront à l&apos;image par défaut de leur catégorie.</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setDeleteId(null)} className="px-5 py-2.5 rounded-full text-sm font-bold text-on-surface/60 hover:bg-surface-container transition-colors">Annuler</button>
              <button onClick={handleDelete} className="px-6 py-2.5 rounded-full text-sm font-bold bg-error text-white hover:opacity-90 transition-all active:scale-95">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
