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
    redirects: () => [
      {
        source: '/blog',
        permanent: false,
        destination: 'https://mcansh.blog',
      },
    ],
  },

  webpack: (config, { buildId, webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.BUILD_ID': JSON.stringify(buildId),
      })
    );

    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: [
                { removeViewBox: false },
                { removeDimensions: true },
                {
                  prefixIds: {
                    delim: '_',
                    prefixIds: true,
                    prefixClassNames: false,
                  },
                },
              ],
            },
          },
        },
      ],
    });

    return config;
  },
};
