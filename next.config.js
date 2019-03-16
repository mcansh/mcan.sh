const withMDX = require('@zeit/next-mdx')({
  extension: /\.mdx?$/,
});
const withOffline = require('next-offline');
const withTypescript = require('@zeit/next-typescript');
const generate = require('./lib/manifest');

const nextConfig = {
  async exportPathMap(defaultPathMap, { dev, outDir }) {
    if (dev) return defaultPathMap;
    generate(outDir);
    return defaultPathMap;
  },
  target: 'server',
  pageExtensions: ['js', 'jsx', 'tsx', 'mdx'],
  dontAutoRegisterSw: true,
  workboxOpts: {
    swDest: 'static/sw.js',
    runtimeCaching: [
      {
        handler: 'staleWhileRevalidate',
        urlPattern: /[.](webp|png|jpg|svg|css)/,
      },
      {
        handler: 'networkFirst',
        urlPattern: /^https?.*/,
      },
    ],
  },
};

module.exports = withMDX(withOffline(withTypescript(nextConfig)));
