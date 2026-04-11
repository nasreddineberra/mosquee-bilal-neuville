'use client';

import { useState, useEffect } from 'react';
import type { Hadith } from '@/types/hadith';

// Hadiths temporaires — en attente de la table Supabase
const tempHadiths: Hadith[] = [
  {
    id: '1',
    text: 'Les actes ne valent que par leurs intentions, et chaque personne ne sera récompensée que selon ce qu\'elle aura eu en vue.',
    source: 'Al-Bukhari n°1 & Muslim n°1907',
    narrator: 'Omar ibn Al-Khattab (رضي الله عنه)',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    text: 'Nul d\'entre vous ne croit vraiment que lorsqu\'il aime pour son frère ce qu\'il aime pour lui-même.',
    source: 'Al-Bukhari n°13 & Muslim n°45',
    narrator: 'Anas ibn Malik (رضي الله عنه)',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    text: 'Le musulman est celui dont les autres musulmans sont en paix, de sa langue et de sa main.',
    source: 'Al-Bukhari n°10 & Muslim n°40',
    narrator: 'Abdullah ibn Amr (رضي الله عنه)',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    text: 'Celui qui croit en Allah et au Jour Dernier, qu\'il dise du bien ou qu\'il se taise.',
    source: 'Al-Bukhari n°6018 & Muslim n°47',
    narrator: 'Abu Hurayra (رضي الله عنه)',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    text: 'Faites le bien de manière parfaite, car Allah a prescrit de bien faire toute chose.',
    source: 'Muslim n°1955',
    narrator: 'Shaddad ibn Aws (رضي الله عنه)',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    text: 'La religion, c\'est le conseil sincère.',
    source: 'Muslim n°55',
    narrator: 'Tamim Ad-Dari (رضي الله عنه)',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '7',
    text: 'Ce qui est licite est clair, et ce qui est illicite est clair, et entre les deux se trouvent des choses douteuses que beaucoup de gens ignorent.',
    source: 'Al-Bukhari n°52 & Muslim n°1596',
    narrator: 'An-Nu\'man ibn Bashir (رضي الله عنه)',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function DailyReminder() {
  const [hadith, setHadith] = useState<Hadith>(tempHadiths[0]);

  useEffect(() => {
    // Changer le hadith en fonction du jour de l'année
    const startOfYear = new Date(new Date().getFullYear(), 0, 0);
    const dayOfYear = Math.floor(
      (Date.now() - startOfYear.getTime()) / 86400000
    );
    // TODO: remplacer par un fetch Supabase
    setHadith(tempHadiths[dayOfYear % tempHadiths.length]);
  }, []);

  return (
    <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-container" />

      {/* Decorative Motifs */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />

      {/* Content */}
      <div className="relative z-10 p-8 flex flex-col justify-between min-h-[400px] text-white">
        {/* Type Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold">
            🌙 Hadith
          </span>
        </div>

        {/* Quote */}
        <div className="space-y-5">
          <blockquote className="text-xl md:text-2xl font-serif leading-relaxed text-white/95">
            &laquo; {hadith.text} &raquo;
          </blockquote>

          {/* Narrator */}
          <p className="text-sm text-white/60 italic">
            {hadith.narrator}
          </p>

          {/* Source */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-[1px] bg-white/30" />
            <cite className="text-sm font-medium not-italic text-white/70">
              {hadith.source}
            </cite>
          </div>
        </div>

        {/* CTA */}
        <a
          href="/documentation"
          className="inline-flex items-center gap-2 text-sm font-bold text-white/80 hover:text-white transition-colors group"
        >
          Explorer la documentation
          <svg
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </a>
      </div>
    </div>
  );
}
