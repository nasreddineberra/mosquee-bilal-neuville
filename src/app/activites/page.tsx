export default function ActivitesPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif text-primary mb-4">Activités communautaires</h1>
        <p className="text-on-surface/60 mb-8">
          Cours, sorties, services sociaux et programmes éducatifs.
        </p>

        {/* Placeholder Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: 'Cours de Tajwid', desc: 'Apprenez la récitation coranique avec un enseignant qualifié.', icon: '📖' },
            { title: 'Langue Arabe', desc: 'Cours pour enfants et adultes, tous niveaux.', icon: '✍️' },
            { title: 'Sorties Familiales', desc: 'Activités récréatives et éducatives pour toute la famille.', icon: '👨‍👩‍👧‍👦' },
            { title: 'Aide Sociale', desc: 'Accompagnement et soutien pour les membres de la communauté.', icon: '🤝' },
          ].map((activity, i) => (
            <div
              key={i}
              className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm flex items-start gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary-fixed/30 flex items-center justify-center text-2xl flex-shrink-0">
                {activity.icon}
              </div>
              <div>
                <h3 className="text-lg font-serif text-primary mb-1">{activity.title}</h3>
                <p className="text-on-surface/60 text-sm">{activity.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
