import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        ink: 'var(--color-ink)',
        paper: 'var(--color-paper)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          strong: 'var(--color-surface-strong)',
        },
        muted: 'var(--color-muted)',
        border: 'var(--color-border)',
        mint: 'var(--color-mint)',
        peach: 'var(--color-peach)',
        lavender: 'var(--color-lavender)',
      },
      fontFamily: {
        display: ['EB Garamond', 'Times New Roman', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        pill: '9999px',
        xxl: '24px',
        xl: '16px',
      },
      boxShadow: {
        soft: '0 4px 16px rgba(0, 0, 0, 0.04)',
        elevated: '0 8px 32px rgba(0, 0, 0, 0.10)',
      },
      maxWidth: {
        '7xl': '80rem',
        container: '1200px',
      },
    },
  },
  plugins: [],
} satisfies Config;
