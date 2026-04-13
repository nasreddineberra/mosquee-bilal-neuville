import Link from 'next/link';

export default function QuickLinks() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cours & Activités */}
        <Link
          href="/activites"
          className="flex items-center justify-between p-5 bg-surface-container-lowest rounded-xl 
                     card-outline hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center">
              <svg
                className="w-6 h-6 text-secondary"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <div>
              <span className="text-sm font-bold text-primary block">
                Cours &amp; Activités
              </span>
              <span className="text-xs text-on-surface/50">
                Inscrivez-vous aux programmes éducatifs
              </span>
            </div>
          </div>
          <svg
            className="w-5 h-5 text-on-surface/30 group-hover:text-primary transition-colors"
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

        {/* Contact */}
        <Link
          href="/contact"
          className="flex items-center justify-between p-5 bg-surface-container-lowest rounded-xl 
                     card-outline hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center">
              <svg
                className="w-6 h-6 text-secondary"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div>
              <span className="text-sm font-bold text-primary block">Contact</span>
              <span className="text-xs text-on-surface/50">
                Une question ? Notre équipe vous répond
              </span>
            </div>
          </div>
          <svg
            className="w-5 h-5 text-on-surface/30 group-hover:text-primary transition-colors"
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
    </section>
  );
}
