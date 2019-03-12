const env = {
  'process.env.VERSION': require('./package.json').version,
  'process.env.DESCRIPTION': require('./package.json').description,
  'process.env.REPO': require('./package.json').repository,
};

module.exports = {
  presets: ['next/babel', '@zeit/next-typescript/babel'],
  plugins: ['styled-components', 'root-import', ['transform-define', env]],
};
