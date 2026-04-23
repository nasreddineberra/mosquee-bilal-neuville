'use client';

import { X, ExternalLink } from 'lucide-react';

export type DonDetail = {
  id: string;
  titre: string;
  resume: string | null;
  description: string | null;
  lien_externe: string | null;
  image_url: string | null;
};

export default function DonDetailModal({ don, onClose }: { don: DonDetail | null; onClose: () => void }) {
  if (!don) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up border border-primary">
        <div className="card-green rounded-t-2xl p-5 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider truncate pr-4">{don.titre}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors flex-shrink-0"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-0">
          {don.image_url && (
            <div
              className="w-full h-48 bg-cover bg-center"
              style={{ backgroundImage: `url(${don.image_url})` }}
              aria-hidden="true"
            />
          )}

          <div className="p-6 space-y-4">
            {don.description && (
              <p className="text-on-surface/80 text-sm leading-relaxed whitespace-pre-line">{don.description}</p>
            )}

            {don.lien_externe && (
              <div className="pt-2">
                <a
                  href={don.lien_externe}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 card-green text-white px-6 py-3 rounded-full font-bold text-sm shadow-md hover:opacity-90 transition-all active:scale-95"
                >
                  Faire un don
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
