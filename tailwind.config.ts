import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ============================================================
        // Thème dynamique via CSS Variables (Light/Dark mode)
        // Les valeurs sont définies dans src/app/globals.css
        // ============================================================
        primary: 'var(--color-primary)',
        'primary-container': 'var(--color-primary-container)',
        'primary-fixed': 'var(--color-primary-fixed)',
        'primary-fixed-dim': 'var(--color-primary-fixed-dim)',
        'on-primary': 'var(--color-on-primary)',
        'on-primary-container': 'var(--color-on-primary-container)',
        'on-primary-fixed': 'var(--color-on-primary-fixed)',
        secondary: 'var(--color-secondary)',
        'secondary-container': 'var(--color-secondary-container)',
        'secondary-fixed': 'var(--color-secondary-fixed)',
        'secondary-fixed-dim': 'var(--color-secondary-fixed-dim)',
        'on-secondary': 'var(--color-on-secondary)',
        'on-secondary-container': 'var(--color-on-secondary-container)',
        'on-secondary-fixed': 'var(--color-on-secondary-fixed)',
        tertiary: 'var(--color-tertiary)',
        'tertiary-container': 'var(--color-tertiary-container)',
        'tertiary-fixed': 'var(--color-tertiary-fixed)',
        'tertiary-fixed-dim': 'var(--color-tertiary-fixed-dim)',
        'on-tertiary': 'var(--color-on-tertiary)',
        'on-tertiary-container': 'var(--color-on-tertiary-container)',
        'on-tertiary-fixed': 'var(--color-on-tertiary-fixed)',
        background: 'var(--color-background)',
        'on-background': 'var(--color-on-background)',
        surface: 'var(--color-surface)',
        'surface-bright': 'var(--color-surface-bright)',
        'surface-container': 'var(--color-surface-container)',
        'surface-container-low': 'var(--color-surface-container-low)',
        'surface-container-lowest': 'var(--color-surface-container-lowest)',
        'surface-container-high': 'var(--color-surface-container-high)',
        'surface-container-highest': 'var(--color-surface-container-highest)',
        'surface-variant': 'var(--color-surface-variant)',
        'on-surface': 'var(--color-on-surface)',
        'on-surface-variant': 'var(--color-on-surface-variant)',
        'inverse-surface': 'var(--color-inverse-surface)',
        'inverse-on-surface': 'var(--color-inverse-on-surface)',
        'inverse-primary': 'var(--color-inverse-primary)',
        outline: 'var(--color-outline)',
        'outline-variant': 'var(--color-outline-variant)',
        error: 'var(--color-error)',
        'error-container': 'var(--color-error-container)',
        'on-error': 'var(--color-on-error)',
        'on-error-container': 'var(--color-on-error-container)',
      },
      fontFamily: {
        serif: ["var(--font-noto-serif)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        manrope: ["var(--font-manrope)", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["4rem", { lineHeight: "1.1", letterSpacing: "-0.03em" }],
        "display-md": ["3rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-sm": ["2.5rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "headline-lg": ["2rem", { lineHeight: "1.25", letterSpacing: "-0.02em" }],
        "headline-md": ["1.5rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6", letterSpacing: "0" }],
        "body-md": ["1rem", { lineHeight: "1.6", letterSpacing: "0" }],
        "label-lg": ["0.875rem", { lineHeight: "1.5", letterSpacing: "0.05em" }],
        "label-md": ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.05em" }],
        "label-sm": ["0.625rem", { lineHeight: "1.3", letterSpacing: "0.08em" }],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
      boxShadow: {
        ambient: "0px 20px 40px rgba(17, 28, 45, 0.06)",
        "ambient-lg": "0px 24px 48px rgba(6, 14, 32, 0.4)",
        "glass": "0 8px 32px rgba(17, 28, 45, 0.08)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
