const fs = require('fs');
const path = require('path');
const theme = require('../style');
const { description, name } = require('../package.json');

const OUT_DIR = path.join(process.cwd(), 'out');

const manifest = {
  name,
  short_name: name,
  description,
  start_url: '/?homescreen=1',
  background_color: theme.links,
  theme_color: theme.links,
  display: 'standalone',
  icons: [
    {
      src: '/static/images/favicon.png',
      sizes: '72x72 96x96 128x128 144x144 256x256 512x512',
    },
  ],
};

module.exports = (dir = OUT_DIR) => {
  fs.writeFileSync(
    path.join(dir, 'manifest.webmanifest'),
    JSON.stringify(manifest, null, 2)
  );
};
