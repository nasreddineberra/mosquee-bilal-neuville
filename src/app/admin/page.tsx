'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { X, Eye, EyeOff } from 'lucide-react';
import { FloatInput } from '@/components/FloatField';

export default function AdminLoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isLoginEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isLoginValid = email.trim() !== '' && password.trim() !== '' && isLoginEmailValid;
  const [showVisiteur, setShowVisiteur] = useState(false);
  const [visiteurSubmitted, setVisiteurSubmitted] = useState(false);
  const [visiteurForm, setVisiteurForm] = useState({ firstname: '', lastname: '', email: '', phone: '' });
  const isVisiteurEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(visiteurForm.email);
  const isVisiteurValid = Object.values(visiteurForm).every((v) => v.trim() !== '') && isVisiteurEmailValid;

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/admin/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const success = login(email, password);
    if (success) {
      router.push('/admin/dashboard');
    } else {
      setError('Email ou mot de passe incorrect');
    }
    setIsLoading(false);
  };

  const handleVisiteurSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVisiteurValid) return;
    setVisiteurSubmitted(true);
  };

  const handleVisiteurClose = () => {
    setShowVisiteur(false);
    setVisiteurSubmitted(false);
    setVisiteurForm({ firstname: '', lastname: '', email: '', phone: '' });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 rounded-2xl overflow-hidden mx-auto mb-6">
            <Image
              src="/logo.png"
              alt="Mosquée Bilal"
              width={128}
              height={128}
              className="object-cover logo-invert"
            />
          </div>
          <h1 className="text-3xl font-serif text-primary mb-2">Accès réservé</h1>
        </div>

        {/* Login Form */}
        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <FloatInput id="login-email" label="Email" type="email" value={email} onChange={setEmail} required transform="lowercase" error={email.length > 0 && !isLoginEmailValid} />
            <div className="relative">
              <FloatInput id="login-password" label="Mot de passe" type={showPassword ? 'text' : 'password'} value={password} onChange={setPassword} required />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[50%] -translate-y-[50%] text-on-surface/40 hover:text-primary transition-colors"
              >
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
              disabled={!isLoginValid || isLoading}
              className={`w-full py-3 rounded-full font-bold shadow-md transition-all active:scale-95 ${isLoginValid && !isLoading ? 'bg-primary text-on-primary hover:opacity-90' : 'bg-on-surface/10 text-on-surface/30 cursor-not-allowed'}`}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setShowVisiteur(true)}
              className="text-xs font-semibold text-primary hover:underline transition-colors"
            >
              Demander un accès visiteur
            </button>
          </div>
        </div>

        {/* Back to site */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm text-on-surface/60 hover:text-primary transition-colors"
          >
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
              <button
                onClick={handleVisiteurClose}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                aria-label="Fermer"
              >
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
                    Votre demande d&apos;accès visiteur a bien été prise en compte. Elle est en attente de validation par l&apos;administrateur. Vous recevrez un email de confirmation une fois votre accès activé.
                  </p>
                  <button
                    onClick={handleVisiteurClose}
                    className="card-green text-white px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-all active:scale-95"
                  >
                    Fermer
                  </button>
                </div>
              ) : (
                <form onSubmit={handleVisiteurSubmit} className="space-y-4">
                  <p className="text-sm text-on-surface/60 mb-2">
                    Demandez un accès pour vous inscrire aux activités communautaires de la Mosquée Bilal. Votre demande sera examinée et validée par un administrateur.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <FloatInput id="visiteur-prenom" label="Prénom" value={visiteurForm.firstname} onChange={(v) => setVisiteurForm({ ...visiteurForm, firstname: v })} required transform="capitalize" />
                    <FloatInput id="visiteur-nom" label="Nom" value={visiteurForm.lastname} onChange={(v) => setVisiteurForm({ ...visiteurForm, lastname: v })} required transform="uppercase" />
                  </div>
                  <FloatInput id="visiteur-email" label="Email" type="email" value={visiteurForm.email} onChange={(v) => setVisiteurForm({ ...visiteurForm, email: v })} required transform="lowercase" error={visiteurForm.email.length > 0 && !isVisiteurEmailValid} />
                  <FloatInput id="visiteur-tel" label="Téléphone" type="tel" value={visiteurForm.phone} onChange={(v) => setVisiteurForm({ ...visiteurForm, phone: v })} required transform="phone" />
                  <div className="flex items-center justify-between">
                    <span className="text-red-500 text-xs font-medium">* obligatoire</span>
                    <button
                      type="submit"
                      disabled={!isVisiteurValid}
                      className={`px-8 py-3 rounded-full font-bold shadow-md transition-all active:scale-95 ${isVisiteurValid ? 'card-green text-white hover:opacity-90' : 'bg-on-surface/10 text-on-surface/30 cursor-not-allowed'}`}
                    >
                      Envoyer la demande
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
