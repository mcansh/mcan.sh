module.exports = api => {
  api.cache(true);
  const presets = ['next/babel'];
  const plugins = ['styled-components', 'polished'];

  return { presets, plugins };
};
