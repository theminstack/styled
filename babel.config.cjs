/** @type {import('@babel/core').TransformOptions} */
module.exports = {
  compact: false,
  env: {
    test: {
      presets: [['@babel/preset-env', { modules: 'commonjs' }]],
      targets: { node: 'current' },
    },
  },
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: { proposals: true, version: require('core-js/package.json').version },
        modules: false,
        useBuiltIns: 'entry',
      },
    ],
  ],
};
