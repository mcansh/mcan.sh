const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["app/**/*.{ts,tsx,js,jsx}"],
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
  plugins: [require("tailwindcss-padding-safe")],
};
