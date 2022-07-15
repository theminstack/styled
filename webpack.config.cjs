const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/** @type {(env: Record<string, unknown>) => import('webpack').Configuration} */
module.exports = (environment) => {
  const isBuild = !!environment.WEBPACK_BUILD;
  const source = path.resolve(__dirname, 'src/__benchmark__');
  const target = path.resolve(__dirname, 'docs/benchmark');

  return {
    devServer: {
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
      compress: true,
      hot: false,
      open: true,
      port: 3000,
      watchFiles: path.resolve(__dirname, 'src'),
    },
    devtool: 'inline-source-map',
    entry: source,
    mode: 'production',
    module: {
      rules: [
        {
          exclude: /node_modules/,
          test: /\.(tsx?|jsx?)$/i,
          use: [{ loader: 'ts-loader', options: { configFile: 'tsconfig.build-module.json' } }],
        },
        {
          test: /\.(woff2?)$/i,
          type: 'asset/inline',
        },
        {
          parser: {
            dataUrlCondition: {
              maxSize: 4 * 1024, // 4kb
            },
          },
          test: /\.(gif|jpe?g|png|apng|svg|webp)$/i,
          type: 'asset',
        },
        {
          sideEffects: true,
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    optimization: {
      sideEffects: false,
    },
    output: {
      assetModuleFilename: 'bundle/[name].[contenthash:8].[ext]',
      filename: 'bundle/[name].[chunkhash:8].js',
      path: target,
      publicPath: 'auto',
    },
    performance: {
      hints: isBuild && 'warning',
      maxAssetSize: 1024 * 1024,
      maxEntrypointSize: 1024 * 1024,
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        minify: false,
        template: path.resolve(__dirname, 'src/__benchmark__/index.html'),
      }),
    ],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    },
    stats: isBuild ? 'errors-warnings' : 'minimal',
    target: 'web',
  };
};
