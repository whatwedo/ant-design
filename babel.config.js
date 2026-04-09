module.exports = function (api) {
  api.cache(true);

  const isCommonJS = process.env.BABEL_MODULE === 'commonjs';

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: isCommonJS ? 'commonjs' : false,
          targets: { browsers: ['> 0.5%', 'last 2 versions', 'Firefox ESR', 'not dead'] },
        },
      ],
      ['@babel/preset-react', { runtime: 'classic' }],
      '@babel/preset-typescript',
    ],
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-transform-class-properties', { loose: true }],
      ['@babel/plugin-transform-runtime', { useESModules: !isCommonJS }],
    ],
  };
};
