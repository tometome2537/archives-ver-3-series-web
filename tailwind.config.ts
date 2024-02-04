import type { Config } from "tailwindcss";

const config: Config = {
  mode: "jit",
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.html",
  ],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      spacing: {
        84: "21rem",
        88: "22rem",
        92: "23rem",
        112: "28rem",
        128: "32rem",
        192: "48rem",
        256: "64rem",
      },
      colors: {
        primary: {
          "50": "#f0fdf4",
          "100": "#dcfce7",
          "200": "#bcf6cf",
          "300": "#87eeab",
          "400": "#4cdc7f",
          "500": "#24c35d",
          "600": "#18a149",
          "700": "#167c3b",
          "800": "#176433",
          "900": "#15522c",
          "950": "#062d16",
          default: "#167c3b",
        },
        secondary: {
          "50": "#f3f6f3",
          "100": "#e4e8e3",
          "200": "#cad2c8",
          "300": "#a4b2a3",
          "400": "#7b8d7a",
          "500": "#516351",
          "600": "#455646",
          "700": "#374538",
          "800": "#2d382e",
          "900": "#262e27",
          "950": "#151915",
        },
      },
      tertiary: {
        "50": "#f2f9f9",
        "100": "#deefef",
        "200": "#c0e0e1",
        "300": "#94c8cc",
        "400": "#61aaaf",
        "500": "#468e94",
        "600": "#3d757d",
        "700": "#39656d",
        "800": "#335157",
        "900": "#2e454b",
        "950": "#1b2c31",
      },
      error: {
        "50": "#fef2f2",
        "100": "#fee2e2",
        "200": "#ffc9c9",
        "300": "#fda4a4",
        "400": "#fa6f6f",
        "500": "#f14242",
        "600": "#de2424",
        "700": "#ba1a1a",
        "800": "#9b1919",
        "900": "#801c1c",
        "950": "#460909",
      },
    },
  },
  states: {
    on: true,
    current: true,
  },
  plugins: [require("tailwindcss-state")],
};
export default config;
