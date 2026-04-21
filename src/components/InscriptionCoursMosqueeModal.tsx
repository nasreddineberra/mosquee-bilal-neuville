'use client';

import { useEffect, useState } from 'react';
import { X, BookOpenCheck, Check } from 'lucide-react';
import { FloatTextarea } from '@/components/FloatField';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';

type Profile = {
  prenom: string | null;
  nom: string | null;
  email: string;
  telephone: string | null;
  adresse: string | null;
};

export type CoursMosqueeItem = {
  id: string;
  titre: string;
  type: string;
  niveau: string;
  horaire: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  activite: CoursMosqueeItem | null;
  onSuccess?: () => void;
};

export default function InscriptionCoursMosqueeModal({ open, onClose, activite, onSuccess }: Props) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    if (!userId) { setLoading(true); return; }
    let cancelled = false;
    const supabase = createClient();
    const load = async () => {
      setLoading(true);
      setError('');
      setSubmitted(false);
      setMessage('');
      const { data, error: err } = await supabase
        .from('profiles')
        .select('prenom, nom, email, telephone, adresse')
        .eq('id', userId)
        .maybeSingle();
      if (cancelled) return;
      if (err || !data) {
        setError('Impossible de charger votre profil.');
      } else {
        setProfile(data as Profile);
      }
      setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [open, userId]);

  const profileComplete = !!(profile?.prenom && profile?.nom);

  const handleSubmit = async () => {
    if (!userId || !activite || !profile || !profileComplete) return;
    setSubmitting(true);
    setError('');
    const supabase = createClient();
    const { error: err } = await supabase.from('inscriptions').insert({
      user_id: userId,
      activite_type: 'cours_mosquee',
      activite_id: activite.id,
      nom: profile.nom,
      prenom: profile.prenom,
      email: profile.email,
      telephone: profile.telephone,
      adresse: profile.adresse,
      message: message.trim() || null,
      statut: 'en_attente',
    });
    setSubmitting(false);
    if (err) {
      setError(err.message || 'Erreur lors de l\'inscription.');
      return;
    }
    setSubmitted(true);
    onSuccess?.();
  };

  if (!open || !activite) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md overflow-y-auto animate-slide-up border border-primary">
        <div className="bg-primary rounded-t-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-on-primary" />
            <h2 className="text-sm font-bold text-on-primary uppercase tracking-wider">Inscription Cours Mosquée</h2>
          </div>
          {!submitting && (
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-on-primary transition-colors" aria-label="Fermer">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="p-6 space-y-4">
          {loading ? (
            <p className="text-sm text-on-surface/60 text-center py-4">Chargement…</p>
          ) : submitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full badge-open flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-serif text-on-surface mb-2">Inscription envoyée</h3>
              <p className="text-sm text-on-surface/60 mb-6 leading-relaxed">
                Votre inscription à <strong>{activite.titre}</strong> a bien été enregistrée. Elle sera examinée par un administrateur.
              </p>
              <button onClick={onClose} className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-all active:scale-95">
                Fermer
              </button>
            </div>
          ) : !profileComplete ? (
            <div className="py-4 text-center">
              <p className="text-sm text-on-surface/80 mb-4">
                Votre profil est incomplet. Merci de renseigner votre <strong>prénom</strong> et <strong>nom</strong> avant de vous inscrire.
              </p>
              <button onClick={onClose} className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-all active:scale-95">
                Compléter mon profil
              </button>
            </div>
          ) : (
            <>
              <div className="bg-surface-container rounded-xl p-4 space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">{activite.titre}</p>
                <p className="text-xs text-on-surface/70"><strong>Type :</strong> {activite.type}</p>
                <p className="text-xs text-on-surface/70"><strong>Niveau :</strong> {activite.niveau}</p>
                <p className="text-xs text-on-surface/70"><strong>Créneau :</strong> {activite.horaire}</p>
              </div>

              <div className="bg-primary/5 rounded-xl p-4 space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Vos informations</p>
                <p className="text-sm text-on-surface"><strong>{profile!.prenom} {profile!.nom}</strong></p>
                <p className="text-xs text-on-surface/70">{profile!.email}</p>
                {profile!.telephone && <p className="text-xs text-on-surface/70">{profile!.telephone}</p>}
                {profile!.adresse && <p className="text-xs text-on-surface/70">{profile!.adresse}</p>}
              </div>

              <FloatTextarea
                id="cm-message"
                label="Message (facultatif)"
                value={message}
                onChange={setMessage}
                rows={3}
              />

              {error && (
                <div className="bg-error-container/20 border border-error/20 rounded-xl p-3">
                  <p className="text-error text-sm text-center">{error}</p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={onClose}
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-medium text-on-surface/60 hover:text-on-surface transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-full font-bold text-sm shadow-md bg-primary text-on-primary hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
                >
                  {submitting ? 'Envoi…' : 'Confirmer mon inscription'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
