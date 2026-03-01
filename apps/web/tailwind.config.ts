import type { Config } from 'tailwindcss'

export default <Config>{
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx,html}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCF8',
          100: '#FAF9F0',
          200: '#F5F3E0',
        },
        forest: {
          DEFAULT: '#2D4F1E',
          50: '#4A6B3A',
          100: '#3D5A30',
          200: '#2D4F1E',
          300: '#1F3A14',
        },
        earth: {
          DEFAULT: '#C4703A',
          50: '#E8A882',
          100: '#D9956A',
          200: '#C4703A',
          300: '#9E5628',
        },
      },
      fontFamily: {
        serif: ['Libre Baskerville', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
