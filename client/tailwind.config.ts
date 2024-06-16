import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "custom-purple": "#928CFB",
        "custom-yellow": "#FAF58C",
      },
      fontFamily: {
        ratio: ['ratio', 'sans-serif'],
      },
      screens: {
        'xs': {'max': '639px'},
      }
    },
  },
  plugins: [],
};
export default config;
