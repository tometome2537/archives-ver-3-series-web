import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite/**/*.js",
    "./node_modules/flowbite-react/lib/**/*.js",
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
      active: true,
    },
  },
  plugins: [require("flowbite/plugin"), require("tailwindcss-state")],
};
export default config;
