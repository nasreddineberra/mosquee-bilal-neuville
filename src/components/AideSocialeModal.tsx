'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface AideSocialeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AideSocialeModal({ open, onClose }: AideSocialeModalProps) {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop — no onClick to prevent closing */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up border border-primary">
        {/* Header */}
        <div className="card-green rounded-t-2xl p-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            Demande d&apos;aide sociale
          </h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full badge-open flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="text-lg font-serif text-on-surface mb-2">Demande envoyée</h3>
              <p className="text-sm text-on-surface/60 mb-6">
                Votre demande a été enregistrée. Nous vous recontacterons dans les plus brefs délais.
              </p>
              <button
                onClick={handleClose}
                className="card-green text-white px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-all active:scale-95"
              >
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-on-surface/60 mb-2">
                Remplissez ce formulaire confidentiel. Un responsable vous contactera rapidement.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="aide-prenom" className="block text-sm font-medium text-on-surface/70 mb-1">Prénom</label>
                  <input type="text" id="aide-prenom" required className="w-full bg-surface-container-low border-none rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface/40" placeholder="Votre prénom" />
                </div>
                <div>
                  <label htmlFor="aide-nom" className="block text-sm font-medium text-on-surface/70 mb-1">Nom</label>
                  <input type="text" id="aide-nom" required className="w-full bg-surface-container-low border-none rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface/40" placeholder="Votre nom" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="aide-email" className="block text-sm font-medium text-on-surface/70 mb-1">Email</label>
                  <input type="email" id="aide-email" required className="w-full bg-surface-container-low border-none rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface/40" placeholder="votre@email.com" />
                </div>
                <div>
                  <label htmlFor="aide-tel" className="block text-sm font-medium text-on-surface/70 mb-1">Téléphone</label>
                  <input type="tel" id="aide-tel" required className="w-full bg-surface-container-low border-none rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface/40" placeholder="06 XX XX XX XX" />
                </div>
              </div>

              <div>
                <label htmlFor="aide-type" className="block text-sm font-medium text-on-surface/70 mb-1">Type d&apos;aide souhaitée</label>
                <select id="aide-type" required className="w-full bg-surface-container-low border-none rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary/20 text-on-surface">
                  <option value="">— Sélectionnez —</option>
                  <option value="alimentaire">Aide alimentaire</option>
                  <option value="financiere">Aide financière ponctuelle</option>
                  <option value="administrative">Accompagnement administratif</option>
                  <option value="logement">Aide au logement</option>
                  <option value="ecoute">Écoute et soutien moral</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label htmlFor="aide-situation" className="block text-sm font-medium text-on-surface/70 mb-1">Décrivez votre situation</label>
                <textarea id="aide-situation" rows={4} required className="w-full bg-surface-container-low border-none rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface/40 resize-none" placeholder="Décrivez brièvement votre situation afin que nous puissions mieux vous orienter..." />
              </div>

              <button
                type="submit"
                className="w-full card-green text-white py-3 rounded-full font-bold shadow-md hover:opacity-90 transition-all active:scale-95"
              >
                Envoyer la demande
              </button>

              <p className="text-[10px] text-on-surface/40 text-center">
                Vos informations restent strictement confidentielles.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
