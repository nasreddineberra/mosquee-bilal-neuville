'use client';

import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  // Éviter le mismatch SSR/CSR
  if (!mounted) {
    return (
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center text-surface-600 hover:text-primary transition-colors"
        aria-label="Changer le thème"
        disabled
      >
        <span className="material-symbols-outlined">light_mode</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:text-primary transition-all duration-300 hover:bg-surface-container"
      aria-label={`Passer en mode ${theme === 'light' ? 'sombre' : 'clair'}`}
      title={`Passer en mode ${theme === 'light' ? 'sombre' : 'clair'}`}
    >
      <span className="material-symbols-outlined text-xl">
        {theme === 'light' ? 'dark_mode' : 'light_mode'}
      </span>
    </button>
  );
}
