'use client';

import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Initialiser le thème au montage
  useEffect(() => {
    setMounted(true);
    
    // Vérifier localStorage en premier
    const savedTheme = localStorage.getItem('mosquee-bilal-theme') as Theme | null;
    
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Par défaut: light mode
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  // Fonction pour basculer le thème
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      
      // Sauvegarder dans localStorage
      localStorage.setItem('mosquee-bilal-theme', newTheme);
      
      // Appliquer au DOM
      document.documentElement.setAttribute('data-theme', newTheme);
      
      return newTheme;
    });
  }, []);

  // Fonction pour définir un thème spécifique
  const setThemeValue = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('mosquee-bilal-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }, []);

  return {
    theme,
    mounted,
    toggleTheme,
    setTheme: setThemeValue,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
}
