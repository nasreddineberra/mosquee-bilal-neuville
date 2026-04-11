'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simuler un délai de connexion
    await new Promise((resolve) => setTimeout(resolve, 800));

    const success = login(email, password);
    if (success) {
      router.push('/admin/dashboard');
    } else {
      setError('Email ou mot de passe incorrect');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-xl overflow-hidden mx-auto mb-4">
            <Image
              src="/logo.png"
              alt="Mosquée Bilal"
              width={64}
              height={64}
              className="object-cover [data-theme='dark']:invert"
            />
          </div>
          <h1 className="text-3xl font-serif text-primary mb-2">Accès réservé</h1>
          <p className="text-on-surface/60 text-sm">
            Gestion du contenu - Mosquée Bilal
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-on-surface/50 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm 
                           focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface/40"
                placeholder="admin@mosquee-bilal.fr"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-on-surface/50 mb-2"
              >
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm 
                           focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface/40"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-error-container/20 border border-error/20 rounded-xl p-3">
                <p className="text-error text-sm text-center">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-on-primary py-3 rounded-full font-bold 
                         shadow-md hover:opacity-90 transition-all active:scale-95 
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Demo Notice */}
          <div className="mt-6 bg-surface-container-low rounded-xl p-4">
            <p className="text-xs text-on-surface/60 text-center">
              <span className="font-bold text-primary">Mode démo :</span> Utilisez n&apos;importe quel email et mot de passe pour vous connecter.
            </p>
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
    </div>
  );
}
