const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");
const flattenColorPalette = require("tailwindcss/lib/util/flattenColorPalette");

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
  plugins: [
    require("tailwindcss-padding-safe"),
    tailwindColorsCustomProperties(),
  ],
};

function tailwindColorsCustomProperties() {
  return plugin(({ addBase, theme }) => {
    let colors = flattenColorPalette.default(theme("colors"));
    let colorKeys = Object.keys(colors);
    let colorProperties = colorKeys.reduce((acc, key) => {
      let value = colors[key];
      return {
        ...acc,
        [`--${key}`]: value,
      };
    }, {});

    addBase({ ":root": colorProperties });
  });
}
