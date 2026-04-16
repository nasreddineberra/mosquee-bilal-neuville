import Link from 'next/link';
import { Scale, ChevronLeft } from 'lucide-react';

export default function MentionsLegalesPage() {
  return (
    <div className="bg-background pt-8 pb-2 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Retour accueil */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs font-semibold text-on-surface/50 hover:text-primary transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour à l&apos;accueil
        </Link>

        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold font-serif text-primary uppercase tracking-wider">
              Mentions légales
            </h1>
          </div>
        </div>

        <div className="space-y-3 max-w-4xl">

          {/* Éditeur du site */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Éditeur du site</h2>
            <ul className="space-y-2 text-sm text-on-surface/70">
              <li><span className="font-semibold text-on-surface">Nom :</span> Association ACM - Mosquée Bilal</li>
              <li><span className="font-semibold text-on-surface">Forme juridique :</span> Association loi 1901</li>
              <li><span className="font-semibold text-on-surface">Adresse :</span> 10 Avenue Auguste Wissel, 69250 Neuville-sur-Saône</li>
              <li><span className="font-semibold text-on-surface">Téléphone :</span> 04 78 49 85 22</li>
              <li><span className="font-semibold text-on-surface">Email :</span> (à renseigner)</li>
              <li><span className="font-semibold text-on-surface">Responsable de publication :</span> (à renseigner)</li>
            </ul>
          </div>

          {/* Hébergement */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Hébergement</h2>
            <ul className="space-y-2 text-sm text-on-surface/70">
              <li><span className="font-semibold text-on-surface">Hébergeur :</span> (à renseigner)</li>
              <li><span className="font-semibold text-on-surface">Adresse :</span> (à renseigner)</li>
            </ul>
          </div>

          {/* Propriété intellectuelle */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Propriété intellectuelle</h2>
            <p className="text-sm text-on-surface/70 leading-relaxed mb-3">
              L&apos;ensemble du contenu de ce site (textes, images, logos, mise en page) est la propriété de l&apos;Association ACM - Mosquée Bilal, sauf mention contraire.
            </p>
            <p className="text-sm text-on-surface/70 leading-relaxed">
              Toute reproduction, même partielle, est interdite sans autorisation préalable écrite de l&apos;association.
            </p>
          </div>

          {/* Limitation de responsabilité */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Limitation de responsabilité</h2>
            <p className="text-sm text-on-surface/70 leading-relaxed mb-3">
              L&apos;Association ACM - Mosquée Bilal s&apos;efforce de fournir des informations exactes et à jour, mais ne peut garantir l&apos;absence d&apos;erreurs ou d&apos;omissions.
            </p>
            <p className="text-sm text-on-surface/70 leading-relaxed">
              L&apos;association ne saurait être tenue responsable du contenu des sites externes vers lesquels des liens sont proposés.
            </p>
          </div>

          {/* Crédits */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Crédits</h2>
            <ul className="space-y-2 text-sm text-on-surface/70">
              <li><span className="font-semibold text-on-surface">Photos :</span> Unsplash</li>
              <li><span className="font-semibold text-on-surface">Icônes :</span> Lucide Icons</li>
              <li><span className="font-semibold text-on-surface">Polices :</span> Google Fonts (Inter, Noto Serif)</li>
              <li><span className="font-semibold text-on-surface">Horaires de prière :</span> Mawaqit</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
