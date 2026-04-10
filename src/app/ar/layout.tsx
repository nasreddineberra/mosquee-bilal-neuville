import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Noto_Serif, Inter, Manrope } from 'next/font/google';
import '../globals.css';

const notoSerif = Noto_Serif({
  subsets: ['latin', 'arabic'],
  variable: '--font-noto-serif',
  display: 'swap',
  weight: ['400', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export default async function ArabicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  setRequestLocale('ar');
  const messages = await getMessages();

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${notoSerif.variable} ${inter.variable} ${manrope.variable} font-sans`}>
        <NextIntlClientProvider messages={messages} locale="ar">
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
