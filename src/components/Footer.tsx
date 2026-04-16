import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/10 py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="Mosquée Bilal"
                  width={40}
                  height={40}
                  className="object-cover logo-invert"
                />
              </div>
              <div>
                <p className="font-serif font-bold text-primary leading-none">Mosquée Bilal</p>
                <p className="text-[10px] text-on-surface/40 uppercase tracking-widest mt-0.5">Neuville-sur-Saône</p>
              </div>
            </div>
            <p className="text-xs text-on-surface/55 leading-relaxed">
              Un lieu de sérénité, de savoir et de fraternité au cœur de Neuville-sur-Saône.
            </p>
            <div className="mt-auto pt-6">
              <p className="text-xs text-on-surface/40 uppercase tracking-wider mb-2">Accès en transport - Arrêt <strong className="text-on-surface/60">Neuville</strong></p>
              <div className="flex flex-wrap gap-1.5">
              {[
                { label: '40', color: 'bg-red-600' },
                { label: '70', color: 'bg-red-600' },
                { label: '82', color: 'bg-red-600' },
                { label: '84', color: 'bg-red-600' },
                { label: '96', color: 'bg-red-600' },
                { label: '97', color: 'bg-red-600' },
                { label: 'S14', color: 'bg-green-700' },
                { label: 'JD 185', color: 'bg-indigo-800' },
                { label: 'JD 242', color: 'bg-indigo-800' },
              ].map((line) => (
                <span key={line.label} className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold text-white ${line.color}`}>
                  {line.label}
                </span>
              ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface/40 mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-on-surface/65 hover:text-primary transition-colors">Accueil</Link></li>
              <li><Link href="/actualites" className="text-sm text-on-surface/65 hover:text-primary transition-colors">Actualités</Link></li>
              <li><Link href="/activites" className="text-sm text-on-surface/65 hover:text-primary transition-colors">Activités</Link></li>
              <li><Link href="/documentation" className="text-sm text-on-surface/65 hover:text-primary transition-colors">Islam</Link></li>
              <li><Link href="/don" className="text-sm text-on-surface/65 hover:text-primary transition-colors">Faire un don</Link></li>
            </ul>
          </div>

          {/* Infos pratiques */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface/40 mb-4">
              Infos pratiques
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-primary flex-shrink-0" />
                <Link href="/infos" className="text-sm text-on-surface/65 hover:text-primary transition-colors">Accès</Link>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-on-surface/65 leading-snug">
                  10 avenue Auguste Wissel<br />
                  69250 Neuville-sur-Saône
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm text-on-surface/65">04 78 49 85 22</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm text-on-surface/65">contact@mosquee-bilal.fr</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-on-surface/65">
                  Ouvert aux heures de prière
                </span>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface/40 mb-4">
              Services
            </h4>
            <ul className="space-y-1.5">
              {[
                'Prières quotidiennes',
                'Prière mortuaire (Janâza)',
                'Prières de l\'Aïd',
                'Cours',
                'Parking PMR',
              ].map((s) => (
                <li key={s} className="text-sm text-on-surface/65 flex items-center gap-1.5">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-outline-variant/10 pt-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-on-surface/35">
            © {new Date().getFullYear()} Association ACM - Mosquée Bilal. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/mentions-legales" className="text-xs text-on-surface/35 hover:text-primary transition-colors">Mentions légales</Link>
            <Link href="/confidentialite" className="text-xs text-on-surface/35 hover:text-primary transition-colors">Confidentialité</Link>
            <Link href="/admin" className="text-xs text-on-surface/35 hover:text-primary transition-colors">Accès réservé</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
