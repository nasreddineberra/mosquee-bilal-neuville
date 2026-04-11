import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/10 py-12 px-4 mt-12">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Mosquée Bilal"
                  width={32}
                  height={32}
                  className="object-cover logo-invert"
                />
              </div>
              <span className="font-serif font-bold text-primary">Mosquée Bilal</span>
            </div>
            <p className="text-sm text-on-surface/60 leading-relaxed">
              Un sanctuaire de sérénité, de savoir et de fraternité au cœur de Neuville-sur-Saône.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface/50 mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-sm text-on-surface/70 hover:text-primary transition-colors">Accueil</a></li>
              <li><a href="/actualites" className="text-sm text-on-surface/70 hover:text-primary transition-colors">Actualités</a></li>
              <li><a href="/activites" className="text-sm text-on-surface/70 hover:text-primary transition-colors">Activités</a></li>
              <li><a href="/documentation" className="text-sm text-on-surface/70 hover:text-primary transition-colors">Documentation</a></li>
            </ul>
          </div>

          {/* Infos */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface/50 mb-4">
              Informations
            </h4>
            <ul className="space-y-2">
              <li><a href="/infos" className="text-sm text-on-surface/70 hover:text-primary transition-colors">Infos pratiques</a></li>
              <li><a href="/contact" className="text-sm text-on-surface/70 hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="text-sm text-on-surface/70 hover:text-primary transition-colors">Faire un don</a></li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface/50 mb-4">
              Légal
            </h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-on-surface/70 hover:text-primary transition-colors">Confidentialité</a></li>
              <li><a href="#" className="text-sm text-on-surface/70 hover:text-primary transition-colors">Mentions légales</a></li>
              <li><a href="/admin" className="text-sm text-on-surface/70 hover:text-primary transition-colors">Accès admin</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-outline-variant/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-on-surface/40">
            © {new Date().getFullYear()} Mosquée Bilal. Neuville-sur-Saône.
          </p>
          <p className="text-xs text-on-surface/40">
            Foi, fraternité, proximité
          </p>
        </div>
      </div>
    </footer>
  );
}
