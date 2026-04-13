export default function ActualitesPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif text-primary mb-4">Actualités</h1>
        <p className="text-on-surface/60 mb-8">
          Retrouvez toutes les actualités et événements de la Mosquée Bilal.
        </p>

        {/* Placeholder Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm"
            >
              <div className="aspect-[4/3] bg-surface-container flex items-center justify-center">
                <span className="text-on-surface/30 text-sm">Image {i}</span>
              </div>
              <div className="p-6">
                <p className="text-tertiary text-xs font-bold uppercase tracking-widest mb-2">
                  Catégorie
                </p>
                <h3 className="text-xl font-serif text-on-surface mb-2">
                  Titre de l&apos;actualité {i}
                </h3>
                <p className="text-on-surface/60 text-sm">
                  Description de l&apos;actualité ou de l&apos;événement à venir...
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
