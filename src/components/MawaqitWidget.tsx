export default function MawaqitWidget() {
  return (
    <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-serif text-primary">
            Les Horaires de Prière
          </h3>
          <p className="text-sm text-on-surface/60 mt-1">
            Neuville-sur-Saône &amp; alentours
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-primary/10 transition-colors"
            aria-label="Localisation"
          >
            <svg
              className="w-5 h-5 text-on-surface/50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mawaqit Iframe */}
      <div className="w-full rounded-2xl overflow-hidden border border-outline-variant/10">
        <iframe
          className="w-full h-[400px]"
          src="//mawaqit.net/fr/w/bilal-neuville?showOnly5PrayerTimes=0"
          frameBorder="0"
          scrolling="no"
          title="Horaires de prière Mawaqit"
        />
      </div>
    </div>
  );
}
