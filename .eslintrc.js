module.exports = {
  extends: ['@mcansh/eslint-config/typescript'],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['next.config.js', 'prettier.config.js'],
      },
    ],
  },
};
