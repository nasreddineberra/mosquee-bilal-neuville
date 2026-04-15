'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Newspaper, BookOpenCheck, NotebookTabs, ShieldCheck, ChevronRight, Award } from 'lucide-react';
import DailyReminder from './DailyReminder';
import { useTheme } from './ThemeProvider';

const actualites = [
  {
    id: 1,
    date: '12/04',
    title: 'Soirée de fraternité',
    summary: 'Rejoignez-nous pour une soirée d\'échange et de partage autour d\'un dîner communautaire.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    date: '08/04',
    title: 'Cours de Tajwid',
    summary: 'Inscriptions ouvertes pour le nouveau semestre, pour enfants et adultes.',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    date: '01/04',
    title: 'Collecte Zakat al-Fitr',
    summary: 'Des urnes sont disponibles à la mosquée pour vos dons de Zakat al-Fitr avant la fin du Ramadan.',
    image: 'https://images.unsplash.com/photo-1590250998460-ebbc33182ce7?w=300&auto=format&fit=crop&q=80',
  },
];

export default function HeroSection() {
  const { theme } = useTheme();
  const heroSrc = theme === 'dark'
    ? '/images/mosquee-hero-dark.png'
    : '/images/mosquee-hero-light.png';

  return (
    <section className="max-w-7xl mx-auto px-4 py-2">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* ROW 1 - Hero Image (2/3) */}
        <div className="lg:col-span-2 relative rounded-2xl overflow-hidden shadow-sm group bg-surface-container-lowest h-[360px]">
          <div className="relative w-full h-full transition-transform duration-700 group-hover:scale-105">
            <Image
              src={heroSrc}
              alt="Mosquée Bilal Neuville-sur-Saône"
              fill
              priority
              quality={85}
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-10 w-full">
              <span
                className="bg-tertiary-fixed-dim/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-4 inline-block"
                style={{ color: '#A9824D' }}
              >
                Que la paix soit sur vous
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">
                Mosquée Bilal
                <br />
                <span className="text-2xl md:text-3xl font-serif font-normal text-white/90">
                  Neuville-sur-Saône
                </span>
              </h2>
              <p className="text-white/80 mt-4 max-w-md font-light leading-relaxed">
                La voix qui appelle, le cœur qui rassemble.
              </p>
            </div>
          </div>
        </div>

        {/* ROW 1-2 - Mawaqit Widget (1/3, spans 2 rows) */}
        <div className="lg:row-span-2 bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden h-[560px]">
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore scrolling is deprecated in HTML5 but required to hide Mawaqit scrollbar */}
          <iframe
            className="w-full h-full border-0"
            src="//mawaqit.net/fr/m/bilal-neuville?showNotification=0&showSearchButton=0&showFooter=0&showFlashMessage=0&view=mobile"
            title="Horaires de prière Mawaqit"
            scrolling="no"
          />
        </div>

        {/* ROW 2 - Dernières Actualités (2/3) */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
                Dernières actualités
              </h3>
            </div>
            <Link href="/actualites" className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors text-primary">
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {actualites.map((actu) => (
              <Link
                key={actu.id}
                href="/actualites"
                className="flex rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors group overflow-hidden"
              >
                <div className="relative w-24 flex-shrink-0">
                  <Image
                    src={actu.image}
                    alt={actu.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="flex flex-col justify-center gap-1 min-w-0 p-3">
                  <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest">
                    {actu.date}
                  </span>
                  <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors leading-tight">
                    {actu.title}
                  </p>
                  <p className="text-xs text-on-surface/50 line-clamp-2 leading-relaxed">
                    {actu.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ROW 3 - Hadith du jour (2/3) */}
        <div className="lg:col-span-2">
          <DailyReminder />
        </div>

        {/* ROW 3 - Soutenir les projets (1/3) */}
        <a
          href="#"
          className="group relative overflow-hidden card-green p-5 rounded-xl shadow-lg transition-transform active:scale-95 flex flex-col justify-start"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-white/80 flex-shrink-0 heart-pulse"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Soutenir les projets
                </h4>
              </div>
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white flex-shrink-0 transition-colors group-hover:bg-amber-500 group-hover:text-white">
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-primary-fixed-dim text-xs">
              Faire un Don en ligne
            </p>
          </div>
          <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
        </a>

        {/* ROW 4 - Cours + Islam (1/3, stacked) */}
        <div className="space-y-3">
          <Link href="/activites" className="group bg-surface-container-lowest rounded-xl p-5 shadow-sm block hover:bg-surface-container transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BookOpenCheck className="w-5 h-5 text-primary" />
                <h4 className="text-sm font-bold text-primary uppercase tracking-wider">
                  Cours et Activités
                </h4>
              </div>
              <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-xs text-on-surface/60">
              Des activités pour toute la communauté, tout au long de l&apos;année.
            </p>
          </Link>
          <Link href="/documentation" className="group bg-surface-container-lowest rounded-xl p-5 shadow-sm block hover:bg-surface-container transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BookOpenCheck className="w-5 h-5 text-primary" />
                <h4 className="text-sm font-bold text-primary uppercase tracking-wider">
                  C&apos;est quoi l&apos;Islam ?
                </h4>
              </div>
              <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-xs text-on-surface/60">
              Découvrez les bases de l&apos;Islam.
            </p>
          </Link>
        </div>

        {/* ROW 4 - Certificat de conversion (1/3) */}
        <Link href="/certificat" className="group bg-surface-container-lowest rounded-xl p-5 shadow-sm hover:bg-surface-container transition-colors block">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Certificat de conversion</h4>
            </div>
            <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors">
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-xs text-on-surface/60">
            Vous souhaitez officialiser votre conversion à l&apos;islam ? La Mosquée Bilal vous accompagne dans vos démarches pour obtenir votre certificat de conversion - un document officiel reconnu, indispensable pour de nombreuses occasions.
          </p>
        </Link>

        {/* ROW 4 - Contact + Assurances (1/3, stacked) */}
        <div className="space-y-3">
          {/* Contact */}
          <Link href="/infos" className="group bg-surface-container-lowest rounded-xl p-5 shadow-sm block hover:bg-surface-container transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <NotebookTabs className="w-5 h-5 text-primary" />
                <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Contact et infos pratiques</h4>
              </div>
              <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-xs text-on-surface/60">
              Nous contacter et comment accéder à la mosquée.
            </p>
          </Link>

          {/* Assurances */}
          <div className="group bg-surface-container-lowest rounded-xl p-5 shadow-sm hover:bg-surface-container transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Assurances</h4>
              </div>
              <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-xs text-on-surface/60">
              Informations et protections
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
