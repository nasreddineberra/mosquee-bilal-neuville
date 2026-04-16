'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { FloatInput, FloatSelect, FloatTextarea } from '@/components/FloatField';

interface AideSocialeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AideSocialeModal({ open, onClose }: AideSocialeModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ firstname: '', lastname: '', email: '', phone: '', type: '', situation: '' });
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isValid = Object.values(form).every((v) => v.trim() !== '') && isEmailValid;

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
    if (!isValid) return;
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setForm({ firstname: '', lastname: '', email: '', phone: '', type: '', situation: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
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
                <FloatInput id="aide-prenom" label="Prénom" value={form.firstname} onChange={(v) => setForm({ ...form, firstname: v })} required transform="capitalize" />
                <FloatInput id="aide-nom" label="Nom" value={form.lastname} onChange={(v) => setForm({ ...form, lastname: v })} required transform="uppercase" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FloatInput id="aide-email" label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required transform="lowercase" error={form.email.length > 0 && !isEmailValid} />
                <FloatInput id="aide-tel" label="Téléphone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required transform="phone" />
              </div>

              <FloatSelect
                id="aide-type"
                label="Type d'aide souhaitée"
                value={form.type}
                onChange={(v) => setForm({ ...form, type: v })}
                required
                options={[
                  { value: 'alimentaire', label: 'Aide alimentaire' },
                  { value: 'financiere', label: 'Aide financière ponctuelle' },
                  { value: 'administrative', label: 'Accompagnement administratif' },
                  { value: 'logement', label: 'Aide au logement' },
                  { value: 'ecoute', label: 'Écoute et soutien moral' },
                  { value: 'autre', label: 'Autre' },
                ]}
              />

              <FloatTextarea id="aide-situation" label="Décrivez votre situation" rows={4} value={form.situation} onChange={(v) => setForm({ ...form, situation: v })} required />

              <div className="flex items-center justify-between">
                <span className="text-red-500 text-xs font-medium">* obligatoire</span>
                <button
                  type="submit"
                  disabled={!isValid}
                  className={`px-8 py-3 rounded-full font-bold shadow-md transition-all active:scale-95 ${isValid ? 'card-green text-white hover:opacity-90' : 'bg-on-surface/10 text-on-surface/30 cursor-not-allowed'}`}
                >
                  Envoyer la demande
                </button>
              </div>

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
