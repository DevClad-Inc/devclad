/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // light palette
        white: '#FFFFFF',
        snow: '#FFFCFA',
        linen: '#FFF1E5',
        almond: '#FFE9D6',
        beauBlue: '#D6EBFF',
        mistyRose: '#F3DDDD',
        honeyDew: '#DDF3E4',
        gyCrayola: '#FEF2A4',
        black: '#000000',
        neon: '#FFF8E7',
        // dark palette
        darkBG: '#08090C',
        darkBG2: '#030405',
        raisinBlack: '#191B24',
        raisinBlack2: '#222430',
        oxfordBlue: '#002A52',
        bloodRed: '#660C00',
        phthaloGreen: '#113123',
        saffron: '#F0C000',
      },
      fontFamily: {
        mono: ['IBM Plex Mono', 'monospace'],
        system: ['system-ui', 'sans-serif'],
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        'spin-slow': 'spin 10s linear',
      },
    },
  },
  plugins: ['@tailwindcss/forms'],
};
