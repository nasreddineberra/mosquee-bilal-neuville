import Link from 'next/link';

const newsItems = [
  {
    id: 1,
    category: 'Événement',
    date: '12 Octobre 2023',
    title: 'Soirée de fraternité : Rencontre annuelle de la communauté',
    description:
      "Rejoignez-nous pour une soirée d'échange et de partage autour d'un dîner communautaire exceptionnel ce samedi.",
    image:
      'https://images.unsplash.com/photo-1585036156171-384164a8c159?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    category: 'Éducation',
    date: '08 Octobre 2023',
    title: 'Inscriptions ouvertes : Cours de Tajwid et Langue Arabe',
    description:
      'Le nouveau semestre débute bientôt. Découvrez nos différents niveaux pour enfants et adultes.',
    image:
      'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    category: 'Travaux',
    date: '05 Octobre 2023',
    title: "Extension du parking : Fin de la première phase",
    description:
      'Les travaux avancent comme prévu pour améliorer votre accueil lors des grandes affluences du vendredi.',
    image:
      'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&auto=format&fit=crop&q=80',
  },
];

export default function NewsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-serif text-primary">
          Dernières Actualités
        </h2>
        <Link
          href="/actualites"
          className="text-sm font-bold text-primary hover:text-tertiary transition-colors flex items-center gap-2"
        >
          Tout voir
          <svg
            className="w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {newsItems.map((item) => (
          <article
            key={item.id}
            className="group cursor-pointer"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden mb-6 shadow-sm">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase tracking-widest">
                  {item.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <p className="text-tertiary text-xs font-bold uppercase tracking-widest mb-2">
              {item.date}
            </p>
            <h4 className="text-xl font-serif text-on-surface group-hover:text-primary transition-colors leading-tight mb-2">
              {item.title}
            </h4>
            <p className="text-on-surface/60 text-sm line-clamp-2 font-light leading-relaxed">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
