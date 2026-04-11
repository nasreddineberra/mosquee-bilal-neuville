import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight, Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function HeroSection() {
  const t = useTranslations();

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
      {/* Main Hero Image */}
      <div className="lg:col-span-2 relative h-[320px] rounded-[2.5rem] overflow-hidden shadow-lg group">
        {/* Background Image - Placeholder architectural mosque */}
        <Image
          src="https://images.unsplash.com/photo-1541414109671-3e96c6f9294d?q=80&w=2070&auto=format&fit=crop"
          alt="Mosquée Bilal - Intérieur architectural"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
        
        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full max-w-2xl">
          <span className="bg-tertiary/20 backdrop-blur-md text-tertiary-fixed-dim px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-4 inline-block">
            {t('common.salam').toUpperCase()}
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-white leading-tight mb-3">
            {t('home.welcomeTitle', { defaultValue: 'Bienvenue à la Mosquée Bilal' })}
          </h2>
          <p className="text-white/80 text-sm md:text-base font-light leading-relaxed max-w-md">
            {t('home.welcomeDesc', { defaultValue: 'Un sanctuaire de sérénité, de savoir et de fraternité au cœur de Neuville-en-Ferrain.' })}
          </p>
        </div>
      </div>

      {/* Next Prayer Widget */}
      <div className="bg-primary rounded-[2.5rem] p-8 flex flex-col justify-between text-white shadow-xl">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-primary-fixed-dim/80 uppercase tracking-widest">
              {t('home.nextPrayer')}
            </span>
            <Clock className="w-5 h-5 text-tertiary-fixed-dim" />
          </div>
          <div>
            <h3 className="text-4xl md:text-5xl font-serif text-white tracking-tighter">
              Asr
            </h3>
            <p className="text-primary-fixed-dim mt-1 font-medium">
              {t('prayer.inTime', { time: '1h 42min' })}
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-tertiary-fixed-dim w-[65%] rounded-full shadow-[0_0_8px_rgba(255,182,142,0.5)] transition-all duration-1000"
            />
          </div>
          
          <div className="flex justify-between items-end">
            <p className="text-xs text-primary-fixed-dim/60 leading-relaxed max-w-[150px] italic">
              {t('prayer.quote')}
            </p>
            <span className="text-2xl font-serif text-white">
              16:14
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
