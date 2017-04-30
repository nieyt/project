'use strict';

import path from 'path';
import webpack  from 'webpack';
import pkg from '../../package.json';

export default {
  devtool: 'eval',

  entry: [
    // 'webpack/hot/dev-server',
    // 'webpack-hot-middleware/client?reload=true',
    __dirname + '/client/entry.js'
  ],

  output: {
    path: __dirname + '/public/js/',
    filename: 'bundle.js',
    publicPath: '/js/'
  },

  resolve: {
    alias: {
      react: __dirname + '/node_modules/react',
      'react-dom': __dirname + '/node_modules/react-dom',
    }
  },

  plugins: [
    new webpack.DefinePlugin({
      SERVER_RENDING: true,
      __VERSION__: JSON.stringify(pkg.version),
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      },
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  resolveLoader: {
    root: path.resolve(__dirname, '../../node_modules')
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        // exclude: /node_modules/,
        include: [
          path.resolve(__dirname, '../../js'),
          path.resolve(__dirname, '../../kitchen-sink'),
          path.resolve(__dirname, '../../kitchen-sink/node_modules'),
          path.resolve(__dirname, 'client'),
          path.resolve(__dirname, 'shared'),
        ]
      },
      {
        test: /\.scss$/,
        loader: 'style!css?sourceMap!postcss!sass?sourceMap',
      },
      {
        test: /\.svg$/,
        loader: 'url?mimetype=image/svg+xml&name=[name].[ext]'
      },
      {
        test: /\.woff$/,
        loader: 'url?mimetype=application/font-woff&name=[name].[ext]'
      },
      {
        test: /\.woff2$/,
        loader: 'url?mimetype=application/font-woff2&name=[name].[ext]'
      },
      {
        test: /\.[ot]tf$/,
        loader: 'url?mimetype=application/octet-stream&name=[name].[ext]'
      },
    ]
  }
};
