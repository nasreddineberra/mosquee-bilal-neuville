'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Newspaper, Building, CalendarArrowUp, BookOpenCheck, Users, ChevronRight, type LucideIcon } from 'lucide-react';
import ArticleModal, { Article } from '@/components/ArticleModal';

const articles: Article[] = [
  {
    id: 1,
    featured: true,
    category: 'Vie de la mosquée',
    date: '12 avril 2026',
    title: 'Grande soirée de fraternité pour célébrer le renouveau de la mosquée',
    summary:
      'Rejoignez-nous pour une soirée exceptionnelle d\'échange et de partage autour d\'un dîner communautaire ouvert à tous.',
    content:
      'La Mosquée Bilal de Neuville-sur-Saône vous invite à une grande soirée de fraternité, ouverte à toutes et à tous, le samedi 19 avril à partir de 19h.\n\nCet événement spécial marque une étape importante dans la vie de notre communauté. Au programme : un dîner partagé, des interventions inspirantes et un moment de convivialité pour renforcer les liens entre les fidèles et les habitants du quartier.\n\nNous souhaitons que cette soirée soit l\'occasion de mieux nous connaître, d\'échanger sur nos projets communs et de partager un moment chaleureux ensemble. Les familles sont les bienvenues, et un espace sera prévu pour les enfants.\n\nPour des raisons d\'organisation, merci de confirmer votre présence avant le 16 avril auprès du secrétariat de la mosquée ou via le formulaire de contact du site.',
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    category: 'Cours',
    date: '08 avril 2026',
    title: 'Inscriptions ouvertes — Cours de Tajwid',
    summary:
      'Nouveau semestre de cours de Tajwid pour enfants et adultes. Inscriptions ouvertes dès maintenant.',
    content:
      'Les inscriptions pour le nouveau semestre de cours de Tajwid sont désormais ouvertes à la Mosquée Bilal.\n\nDeux niveaux sont proposés : débutant et intermédiaire. Les cours se tiennent chaque samedi matin de 10h à 12h pour les adultes, et chaque mercredi de 14h à 16h pour les enfants.\n\nLes places étant limitées, nous vous encourageons à vous inscrire rapidement. Pour toute information complémentaire, n\'hésitez pas à nous contacter.',
    image:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    category: 'Événements',
    date: '05 avril 2026',
    title: 'Conférence : L\'éthique du voisinage en Islam',
    summary:
      'Une conférence ouverte à tous sur les valeurs de bon voisinage et de solidarité dans la tradition islamique.',
    content:
      'La Mosquée Bilal organise une conférence sur le thème « L\'éthique du voisinage en Islam », animée par l\'imam de la mosquée.\n\nCette conférence abordera les principes fondamentaux du bon voisinage tels qu\'enseignés par le Prophète (paix et salut sur lui), et leur application concrète dans notre vie quotidienne.\n\nL\'événement aura lieu le vendredi 11 avril après la prière du Maghreb. L\'entrée est libre et ouverte à tous.',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    category: 'Communauté',
    date: '01 avril 2026',
    title: 'Collecte alimentaire — Solidarité de printemps',
    summary:
      'Participez à notre collecte alimentaire au profit des familles dans le besoin du quartier.',
    content:
      'Dans le cadre de notre engagement solidaire, la Mosquée Bilal lance une grande collecte alimentaire du 1er au 15 avril.\n\nVous pouvez déposer vos dons (denrées non périssables, produits d\'hygiène) à l\'accueil de la mosquée tous les jours entre 9h et 19h.\n\nLes paniers seront distribués aux familles identifiées en partenariat avec les associations locales. Chaque geste compte — merci pour votre générosité.',
    image:
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    category: 'Vie de la mosquée',
    date: '28 mars 2026',
    title: 'Horaires de prière — Passage à l\'heure d\'été',
    summary:
      'Les horaires de prière sont mis à jour suite au changement d\'heure. Consultez le widget Mawaqit.',
    content:
      'Suite au passage à l\'heure d\'été, les horaires de prière à la Mosquée Bilal ont été ajustés.\n\nNous vous invitons à consulter le widget Mawaqit sur notre page d\'accueil pour connaître les horaires actualisés. Les horaires de Joumou\'a restent inchangés : premier sermon à 13h00.\n\nPour toute question, n\'hésitez pas à contacter le secrétariat.',
    image:
      'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 6,
    category: 'Cours',
    date: '22 mars 2026',
    title: 'Atelier langue arabe pour débutants',
    summary:
      'Un nouvel atelier d\'initiation à la langue arabe est proposé chaque dimanche matin.',
    content:
      'La Mosquée Bilal propose un nouvel atelier d\'initiation à la langue arabe, destiné aux adultes débutants.\n\nLes séances auront lieu chaque dimanche matin de 10h à 11h30, à partir du 5 avril. L\'objectif est d\'acquérir les bases de la lecture et de l\'écriture arabe.\n\nAucun prérequis n\'est nécessaire. Les inscriptions sont ouvertes auprès du secrétariat.',
    image:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
  },
];

const categories = ['Tous', 'Vie de la mosquée', 'Événements', 'Cours', 'Communauté'];

const categoryIcons: Record<string, LucideIcon> = {
  'Vie de la mosquée': Building,
  'Événements': CalendarArrowUp,
  'Cours': BookOpenCheck,
  'Communauté': Users,
};

