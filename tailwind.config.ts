import type { Config } from "tailwindcss";

const config: Config = {
  mode: "jit",
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.html",
  ],
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
    },
    states: {
      on: true,
      current: true,
    },
  },
  plugins: [require("tailwindcss-state")],
};
export default config;
