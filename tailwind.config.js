const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  purge: ['app/**/*.tsx'],
  darkMode: 'media',
  theme: {
    extend: {
      screens: {
        print: { raw: 'print' },
      },
      colors: {
        gray: colors.coolGray,
        'blue-gray': colors.blueGray,
        blue: {
          screen: '#1000f2',
        },
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
