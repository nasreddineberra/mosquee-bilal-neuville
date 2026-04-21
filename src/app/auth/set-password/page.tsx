'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, Check, ShieldCheck } from 'lucide-react';
import { FloatInput } from '@/components/FloatField';
import { createClient } from '@/lib/supabase/client';

export default function SetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Définir votre mot de passe - Mosquée Bilal';
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email ?? '');
        setAuthorized(true);
      }
      setChecking(false);
    })();
  }, [supabase]);

  const isPasswordValid = password.length >= 8;
  const passwordsMatch = password.length > 0 && password === confirm;
  const canSubmit = isPasswordValid && passwordsMatch && !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError('');
    const { error: err } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (err) {
      setError(err.message || 'Erreur lors de la mise à jour du mot de passe.');
      return;
    }
    setDone(true);
    setTimeout(() => router.push('/'), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-32 h-32 rounded-2xl overflow-hidden mx-auto mb-6">
            <Image src="/logo.png" alt="Mosquée Bilal" width={128} height={128} className="object-cover logo-invert" loading="eager" />
          </div>
          <h1 className="text-3xl font-serif text-primary mb-2">Bienvenue</h1>
          <p className="text-sm text-on-surface/60">Définissez votre mot de passe pour finaliser votre accès.</p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
          {checking ? (
            <p className="text-sm text-on-surface/60 text-center py-4">Vérification…</p>
          ) : !authorized ? (
            <div className="text-center py-4">
              <p className="text-sm text-on-surface/80 mb-4">
                Ce lien d&apos;invitation est invalide ou a expiré.
              </p>
              <a href="/admin" className="inline-block bg-primary text-on-primary px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-all">
                Retour à l&apos;accueil
              </a>
            </div>
          ) : done ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full badge-open flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-serif text-on-surface mb-2">Mot de passe défini</h3>
              <p className="text-sm text-on-surface/60 leading-relaxed">
                Votre compte est prêt. Redirection vers le site…
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/10">
                <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm text-on-surface/70 truncate">{email}</span>
              </div>

              <div className="relative">
                <FloatInput
                  id="set-password"
                  label="Nouveau mot de passe"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={setPassword}
                  required
                  error={password.length > 0 && !isPasswordValid}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[50%] -translate-y-[50%] text-on-surface/40 hover:text-primary transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-on-surface/50 -mt-3">Minimum 8 caractères.</p>

              <div className="relative">
                <FloatInput
                  id="set-password-confirm"
                  label="Confirmer le mot de passe"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  onChange={setConfirm}
                  required
                  error={confirm.length > 0 && !passwordsMatch}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-[50%] -translate-y-[50%] text-on-surface/40 hover:text-primary transition-colors">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <div className="bg-error-container/20 border border-error/20 rounded-xl p-3">
                  <p className="text-error text-sm text-center">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className={`w-full py-3 rounded-full font-bold shadow-md transition-all active:scale-95 ${
                  canSubmit
                    ? 'bg-primary text-on-primary hover:opacity-90'
                    : 'bg-on-surface/10 text-on-surface/30 cursor-not-allowed'
                }`}
              >
                {submitting ? 'Enregistrement…' : 'Définir mon mot de passe'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
