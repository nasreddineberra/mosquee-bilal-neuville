export default function InfosPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif text-primary mb-4">Infos pratiques</h1>
        <p className="text-on-surface/60 mb-8">
          Accès, horaires, services et informations utiles.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Horaires */}
          <div className="bg-surface-container-lowest rounded-3xl p-4 shadow-sm">
            <h2 className="text-2xl font-serif text-primary mb-6">Horaires d&apos;ouverture</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-on-surface/70">Lundi - Vendredi</span>
                <span className="text-on-surface font-medium">5h30 - 22h00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface/70">Samedi</span>
                <span className="text-on-surface font-medium">6h00 - 22h00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface/70">Dimanche</span>
                <span className="text-on-surface font-medium">6h00 - 21h00</span>
              </div>
              <div className="border-t border-outline-variant/10 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-on-surface/70">Prière du Vendredi</span>
                  <span className="text-primary font-bold">13h00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Accès */}
          <div className="bg-surface-container-lowest rounded-3xl p-4 shadow-sm">
            <h2 className="text-2xl font-serif text-primary mb-6">Accès</h2>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-on-surface mb-1">Adresse</h4>
                <p className="text-on-surface/60 text-sm">
                  10 avenue Auguste Wissel<br />
                  69250 Neuville-sur-Saône
                </p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface mb-2">Transport</h4>
                <p className="text-on-surface/60 text-sm mb-2">
                  Arrêt <strong>Neuville</strong> — Zone tarifaire 1
                </p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-600 text-white">40</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-600 text-white">70</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-600 text-white">82</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-600 text-white">84</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-600 text-white">96</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-600 text-white">97</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-700 text-white">S14</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-indigo-800 text-white">JD 185</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-indigo-800 text-white">JD 242</span>
                </div>
                <p className="text-on-surface/60 text-sm">
                  Petit parking disponible
                </p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface mb-1">Contact</h4>
                <p className="text-on-surface/60 text-sm">
                  Tél : 04 XX XX XX XX<br />
                  Email : contact@mosquee-bilal.fr
                </p>
              </div>
            </div>
          </div>

          {/* Plan d'accès */}
          <div className="bg-surface-container-lowest rounded-3xl p-4 shadow-sm flex flex-col">
            <h2 className="text-2xl font-serif text-primary mb-4">Plan d&apos;accès</h2>
            <div className="rounded-2xl overflow-hidden flex-1 min-h-[320px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2783.5!2d4.834!3d45.832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47f4ea7f0b0b0b0b%3A0x0!2s10+Avenue+Auguste+Wissel%2C+69250+Neuville-sur-Sa%C3%B4ne!5e0!3m2!1sfr!2sfr!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Plan d'accès Mosquée Bilal"
                className="rounded-2xl"
              />
            </div>
          </div>

          {/* Services */}
          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm md:col-span-3">
            <h2 className="text-2xl font-serif text-primary mb-6">Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: 'Obsèques', desc: 'Organisation et accompagnement des funérailles musulmanes.' },
                { title: 'Conseil Spirituel', desc: 'Entretiens avec l&apos;imam pour des questions personnelles.' },
                { title: 'Salle de Prière', desc: 'Espace dédié à la prière et au recueillement.' },
              ].map((service, i) => (
                <div key={i} className="p-4 bg-surface-container-low rounded-2xl">
                  <h4 className="text-sm font-bold text-primary mb-1">{service.title}</h4>
                  <p className="text-on-surface/60 text-xs">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