export default function ActualitesPage() {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const featuredArticle = articles.find((a) => a.featured)!;
  const otherArticles = articles.filter((a) => !a.featured);

  const filteredArticles =
    activeCategory === 'Tous'
      ? otherArticles
      : otherArticles.filter((a) => a.category === activeCategory);

  // Hide featured if filter is active and doesn't match
  const showFeatured =
    activeCategory === 'Tous' || featuredArticle.category === activeCategory;

  return (
    <>
      <div className="bg-background pt-8 pb-2 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Newspaper className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold font-serif text-primary uppercase tracking-wider">
                Actualités
              </h1>
            </div>
            <p className="text-on-surface/60 text-sm">
              Retrouvez toutes les actualités et événements de la Mosquée Bilal.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-on-primary shadow-md'
                    : 'bg-surface-container-lowest text-on-surface/60 hover:text-primary hover:bg-surface-container border border-[var(--color-card-border)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Row 1 — Featured (2/3) + First article (1/3) */}
          {showFeatured && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
              {/* Featured — 1/2 */}
              <button
                onClick={() => setSelectedArticle(featuredArticle)}
                className="sm:col-span-2 text-left card-green rounded-2xl shadow-sm overflow-hidden group transition-all hover:shadow-lg"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 h-full">
                  {/* Photo — 1/3 */}
                  <div className="relative h-[180px] sm:h-full overflow-hidden">
                    <Image
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 30vw"
                      priority
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-tertiary text-on-tertiary text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                        À la une
                      </span>
                    </div>
                  </div>

                  {/* Contenu — 2/3 */}
                  <div className="sm:col-span-2 p-4 lg:p-5 flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-3">
                      {(() => { const Icon = categoryIcons[featuredArticle.category]; return Icon ? <Icon className="w-5 h-5 text-white/80" /> : null; })()}
                      <h3 className="text-sm font-bold text-white/90 uppercase tracking-wider">
                        {featuredArticle.category}
                      </h3>
                      <span className="text-xs text-white/50 ml-1">
                        - {featuredArticle.date}
                      </span>
                    </div>
                    <h2 className="text-xl lg:text-2xl font-serif text-white mb-3 leading-tight">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-sm text-white/70 leading-relaxed line-clamp-3">
                      {featuredArticle.summary}
                    </p>
                    <div className="flex items-center gap-2 text-white text-sm font-semibold justify-end mt-auto pt-3">
                      <span>Lire l&apos;article</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>

              {/* Second article — 1/4 */}
              {filteredArticles[0] && (
                <button
                  onClick={() => setSelectedArticle(filteredArticles[0])}
                  className="text-left bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden group transition-all hover:shadow-lg flex flex-col"
                >
                  <div className="relative h-[140px] overflow-hidden flex-shrink-0">
                    <Image
                      src={filteredArticles[0].image}
                      alt={filteredArticles[0].title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {(() => { const Icon = categoryIcons[filteredArticles[0].category]; return Icon ? <Icon className="w-4 h-4 text-primary" /> : null; })()}
                      <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
                        {filteredArticles[0].category}
                      </h3>
                      <span className="text-[10px] text-on-surface/40 ml-auto">
                        {filteredArticles[0].date}
                      </span>
                    </div>
                    <h3 className="text-base font-serif text-on-surface mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {filteredArticles[0].title}
                    </h3>
                    <p className="text-xs text-on-surface/55 leading-relaxed line-clamp-3">
                      {filteredArticles[0].summary}
                    </p>
                    <div className="mt-auto pt-3 flex items-center gap-2 text-primary text-sm font-semibold justify-end">
                      <span>Lire l&apos;article</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              )}

              {/* Third article — 1/4 */}
              {filteredArticles[1] && (
                <button
                  onClick={() => setSelectedArticle(filteredArticles[1])}
                  className="text-left bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden group transition-all hover:shadow-lg flex flex-col"
                >
                  <div className="relative h-[140px] overflow-hidden flex-shrink-0">
                    <Image
                      src={filteredArticles[1].image}
                      alt={filteredArticles[1].title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {(() => { const Icon = categoryIcons[filteredArticles[1].category]; return Icon ? <Icon className="w-4 h-4 text-primary" /> : null; })()}
                      <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
                        {filteredArticles[1].category}
                      </h3>
                      <span className="text-[10px] text-on-surface/40 ml-auto">
                        {filteredArticles[1].date}
                      </span>
                    </div>
                    <h3 className="text-sm font-serif text-on-surface mb-1 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {filteredArticles[1].title}
                    </h3>
                    <p className="text-xs text-on-surface/55 leading-relaxed line-clamp-2">
                      {filteredArticles[1].summary}
                    </p>
                    <div className="mt-auto pt-2 flex items-center gap-2 text-primary text-sm font-semibold justify-end">
                      <span>Lire l&apos;article</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              )}
            </div>
          )}

          {/* Remaining Articles Grid — 4 columns */}
          {filteredArticles.slice(showFeatured ? 2 : 0).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {filteredArticles.slice(showFeatured ? 2 : 0).map((article) => (
                <button
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="text-left bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden group transition-all hover:shadow-lg"
                >
                  {/* Image */}
                  <div className="relative h-[140px] overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {(() => { const Icon = categoryIcons[article.category]; return Icon ? <Icon className="w-4 h-4 text-primary" /> : null; })()}
                      <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
                        {article.category}
                      </h3>
                      <span className="text-[10px] text-on-surface/40 ml-auto">
                        {article.date}
                      </span>
                    </div>
                    <h3 className="text-base font-serif text-on-surface mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-on-surface/55 leading-relaxed line-clamp-2">
                      {article.summary}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-primary text-sm font-semibold justify-end">
                      <span>Lire l&apos;article</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-on-surface/40 text-sm">
                Aucun article dans cette catégorie pour le moment.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Article Modal */}
      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </>
  );
}
