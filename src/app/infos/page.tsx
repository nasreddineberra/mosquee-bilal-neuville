export default function InfosPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif text-primary mb-4">Infos pratiques</h1>
        <p className="text-on-surface/60 mb-8">
          Accès, horaires, services et informations utiles.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Horaires */}
          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
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
          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
            <h2 className="text-2xl font-serif text-primary mb-6">Accès</h2>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-on-surface mb-1">Adresse</h4>
                <p className="text-on-surface/60 text-sm">
                  10 avenue Auguste Wissel<br />
                  69250 Neuville-sur-Saône, France
                </p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface mb-1">Transport</h4>
                <p className="text-on-surface/60 text-sm">
                  Bus Ligne 40 - Arrêt Mairie<br />
                  Parking disponible
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

          {/* Services */}
          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm md:col-span-2">
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
