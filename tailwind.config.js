const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  important: true,
  content: ["pages/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1360px",
      },
    },
    extend: {
      backgroundImage: (theme) => ({
        grad: "linear-gradient(76.03deg, rgba(10, 117, 255, 0) 0%, rgba(255, 117, 255, 0.5) 19.01%, rgba(120, 117, 255, 0) 45.83%, rgba(120, 117, 255, 0.4) 73.44%, rgba(120, 117, 255, 0.25) 100%)",
        "grad-yellow-green":
          "linear-gradient(263.08deg, #75E0A2 0%, rgba(117, 224, 162, 0.25) 21.88%, rgba(117, 224, 162, 0.9) 42.71%, rgba(244, 248, 92, 0.3) 65.1%, rgba(244, 248, 92, 0.9) 84.38%, rgba(244, 248, 92, 0.25) 100%)",
        grad2:
          "linear-gradient(76.03deg, rgba(120, 117, 255, 0) 0%, rgba(120, 117, 255, 0.5) 19.01%, rgba(120, 117, 255, 0) 45.83%, rgba(120, 117, 255, 0.4) 73.44%, rgba(120, 117, 255, 0.25) 100%)",
        "grad-blue-green":
          "linear-gradient(253.54deg, #59F7C8 0%, rgba(94, 233, 202, 0.5) 17.71%, rgba(99, 220, 204, 0.9) 34.37%, rgba(105, 200, 207, 0.3) 51.04%, rgba(112, 182, 209, 0.6) 68.23%, rgba(116, 170, 211, 0.3) 84.9%, rgba(120, 158, 213, 0) 91.67%, rgba(125, 144, 215, 0.75) 100%)",
        "gradient-conic": "conic-gradient(var(--tw-gradient-stops))",
      }),
      boxShadow: {
        input:
          "0px 1px 0px -1px var(--tw-shadow-color), 0px 1px 1px -1px var(--tw-shadow-color), 0px 1px 2px -1px var(--tw-shadow-color), 0px 2px 4px -2px var(--tw-shadow-color), 0px 3px 6px -3px var(--tw-shadow-color)",
        highlight:
          "inset 0px 0px 0px 1px var(--tw-shadow-color), inset 0px 1px 0px var(--tw-shadow-color)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        aboreto: ["var(--font-aboreto)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      colors: {
        neutral: {
          750: "#313131",
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("windy-radix-palette"),
    require("tailwindcss-animate"),
    require("@tailwindcss/forms"),
  ],
  presets: [require("windy-radix-palette")],
}
