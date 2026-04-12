'use client';

import Image from 'next/image';
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
              <svg className="w-5 h-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10l6 6v8a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
                Dernières actualités
              </h3>
            </div>
            <a href="/actualites" className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors text-primary">
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {actualites.map((actu) => (
              <a
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
              </a>
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
          className="group relative overflow-hidden bg-gradient-to-br from-primary to-primary-container p-5 rounded-xl shadow-lg transition-transform active:scale-95 flex flex-col justify-start"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
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
            <p className="text-primary-fixed-dim text-xs">
              Faire un Don en ligne
            </p>
          </div>
          <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
        </a>

        {/* ROW 4 - Conférences et Assises (1/3) */}
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider">
                Conférences et Assises
              </h4>
            </div>
            <a href="/conferences" className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors text-primary">
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
          </div>
          <p className="text-xs text-on-surface/60">
            Événements et rencontres communautaires
          </p>
        </div>

        {/* ROW 4 - Cours et Activités (1/3) */}
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-tertiary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider">
                Cours et Activités
              </h4>
            </div>
            <a href="/activites" className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors text-primary">
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
          </div>
          <p className="text-xs text-on-surface/60">
            Programmes éducatifs et formations
          </p>
        </div>

        {/* ROW 4 - Contact + Assurances (1/3, stacked) */}
        <div className="space-y-3">
          {/* Contact */}
          <a href="/infos" className="bg-surface-container-lowest rounded-xl p-5 shadow-sm block hover:bg-surface-container transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-5 h-5 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Contact et infos pratiques</h4>
            </div>
            <p className="text-xs text-on-surface/60">
              Nous contacter
            </p>
          </a>

          {/* Assurances */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-5 h-5 text-tertiary"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Assurances</h4>
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
