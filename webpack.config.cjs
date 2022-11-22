module.exports = {
  target: 'node',
  externals: { react: 'react' },
  entry: './lib/esm/index.js',
  mode: 'production',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/out/bundle',
  },
  optimization: {
    usedExports: false
  }
};
