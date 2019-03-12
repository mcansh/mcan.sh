module.exports = {
  setupFilesAfterEnv: [
    'jest-dom/extend-expect',
    'react-testing-library/cleanup-after-each',
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx|js|jsx)$',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
};
