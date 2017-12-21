require('babel-polyfill');
const path = require('path');
const Extract = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const isProd = process.env.NODE_ENV === 'production';
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const webpack = require('webpack');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
  devtool: isProd ? false : 'source-map',
  entry: {
    'javascripts/main': ['babel-polyfill', './src/javascripts/main.js'],
    'stylesheets/main': './src/stylesheets/main.scss'
  },
  output: {
    path: path.join(__dirname, 'static/assets'),
    filename: isProd ? '[name].[chunkhash].js' : '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules|vendor/,
        loader: 'babel-loader'
      },
      {
        test: /\.s?css$/,
        loader: Extract.extract({
          fallbackLoader: 'style-loader',
          loader: [
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        })
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.html$/,
        loader: 'html'
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/,
        loader: 'file-loader?name=[path][name].[hash:base64:5].[ext]'
      }
    ]
  },
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.js', '.json']
  },
  plugins: [
    new ManifestPlugin(),
    new Extract(isProd ? '[name].[contenthash].css' : '[name].css'),
    new ImageminPlugin({
      disable: process.env.NODE_ENV !== 'production' // Disable during development
    }),
    new FaviconsWebpackPlugin({
      logo: './src/images/default-favicon.png',
      emitStats: true,
      prefix: '/shortcut-[hash:base64:5]/',
      statsFilename: 'favicon-mainfest.json',
      persistentCache: true,
      icons: {
        android: true,
        appleIcon: true,
        favicons: true,
        firefox: false,
        appleStartup: false,
        coast: false,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false
      }
    })
  ]
};
