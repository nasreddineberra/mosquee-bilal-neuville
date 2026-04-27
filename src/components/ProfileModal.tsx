'use client';

import { useEffect, useState } from 'react';
import { X, User, Mail, KeyRound } from 'lucide-react';
import { FloatInput } from '@/components/FloatField';
import { useAuth } from '@/context/AuthContext';

type ProfileData = {
  email: string;
  role: string;
  prenom: string;
  nom: string;
  telephone: string;
  adresse: string;
  newsletter_opt_in: boolean;
};

export default function ProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<ProfileData>({ email: '', role: '', prenom: '', nom: '', telephone: '', adresse: '', newsletter_opt_in: false });
  const [initial, setInitial] = useState<ProfileData>({ email: '', role: '', prenom: '', nom: '', telephone: '', adresse: '', newsletter_opt_in: false });
  const [emailEditOpen, setEmailEditOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState<string | null>(null);
  const [emailError, setEmailError] = useState('');
  const [pwdSending, setPwdSending] = useState(false);
  const [pwdSent, setPwdSent] = useState<string | null>(null);
  const [pwdError, setPwdError] = useState('');

  const isNewEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail) && newEmail.toLowerCase() !== form.email.toLowerCase();

  // Changement d'email : appel direct Supabase (auth.updateUser) via import dynamique
  // Reste côté client car nécessite le cookie de session navigateur (pas de table exposée)
  const handleEmailChange = async () => {
    if (!isNewEmailValid) return;
    setEmailSending(true);
    setEmailError('');
    const supabase = (await import('@/lib/supabase/client')).createClient();
    const { error: err } = await supabase.auth.updateUser({ email: newEmail.toLowerCase().trim() });
    setEmailSending(false);
    if (err) {
      setEmailError(err.message || 'Erreur lors de la demande.');
      return;
    }
    setEmailSent(newEmail.toLowerCase().trim());
    setEmailEditOpen(false);
    setNewEmail('');
  };

  const closeEmailEdit = () => {
    setEmailEditOpen(false);
    setNewEmail('');
    setEmailError('');
  };

  // Réinitialisation mot de passe : appel direct Supabase via import dynamique
  // Reste côté client car nécessite le cookie de session et l'URL de redirection navigateur
  const handlePasswordReset = async () => {
    if (!form.email) return;
    setPwdSending(true);
    setPwdError('');
    setPwdSent(null);
    const supabase = (await import('@/lib/supabase/client')).createClient();
    const redirectTo = `${window.location.origin}/auth/set-password`;
    const { error: err } = await supabase.auth.resetPasswordForEmail(form.email, { redirectTo });
    setPwdSending(false);
    if (err) {
      setPwdError(err.message || 'Erreur lors de l\'envoi du mail.');
      return;
    }
    setPwdSent(form.email);
  };

  // Chargement du profil via API serveur (GET /api/user/profile → table 'profiles')
  // Appel serveur : pas d'exposition des noms de tables dans le bundle JS client
  useEffect(() => {
    if (!open) return;
    if (!userId) { setLoading(true); return; }
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      setSaved(false);
      setPwdSent(null);
      setPwdError('');
      try {
        const res = await fetch('/api/user/profile');
        const json = await res.json();
        if (cancelled) return;
        if (json.error) {
          setError('Impossible de charger le profil.');
        } else if (json.data) {
          const next: ProfileData = {
            email: json.data.email ?? '',
            role: json.data.role ?? '',
            prenom: json.data.prenom ?? '',
            nom: json.data.nom ?? '',
            telephone: json.data.telephone ?? '',
            adresse: json.data.adresse ?? '',
            newsletter_opt_in: !!json.data.newsletter_opt_in,
          };
          setForm(next);
          setInitial(next);
        }
      } catch (e) {
        if (cancelled) return;
        console.error('[ProfileModal] exception:', e);
        setError('Erreur de chargement.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [open, userId]);

  const isDirty = JSON.stringify(form) !== JSON.stringify(initial);
  const isValid = form.prenom.trim() !== '' && form.nom.trim() !== '';

  // Sauvegarde du profil via API serveur (PUT /api/user/profile)
  // Le serveur filtre les champs autorisés (protection mass-assignment)
  const handleSave = async () => {
    if (!userId || !isDirty || !isValid) return;
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prenom: form.prenom.trim(),
          nom: form.nom.trim(),
          telephone: form.telephone.trim() || null,
          adresse: form.adresse.trim() || null,
          newsletter_opt_in: form.newsletter_opt_in,
        }),
      });
      if (!res.ok) throw new Error();
      setInitial(form);
      setSaved(true);
    } catch (e) {
      setError('Erreur lors de l\'enregistrement.');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md overflow-y-auto animate-slide-up border border-primary">
        <div className="bg-primary rounded-t-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-on-primary" />
            <h2 className="text-sm font-bold text-on-primary uppercase tracking-wider">Mon profil</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-on-primary transition-colors" aria-label="Fermer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {loading ? (
            <p className="text-sm text-on-surface/60 text-center py-4">Chargement…</p>
          ) : (
            <>
              <div className="pb-2 border-b border-outline-variant/10">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-on-surface/60 truncate flex-1">{form.email}</span>
                  <button
                    type="button"
                    onClick={() => { setEmailEditOpen((v) => !v); setEmailError(''); }}
                    className="text-xs text-primary hover:underline flex-shrink-0"
                  >
                    {emailEditOpen ? 'Annuler' : 'Modifier'}
                  </button>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary flex-shrink-0">{form.role}</span>
                </div>
                {emailSent && (
                  <div className="mt-2 bg-primary/10 border border-primary/20 rounded-xl p-2.5 flex items-start gap-2">
                    <Mail className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-primary leading-relaxed">
                      Un email de confirmation a été envoyé à <strong>{emailSent}</strong>. Cliquez sur le lien reçu pour valider le changement.
                    </p>
                  </div>
                )}
                {emailEditOpen && (
                  <div className="mt-3 space-y-2">
                    <FloatInput
                      id="profil-new-email"
                      label="Nouvelle adresse email"
                      type="email"
                      value={newEmail}
                      onChange={setNewEmail}
                      transform="lowercase"
                      error={newEmail.length > 0 && !isNewEmailValid}
                    />
                    {emailError && (
                      <p className="text-error text-xs">{emailError}</p>
                    )}
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={closeEmailEdit}
                        className="px-4 py-2 text-xs font-medium text-on-surface/60 hover:text-on-surface transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        type="button"
                        onClick={handleEmailChange}
                        disabled={!isNewEmailValid || emailSending}
                        className={`px-5 py-2 rounded-full text-xs font-bold shadow-sm transition-all active:scale-95 ${
                          isNewEmailValid && !emailSending
                            ? 'bg-primary text-on-primary hover:opacity-90'
                            : 'bg-on-surface/10 text-on-surface/30 cursor-not-allowed'
                        }`}
                      >
                        {emailSending ? 'Envoi…' : 'Envoyer la confirmation'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="pb-2 border-b border-outline-variant/10">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <KeyRound className="w-3.5 h-3.5 text-on-surface/60 flex-shrink-0" />
                    <span className="text-xs text-on-surface/60 truncate">Mot de passe</span>
                  </div>
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    disabled={pwdSending || !form.email}
                    className="text-xs text-primary hover:underline flex-shrink-0 disabled:opacity-50 disabled:no-underline"
                  >
                    {pwdSending ? 'Envoi…' : 'Modifier'}
                  </button>
                </div>
                {pwdSent && (
                  <div className="mt-2 bg-primary/10 border border-primary/20 rounded-xl p-2.5 flex items-start gap-2">
                    <Mail className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-primary leading-relaxed">
                      Un email de réinitialisation a été envoyé à <strong>{pwdSent}</strong>. Cliquez sur le lien reçu pour définir votre nouveau mot de passe.
                    </p>
                  </div>
                )}
                {pwdError && (
                  <p className="text-error text-xs mt-2">{pwdError}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FloatInput id="profil-prenom" label="Prénom" value={form.prenom} onChange={(v) => setForm({ ...form, prenom: v })} required transform="capitalize" />
                <FloatInput id="profil-nom" label="Nom" value={form.nom} onChange={(v) => setForm({ ...form, nom: v })} required transform="uppercase" />
              </div>
              <FloatInput id="profil-tel" label="Téléphone" type="tel" value={form.telephone} onChange={(v) => setForm({ ...form, telephone: v })} transform="phone" />
              <FloatInput id="profil-adresse" label="Adresse" value={form.adresse} onChange={(v) => setForm({ ...form, adresse: v })} />

              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
                <input
                  type="checkbox"
                  checked={form.newsletter_opt_in}
                  onChange={(e) => setForm({ ...form, newsletter_opt_in: e.target.checked })}
                  className="mt-0.5 w-4 h-4 accent-primary cursor-pointer flex-shrink-0"
                />
                <span className="text-xs text-on-surface/80 leading-relaxed">
                  Je souhaite recevoir les informations et actualités de la Mosquée Bilal par email.
                </span>
              </label>

              {error && (
                <div className="bg-error-container/20 border border-error/20 rounded-xl p-3">
                  <p className="text-error text-sm text-center">{error}</p>
                </div>
              )}
              {saved && !isDirty && (
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3">
                  <p className="text-primary text-sm text-center font-medium">Profil mis à jour.</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-red-500 text-xs font-medium">* obligatoire</span>
                <button
                  onClick={handleSave}
                  disabled={!isDirty || !isValid || saving}
                  className={`px-8 py-3 rounded-full font-bold shadow-md transition-all active:scale-95 ${
                    isDirty && isValid && !saving
                      ? 'bg-primary text-on-primary hover:opacity-90'
                      : 'bg-on-surface/10 text-on-surface/30 cursor-not-allowed'
                  }`}
                >
                  {saving ? 'Enregistrement…' : 'Enregistrer'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
