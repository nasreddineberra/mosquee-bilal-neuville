import { HeartHandshake, Goal, ShieldCheck, ExternalLink, ArrowBigRight, HandHeart } from 'lucide-react';

export default function DonsPage() {
  return (
    <div className="bg-background pt-8 pb-2 px-4">
      <div className="max-w-7xl mx-auto">

        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <HeartHandshake className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold font-serif text-primary uppercase tracking-wider">
              Dons
            </h1>
          </div>
          <p className="text-on-surface/60 text-sm">
            Soutenez les projets de la Mosquée Bilal via des plateformes de collecte sécurisées.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          {/* Col 1 - Pourquoi donner + Plateformes */}
          <div className="space-y-3">
            {/* Pourquoi donner ? */}
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <HandHeart className="w-5 h-5 text-primary" />
                <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Pourquoi donner ?</h2>
              </div>
              <p className="text-on-surface/70 text-sm leading-relaxed mb-3">
                Le don occupe une place centrale dans l&apos;islam. La <span className="text-primary font-semibold">sadaqa</span> (aumône volontaire) et la <span className="text-primary font-semibold">zakat</span> (aumône obligatoire) sont des actes de foi qui purifient les biens et renforcent la solidarité au sein de la communauté.
              </p>
              <p className="text-on-surface/70 text-sm leading-relaxed mb-3">
                Le Prophète Muhammad ﷺ a dit : <span className="italic text-on-surface">&quot;La sadaqa n&apos;a jamais diminué une richesse.&quot;</span> (Muslim)
              </p>
              <p className="text-on-surface/70 text-sm leading-relaxed">
                Chaque contribution, quelle que soit sa taille, permet de maintenir et développer les activités de la mosquée : cours, événements, entretien des locaux, aide sociale et projets communautaires.
              </p>
            </div>

            {/* Plateformes de confiance */}
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Plateformes de confiance</h2>
              </div>
              <p className="text-on-surface/70 text-sm leading-relaxed mb-4">
                Tous les dons sont collectés via des plateformes reconnues et sécurisées.
              </p>
              <ul className="space-y-3 mb-4">
                {[
                  { title: 'Paiement 100% sécurisé', desc: 'Transactions chiffrées et protégées par les standards bancaires.' },
                  { title: 'Transparence totale', desc: 'Suivi en temps réel des collectes et de l\'utilisation des fonds.' },
                  { title: 'Reçu fiscal automatique', desc: 'Un reçu fiscal vous est délivré pour votre déclaration d\'impôts (déduction de 66% du montant).' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-on-surface/70">
                      <span className="font-semibold text-on-surface">{item.title}</span> - {item.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Col 2 - Nos projets */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Goal className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Nos projets</h2>
            </div>

            <div className="space-y-3">
              {/* CTA Soutenir la mosquée */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative card-green card-green-link rounded-2xl p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <svg
                      className="w-5 h-5 text-white/80 flex-shrink-0 heart-pulse"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Soutenir la mosquée</h3>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed mb-4">
                    Contribuez au fonctionnement et au développement de la Mosquée Bilal. Vos dons sont éligibles à une réduction d&apos;impôt de 66%.
                  </p>
                </div>
                <span className="card-green-btn">
                  <ArrowBigRight className="w-4 h-4 fill-white" />
                </span>
              </a>

              {/* Projets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  title: 'Programmes éducatifs',
                  desc: 'Financement des cours de Tajwid, de langue arabe et des activités pour enfants et adultes.',
                  url: '#',
                },
                {
                  title: 'Actions sociales',
                  desc: 'Soutien aux familles en difficulté, distribution de repas durant le Ramadan et aide aux plus démunis.',
                  url: '#',
                },
                {
                  title: 'Événements communautaires',
                  desc: 'Organisation des célébrations de l\'Aïd, conférences, sorties et rencontres fraternelles.',
                  url: '#',
                },
              ].map((projet, i) => (
                <a
                  key={i}
                  href={projet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/projet block p-4 bg-surface-container-low rounded-2xl hover:bg-surface-container-high transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-primary">{projet.title}</h4>
                    <ExternalLink className="w-3.5 h-3.5 text-on-surface/30 group-hover/projet:text-primary transition-colors" />
                  </div>
                  <p className="text-on-surface/60 text-xs">{projet.desc}</p>
                </a>
              ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
