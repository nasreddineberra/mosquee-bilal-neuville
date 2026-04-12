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
    <div className="relative rounded-2xl overflow-hidden shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-container" />
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-10 translate-x-10" />

      <div className="relative z-10 p-5 text-white">
        {/* Titre uniformisé */}
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-white/70 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <span className="text-sm font-bold uppercase tracking-wider text-white">
            Hadith du jour
          </span>
        </div>

        {/* Quote + source */}
        <blockquote className="text-sm font-serif leading-relaxed text-white/95 line-clamp-2">
          &laquo; {hadith.text} &raquo;
        </blockquote>
        <cite className="text-xs text-white/60 not-italic mt-1 block">
          {hadith.narrator} — {hadith.source}
        </cite>
      </div>
    </div>
  );
}
