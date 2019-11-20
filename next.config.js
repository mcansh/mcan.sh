const pkgJSON = require('./package.json');

module.exports = {
  crossOrigin: 'anonymous',
  target: 'serverless',
  env: {
    VERSION: pkgJSON.version,
    DESCRIPTION: pkgJSON.description,
    REPO: `https://github.com/${pkgJSON.repository}`,
  },
  experimental: {
    deferScripts: true,
    granularChunks: true,
    modern: true,
  },
  webpack: (config, { buildId, webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.BUILD_ID': JSON.stringify(buildId),
      })
    );
    return config;
  },
};
