const pkgJSON = require('./package.json');

module.exports = {
  crossOrigin: 'anonymous',
  target: 'serverless',
  env: {
    SENTRY: '',
    VERSION: pkgJSON.version,
    DESCRIPTION: pkgJSON.description,
    REPO: `https://github.com/${pkgJSON.repository}`,
  },
  experimental: {
    granularChunks: true,
    modern: true,
    publicDirectory: true,
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
