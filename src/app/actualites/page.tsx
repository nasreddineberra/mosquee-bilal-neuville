'use client';

// ─── Page publique des actualités ───────────────────────────────────────────
// Liste tous les articles publiés (actifs) avec pagination.
// Les articles "À la une" sont mis en avant en haut de page.
// Filtrage par catégorie et recherche par mot-clé.

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Newspaper, Building, CalendarArrowUp, BookOpenCheck, Users, ChevronRight, type LucideIcon } from 'lucide-react';
import ArticleModal, { Article } from '@/components/ArticleModal';
import { createClient } from '@/lib/supabase/client';
import { getArticleImage, fetchCategoryDefaults } from '@/lib/images';

const categories = ['Tous', 'Vie de la mosquée', 'Événements', 'Cours', 'Communauté'];

const categoryIcons: Record<string, LucideIcon> = {
  'Vie de la mosquée': Building,
  'Événements': CalendarArrowUp,
  'Cours': BookOpenCheck,
  'Communauté': Users,
};

export default function ActualitesPage() {
  const supabase = createClient();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [categoryDefaults, setCategoryDefaults] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([
      fetchCategoryDefaults(supabase),
      supabase
        .from('articles')
        .select('id,titre,summary,contenu,category,a_la_une,date_parution,images(url)')
        .eq('actif', true)
        .order('a_la_une', { ascending: false })
        .order('position', { ascending: true })
        .order('date_parution', { ascending: false }),
    ]).then(([defaults, { data }]) => {
      setCategoryDefaults(defaults);
      if (data) setArticles(data.map((a) => {
        const img = Array.isArray(a.images) ? a.images[0] : a.images;
        return {
          id: a.id,
          title: a.titre,
          summary: a.summary,
          content: a.contenu,
          category: a.category,
          date: new Date(a.date_parution).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
          image: getArticleImage({ image_url: img?.url, category: a.category, categoryDefaults: defaults }),
          featured: a.a_la_une,
        };
      }));
      setLoading(false);
    });
  }, []);

  const featuredArticles = articles.filter((a) => a.featured &&
    (activeCategory === 'Tous' || a.category === activeCategory));
  const otherArticles = articles.filter((a) => !a.featured &&
    (activeCategory === 'Tous' || a.category === activeCategory));

  const filteredArticles = otherArticles;

  const showFeatured = featuredArticles.length > 0;

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

          {loading && <p className="text-center text-on-surface/40 text-sm py-16">Chargement...</p>}

          {/* Row 1 — 2 articles à la une, chacun 1/2 */}
          {!loading && showFeatured && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {featuredArticles.map((fa) => (
                <button
                  key={fa.id}
                  onClick={() => setSelectedArticle(fa)}
                  className="text-left card-green rounded-2xl shadow-sm overflow-hidden group transition-all hover:shadow-lg"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 h-full">
                    {/* Photo — 1/3 */}
                    <div className="relative h-[120px] sm:h-full overflow-hidden">
                      <Image
                        src={fa.image}
                        alt={fa.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 25vw"
                        priority
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-tertiary text-on-tertiary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                          À la une
                        </span>
                      </div>
                    </div>
                    {/* Contenu — 2/3 */}
                    <div className="sm:col-span-2 p-4 flex flex-col justify-between">
                      <div className="flex items-center gap-2 mb-2">
                        {(() => { const Icon = categoryIcons[fa.category]; return Icon ? <Icon className="w-4 h-4 text-white/80" /> : null; })()}
                        <h3 className="text-xs font-bold text-white/90 uppercase tracking-wider">{fa.category}</h3>
                        <span className="text-xs text-white/50 ml-1">- {fa.date}</span>
                      </div>
                      <h2 className="text-base lg:text-lg font-serif text-white mb-2 leading-tight line-clamp-2">
                        {fa.title}
                      </h2>
                      <p className="text-xs text-white/70 leading-relaxed line-clamp-2">
                        {fa.summary}
                      </p>
                      <div className="flex items-center gap-2 text-white text-xs font-semibold justify-end mt-auto pt-2">
                        <span>Lire l&apos;article</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Remaining Articles Grid — 4 columns */}
          {!loading && filteredArticles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="card-border cursor-pointer group rounded-2xl overflow-hidden bg-surface-container-lowest shadow-sm transition-all hover:shadow-lg flex flex-col"
                >
                  <div
                    className="w-full h-24 flex-shrink-0"
                    style={{
                      backgroundImage: `url(${article.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {(() => { const Icon = categoryIcons[article.category]; return Icon ? <Icon className="w-4 h-4 text-primary" /> : null; })()}
                      <span className="text-sm font-bold text-primary uppercase tracking-wider">
                        {article.category}
                      </span>
                      <span className="text-[10px] text-on-surface/40 ml-auto">
                        {article.date}
                      </span>
                    </div>
                    <p className="text-base font-serif text-on-surface mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </p>
                    <p className="text-xs text-on-surface/55 leading-relaxed line-clamp-2">
                      {article.summary}
                    </p>
                    <div className="mt-auto pt-3 flex items-center gap-2 text-primary text-sm font-semibold justify-end">
                      <span>Lire l&apos;article</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && filteredArticles.length === 0 && !showFeatured && (
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
