import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Noto_Serif, Inter, Manrope } from 'next/font/google';
import { headers } from 'next/headers';
import '../globals.css';
import { locales } from '@/i18n/locales';

// ============================================================
// Configuration des polices
// ============================================================

// Noto Serif - Pour les titres et éléments spirituels
const notoSerif = Noto_Serif({
  subsets: ['latin', 'arabic'],
  variable: '--font-noto-serif',
  display: 'swap',
  weight: ['400', '700'],
});

// Inter - Pour le body en light mode
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Manrope - Alternative pour le body (dark mode)
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

// ============================================================
// Génération des routes statiques pour chaque locale
// ============================================================
export function generateStaticParams() {
  return Object.keys(locales).map((locale) => ({ locale }));
}

// ============================================================
// Metadata dynamique
// ============================================================
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale });

  return {
    title: {
      default: t('common.siteName'),
      template: `%s | ${t('common.siteName')}`,
    },
    description: t('common.tagline'),
  };
}

// ============================================================
// Root Layout
// ============================================================
export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  const headersList = await headers();
  
  // Détection RTL pour l'arabe
  const isRTL = locale === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body
        className={`${notoSerif.variable} ${inter.variable} ${manrope.variable} font-sans`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
