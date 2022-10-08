/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    fontSize: {
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
        monoItalic: ['"JetBrainsMono-VariableItalic"'],
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
        display: ['"Quilon-Variable"'],
      },
      keyframes: {
        // gradient text animation from #F0C000 to #660C00
        gradient: {
          "0%, 100%": { color: "#fab296", backgroundPosition: "0% 50%" },
          "25%": { color: "#45caff", backgroundPosition: "100% 25%" },
          "75%": { color: "#aafa96", backgroundPosition: "0% 50%" },
        },
        darkglow: {
          "0%": {
            boxShadow: "0 0 0 3px #3a015c",
          },
          "25%": {
            boxShadow: "0 0 0 3px #280000",
          },
          "50%": {
            boxShadow: "0 0 0 3px #290025",
          },
          "75%": {
            boxShadow: "0 0 0 3px #35012c",
          },
          "100%": { boxShadow: "0 0 0 3px #3a015c" },
        },
        darkglowbutton: {
          "0%": {
            boxShadow: "0 0 0 1px #3a015c",
          },
          "25%": {
            boxShadow: "0 0 0 1px #280000",
          },
          "50%": {
            boxShadow: "0 0 0 1px #651673",
          },
          "75%": {
            boxShadow: "0 0 0 1px #35012c",
          },
          "100%": { boxShadow: "0 0 0 1px #3a015c" },
        },
        dropdarkglow: {
          "0%": {
            boxShadow: "0 10px 20px 5px #3a015c",
          },
          "25%": {
            boxShadow: "0 10px 20px 5px #35012c",
          },
          "50%": {
            boxShadow: "0 10px 20px 5px #651673",
          },
          "75%": {
            boxShadow: "0 10px 20px 5px #280000",
          },
          "100%": { boxShadow: "0 10px 20px 5px #3a015c" },
        },
      },
      animation: {
        gradient: "gradient 10s ease-out infinite",
        "gradient-reverse": "gradient 10s ease infinite reverse",
        "spin-slow": "spin 10s linear",
        "pulse-slow": "pulse 10s linear infinite",
        darkglow: "darkglow 5s ease-out infinite",
        dropdarkglow: "dropdarkglow 10s ease-out infinite",
        darkglowbtn: "darkglowbutton 20s ease-out infinite",
      },
    },
  },
  plugins: [
    "@tailwindcss/forms",
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