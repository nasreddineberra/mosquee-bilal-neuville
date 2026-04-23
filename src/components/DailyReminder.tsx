'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Hadith } from '@/types/hadith';

export default function DailyReminder() {
  const [hadith, setHadith] = useState<Hadith | null>(null);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data } = await supabase
        .from('hadiths')
        .select('id, texte, narrateur, source, actif, created_at, updated_at')
        .eq('actif', true)
        .order('id', { ascending: true });
      const list = (data ?? []) as Hadith[];
      if (list.length === 0) return;
      const startOfYear = new Date(new Date().getFullYear(), 0, 0);
      const dayOfYear = Math.floor((Date.now() - startOfYear.getTime()) / 86400000);
      setHadith(list[dayOfYear % list.length]);
    })();
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-container" />
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-10 translate-x-10" />

      <div className="relative z-10 p-5 text-white">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <svg className="w-5 h-5 text-white/70 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span className="text-sm font-bold uppercase tracking-wider text-white">
              Hadith du jour
            </span>
          </div>
          {hadith?.source && (
            <span className="text-sm font-bold uppercase tracking-wider text-white text-right flex-shrink-0">{hadith.source}</span>
          )}
        </div>

        {hadith ? (
          <blockquote className="text-sm font-serif leading-relaxed text-white/95 line-clamp-2">
            {hadith.narrateur && (
              <cite className="not-italic">{hadith.narrateur} : </cite>
            )}
            &laquo; {hadith.texte} &raquo;
          </blockquote>
        ) : (
          <p className="text-sm text-white/60 italic">Aucun hadith à afficher.</p>
        )}
      </div>
    </div>
  );
}
