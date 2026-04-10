import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h1 className="text-5xl font-serif mb-4">
          {t('common.siteName')}
        </h1>
        <p className="text-xl mb-8">
          {t('common.tagline')}
        </p>
        <div className="p-6 bg-surface-container-lowest rounded-2xl">
          <p className="text-lg">
            {t('common.welcome')} - {t('common.salam')}
          </p>
        </div>
      </div>
    </div>
  );
}
