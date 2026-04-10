import { createNavigation } from 'next-intl/navigation';

export const locales = ['fr', 'ar'] as const;
export const defaultLocale = 'fr' as const;
export const localePrefix = 'always' as const;

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation({ locales, defaultLocale, localePrefix });
