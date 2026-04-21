'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import ProfileModal from './ProfileModal';
import { createClient } from '@/lib/supabase/client';

const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Actualités', href: '/actualites' },
  { label: 'Activités', href: '/activites' },
  { label: 'Islam', href: '/documentation' },
  { label: 'Dons', href: '/don' },
  { label: 'Contact', href: '/infos' },
];

type Profile = { prenom: string | null; nom: string | null; role: string };

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    const loadProfile = async (userId: string | undefined) => {
      if (!userId) { setProfile(null); return; }
      const { data } = await supabase.from('profiles').select('prenom, nom, role').eq('id', userId).single();
      if (data) setProfile(data as Profile);
    };
    supabase.auth.getSession().then(({ data }) => loadProfile(data.session?.user.id));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => loadProfile(session?.user.id));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [menuOpen]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setMenuOpen(false);
    window.location.href = '/';
  };

  const displayName = profile ? [profile.prenom, profile.nom].filter(Boolean).join(' ') || 'Utilisateur' : '';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo & Branding */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-16 h-16 overflow-hidden flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Mosquée Bilal"
              width={64}
              height={64}
              loading="eager"
              className="object-cover logo-invert"
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold font-serif text-primary leading-none">
              Mosquée Bilal
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-on-surface/50 font-medium mt-1 lg:block hidden">
              Foi, fraternité, proximité
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-on-surface/70 hover:text-primary transition-colors py-2"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Connexion / Profil */}
          {profile ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="btn-admin-link bg-primary text-on-primary pl-3 pr-4 py-2 rounded-full text-sm font-bold text-center shadow-md transition-all active:scale-95 whitespace-nowrap flex items-center gap-2"
              >
                <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <UserIcon className="w-4 h-4" />
                </span>
                <span className="hidden sm:inline max-w-[10rem] truncate">{displayName}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/20 overflow-hidden">
                  <div className="px-4 py-3 border-b border-outline-variant/10">
                    <p className="text-sm font-bold text-on-surface truncate">{displayName}</p>
                    <p className="text-xs text-on-surface/50 capitalize">{profile.role}</p>
                  </div>
                  <button
                    onClick={() => { setMenuOpen(false); setProfileOpen(true); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    <UserIcon className="w-4 h-4" />
                    Mon profil
                  </button>
                  {profile.role === 'administrateur' || profile.role === 'editeur' ? (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                    >
                      <UserIcon className="w-4 h-4" />
                      Administration
                    </Link>
                  ) : null}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors border-t border-outline-variant/10"
                  >
                    <LogOut className="w-4 h-4" />
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/admin"
              className="btn-admin-link bg-primary text-on-primary px-6 py-2.5 rounded-full text-sm font-bold text-center shadow-md transition-all active:scale-95 whitespace-nowrap"
            >
              Accès réservé
            </Link>
          )}

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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-sm font-medium text-on-surface/80 hover:text-primary
                           hover:bg-primary/5 rounded-xl transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </header>
  );
}
