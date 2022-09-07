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
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.5rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '2rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['2rem', { lineHeight: '3rem' }],
      '4xl': ['2.5rem', { lineHeight: '3rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
    },
    extend: {
      colors: {
        // light palette
        whitewhite: '#ffffff',
        white: '#ffffe3',
        snow: '#FFFCFA',
        linen: '#FFF1E5',
        almond: '#ffffe3',
        beauBlue: '#D6EBFF',
        mistyRose: '#F3DDDD',
        honeyDew: '#DDF3E4',
        gyCrayola: '#FEF6C2',
        bistreBrown: '#946800',
        black: '#000000',
        neon: '#FFF8E7',
        // dark palette
        darkBG: '#030405',
        darkBG2: '#101218',
        raisinBlack: '#191B45',
        raisinBlack2: '#222435',
        oxfordBlue: '#002A52',
        bloodRed: '#660C00',
        phthaloGreen: '#113123',
        saffron: '#F0C000',
        blackChocolate: '#241B00',
      },
      fontFamily: {
        mono: ['IBM Plex Mono', 'monospace'],
        system: ['system-ui', 'sans-serif'],
        sans: [...defaultTheme.fontFamily.sans],
        display: ['"ClashDisplay-Variable"'],
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
