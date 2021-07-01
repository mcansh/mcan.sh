module.exports = {
  globDirectory: 'public/',
  globPatterns: ['**/*.{css,js,svg,ico,png,woff,woff2,sketch,webmanifest,pdf}'],
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  swDest: 'public/sw.js',
};
