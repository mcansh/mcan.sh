const { PORT = 3000 } = process.env;

module.exports = {
  apps: [
    {
      name: 'Vercel',
      script: `vc dev --listen ${PORT}`,
      ignore_watch: ['.'],
    },
    {
      name: 'Remix',
      script: 'remix watch',
      ignore_watch: ['.'],
      env: {
        NODE_ENV: 'development',
      },
    },
    {
      name: 'CSS',
      script: 'postcss styles --base styles --dir app/styles -w',
      ignore_watch: ['.'],
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
