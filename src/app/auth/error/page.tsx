'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';

function ErrorContent() {
  const params = useSearchParams();
  const reason = params.get('reason') ?? 'Lien invalide ou expiré.';

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-32 h-32 rounded-2xl overflow-hidden mx-auto mb-6">
          <Image src="/logo.png" alt="Mosquée Bilal" width={128} height={128} className="object-cover logo-invert" loading="eager" />
        </div>
        <h1 className="text-3xl font-serif text-primary mb-2">Lien invalide</h1>
      </div>
      <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm text-center">
        <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-error" />
        </div>
        <p className="text-sm text-on-surface/80 mb-2">
          Le lien que vous avez utilisé est invalide ou a expiré.
        </p>
        <p className="text-xs text-on-surface/50 mb-6 break-words">{reason}</p>
        <a href="/" className="inline-block bg-primary text-on-primary px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-all">
          Retour à l&apos;accueil
        </a>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <Suspense fallback={<p className="text-sm text-on-surface/60">Chargement…</p>}>
        <ErrorContent />
      </Suspense>
    </div>
  );
}
