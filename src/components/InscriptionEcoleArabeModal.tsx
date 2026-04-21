'use client';

import { useEffect, useState } from 'react';
import { X, NotebookPen, Check, Plus, Trash2 } from 'lucide-react';
import { FloatInput, FloatTextarea } from '@/components/FloatField';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';

type Profile = {
  prenom: string | null;
  nom: string | null;
  email: string;
  telephone: string | null;
  adresse: string | null;
};

export type EcoleArabeItem = {
  id: string;
  titre: string;
  categorie: string;
  horaire: string;
};

type Enfant = {
  prenom: string;
  nom: string;
  date_naissance: string;
  niveau: string;
};

const emptyEnfant: Enfant = { prenom: '', nom: '', date_naissance: '', niveau: '' };

type Props = {
  open: boolean;
  onClose: () => void;
  activite: EcoleArabeItem | null;
  onSuccess?: () => void;
};

export default function InscriptionEcoleArabeModal({ open, onClose, activite, onSuccess }: Props) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [enfants, setEnfants] = useState<Enfant[]>([{ ...emptyEnfant }]);
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
      setEnfants([{ ...emptyEnfant }]);
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
  const enfantsValid = enfants.length > 0 && enfants.every(e => e.prenom.trim() && e.nom.trim() && e.date_naissance);

  const updateEnfant = (idx: number, patch: Partial<Enfant>) => {
    setEnfants(enfants.map((e, i) => i === idx ? { ...e, ...patch } : e));
  };
  const addEnfant = () => setEnfants([...enfants, { ...emptyEnfant }]);
  const removeEnfant = (idx: number) => setEnfants(enfants.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    if (!userId || !activite || !profile || !profileComplete || !enfantsValid) return;
    setSubmitting(true);
    setError('');
    const supabase = createClient();
    const cleanEnfants = enfants.map(e => ({
      prenom: e.prenom.trim(),
      nom: e.nom.trim(),
      date_naissance: e.date_naissance,
      niveau: e.niveau.trim() || null,
    }));
    const { error: err } = await supabase.from('inscriptions').insert({
      user_id: userId,
      activite_type: 'ecole_arabe',
      activite_id: activite.id,
      nom: profile.nom,
      prenom: profile.prenom,
      email: profile.email,
      telephone: profile.telephone,
      adresse: profile.adresse,
      enfants: cleanEnfants,
      message: message.trim() || null,
      statut: 'en_attente',
    });
    setSubmitting(false);
    if (err) {
      setError(err.message || 'Erreur lors de la préinscription.');
      return;
    }
    setSubmitted(true);
    onSuccess?.();
  };

  if (!open || !activite) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up border border-primary">
        <div className="bg-primary rounded-t-2xl p-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <NotebookPen className="w-5 h-5 text-on-primary" />
            <h2 className="text-sm font-bold text-on-primary uppercase tracking-wider">Préinscription École Arabe</h2>
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
              <h3 className="text-lg font-serif text-on-surface mb-2">Préinscription envoyée</h3>
              <p className="text-sm text-on-surface/60 mb-6 leading-relaxed">
                Votre préinscription pour <strong>{enfants.length} enfant{enfants.length > 1 ? 's' : ''}</strong> à <strong>{activite.titre}</strong> a bien été enregistrée.
              </p>
              <button onClick={onClose} className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-all active:scale-95">
                Fermer
              </button>
            </div>
          ) : !profileComplete ? (
            <div className="py-4 text-center">
              <p className="text-sm text-on-surface/80 mb-4">
                Votre profil est incomplet. Merci de renseigner votre <strong>prénom</strong> et <strong>nom</strong> avant de préinscrire vos enfants.
              </p>
              <button onClick={onClose} className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-all active:scale-95">
                Compléter mon profil
              </button>
            </div>
          ) : (
            <>
              <div className="bg-surface-container rounded-xl p-4 space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">{activite.titre}</p>
                <p className="text-xs text-on-surface/70"><strong>Catégorie :</strong> {activite.categorie}</p>
                <p className="text-xs text-on-surface/70"><strong>Créneau :</strong> {activite.horaire}</p>
              </div>

              <div className="bg-primary/5 rounded-xl p-4 space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Parent responsable</p>
                <p className="text-sm text-on-surface"><strong>{profile!.prenom} {profile!.nom}</strong></p>
                <p className="text-xs text-on-surface/70">{profile!.email}</p>
                {profile!.telephone && <p className="text-xs text-on-surface/70">{profile!.telephone}</p>}
                {profile!.adresse && <p className="text-xs text-on-surface/70">{profile!.adresse}</p>}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">Enfants à préinscrire</p>
                  <button
                    type="button"
                    onClick={addEnfant}
                    className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" /> Ajouter un enfant
                  </button>
                </div>
                {enfants.map((enfant, idx) => (
                  <div key={idx} className="bg-surface-container-low rounded-xl p-3 space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface/50">Enfant {idx + 1}</p>
                      {enfants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEnfant(idx)}
                          className="text-on-surface/40 hover:text-error transition-colors"
                          aria-label="Supprimer cet enfant"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <FloatInput id={`ea-prenom-${idx}`} label="Prénom" value={enfant.prenom} onChange={(v) => updateEnfant(idx, { prenom: v })} required transform="capitalize" />
                      <FloatInput id={`ea-nom-${idx}`} label="Nom" value={enfant.nom} onChange={(v) => updateEnfant(idx, { nom: v })} required transform="uppercase" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <FloatInput id={`ea-dn-${idx}`} label="Date de naissance" type="date" value={enfant.date_naissance} onChange={(v) => updateEnfant(idx, { date_naissance: v })} required />
                      <FloatInput id={`ea-niveau-${idx}`} label="Niveau scolaire" value={enfant.niveau} onChange={(v) => updateEnfant(idx, { niveau: v })} />
                    </div>
                  </div>
                ))}
              </div>

              <FloatTextarea
                id="ea-message"
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

              <div className="flex items-center justify-between pt-2">
                <span className="text-red-500 text-xs font-medium">* obligatoire</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onClose}
                    disabled={submitting}
                    className="px-4 py-2 text-xs font-medium text-on-surface/60 hover:text-on-surface transition-colors disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !enfantsValid}
                    className={`px-6 py-2.5 rounded-full font-bold text-sm shadow-md transition-all active:scale-95 ${
                      enfantsValid && !submitting
                        ? 'bg-primary text-on-primary hover:opacity-90'
                        : 'bg-on-surface/10 text-on-surface/30 cursor-not-allowed'
                    }`}
                  >
                    {submitting ? 'Envoi…' : 'Confirmer'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
