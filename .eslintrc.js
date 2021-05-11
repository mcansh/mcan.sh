const path = require('path');

module.exports = {
  extends: ['@mcansh/eslint-config/typescript'],
  parserOptions: {
    project: [path.join(process.cwd(), 'app/tsconfig.json')],
  },
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
