export const locales = {
  fr: {
    nativeName: "Français",
    dir: "ltr",
    locale: "fr-FR"
  },
  ar: {
    nativeName: "العربية",
    dir: "rtl",
    locale: "ar-SA"
  }
} as const;

export type Locale = keyof typeof locales;
