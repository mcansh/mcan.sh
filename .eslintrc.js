module.exports = {
  extends: ['@mcansh/eslint-config/typescript'],
  rules: {
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
