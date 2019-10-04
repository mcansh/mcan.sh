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
    publicDirectory: true,
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
