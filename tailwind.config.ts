import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#EDF5F2', 100: '#D7E9E3', 500: '#28655D', 600: '#20554E', 700: '#183C3C', 800: '#102E30' },
        secondary: { 50: '#F9F2E8', 100: '#F1E3CF', 500: '#A45C3A', 600: '#87482D', 700: '#6C3823' },
        neutral: { 50: '#FAFAF8', 100: '#F4F3EF', 200: '#E5E3DC', 300: '#D2D0C8', 500: '#78766F', 700: '#44443F', 900: '#252522' },
        success: { 50: '#ECF7F0', 500: '#287A55', 700: '#1D5A3E' },
        warning: { 50: '#FFF6E5', 500: '#AE7214', 700: '#7C4D06' },
      },
      fontFamily: { display: ['Fraunces', 'Georgia', 'serif'], sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      spacing: { 18: '4.5rem', 22: '5.5rem', 30: '7.5rem' },
      borderRadius: { 'card': '1rem', 'control': '0.625rem' },
      boxShadow: { card: '0 4px 18px rgba(37, 37, 34, 0.08)', 'card-hover': '0 10px 28px rgba(37, 37, 34, 0.12)' },
    },
  },
  plugins: [],
} satisfies Config
