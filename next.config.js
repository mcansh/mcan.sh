const pkgJSON = require('./package.json');

const nextConfig = {
  crossOrigin: 'anonymous',
  target: 'serverless',

  env: {
    VERSION: pkgJSON.version,
    DESCRIPTION: pkgJSON.description,
    REPO: `https://github.com/${pkgJSON.repository}`,
    FATHOM_SUBDOMAIN: 'https://kiwi.mcan.sh',
    FATHOM_SITEID: 'EPVCGNZL',
  },

  redirects: () => [
    {
      source: '/blog',
      permanent: false,
      destination: 'https://mcansh.blog',
    },
  ],

  experimental: {
    modern: true,
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

module.exports = nextConfig;
