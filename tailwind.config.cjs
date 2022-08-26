/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');

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
      keyframes: {
        darkglow: {
          '0%': {
            boxShadow: '0 0 0 1px #3a015c',
          },
          '25%': {
            boxShadow: '0 0 0 1px #35012c',
          },
          '50%': {
            boxShadow: '0 0 0 1px #290025',
          },
          '75%': {
            boxShadow: '0 0 0 1px #280000',
          },
          '100%': { boxShadow: '0 0 0 1px #3a015c' },
        },
      },
      animation: {
        'spin-slow': 'spin 10s linear',
        'pulse-slow': 'pulse 10s linear infinite',
        darkglow: 'darkglow 5s ease-out infinite',
      },
    },
  },
  plugins: ['@tailwindcss/forms',
  // add scrollbar color
    plugin(({ addBase, theme }) => {
      addBase({
        '.scrollbar': {
          overflowY: 'auto',
          // if dark mode is enabled, use the dark scrollbar color
          scrollbarWidth: 'thin',
        },
        '.scrollbar::-webkit-scrollbar': {
          height: '6px',
          width: '6px',
        },
        '.scrollbar::-webkit-scrollbar-thumb': {
          backgroundColor: theme('colors.fuchsia.900'),
        },
      });
    }),
  ],
};
