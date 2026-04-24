'use client';

import { useEffect } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import ImageLibrary, { type LibraryImage } from '@/components/ImageLibrary';

export type { LibraryImage };

interface ImagePickerProps {
  open: boolean;
  selectedId: string | null;
  onSelect: (image: LibraryImage) => void;
  onClose: () => void;
}

export default function ImagePicker({ open, selectedId, onSelect, onClose }: ImagePickerProps) {
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up border border-primary"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-green p-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-white" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Bibliothèque d&apos;images</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors" aria-label="Fermer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ImageLibrary selectedId={selectedId} onSelect={onSelect} />
        </div>
      </div>
    </div>
  );
}
