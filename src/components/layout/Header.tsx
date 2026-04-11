'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, Bell, LogIn, Moon, Sun, Globe } from 'lucide-react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme, mounted } = useTheme();

  const navLinks = [
    { href: `/${locale}`, label: 'Accueil' },
    { href: `/${locale}/actualites`, label: 'Actualités' },
    { href: `/${locale}/activites`, label: 'Activités' },
    { href: `/${locale}/documentation`, label: 'Islam' },
    { href: `/${locale}/info-pratiques`, label: 'Infos' },
    { href: `/${locale}/contact`, label: 'Contact' },
  ];

  const handleLangSwitch = () => {
    const newLocale = locale === 'fr' ? 'ar' : 'fr';
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* Logo & Branding */}
        <Link href={`/${locale}`} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-lg transition-transform group-hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-1.07 3.97-2.9 5.4z" />
            </svg>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold font-serif text-primary leading-none">Mosquée Bilal</h1>
            <p className="text-[10px] uppercase tracking-widest text-on-surface/50 font-medium mt-1">The Living Sanctuary</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors relative py-2 ${
                pathname === link.href
                  ? 'text-primary after:content-[""] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-primary after:rounded-full'
                  : 'text-on-surface/70 hover:text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden sm:block group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/40 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-xs w-48 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-on-surface/40"
            />
          </div>

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface/60 hover:text-primary hover:bg-surface-container transition-all"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          )}

          {/* Language Switch */}
          <button
            onClick={handleLangSwitch}
            className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface/60 hover:text-primary hover:bg-surface-container transition-all"
            title={`Passer en ${locale === 'fr' ? 'arabe' : 'français'}`}
          >
            <Globe className="w-5 h-5" />
          </button>

          {/* Connexion Button */}
          <Link
            href={`/${locale}/admin/login`}
            className="hidden sm:flex bg-primary text-on-primary px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-primary/90 transition-all active:scale-95 items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            Connexion
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-on-surface hover:text-primary"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface border-t border-primary/10 animate-slide-down">
          <nav className="flex flex-col p-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium text-on-surface/80 hover:text-primary py-2"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={`/${locale}/admin/login`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-primary text-on-primary px-6 py-3 rounded-full text-sm font-bold shadow-md text-center flex items-center justify-center gap-2 mt-2"
            >
              <LogIn className="w-4 h-4" />
              Connexion
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
