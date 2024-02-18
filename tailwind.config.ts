import type { Config } from "tailwindcss";

const config: Config = {
  mode: process.env.NODE_ENV ? "jit" : undefined,
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
        38: "9.5rem" /* 152px */,
        62: "15.5rem" /* 248px */,
        84: "21rem" /* 336px */,
        88: "22rem" /* 352px */,
        92: "23rem" /* 368px */,
        112: "28rem" /* 448px */,
        128: "32rem" /* 512px */,
        192: "48rem" /* 768px */,
        256: "64rem" /* 1024px */,
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
          "50": "#f5f3ff",
          "100": "#ede9fe",
          "200": "#ddd7fd",
          "300": "#c6b6fc",
          "400": "#a98df8",
          "500": "#8d5ff3",
          "600": "#7f3dea",
          "700": "#702bd6",
          "800": "#5d24b3",
          "900": "#4d1f93",
          "950": "#3b167c",
          default: "#702bd6",
        },
        // tertiary: {
        //   "50": "#f2f9f9",
        //   "100": "#deefef",
        //   "200": "#c0e0e1",
        //   "300": "#94c8cc",
        //   "400": "#61aaaf",
        //   "500": "#468e94",
        //   "600": "#3d757d",
        //   "700": "#39656d",
        //   "800": "#335157",
        //   "900": "#2e454b",
        //   "950": "#1b2c31",
        //   default: "#39656d",
        // },
        tertiary: {
          "50": "#fefaec",
          "100": "#fbf1ca",
          "200": "#f7e290",
          "300": "#f3ce56",
          "400": "#f0ba2f",
          "500": "#e99b17",
          "600": "#ce7611",
          "700": "#ab5412",
          "800": "#8b4215",
          "900": "#7c3b16",
          "950": "#421b06",
          default: "#ab5412",
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
          default: "#ba1a1a",
        },
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
