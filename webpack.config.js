// @ts-check
/* eslint-env node */

const { resolve } = require('path');

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
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat',
    },
  },

  externals: {
    'preact': '/api/code/pokutuna/preact@10.4.4/script.js',
    'preact-compat': '/api/code/pokutuna/preact-compat@10.4.4/script.js',
  },

  experiments: {
    outputModule: true,
  },
});
