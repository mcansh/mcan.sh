import defaultTheme from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";
import tailwindcssPaddingSafe from "tailwindcss-padding-safe";

let config: Config = {
  content: ["app/**/*.{ts,tsx,js,jsx}"],
  darkMode: "media",
  theme: {
    extend: {
      screens: {
        print: { raw: "print" },
      },
      colors: {
        blue: {
          screen: "#1000f2",
        },
      },
      fontFamily: {
        sans: ["InterVar", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [tailwindcssPaddingSafe],
};

export default config;
