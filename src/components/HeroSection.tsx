'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Newspaper, BookOpenCheck, NotebookTabs, ShieldCheck, ChevronRight, Award, MessageSquareHeart, ExternalLink } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import CardCtaButton from '@/components/CardCtaButton';
import DailyReminder from './DailyReminder';
import { useTheme } from './ThemeProvider';
import { createClient } from '@/lib/supabase/client';
import { getArticleImage, fetchCategoryDefaults } from '@/lib/images';
import ArticleModal, { Article } from './ArticleModal';

export default function HeroSection() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [actualites, setActualites] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [certificatImage, setCertificatImage] = useState<string | null>(null);
  const [hasAdhesion, setHasAdhesion] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      fetchCategoryDefaults(supabase),
      supabase
        .from('articles')
        .select('id,titre,summary,contenu,category,a_la_une,date_parution,images(url)')
        .eq('actif', true)
        .order('a_la_une', { ascending: false })
        .order('position', { ascending: true })
        .order('date_parution', { ascending: false })
        .limit(3),
    ]).then(([defaults, { data }]) => {
      setCertificatImage(defaults['Certificat'] ?? null);
      if (data) setActualites(data.map((a) => {
        const img = Array.isArray(a.images) ? a.images[0] : a.images;
        return {
          id: a.id,
          title: a.titre,
          summary: a.summary,
          content: a.contenu,
          category: a.category,
          date: new Date(a.date_parution).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
          image: getArticleImage({ image_url: img?.url, category: a.category, categoryDefaults: defaults }),
          featured: a.a_la_une,
        };
      }));
    });
  }, []);

  // Vérifie si le visiteur connecté a un dossier d'adhésion obsèques
  useEffect(() => {
    if (!user) { setHasAdhesion(false); return; }
    const supabase = createClient();
    supabase.from('adhesions_obseques').select('id').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => setHasAdhesion(!!data));
  }, [user]);

  const heroSrc = theme === 'dark'
    ? '/images/mosquee-hero-dark.png'
    : '/images/mosquee-hero-light.png';

  return (
    <>
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
          <iframe
            className="w-full h-full border-0"
            src="//mawaqit.net/fr/m/bilal-neuville?showNotification=0&showSearchButton=0&showFooter=0&showFlashMessage=0&view=mobile"
            title="Horaires de prière Mawaqit"
            scrolling="no"
            sandbox="allow-scripts allow-same-origin"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* ROW 2 - Dernières Actualités (2/3) */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col lg:h-[188px] overflow-hidden">
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 flex-1 min-h-0">
            {actualites.map((actu) => (
              <button
                key={actu.id}
                onClick={() => setSelectedArticle(actu)}
                className="flex flex-col rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors group overflow-hidden text-left w-full h-full border border-[var(--color-card-border)]"
              >
                <div className="relative w-full h-1/3 flex-shrink-0">
                  <Image
                    src={actu.image}
                    alt={actu.title}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
                <div className="flex flex-col justify-between min-w-0 px-2.5 pt-0.5 pb-2.5 flex-1">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest truncate">
                        {actu.category}
                      </span>
                      <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest flex-shrink-0">
                        {actu.date}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors leading-tight line-clamp-2">
                      {actu.title}
                    </p>
                  </div>
                  <p className="text-[11px] text-on-surface/50 line-clamp-2 leading-snug">
                    {actu.summary}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ROW 3 - Hadith du jour (2/3) */}
        <div className="lg:col-span-2">
          <DailyReminder />
        </div>

        {/* ROW 3 - Soutenir les projets (1/3) */}
        <Link
          href="/don"
          className="group relative card-green card-green-link p-5 rounded-xl shadow-lg active:scale-95 flex flex-col justify-start"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-5 h-5 text-white/80 flex-shrink-0 heart-pulse"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="white"
                strokeWidth="1"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Soutenir les projets
              </h4>
            </div>
            <p className="text-white text-xs">
              Faire un Don en ligne
            </p>
          </div>
          <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <CardCtaButton label="Oui je veux" />
        </Link>

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
                <MessageSquareHeart className="w-5 h-5 text-primary" />
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
        <Link href="/certificat" className="group bg-surface-container-lowest rounded-xl hover:bg-surface-container transition-colors flex flex-col overflow-hidden h-full border border-[var(--color-card-border)]">
          {certificatImage && (
            <div className="relative w-full h-1/3 flex-shrink-0">
              <Image
                src={certificatImage}
                alt=""
                fill
                className="object-cover"
                sizes="400px"
              />
            </div>
          )}
          <div className="p-5 flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <Award className="w-5 h-5 text-primary flex-shrink-0" />
                <h4 className="text-sm font-bold text-primary uppercase tracking-wider truncate">Certificat de conversion</h4>
              </div>
              <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-xs text-on-surface/60 line-clamp-3">
              Vous souhaitez officialiser votre conversion à l&apos;islam ? La Mosquée Bilal vous accompagne dans vos démarches pour obtenir votre certificat de conversion - un document officiel reconnu, indispensable pour de nombreuses occasions.
            </p>
          </div>
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

          {/* Assurance obsèques */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Assurance obsèque</h4>
              </div>
              {hasAdhesion && (
                <Link href="/mon-adhesion"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-surface-container text-primary hover:bg-primary hover:text-on-primary transition-all">
                  mon adhésion
                  <ChevronRight className="w-3 h-3" />
                </Link>
              )}
            </div>
            <p className="text-xs text-on-surface/60">
              Contrat géré par la mosquée (connexion nécessaire)
            </p>
          </div>
        </div>
      </div>
    </section>
    <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </>
  );
}
