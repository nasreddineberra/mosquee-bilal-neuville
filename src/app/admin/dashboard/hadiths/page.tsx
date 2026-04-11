'use client';

import { useState } from 'react';
import type { Hadith } from '@/types/hadith';

const initialHadiths: Hadith[] = [
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
];

export default function AdminHadithsPage() {
  const [hadiths, setHadiths] = useState<Hadith[]>(initialHadiths);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ text: '', source: '', narrator: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newHadith: Hadith = {
      id: String(Date.now()),
      ...formData,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setHadiths([newHadith, ...hadiths]);
    setFormData({ text: '', source: '', narrator: '' });
    setShowForm(false);
  };

  const toggleActive = (id: string) => {
    setHadiths(
      hadiths.map((h) =>
        h.id === id ? { ...h, is_active: !h.is_active, updated_at: new Date().toISOString() } : h
      )
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-serif text-on-surface mb-2">
            Gestion des Hadiths
          </h1>
          <p className="text-on-surface/60 font-medium">
            Renseignez les hadiths authentiques avec références exactes.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-full font-bold shadow-lg hover:scale-105 transition-transform w-fit"
        >
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {showForm ? 'Annuler' : 'Ajouter un hadith'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm mb-8">
          <h2 className="text-xl font-serif text-primary mb-6">Nouveau hadith</h2>
          <form onSubmit={handleAdd} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface/50 mb-2">
                Texte du hadith
              </label>
              <textarea
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                rows={4}
                className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm 
                           focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface/40 resize-none"
                placeholder="Saisissez le texte du hadith..."
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface/50 mb-2">
                  Référence exacte
                </label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm 
                             focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface/40"
                  placeholder="ex: Al-Bukhari n°13 & Muslim n°45"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface/50 mb-2">
                  Narrateur
                </label>
                <input
                  type="text"
                  value={formData.narrator}
                  onChange={(e) => setFormData({ ...formData, narrator: e.target.value })}
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm 
                             focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface/40"
                  placeholder="ex: Abu Hurayra (رضي الله عنه)"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 rounded-full text-sm font-bold text-on-surface/60 
                           hover:bg-surface-container transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 bg-primary text-white rounded-full font-bold shadow-md 
                           hover:opacity-90 transition-all active:scale-95"
              >
                Ajouter
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Hadiths List */}
      <div className="space-y-4">
        {hadiths.map((hadith) => (
          <div
            key={hadith.id}
            className={`bg-surface-container-lowest rounded-3xl p-6 shadow-sm transition-opacity ${
              !hadith.is_active ? 'opacity-50' : ''
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <blockquote className="text-base text-on-surface leading-relaxed mb-3">
                  &laquo; {hadith.text} &raquo;
                </blockquote>
                <div className="flex items-center gap-3 text-sm text-on-surface/60">
                  <span>{hadith.narrator}</span>
                  <span className="text-outline-variant">•</span>
                  <span className="text-primary font-medium">{hadith.source}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Toggle Active */}
                <button
                  onClick={() => toggleActive(hadith.id)}
                  className={`w-12 h-7 rounded-full flex items-center px-1 transition-colors ${
                    hadith.is_active ? 'bg-primary' : 'bg-surface-container-high'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                      hadith.is_active ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-xs font-bold text-on-surface/50">
                  {hadith.is_active ? 'Actif' : 'Masqué'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
