const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  purge: ['app/**/*.tsx'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        gray: colors.coolGray,
      },
      fontFamily: {
        sans: `"SF Pro Text", "SF Pro Icons", "Helvetica Neue", "Helvetica", "Arial", sans-serif`,
      },
    },
  },
};
