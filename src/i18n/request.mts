import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Liste des locales supportés
const supportedLocales = ['fr', 'ar'];

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !supportedLocales.includes(locale as any)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
