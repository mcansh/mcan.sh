module.exports = {
  extends: ['mcansh/typescript'],
  settings: {
    'import/resolver': {
      'babel-plugin-root-import': {},
      typescript: {},
    },
  },
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        ignoreRestSiblings: true,
      },
    ],
    'no-underscore-dangle': ['error', { allow: ['__NEXT_DATA__'] }],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '__tests__/**/*',
          'jest.setup.js',
          'jest.config.js',
          'utils/render-with-intl.tsx',
          'scripts/**/*',
          'next.config.js',
        ],
      },
    ],
  },
};
