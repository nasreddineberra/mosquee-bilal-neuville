'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Eye, EyeOff, X, ShieldCheck, QrCode } from 'lucide-react';
import { FloatInput } from '@/components/FloatField';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

type Step = 'email' | 'password' | 'mfa-enroll' | 'mfa-verify';

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => { document.title = 'Administration - Mosquée Bilal'; }, []);

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [qrCode, setQrCode] = useState('');
  const [factorId, setFactorId] = useState('');
  const [challengeId, setChallengeId] = useState('');

  const [showVisiteur, setShowVisiteur] = useState(false);
  const [visiteurSubmitted, setVisiteurSubmitted] = useState(false);
  const [visiteurForm, setVisiteurForm] = useState({ firstname: '', lastname: '', email: '', phone: '', address: '' });

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isVisiteurEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(visiteurForm.email);
  const isVisiteurValid = visiteurForm.firstname.trim() !== '' && visiteurForm.lastname.trim() !== '' && visiteurForm.email.trim() !== '' && isVisiteurEmailValid;

  // Étape 1 : vérification email
  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const { exists } = await res.json();
      if (exists) {
        setStep('password');
      } else {
        setError('Adresse email non reconnue.');
      }
    } catch {
      setError('Une erreur est survenue. Réessayez.');
    }
    setIsLoading(false);
  };

  // Étape 2 : connexion + détection MFA
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError('Mot de passe incorrect.');
        setIsLoading(false);
        return;
      }

      const { data: factors } = await supabase.auth.mfa.listFactors();
      const totpFactors = factors?.totp ?? [];

      if (totpFactors.length === 0) {
        // 1ère connexion : enrôlement MFA
        const { data: enrollData, error: enrollError } = await supabase.auth.mfa.enroll({
          factorType: 'totp',
          issuer: 'Mosquée Bilal',
          friendlyName: 'Google Authenticator',
        });
        if (enrollError || !enrollData) {
          setError('Erreur lors de la configuration du 2FA.');
          setIsLoading(false);
          return;
        }
        setQrCode(enrollData.totp.qr_code);
        setFactorId(enrollData.id);
        setStep('mfa-enroll');
      } else {
        // MFA déjà configuré : challenge
        const factor = totpFactors[0];
        const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: factor.id });
        if (challengeError || !challengeData) {
          setError('Erreur lors du challenge 2FA.');
          setIsLoading(false);
          return;
        }
        setFactorId(factor.id);
        setChallengeId(challengeData.id);
        setStep('mfa-verify');
      }
    } catch {
      setError('Une erreur est survenue.');
    }
    setIsLoading(false);
  };

  // Étape 3 : vérification code TOTP
  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      let cId = challengeId;

      if (step === 'mfa-enroll') {
        const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
        if (challengeError || !challengeData) {
          setError('Erreur lors du challenge.');
          setIsLoading(false);
          return;
        }
        cId = challengeData.id;
      }

      const { error: verifyError } = await supabase.auth.mfa.verify({ factorId, challengeId: cId, code });
      if (verifyError) {
        setError('Code incorrect. Vérifiez votre application Google Authenticator.');
        setIsLoading(false);
        return;
      }

      router.push('/admin/dashboard');
    } catch {
      setError('Une erreur est survenue.');
    }
    setIsLoading(false);
  };

  // Demande d'accès visiteur
  const handleVisiteurSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVisiteurValid) return;
    await supabase.from('demandes_acces').insert({
      email: visiteurForm.email.toLowerCase().trim(),
      nom: visiteurForm.lastname.trim(),
      prenom: visiteurForm.firstname.trim(),
      telephone: visiteurForm.phone.trim() || null,
      adresse: visiteurForm.address.trim() || null,
    });
    setVisiteurSubmitted(true);
  };

  const handleVisiteurClose = () => {
    setShowVisiteur(false);
    setVisiteurSubmitted(false);
    setVisiteurForm({ firstname: '', lastname: '', email: '', phone: '', address: '' });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 rounded-2xl overflow-hidden mx-auto mb-6">
            <Image src="/logo.png" alt="Mosquée Bilal" width={128} height={128} className="object-cover logo-invert" loading="eager" />
          </div>
          <h1 className="text-3xl font-serif text-primary mb-2">Accès réservé</h1>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">

          {/* Étape 1 : Email */}
          {step === 'email' && (
            <form onSubmit={handleCheckEmail} className="space-y-5">
              <FloatInput id="login-email" label="Email" type="email" value={email} onChange={setEmail} required transform="lowercase" error={email.length > 0 && !isEmailValid} />
              {error && (
                <div className="bg-error-container/20 border border-error/20 rounded-xl p-3">
                  <p className="text-error text-sm text-center">{error}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={!isEmailValid || isLoading}
                className={`w-full py-3 rounded-full font-bold shadow-md transition-all active:scale-95 ${isEmailValid && !isLoading ? 'bg-primary text-on-primary hover:opacity-90' : 'bg-on-surface/10 text-on-surface/30 cursor-not-allowed'}`}
              >
                {isLoading ? 'Vérification...' : 'Continuer'}
              </button>
            </form>
          )}

          {/* Étape 2 : Mot de passe */}
          {step === 'password' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/10">
                <span className="text-sm text-on-surface/60 truncate flex-1">{email}</span>
                <button type="button" onClick={() => { setStep('email'); setError(''); setPassword(''); }} className="text-xs text-primary hover:underline flex-shrink-0">
                  Modifier
                </button>
              </div>
              <div className="relative">
                <FloatInput id="login-password" label="Mot de passe" type={showPassword ? 'text' : 'password'} value={password} onChange={setPassword} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[50%] -translate-y-[50%] text-on-surface/40 hover:text-primary transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && (
                <div className="bg-error-container/20 border border-error/20 rounded-xl p-3">
                  <p className="text-error text-sm text-center">{error}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={!password.trim() || isLoading}
                className={`w-full py-3 rounded-full font-bold shadow-md transition-all active:scale-95 ${password.trim() && !isLoading ? 'bg-primary text-on-primary hover:opacity-90' : 'bg-on-surface/10 text-on-surface/30 cursor-not-allowed'}`}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
          )}

          {/* Étape 3a : QR Code - 1ère connexion */}
          {step === 'mfa-enroll' && (
            <form onSubmit={handleMfaVerify} className="space-y-5">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <QrCode className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-2">Configuration 2FA</h2>
                <p className="text-xs text-on-surface/60 leading-relaxed">
                  Scannez ce QR code avec <strong>Google Authenticator</strong> puis saisissez le code affiché.
                </p>
              </div>
              {qrCode && (
                <div className="flex justify-center p-4 bg-white rounded-xl border border-outline-variant/20">
                  <img src={qrCode} alt="QR Code 2FA" className="w-48 h-48" />
                </div>
              )}
              <FloatInput id="mfa-code-enroll" label="Code à 6 chiffres" value={code} onChange={setCode} required />
              {error && (
                <div className="bg-error-container/20 border border-error/20 rounded-xl p-3">
                  <p className="text-error text-sm text-center">{error}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={code.length !== 6 || isLoading}
                className={`w-full py-3 rounded-full font-bold shadow-md transition-all active:scale-95 ${code.length === 6 && !isLoading ? 'bg-primary text-on-primary hover:opacity-90' : 'bg-on-surface/10 text-on-surface/30 cursor-not-allowed'}`}
              >
                {isLoading ? 'Vérification...' : 'Activer et accéder'}
              </button>
            </form>
          )}

          {/* Étape 3b : Code TOTP - connexions suivantes */}
          {step === 'mfa-verify' && (
            <form onSubmit={handleMfaVerify} className="space-y-5">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-2">Double authentification</h2>
                <p className="text-xs text-on-surface/60 leading-relaxed">
                  Saisissez le code à 6 chiffres affiché dans votre application <strong>Google Authenticator</strong>.
                </p>
              </div>
              <FloatInput id="mfa-code-verify" label="Code à 6 chiffres" value={code} onChange={setCode} required />
              {error && (
                <div className="bg-error-container/20 border border-error/20 rounded-xl p-3">
                  <p className="text-error text-sm text-center">{error}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={code.length !== 6 || isLoading}
                className={`w-full py-3 rounded-full font-bold shadow-md transition-all active:scale-95 ${code.length === 6 && !isLoading ? 'bg-primary text-on-primary hover:opacity-90' : 'bg-on-surface/10 text-on-surface/30 cursor-not-allowed'}`}
              >
                {isLoading ? 'Vérification...' : 'Valider'}
              </button>
            </form>
          )}

          {/* Lien demande d'accès (étape email uniquement) */}
          {step === 'email' && (
            <div className="mt-4 text-center">
              <button onClick={() => setShowVisiteur(true)} className="text-xs font-semibold text-primary hover:underline transition-colors">
                Demander un accès visiteur
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-sm text-on-surface/60 hover:text-primary transition-colors">
            ← Retour au site
          </a>
        </div>
      </div>

      {/* Modal Accès visiteur */}
      {showVisiteur && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md overflow-y-auto animate-slide-up border border-primary">
            <div className="card-green rounded-t-2xl p-5 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Demande d&apos;accès visiteur</h2>
              <button onClick={handleVisiteurClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors" aria-label="Fermer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              {visiteurSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full badge-open flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-serif text-on-surface mb-2">Demande envoyée</h3>
                  <p className="text-sm text-on-surface/60 mb-6 leading-relaxed">
                    Votre demande d&apos;accès visiteur a bien été prise en compte. Elle sera examinée et validée par un administrateur.
                  </p>
                  <button onClick={handleVisiteurClose} className="card-green text-white px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-all active:scale-95">
                    Fermer
                  </button>
                </div>
              ) : (
                <form onSubmit={handleVisiteurSubmit} className="space-y-4">
                  <p className="text-sm text-on-surface/60 mb-2">
                    Votre demande sera examinée et validée par un administrateur.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <FloatInput id="visiteur-prenom" label="Prénom" value={visiteurForm.firstname} onChange={(v) => setVisiteurForm({ ...visiteurForm, firstname: v })} required transform="capitalize" />
                    <FloatInput id="visiteur-nom" label="Nom" value={visiteurForm.lastname} onChange={(v) => setVisiteurForm({ ...visiteurForm, lastname: v })} required transform="uppercase" />
                  </div>
                  <FloatInput id="visiteur-email" label="Email" type="email" value={visiteurForm.email} onChange={(v) => setVisiteurForm({ ...visiteurForm, email: v })} required transform="lowercase" error={visiteurForm.email.length > 0 && !isVisiteurEmailValid} />
                  <FloatInput id="visiteur-tel" label="Téléphone" type="tel" value={visiteurForm.phone} onChange={(v) => setVisiteurForm({ ...visiteurForm, phone: v })} transform="phone" />
                  <FloatInput id="visiteur-adresse" label="Adresse" value={visiteurForm.address} onChange={(v) => setVisiteurForm({ ...visiteurForm, address: v })} />
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-red-500 text-xs font-medium">* obligatoire</span>
                    <button
                      type="submit"
                      disabled={!isVisiteurValid}
                      className={`px-8 py-3 rounded-full font-bold shadow-md transition-all active:scale-95 ${isVisiteurValid ? 'card-green text-white hover:opacity-90' : 'bg-on-surface/10 text-on-surface/30 cursor-not-allowed'}`}
                    >
                      Envoyer
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
