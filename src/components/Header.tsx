'use client';

import { useState } from 'react';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Actualités', href: '/actualites' },
  { label: 'Activités', href: '/activites' },
  { label: 'Islam', href: '/documentation' },
  { label: 'Infos pratiques', href: '/infos' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo & Branding */}
        <a href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 overflow-hidden">
            <Image
              src="/logo.png"
              alt="Mosquée Bilal"
              width={40}
              height={40}
              className="object-cover [data-theme='dark']:invert"
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold font-serif text-primary leading-none">
              Mosquée Bilal
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-on-surface/50 font-medium mt-1">
              Foi, fraternité, proximité
            </p>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-on-surface/70 hover:text-primary transition-colors py-2"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Search - Desktop */}
          <div className="relative hidden sm:block">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/40"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher..."
              className="bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-xs 
                         focus:ring-2 focus:ring-primary/20 w-48 transition-all 
                         placeholder:text-on-surface/40"
            />
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Connexion Button */}
          <a
            href="/admin"
            className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-sm font-bold 
                       shadow-md hover:opacity-90 transition-all active:scale-95"
          >
            Accès réservé
          </a>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center text-on-surface"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-container-lowest border-t border-outline-variant/10 animate-slide-up">
          <nav className="px-4 py-4 space-y-1">
            {/* Mobile Search */}
            <div className="relative sm:hidden mb-3">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/40"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full bg-surface-container-low border-none rounded-full py-2.5 pl-10 pr-4 text-xs 
                           focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface/40"
              />
            </div>

            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-sm font-medium text-on-surface/80 hover:text-primary 
                           hover:bg-primary/5 rounded-xl transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
