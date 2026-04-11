export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif text-primary mb-4">Documentation sur l&apos;Islam</h1>
        <p className="text-on-surface/60 mb-8">
          Articles pédagogiques et ressources pour approfondir vos connaissances.
        </p>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { title: 'Les 5 Piliers', desc: 'Les fondements de l&apos;Islam', icon: '🕋' },
            { title: 'Le Coran', desc: 'Apprentissage et Tajwid', icon: '📖' },
            { title: 'La Sira', desc: 'Vie du Prophète ﷺ', icon: '📜' },
            { title: 'Le Hadith', desc: 'Traditions prophétiques', icon: '📚' },
            { title: 'La Prière', desc: 'Guide pratique', icon: '🤲' },
            { title: 'FAQ', desc: 'Questions fréquentes', icon: '❓' },
          ].map((cat, i) => (
            <a
              key={i}
              href="#"
              className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="text-3xl mb-4">{cat.icon}</div>
              <h3 className="text-lg font-serif text-primary mb-1 group-hover:text-tertiary transition-colors">
                {cat.title}
              </h3>
              <p className="text-on-surface/60 text-sm">{cat.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
