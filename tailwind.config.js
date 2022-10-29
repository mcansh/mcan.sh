const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["app/**/*.tsx"],
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
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("tailwindcss-padding-safe")],
};
