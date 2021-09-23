const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/** @type {(env: Record<string, unknown>) => import('webpack').Configuration} */
module.exports = (env) => {
  const isBuild = !!env.WEBPACK_BUILD;
  const source = path.resolve('src/benchmark');
  const target = path.resolve('docs/benchmark');

  return {
    mode: 'production',
    target: 'web',
    entry: source,
    output: {
      path: target,
      filename: 'bundle/[name].[chunkhash:8].js',
      assetModuleFilename: 'bundle/[name].[contenthash:8].[ext]',
      publicPath: '/',
    },
    stats: isBuild ? 'errors-warnings' : 'minimal',
    performance: {
      hints: isBuild && 'warning',
      maxEntrypointSize: 1024 * 1024,
      maxAssetSize: 1024 * 1024,
    },
    optimization: {
      sideEffects: false,
    },
    devtool: 'inline-source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.(tsx?|jsx?)$/i,
          exclude: /node_modules/,
          use: ['ts-loader'],
        },
        {
          test: /\.(woff2?)$/i,
          type: 'asset/inline',
        },
        {
          test: /\.(gif|jpe?g|png|apng|svg|webp)$/i,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 4 * 1024, // 4kb
            },
          },
        },
        {
          test: /\.css$/i,
          sideEffects: true,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        minify: false,
        template: path.resolve(source, 'index.html'),
      }),
    ],
    devServer: {
      static: target,
      hot: false,
      watchFiles: path.resolve(__dirname, 'src'),
      compress: true,
      port: 3000,
      open: true,
    },
  };
};
