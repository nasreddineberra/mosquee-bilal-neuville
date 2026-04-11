'use client';

import { useState, useEffect } from 'react';

const prayerTimes = [
  { name: 'Fajr', time: '05:42' },
  { name: 'Dohr', time: '13:30' },
  { name: 'Asr', time: '16:14' },
  { name: 'Maghrib', time: '19:45' },
  { name: 'Isha', time: '21:15' },
];

function getNextPrayer() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  for (const prayer of prayerTimes) {
    const [h, m] = prayer.time.split(':').map(Number);
    const prayerTimeInMinutes = h * 60 + m;
    if (prayerTimeInMinutes > currentTimeInMinutes) {
      const diff = prayerTimeInMinutes - currentTimeInMinutes;
      const hours = Math.floor(diff / 60);
      const minutes = diff % 60;
      let timeText = '';
      if (hours > 0) timeText += `${hours}h `;
      if (minutes > 0) timeText += `${minutes}min`;
      return { name: prayer.name, time: prayer.time, timeText: timeText.trim() };
    }
  }
  return { name: 'Fajr', time: prayerTimes[0].time, timeText: 'Demain' };
}

export default function HeroSection() {
  const [nextPrayer, setNextPrayer] = useState(getNextPrayer);

  useEffect(() => {
    const interval = setInterval(() => {
      setNextPrayer(getNextPrayer());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* Bento Grid Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grande Image Hero */}
        <div className="lg:col-span-2 relative h-[320px] rounded-[2.5rem] overflow-hidden shadow-sm group">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=1200&auto=format&fit=crop&q=80)',
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 p-10 w-full">
            <span className="bg-tertiary-fixed-dim/20 backdrop-blur-md text-tertiary-fixed-dim px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-4 inline-block">
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
              Sur les pas de Bilal, unis dans la foi, ouverts aux citoyens.
            </p>
          </div>
        </div>

        {/* Prochaine Prière Card */}
        <div className="bg-primary-container rounded-[2.5rem] p-8 flex flex-col justify-between text-on-primary shadow-xl">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-primary-fixed-dim uppercase tracking-widest">
                Prochaine Prière
              </span>
              <svg
                className="w-6 h-6 text-tertiary-fixed-dim"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <h3 className="text-5xl font-serif text-white tracking-tighter">
                {nextPrayer.name}
              </h3>
              <p className="text-primary-fixed-dim mt-1 font-medium">
                Dans {nextPrayer.timeText}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-tertiary-fixed-dim w-[65%] rounded-full"
                style={{ boxShadow: '0 0 8px rgba(255,182,142,0.5)' }}
              />
            </div>
            <div className="flex justify-between items-end">
              <p className="text-xs text-primary-fixed-dim/60 leading-relaxed max-w-[150px]">
                &quot;La prière est la clé du paradis.&quot;
              </p>
              <span className="text-2xl font-serif text-white">{nextPrayer.time}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        {/* Annonces */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-fixed/30 flex items-center justify-center text-primary">
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-on-surface/40 uppercase tracking-wider">
                Annonces
              </h4>
              <p className="text-xl font-serif text-primary">04 Nouvelles</p>
            </div>
          </div>
        </div>

        {/* Conférence */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed/30 flex items-center justify-center text-tertiary">
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-on-surface/40 uppercase tracking-wider">
                Conférence
              </h4>
              <p className="text-xl font-serif text-primary">Dans 2 jours</p>
            </div>
          </div>
        </div>

        {/* Communauté */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-fixed/30 flex items-center justify-center text-primary">
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-on-surface/40 uppercase tracking-wider">
                Communauté
              </h4>
              <p className="text-xl font-serif text-primary">320 Inscrits</p>
            </div>
          </div>
        </div>

        {/* Faire un Don */}
        <a
          href="#"
          className="group relative overflow-hidden bg-gradient-to-br from-primary to-primary-container p-6 rounded-3xl shadow-lg transition-transform active:scale-95"
        >
          <div className="relative z-10 flex flex-col h-full justify-between">
            <svg
              className="w-8 h-8 text-white/50 self-end"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <div>
              <h4 className="text-white font-serif text-xl">Soutenir le projet</h4>
              <p className="text-primary-fixed-dim text-xs mt-1">Faire un Don en ligne</p>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
        </a>
      </div>
    </section>
  );
}
