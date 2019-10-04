module.exports = {
  extends: ['mcansh/typescript'],
  settings: {
    'import/resolver': {
      'babel-plugin-root-import': {},
      typescript: {},
    },
  },
  rules: {
    '@typescript-eslint/camelcase': ['error', { properties: 'never' }],
  },
};
