'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { locales } from '@/i18n/locales';

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    // Construire le nouveau chemin avec la nouvelle locale
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`) || '/';
    router.push(newPathname);
  };

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-primary hover:bg-surface-container transition-all"
        aria-label="Changer de langue"
      >
        <span className="material-symbols-outlined text-lg">translate</span>
        <span className="hidden sm:inline">
          {locales[locale as keyof typeof locales]?.nativeName || 'FR'}
        </span>
      </button>
      
      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-40 bg-surface-container-lowest rounded-xl shadow-glass border border-outline-variant/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-1">
          {Object.entries(locales).map(([code, lang]) => (
            <button
              key={code}
              onClick={() => handleLocaleChange(code)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                locale === code
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="font-medium">{lang.nativeName}</span>
              <span className="ml-2 text-xs opacity-60">
                {code === 'fr' ? '(Français)' : '(العربية)'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
