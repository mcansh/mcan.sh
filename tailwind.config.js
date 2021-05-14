const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  purge: ['app/**/*.tsx'],
  darkMode: 'media',
  theme: {
    extend: {
      animation: {
        fall: 'fall 500ms ease-out',
      },
      keyframes: {
        fall: {
          '0%': { transform: 'translateY(-120px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
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
