import { Clock, MapPin, Navigation, Mail, CheckSquare, NotebookTabs } from 'lucide-react';

export default function InfosPage() {
  return (
    <div className="bg-background pt-8 pb-2 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <NotebookTabs className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold font-serif text-primary uppercase tracking-wider">Contact et Infos pratiques</h1>
        </div>
        <p className="text-on-surface/60 text-sm mb-8">
          Accès, horaires, contact, services et informations utiles.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Horaires */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Horaires d&apos;ouverture</h2>
            </div>
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
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Accès</h2>
            </div>
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
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Navigation className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Plan d&apos;accès</h2>
            </div>
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

        </div>

        {/* LIGNE 2 — Contact (gauche) + Services (droite) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          {/* Formulaire de contact */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-primary">
            {/* Header */}
            <div className="card-green rounded-t-xl p-5 flex items-center gap-2">
              <Mail className="w-5 h-5 text-white" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Envoyez-nous un message</h2>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstname" className="block text-sm font-medium text-on-surface/70 mb-1">Prénom</label>
                    <input type="text" id="firstname" className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface/40" placeholder="Votre prénom" />
                  </div>
                  <div>
                    <label htmlFor="lastname" className="block text-sm font-medium text-on-surface/70 mb-1">Nom</label>
                    <input type="text" id="lastname" className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface/40" placeholder="Votre nom" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-on-surface/70 mb-1">Email</label>
                    <input type="email" id="email" className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface/40" placeholder="votre@email.com" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-on-surface/70 mb-1">Téléphone</label>
                    <input type="tel" id="phone" className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface/40" placeholder="06 XX XX XX XX" />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-on-surface/70 mb-1">Sujet</label>
                  <input type="text" id="subject" className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface/40" placeholder="Sujet de votre message" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-on-surface/70 mb-1">Message</label>
                  <textarea id="message" rows={6} className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface/40 resize-none" placeholder="Votre message..." />
                </div>
                <button type="submit" className="w-full card-green text-white py-3 rounded-full font-bold shadow-md hover:opacity-90 transition-all active:scale-95">
                  Envoyer le message
                </button>
              </form>
            </div>
          </div>

          {/* Services */}
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <CheckSquare className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Services</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {[
                { title: 'Prières quotidiennes et prière mortuaire', desc: 'Salât al-janâza — accompagnement du défunt dans la prière.' },
                { title: 'Prière de l\'Aïd', desc: 'Célébration de l\'Aïd el-Fitr et l\'Aïd el-Adha en communauté.' },
                { title: 'Salle d\'ablutions', desc: 'Espace dédié aux ablutions avant la prière.' },
                { title: 'Iftar Ramadan', desc: 'Rupture du jeûne partagée en communauté durant le mois de Ramadan.' },
                { title: 'Espace pour femmes', desc: 'Salle réservée aux femmes pour la prière et les activités.' },
                { title: 'Cours pour adultes et enfants', desc: 'Enseignement du Coran, tajwid, et éducation islamique.' },
                { title: 'Petit parking avec accès handicapés', desc: 'Stationnement disponible avec accès aménagé pour les personnes à mobilité réduite.' },
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
