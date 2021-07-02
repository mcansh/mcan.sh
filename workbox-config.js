module.exports = {
  globDirectory: 'public/',
  globPatterns: ['**/*.{css,js,svg,ico,png,woff,woff2}'],
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  swDest: 'public/sw.js',
};
