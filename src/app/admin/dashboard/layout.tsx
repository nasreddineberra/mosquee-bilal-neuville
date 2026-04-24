'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard, FileText, MessageSquare, ChevronDown, ChevronRight,
  BookOpen, HeartHandshake, Users, UserCheck, ClipboardList, LogOut, ExternalLink, ScrollText, Image as ImageIcon, ShieldCheck,
} from 'lucide-react';

type Profile = { nom: string | null; prenom: string | null; role: string };

const ADMIN_ONLY = ['administrateur'] as const;
const EDITEURS = ['administrateur', 'editeur'] as const;
const OBSEQUES = ['administrateur', 'gestionnaire_obseques'] as const;

const menu = [
  {
    type: 'link' as const,
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    type: 'section' as const,
    label: 'Édition',
    key: 'edition',
    items: [
      { label: 'Articles', href: '/admin/dashboard/articles', icon: FileText, roles: EDITEURS },
      { label: 'Hadiths', href: '/admin/dashboard/hadiths', icon: ScrollText, roles: EDITEURS },
      { label: 'Bibliothèque', href: '/admin/dashboard/bibliotheque', icon: ImageIcon, roles: EDITEURS },
      { label: 'Communication', href: '/admin/dashboard/communication', icon: MessageSquare, roles: EDITEURS },
    ],
  },
  {
    type: 'section' as const,
    label: 'Administration',
    key: 'administration',
    items: [
      { label: 'Activités', href: '/admin/dashboard/activites', icon: BookOpen, roles: ADMIN_ONLY },
      { label: 'Inscriptions', href: '/admin/dashboard/inscriptions', icon: ClipboardList, roles: ADMIN_ONLY },
      { label: 'Dons', href: '/admin/dashboard/dons', icon: HeartHandshake, roles: ADMIN_ONLY },
      { label: 'Assurance obsèques', href: '/admin/dashboard/obseques', icon: ShieldCheck, roles: OBSEQUES },
      { label: 'Utilisateurs', href: '/admin/dashboard/utilisateurs', icon: Users, roles: ADMIN_ONLY },
      { label: 'Visiteurs', href: '/admin/dashboard/visiteurs', icon: UserCheck, roles: ADMIN_ONLY },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    edition: pathname.includes('/articles') || pathname.includes('/hadiths') || pathname.includes('/bibliotheque') || pathname.includes('/communication'),
    administration: pathname.includes('/activites') || pathname.includes('/inscriptions') || pathname.includes('/dons') || pathname.includes('/obseques') || pathname.includes('/utilisateurs') || pathname.includes('/visiteurs'),
  });

  useEffect(() => {
    document.title = 'Administration - Mosquée Bilal';
  }, [pathname]);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase.from('profiles').select('nom, prenom, role').eq('id', user.id).single()
      .then(({ data }) => { if (data) setProfile(data); });
  }, [user]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isActive = (href: string) => pathname === href;

  const role = profile?.role ?? '';

  return (
    <div className="min-h-screen bg-background flex">

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-surface-container-lowest border-r border-outline-variant/10 flex flex-col z-50">

        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-outline-variant/10">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0">
            <Image src="/logo.png" alt="Mosquée Bilal" width={36} height={36} className="object-cover logo-invert" />
          </div>
          <div>
            <p className="font-serif font-bold text-primary text-sm leading-none">Mosquée Bilal</p>
            <p className="text-[10px] text-on-surface/40 uppercase tracking-widest mt-0.5">Administration</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">

          {menu.map((item) => {
            if (item.type === 'link') {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary text-on-primary'
                      : 'text-on-surface/65 hover:bg-surface-container hover:text-primary'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </Link>
              );
            }

            if (item.type === 'section') {
              const visibleItems = item.items.filter((i) => (i.roles as readonly string[]).includes(role));
              if (visibleItems.length === 0) return null;
              const isOpen = openSections[item.key];
              const hasActiveChild = visibleItems.some((i) => isActive(i.href));

              return (
                <div key={item.key}>
                  <button
                    onClick={() => toggleSection(item.key)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-colors ${
                      hasActiveChild
                        ? 'text-primary'
                        : 'text-on-surface/40 hover:text-on-surface/65'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isOpen
                      ? <ChevronDown className="w-3.5 h-3.5" />
                      : <ChevronRight className="w-3.5 h-3.5" />
                    }
                  </button>

                  {isOpen && (
                    <div className="ml-3 mt-0.5 space-y-0.5 border-l-2 border-outline-variant/20 pl-3">
                      {visibleItems.map((sub) => {
                        const Icon = sub.icon;
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
                              isActive(sub.href)
                                ? 'bg-primary/10 text-primary font-semibold'
                                : 'text-on-surface/60 hover:bg-surface-container hover:text-primary'
                            }`}
                          >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return null;
          })}
        </nav>

        {/* Footer sidebar */}
        <div className="px-3 py-4 border-t border-outline-variant/10 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-on-surface/50 hover:text-primary hover:bg-surface-container transition-colors"
          >
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
            Retour au site
          </Link>

          {/* User info + logout */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-container mt-1">
            <div className="min-w-0">
              <p className="text-xs font-bold text-on-surface truncate">
                {profile ? `${profile.prenom ?? ''} ${profile.nom ?? ''}`.trim() || user?.email : user?.email}
              </p>
              <p className="text-[10px] text-primary uppercase tracking-wider font-bold">
                {profile?.role ?? '—'}
              </p>
            </div>
            <button
              onClick={logout}
              className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface/40 hover:bg-error/10 hover:text-error transition-colors flex-shrink-0 ml-2"
              aria-label="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 min-h-screen p-8">
        {children}
      </main>
    </div>
  );
}
