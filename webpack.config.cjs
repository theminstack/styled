module.exports = {
  target: 'node',
  externals: { react: 'react', 'react/jsx-runtime': 'react-jsx-runtime' },
  entry: './webpack.entry.js',
  mode: 'production',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/out/bundle',
  }
};
