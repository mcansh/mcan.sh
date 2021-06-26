const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');

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
  plugins: [
    require('tailwindcss-padding-safe')(),
    plugin(({ addVariant, e, postcss }) => {
      addVariant('supports-gap', ({ container, separator }) => {
        const supportsRule = postcss.atRule({
          name: 'supports',
          params: '(gap: 0)',
        });
        supportsRule.append(container.nodes);
        container.append(supportsRule);
        supportsRule.walkRules(rule => {
          rule.selector = `.${e(
            `supports-gap${separator}${rule.selector.slice(1)}`
          )}`;
        });
      });
    }),
  ],
};
