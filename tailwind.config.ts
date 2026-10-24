import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--md-primary)',
        'on-primary': 'var(--md-on-primary)',
        'primary-container': 'var(--md-primary-container)',
        'on-primary-container': 'var(--md-on-primary-container)',
        secondary: 'var(--md-secondary)',
        'on-secondary': 'var(--md-on-secondary)',
        'secondary-container': 'var(--md-secondary-container)',
        'on-secondary-container': 'var(--md-on-secondary-container)',
        tertiary: 'var(--md-tertiary)',
        'on-tertiary': 'var(--md-on-tertiary)',
        'tertiary-container': 'var(--md-tertiary-container)',
        'on-tertiary-container': 'var(--md-on-tertiary-container)',
        surface: 'var(--md-surface)',
        'surface-variant': 'var(--md-surface-variant)',
        'on-surface': 'var(--md-on-surface)',
        'on-surface-variant': 'var(--md-on-surface-variant)',
        'surface-container-lowest': 'var(--md-surface-container-lowest)',
        'surface-container-low': 'var(--md-surface-container-low)',
        'surface-container': 'var(--md-surface-container)',
        'surface-container-high': 'var(--md-surface-container-high)',
        'surface-container-highest': 'var(--md-surface-container-highest)',
        outline: 'var(--md-outline)',
        'outline-variant': 'var(--md-outline-variant)',
        error: 'var(--md-error)',
        'on-error': 'var(--md-on-error)',
        'error-container': 'var(--md-error-container)',
        'on-error-container': 'var(--md-on-error-container)',
        'inverse-surface': 'var(--md-inverse-surface)',
        'inverse-on-surface': 'var(--md-inverse-on-surface)',
        'inverse-primary': 'var(--md-inverse-primary)',
      },
      borderRadius: {
        'm3-xs': '4px',
        'm3-sm': '8px',
        'm3-md': '12px',
        'm3-lg': '16px',
        'm3-xl': '28px',
        'm3-full': '9999px',
      },
      boxShadow: {
        'm3-1': 'var(--md-elevation-1)',
        'm3-2': 'var(--md-elevation-2)',
        'm3-3': 'var(--md-elevation-3)',
        'm3-4': 'var(--md-elevation-4)',
      },
      fontFamily: {
        sans: [
          'Roboto',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      keyframes: {
        'm3-in': {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'm3-scrim': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'm3-spin': {
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'm3-in': 'm3-in .22s cubic-bezier(.2,0,0,1)',
        'm3-scrim': 'm3-scrim .18s ease-out',
        'm3-spin': 'm3-spin .9s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
