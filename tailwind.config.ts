import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        yt: {
          bg: 'var(--yt-bg)',
          elevated: 'var(--yt-elevated)',
          text: 'var(--yt-text)',
          secondary: 'var(--yt-secondary)',
          border: 'var(--yt-border)',
          hover: 'var(--yt-hover)',
          chip: 'var(--yt-chip)',
          'chip-active': 'var(--yt-chip-active)',
          'chip-active-text': 'var(--yt-chip-active-text)',
          red: 'var(--yt-red)',
          blue: 'var(--yt-blue)',
          search: 'var(--yt-search)',
          skeleton: 'var(--yt-skeleton)',
        },
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
    },
  },
  plugins: [],
}

export default config
