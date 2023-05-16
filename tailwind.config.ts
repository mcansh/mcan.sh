import defaultTheme from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";
import tailwindcssPaddingSafe from "tailwindcss-padding-safe";

export default {
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
        mono: ["Berkeley Mono", ...defaultTheme.fontFamily.mono],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [tailwindcssPaddingSafe],
} satisfies Config;
