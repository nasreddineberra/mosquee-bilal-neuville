'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Upload, Check, Image as ImageIcon, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { optimizeImage } from '@/lib/images';

export type LibraryImage = {
  id: string;
  url: string;
  created_at: string;
};

interface ImagePickerProps {
  open: boolean;
  selectedId: string | null;
  onSelect: (image: LibraryImage) => void;
  onClose: () => void;
}

const BUCKET = 'articles';

export default function ImagePicker({ open, selectedId, onSelect, onClose }: ImagePickerProps) {
  const supabase = createClient();
  const [images, setImages] = useState<LibraryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('images')
      .select('id,url,created_at')
      .order('created_at', { ascending: false });
    setImages(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    if (open) {
      setError('');
      fetchImages();
    }
  }, [open, fetchImages]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
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
      const { data: inserted, error: insertError } = await supabase
        .from('images')
        .insert({ url: urlData.publicUrl })
        .select('id,url,created_at')
        .single();
      if (insertError) throw insertError;

      await fetchImages();
      if (inserted) onSelect(inserted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up border border-primary"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="card-green p-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-white" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Bibliothèque d&apos;images</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Upload bar */}
        <div className="p-5 border-b border-[var(--color-card-border)] flex items-center justify-between gap-4 flex-shrink-0">
          <p className="text-xs text-on-surface/50">
            JPG, PNG ou WebP - optimisé automatiquement (max 1 Mo, largeur 1200px).
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFile}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex-shrink-0 ${
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
          <div className="px-5 pt-3">
            <div className="bg-error-container/20 border border-error/20 rounded-xl p-3">
              <p className="text-error text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <p className="text-center text-on-surface/40 text-sm py-12">Chargement...</p>
          ) : images.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-12 h-12 text-on-surface/20 mx-auto mb-3" />
              <p className="text-on-surface/40 text-sm">Aucune image dans la bibliothèque.</p>
              <p className="text-on-surface/30 text-xs mt-1">Utilisez le bouton ci-dessus pour en ajouter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((img) => {
                const isSelected = img.id === selectedId;
                return (
                  <div key={img.id} className="relative group">
                    <button
                      type="button"
                      onClick={() => onSelect(img)}
                      className={`w-full aspect-square rounded-xl overflow-hidden bg-cover bg-center transition-all ${
                        isSelected
                          ? 'ring-4 ring-tertiary shadow-lg'
                          : 'ring-1 ring-[var(--color-card-border)] hover:ring-2 hover:ring-primary'
                      }`}
                      style={{ backgroundImage: `url(${img.url})` }}
                    >
                      {isSelected && (
                        <span className="absolute top-2 left-2 w-6 h-6 rounded-full bg-tertiary flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(img.id)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-error flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation */}
      {deleteId && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4"
          onClick={(e) => {
            e.stopPropagation();
            setDeleteId(null);
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center border border-[var(--color-card-border)]"
            onClick={(e) => e.stopPropagation()}
          >
            <Trash2 className="w-10 h-10 text-error mx-auto mb-3" />
            <h3 className="text-lg font-serif text-on-surface mb-2">Supprimer cette image ?</h3>
            <p className="text-sm text-on-surface/60 mb-6">Les articles qui l&apos;utilisaient reviendront à l&apos;image de leur catégorie.</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-5 py-2.5 rounded-full text-sm font-bold text-on-surface/60 hover:bg-surface-container transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2.5 rounded-full text-sm font-bold bg-error text-white hover:opacity-90 transition-all active:scale-95"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
