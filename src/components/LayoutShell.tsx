'use client';

// ─── Layout shell principal ─────────────────────────────────────────────────
// Wrapper minimal qui ajuste l'affichage en fonction de la route active.
// Cache le footer et le layout "page" par défaut pour les pages d'admin.

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="pt-20">{children}</main>
      <Footer />
    </>
  );
}
