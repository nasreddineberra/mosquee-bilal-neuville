import Link from 'next/link';
import { ShieldCheck, ChevronLeft } from 'lucide-react';

export default function ConfidentialitePage() {
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
            <ShieldCheck className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold font-serif text-primary uppercase tracking-wider">
              Politique de confidentialité
            </h1>
          </div>
        </div>

        <div className="space-y-3 max-w-4xl">

          {/* Données collectées */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Données collectées</h2>
            <p className="text-sm text-on-surface/70 leading-relaxed mb-3">
              Les données personnelles collectées sur ce site proviennent exclusivement des formulaires mis à votre disposition :
            </p>
            <ul className="space-y-2 text-sm text-on-surface/70">
              <li><span className="font-semibold text-on-surface">Formulaire de contact :</span> prénom, nom, email, téléphone, message</li>
              <li><span className="font-semibold text-on-surface">Formulaire d&apos;aide sociale :</span> prénom, nom, email, téléphone, type d&apos;aide, message</li>
            </ul>
            <p className="text-sm text-on-surface/70 leading-relaxed mt-3">
              Aucune donnée n&apos;est collectée automatiquement. Le site n&apos;utilise aucun cookie de tracking ni outil d&apos;analyse de trafic.
            </p>
          </div>

          {/* Finalité du traitement */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Finalité du traitement</h2>
            <p className="text-sm text-on-surface/70 leading-relaxed mb-3">
              Les données collectées sont utilisées uniquement pour répondre aux demandes des utilisateurs et assurer le suivi des échanges.
            </p>
            <p className="text-sm text-on-surface/70 leading-relaxed">
              Elles ne font l&apos;objet d&apos;aucune utilisation commerciale et aucune newsletter ne sera envoyée sans votre consentement préalable.
            </p>
          </div>

          {/* Conservation des données */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Conservation des données</h2>
            <p className="text-sm text-on-surface/70 leading-relaxed mb-3">
              Les données personnelles sont conservées sans limitation de durée, sauf demande contraire de votre part.
            </p>
            <p className="text-sm text-on-surface/70 leading-relaxed mb-3">
              Vous pouvez à tout moment demander la suppression de vos données en contactant l&apos;association par email ou par téléphone.
            </p>
            <p className="text-sm text-on-surface/70 leading-relaxed">
              Votre demande sera traitée dans un délai maximum de 30 jours.
            </p>
          </div>

          {/* Partage des données */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Partage des données</h2>
            <p className="text-sm text-on-surface/70 leading-relaxed">
              Aucune donnée personnelle n&apos;est partagée, vendue ou transmise à des tiers.
            </p>
          </div>

          {/* Cookies et stockage local */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Cookies et stockage local</h2>
            <p className="text-sm text-on-surface/70 leading-relaxed mb-3">
              Le site n&apos;utilise aucun cookie de tracking ni d&apos;analytics.
            </p>
            <p className="text-sm text-on-surface/70 leading-relaxed">
              Seul le localStorage de votre navigateur est utilisé pour mémoriser votre choix de thème (clair ou sombre). Cette donnée reste exclusivement sur votre appareil et n&apos;est jamais transmise.
            </p>
          </div>

          {/* Vos droits */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Vos droits (RGPD)</h2>
            <p className="text-sm text-on-surface/70 leading-relaxed mb-3">
              Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
            </p>
            <ul className="space-y-2 text-sm text-on-surface/70">
              <li><span className="font-semibold text-on-surface">Droit d&apos;accès :</span> obtenir une copie des données vous concernant</li>
              <li><span className="font-semibold text-on-surface">Droit de rectification :</span> corriger des données inexactes ou incomplètes</li>
              <li><span className="font-semibold text-on-surface">Droit de suppression :</span> demander l&apos;effacement de vos données</li>
              <li><span className="font-semibold text-on-surface">Droit d&apos;opposition :</span> vous opposer au traitement de vos données</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Contact</h2>
            <p className="text-sm text-on-surface/70 leading-relaxed mb-3">
              Pour exercer vos droits ou pour toute question relative à la protection de vos données, vous pouvez contacter l&apos;association :
            </p>
            <ul className="space-y-2 text-sm text-on-surface/70">
              <li><span className="font-semibold text-on-surface">Association ACM - Mosquée Bilal</span></li>
              <li>10 Avenue Auguste Wissel, 69250 Neuville-sur-Saône</li>
              <li>Téléphone : 04 78 49 85 22</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
