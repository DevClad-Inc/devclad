/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    fontSize: {
      xxs: [".625rem", { lineHeight: "0.75rem" }],
      xs: ["0.75rem", { lineHeight: "1rem" }],
      sm: ["0.875rem", { lineHeight: "1.5rem" }],
      base: ["1rem", { lineHeight: "1.5rem" }],
      lg: ["1.125rem", { lineHeight: "2rem" }],
      xl: ["1.25rem", { lineHeight: "1.75rem" }],
      "2xl": ["1.5rem", { lineHeight: "2rem" }],
      "3xl": ["2rem", { lineHeight: "3rem" }],
      "4xl": ["2.5rem", { lineHeight: "3rem" }],
      "5xl": ["3rem", { lineHeight: "1" }],
      "6xl": ["3.75rem", { lineHeight: "1" }],
      "7xl": ["4.5rem", { lineHeight: "1" }],
      "8xl": ["6rem", { lineHeight: "1" }],
      "9xl": ["8rem", { lineHeight: "1" }],
      "10xl": ["10rem", { lineHeight: "1" }],
    },
    extend: {
      colors: {
        // light palette
        white: "#ffffff",
        snow: "#FFFCFA",
        linen: "#FFF1E5",
        almond: "#ffffe3",
        beauBlue: "#D6EBFF",
        mistyRose: "#F3DDDD",
        honeyDew: "#DDF3E4",
        gyCrayola: "#FEF6C2",
        bistreBrown: "#946800",
        black: "#000000",
        neon: "#FFF8E7",
        // dark palette
        darkBG: "#0d0d0d",
        darkBG2: "#010203",
        raisinBlack: "#161618",
        raisinBlack2: "#27272a",
        oxfordBlue: "#002A52",
        bloodRed: "#660C00",
        bloodRed2: "#3D0700",
        phthaloGreen: "#113123",
        saffron: "#F0C000",
        blackChocolate: "#241B00",
      },
      fontFamily: {
        mono: ['"JetBrainsMono-Variable"'],
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        gradient: {
          "0%, 100%": { color: "#fab296", backgroundPosition: "0% 50%" },
          "25%": { color: "#45caff", backgroundPosition: "100% 25%" },
          "75%": { color: "#ffffff", backgroundPosition: "0% 50%" },
        },
        darkglowbutton: {
          "0%": {
            boxShadow: "0 0 0 2px #3a015c",
          },
          "25%": {
            boxShadow: "0 0 0 2x #280000",
          },
          "50%": {
            boxShadow: "0 0 0 1px #651673",
          },
          "75%": {
            boxShadow: "0 0 0 2px #35012c",
          },
          "100%": { boxShadow: "0 0 0 1px #3a015c" },
        },
        dropglow: {
          "0%": {
            boxShadow: "0 10px 20px 5px #341600",
          },
          "25%": {
            boxShadow: "0 10px 20px 5px #083249",
          },
          "50%": {
            boxShadow: "0 10px 20px 5px #05f5cd",
          },
          "75%": {
            boxShadow: "0 10px 20px 5px #170019",
          },
          "100%": { boxShadow: "0 10px 20px 5px #341600" },
        },
        dropglowSM: {
          "0%": {
            boxShadow: "0 5px 10px 5px #341600",
          },
          "25%": {
            boxShadow: "0 5px 20px 5px #083249",
          },
          "50%": {
            boxShadow: "0 5px 10px 5px #05f5cd",
          },
          "75%": {
            boxShadow: "0 5px 10px 5px #170019",
          },
          "100%": { boxShadow: "0 5px 10px 5px #341600" },
        },
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(50px, -30px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        fadeIn: "fadeIn 1.5s ease-in forwards",
        gradient: "gradient 10s ease-out infinite",
        "gradient-reverse": "gradient 10s ease infinite reverse",
        "spin-slow": "spin 10s linear",
        "pulse-slow": "pulse 10s linear infinite",
        dropglow: "dropglow 10s ease-out infinite",
        dropglowSM: "dropglowSM 10s ease-out infinite",
        darkglowbtn: "darkglowbutton 20s ease-out infinite",
        blob: "blob 7s infinite",
      },
    },
  },
  plugins: [
    "@tailwindcss/forms",
    "@tailwindcss/aspect-ratio",
    plugin(function ({ addBase, theme }) {
      addBase({
        body: {
          color: theme("colors.white"),
          backgroundColor: theme("colors.black"),
        },
      });
    }),
    plugin(({ addBase, theme }) => {
      addBase({
        ".scrollbar": {
          overflowY: "auto",
          scrollbarWidth: "thin",
        },
        ".scrollbar::-webkit-scrollbar": {
          height: "6px",
          width: "6px",
        },
        ".scrollbar::-webkit-scrollbar-thumb": {
          backgroundColor: theme("colors.white"),
        },
      });
    }),
  ],
};
