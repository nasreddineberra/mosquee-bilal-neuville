'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, Mail, KeyRound, ShieldCheck } from 'lucide-react';
import { FloatInput } from '@/components/FloatField';
import { createClient } from '@/lib/supabase/client';
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

const empty: ProfileData = { email: '', role: '', prenom: '', nom: '', telephone: '', adresse: '', newsletter_opt_in: false };

export default function MonProfilPage() {
  const { user, logout } = useAuth();
  const userId = user?.id ?? null;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<ProfileData>(empty);
  const [initial, setInitial] = useState<ProfileData>(empty);

  // Email change
  const [emailEditOpen, setEmailEditOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState<string | null>(null);
  const [emailError, setEmailError] = useState('');

  // Password reset
  const [pwdSending, setPwdSending] = useState(false);
  const [pwdSent, setPwdSent] = useState<string | null>(null);
  const [pwdError, setPwdError] = useState('');

  // Has obseques adhesion (pour afficher lien "Mon adhesion")
  const [hasAdhesion, setHasAdhesion] = useState(false);

  const isNewEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail) && newEmail.toLowerCase() !== form.email.toLowerCase();

  useEffect(() => {
    document.title = 'Mon profil - Mosquée Bilal';
  }, []);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    const supabase = createClient();
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('profiles')
        .select('email, role, prenom, nom, telephone, adresse, newsletter_opt_in')
        .eq('id', userId)
        .maybeSingle();
      if (cancelled) return;
      if (data) {
        const next: ProfileData = {
          email: data.email ?? '',
          role: data.role ?? '',
          prenom: data.prenom ?? '',
          nom: data.nom ?? '',
          telephone: data.telephone ?? '',
          adresse: data.adresse ?? '',
          newsletter_opt_in: !!data.newsletter_opt_in,
        };
        setForm(next);
        setInitial(next);
      }
      // Verifier si visiteur a une adhesion obseques liee
      const { data: adh } = await supabase.from('adhesions_obseques').select('id').eq('user_id', userId).maybeSingle();
      if (!cancelled) setHasAdhesion(!!adh);
      setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [userId]);

  const isDirty = JSON.stringify(form) !== JSON.stringify(initial);
  const isValid = form.prenom.trim() !== '' && form.nom.trim() !== '';

  const handleSave = async () => {
    if (!userId || !isDirty || !isValid) return;
    setSaving(true);
    setError('');
    setSaved(false);
    const supabase = createClient();
    const { error: err } = await supabase.from('profiles').update({
      prenom: form.prenom.trim(),
      nom: form.nom.trim(),
      telephone: form.telephone.trim() || null,
      adresse: form.adresse.trim() || null,
      newsletter_opt_in: form.newsletter_opt_in,
    }).eq('id', userId);
    setSaving(false);
    if (err) { setError('Erreur lors de l\'enregistrement.'); return; }
    setInitial(form);
    setSaved(true);
  };

  const handleEmailChange = async () => {
    if (!isNewEmailValid) return;
    setEmailSending(true);
    setEmailError('');
    const supabase = createClient();
    const { error: err } = await supabase.auth.updateUser({ email: newEmail.toLowerCase().trim() });
    setEmailSending(false);
    if (err) { setEmailError(err.message || 'Erreur.'); return; }
    setEmailSent(newEmail.toLowerCase().trim());
    setEmailEditOpen(false);
    setNewEmail('');
  };

  const handlePasswordReset = async () => {
    if (!form.email) return;
    setPwdSending(true);
    setPwdError('');
    setPwdSent(null);
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/set-password`;
    const { error: err } = await supabase.auth.resetPasswordForEmail(form.email, { redirectTo });
    setPwdSending(false);
    if (err) { setPwdError(err.message || 'Erreur.'); return; }
    setPwdSent(form.email);
  };

  const isVisiteur = form.role === 'visiteur';

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="bg-surface-container-lowest border-b border-outline-variant/10 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
              <Image src="/logo.png" alt="Mosquée Bilal" width={32} height={32} className="object-cover logo-invert" />
            </div>
            <div>
              <p className="font-serif font-bold text-primary text-sm leading-none">Mosquée Bilal</p>
              <p className="text-[10px] text-on-surface/40 uppercase tracking-widest mt-0.5">Mon profil</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            {isVisiteur && hasAdhesion && (
              <Link href="/mon-adhesion" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
                <ShieldCheck className="w-3.5 h-3.5" />
                Mon adhésion
              </Link>
            )}
            <button onClick={logout} className="flex items-center gap-2 text-xs text-on-surface/50 hover:text-error transition-colors">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">

        {loading ? (
          <p className="text-center text-on-surface/40 text-sm py-20">Chargement...</p>
        ) : (
          <div className="space-y-5">

            {/* Email */}
            <div className="bg-surface-container-lowest rounded-2xl border border-[var(--color-card-border)] shadow-sm p-6">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-on-surface/50 font-medium mb-0.5">Adresse email</p>
                  <p className="text-sm text-on-surface truncate">{form.email}</p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary flex-shrink-0">{form.role}</span>
                <button type="button" onClick={() => { setEmailEditOpen((v) => !v); setEmailError(''); }}
                  className="text-xs text-primary hover:underline flex-shrink-0">
                  {emailEditOpen ? 'Annuler' : 'Modifier'}
                </button>
              </div>

              {emailSent && (
                <div className="mt-3 bg-primary/10 border border-primary/20 rounded-xl p-2.5 flex items-start gap-2">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-primary leading-relaxed">
                    Un email de confirmation a été envoyé à <strong>{emailSent}</strong>.
                  </p>
                </div>
              )}

              {emailEditOpen && (
                <div className="mt-3 space-y-2">
                  <FloatInput id="profil-new-email" label="Nouvelle adresse email" type="email" value={newEmail} onChange={setNewEmail} transform="lowercase" error={newEmail.length > 0 && !isNewEmailValid} />
                  {emailError && <p className="text-error text-xs">{emailError}</p>}
                  <div className="flex items-center justify-end gap-2">
                    <button type="button" onClick={() => { setEmailEditOpen(false); setNewEmail(''); setEmailError(''); }}
                      className="px-4 py-2 text-xs font-medium text-on-surface/60 hover:text-on-surface transition-colors">
                      Annuler
                    </button>
                    <button type="button" onClick={handleEmailChange} disabled={!isNewEmailValid || emailSending}
                      className={`px-5 py-2 rounded-full text-xs font-bold shadow-sm transition-all active:scale-95 ${
                        isNewEmailValid && !emailSending ? 'bg-primary text-on-primary hover:opacity-90' : 'bg-on-surface/10 text-on-surface/30 cursor-not-allowed'
                      }`}>
                      {emailSending ? 'Envoi...' : 'Envoyer la confirmation'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mot de passe */}
            <div className="bg-surface-container-lowest rounded-2xl border border-[var(--color-card-border)] shadow-sm p-6">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-on-surface/60" />
                  <span className="text-sm text-on-surface">Mot de passe</span>
                </div>
                <button type="button" onClick={handlePasswordReset} disabled={pwdSending || !form.email}
                  className="text-xs text-primary hover:underline flex-shrink-0 disabled:opacity-50 disabled:no-underline">
                  {pwdSending ? 'Envoi...' : 'Modifier'}
                </button>
              </div>
              {pwdSent && (
                <div className="mt-3 bg-primary/10 border border-primary/20 rounded-xl p-2.5 flex items-start gap-2">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-primary leading-relaxed">
                    Un email de réinitialisation a été envoyé à <strong>{pwdSent}</strong>.
                  </p>
                </div>
              )}
              {pwdError && <p className="text-error text-xs mt-2">{pwdError}</p>}
            </div>

            {/* Identité */}
            <div className="bg-surface-container-lowest rounded-2xl border border-[var(--color-card-border)] shadow-sm p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <FloatInput id="profil-prenom" label="Prénom" value={form.prenom} onChange={(v) => setForm({ ...form, prenom: v })} required transform="capitalize" />
                <FloatInput id="profil-nom" label="Nom" value={form.nom} onChange={(v) => setForm({ ...form, nom: v })} required transform="uppercase" />
              </div>
              <FloatInput id="profil-tel" label="Téléphone" type="tel" value={form.telephone} onChange={(v) => setForm({ ...form, telephone: v })} transform="phone" />
              <FloatInput id="profil-adresse" label="Adresse" value={form.adresse} onChange={(v) => setForm({ ...form, adresse: v })} />
            </div>

            {/* Newsletter */}
            <div className="bg-surface-container-lowest rounded-2xl border border-[var(--color-card-border)] shadow-sm p-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.newsletter_opt_in}
                  onChange={(e) => setForm({ ...form, newsletter_opt_in: e.target.checked })}
                  className="mt-0.5 w-4 h-4 accent-primary cursor-pointer flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-on-surface">Newsletter de la Mosquée Bilal</p>
                  <p className="text-xs text-on-surface/60 mt-0.5">Je souhaite recevoir les informations et actualités de la Mosquée Bilal par email.</p>
                </div>
              </label>
            </div>

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
              <button onClick={handleSave} disabled={!isDirty || !isValid || saving}
                className={`px-8 py-3 rounded-full font-bold shadow-md transition-all active:scale-95 ${
                  isDirty && isValid && !saving ? 'bg-primary text-on-primary hover:opacity-90' : 'bg-on-surface/10 text-on-surface/30 cursor-not-allowed'
                }`}>
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>

            <div className="text-center pt-4">
              <Link href="/" className="text-xs text-on-surface/40 hover:text-primary transition-colors">
                ← Retour au site
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
