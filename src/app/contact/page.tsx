export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif text-primary mb-4">Contact</h1>
        <p className="text-on-surface/60 mb-8">
          Une question ? Notre équipe vous répond.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Formulaire */}
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
            <h2 className="text-xl font-serif text-primary mb-6">Envoyez-nous un message</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-on-surface/70 mb-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm 
                             focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface/40"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-on-surface/70 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm 
                             focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface/40"
                  placeholder="votre@email.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-on-surface/70 mb-1">
                  Sujet
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm 
                             focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface/40"
                  placeholder="Sujet de votre message"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-on-surface/70 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm 
                             focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface/40 resize-none"
                  placeholder="Votre message..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-on-primary py-3 rounded-full font-bold 
                           shadow-md hover:opacity-90 transition-all active:scale-95"
              >
                Envoyer le message
              </button>
            </form>
          </div>

          {/* Infos Contact */}
          <div className="space-y-6">
            <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
              <h3 className="text-lg font-serif text-primary mb-4">Nos coordonnées</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-tertiary mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-on-surface">Adresse</p>
                    <p className="text-sm text-on-surface/60">10 avenue Auguste Wissel, 69250 Neuville-sur-Saône</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-tertiary mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-on-surface">Téléphone</p>
                    <p className="text-sm text-on-surface/60">04 XX XX XX XX</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-tertiary mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-on-surface">Email</p>
                    <p className="text-sm text-on-surface/60">contact@mosquee-bilal.fr</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2783.5!2d4.834!3d45.832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47f4ea7f0b0b0b0b%3A0x0!2s10+Avenue+Auguste+Wissel%2C+69250+Neuville-sur-Sa%C3%B4ne!5e0!3m2!1sfr!2sfr!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Plan d'accès Mosquée Bilal"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
