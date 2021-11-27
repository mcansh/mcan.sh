module.exports = {
  extends: ['@mcansh/eslint-config/typescript'],
  rules: {
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          'postcss.config.js',
          'prettier.config.js',
          'tailwind.config.js',
        ],
      },
    ],
  },
};
