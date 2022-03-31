module.exports = {
  extends: ['@mcansh/eslint-config/typescript'],
  // Report unused `eslint-disable` comments.
  reportUnusedDisableDirectives: true,
  // Tell ESLint not to ignore dot-files, which are ignored by default.
  ignorePatterns: ['!.*.js'],
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
