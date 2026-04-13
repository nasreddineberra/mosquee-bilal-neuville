import { BookOpenCheck, Building, FileText, BookMarked, ShieldCheck, CircleHelp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const categories: { title: string; desc: string; icon: LucideIcon }[] = [
  { title: 'Les 5 Piliers', desc: 'Les fondements de l\'Islam', icon: Building },
  { title: 'Le Coran', desc: 'Apprentissage et Tajwid', icon: BookOpenCheck },
  { title: 'La Sira', desc: 'Vie du Prophète ﷺ', icon: FileText },
  { title: 'Le Hadith', desc: 'Traditions prophétiques', icon: BookMarked },
  { title: 'La Prière', desc: 'Guide pratique', icon: ShieldCheck },
  { title: 'FAQ', desc: 'Questions fréquentes', icon: CircleHelp },
];

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <BookOpenCheck className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold font-serif text-primary uppercase tracking-wider">Documentation sur l&apos;Islam</h1>
        </div>
        <p className="text-on-surface/60 text-sm mb-8">
          Articles pédagogiques et ressources pour approfondir vos connaissances.
        </p>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <a
                key={i}
                href="#"
                className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wider group-hover:text-tertiary transition-colors">
                    {cat.title}
                  </h3>
                </div>
                <p className="text-on-surface/60 text-sm">{cat.desc}</p>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
