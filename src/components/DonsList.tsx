'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import CardCtaButton from '@/components/CardCtaButton';
import DonDetailModal, { DonDetail } from '@/components/DonDetailModal';

export default function DonsList({ featured, projets }: { featured: DonDetail | null; projets: DonDetail[] }) {
  const [selected, setSelected] = useState<DonDetail | null>(null);

  if (!featured && projets.length === 0) {
    return <p className="text-on-surface/40 text-sm text-center py-4">Aucun don disponible pour le moment.</p>;
  }

  return (
    <>
      <div className="space-y-3">
        {/* CTA don a_la_une */}
        {featured && (
          <button
            type="button"
            onClick={() => setSelected(featured)}
            className="group relative card-green card-green-link overflow-hidden rounded-2xl shadow-sm flex flex-col text-left w-full h-48 border border-white/20"
          >
            {featured.image_url && (
              <div
                className="w-full h-1/3 bg-cover bg-center flex-shrink-0 rounded-t-2xl"
                style={{ backgroundImage: `url(${featured.image_url})` }}
                aria-hidden="true"
              />
            )}
            <div className="p-5 flex flex-col flex-1 justify-between min-h-0">
              <div>
                <div className="flex items-start gap-2 mb-3">
                  <svg
                    className="w-5 h-5 text-white/80 flex-shrink-0 heart-pulse mt-0.5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="white"
                    strokeWidth="1"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">{featured.titre}</h3>
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-4">{featured.resume}</p>
              </div>
              <CardCtaButton label="Oui je veux" />
            </div>
          </button>
        )}

        {/* Projets */}
        {projets.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {projets.map((projet) => (
              <button
                key={projet.id}
                type="button"
                onClick={() => setSelected(projet)}
                className="group/projet relative flex flex-col bg-surface-container-low rounded-2xl overflow-hidden hover:bg-surface-container-high transition-colors text-left w-full h-44 border border-[var(--color-card-border)]"
              >
                {projet.image_url && (
                  <div
                    className="w-full h-1/3 bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url(${projet.image_url})` }}
                    aria-hidden="true"
                  />
                )}
                <div className="px-4 pt-1 pb-4 flex-1 min-h-0">
                  <h4 className="text-sm font-bold text-primary mb-1 leading-tight">{projet.titre}</h4>
                  <p className="text-on-surface/60 text-xs line-clamp-3 pr-10">{projet.resume}</p>
                </div>
                <span className="absolute bottom-3 right-3 w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-primary flex-shrink-0 group-hover/projet:bg-primary group-hover/projet:text-on-primary transition-colors">
                  <ChevronRight className="w-3 h-3" />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <DonDetailModal don={selected} onClose={() => setSelected(null)} />
    </>
  );
}
