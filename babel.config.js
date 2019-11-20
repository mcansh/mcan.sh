module.exports = api => {
  api.cache(true);
  const presets = ['next/babel'];
  const plugins = ['styled-components', 'root-import', 'polished'];

  return { presets, plugins };
};
