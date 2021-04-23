// @ts-check
/* eslint-env node */

const { resolve } = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const rootPath = resolve(__dirname, '.');
const srcPath = resolve(__dirname, './src');
const distPath = resolve(__dirname, './dist');

/** @type import('webpack').ConfigurationFactory */
module.exports = (env, argv) => ({
  entry: {
    script: [resolve(srcPath, './index.tsx')],
  },
  output: {
    path: distPath,
    filename: '[name].js',
  },
  devtool: argv.mode === 'development' ? 'inline-source-map' : false,

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
      {
        include: resolve('node_modules', '@progfay/scrapbox-parser'),
        sideEffects: false,
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },

  optimization: {
    minimize: false,
    minimizer: [
      new TerserPlugin({
        terserOptions: { compress: {}, mangle: false },
      }),
    ],
  },

  experiments: {
    outputModule: true,
  },
});
