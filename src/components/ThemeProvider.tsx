'use client';

import { useSyncExternalStore, useCallback, createContext, useContext } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

/* ------------------------------------------------------------------ */
/*  Le DOM (data-theme) est la source de vérité unique                */
/*  Le script beforeInteractive le pose avant React                   */
/*  useSyncExternalStore le lit de façon synchrone = pas de flash     */
/* ------------------------------------------------------------------ */
function getThemeFromDOM(): Theme {
  return (document.documentElement.getAttribute('data-theme') as Theme) || 'light';
}

const subscribe = (cb: () => void) => {
  const observer = new MutationObserver(cb);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
};

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useSyncExternalStore(subscribe, getThemeFromDOM, () => 'light' as Theme);

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
