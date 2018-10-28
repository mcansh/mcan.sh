const fs = require('fs');
const { join } = require('path');
const { promisify } = require('util');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const { name } = require('./package.json');

const copyFile = promisify(fs.copyFile);

module.exports = {
  exportPathMap: async (defaultPathMap, { dev, dir, outDir }) => {
    if (dev) return defaultPathMap;

    await copyFile(join(dir, '.next', 'sw.js'), join(outDir, 'sw.js'));
    return defaultPathMap;
  },
  webpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new SWPrecacheWebpackPlugin({
          cacheId: name,
          minify: true,
          filename: 'sw.js',
          verbose: true,
          staticFileGlobs: [
            'static/**/*', // Precache all static files by default
          ],
          staticFileGlobsIgnorePatterns: [/\.next\//],
          runtimeCaching: [
            {
              handler: 'networkFirst',
              urlPattern: /^https?.*/,
            },
          ],
        })
      );
    }
    return config;
  },
};
