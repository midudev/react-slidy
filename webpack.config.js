var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var merge = require('webpack-merge');

var APP_PATH = path.join(__dirname, '/src');
var TARGET = process.env.npm_lifecycle_event;

var path = require('path');
var webpack = require('webpack');

var base = {
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['babel-loader'],
      exclude: path.join(__dirname, 'node_modules')
    }, {
      test: /\.s?css$/,
      loader: ExtractTextPlugin.extract('css!sass')
    }, {
        test: /\.svg$/,
        loader: 'svg-inline'
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
       }
    })
  ]
};

if (TARGET === 'start:server' || !TARGET) {
  module.exports = merge(base, {
    entry: [
      'webpack-dev-server/client?http://0.0.0.0:8080',
      'webpack/hot/only-dev-server',
      path.resolve(__dirname, 'docs/index.jsx')
    ],
    output: {
      path: path.resolve(__dirname, 'docs/dist'),
      filename: 'dist/index.js'
    },
    devServer: {
      port: 8080,
      stats: { colors: true },
      inline: true,
      contentBase: 'docs'
    },
    devtool: 'source-map',
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new ExtractTextPlugin('dist/index.css', {
        allChunks: true
      })
    ]
  });
}


if (TARGET === 'dist') {
  module.exports = merge(base, {
    entry: {
      app: path.resolve(__dirname, 'docs/index.jsx'),
      vendors: ['react', 'react-dom', 'babel-polyfill']
    },
    output: {
      filename: 'dist/index.[hash].js'
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new ExtractTextPlugin('dist/index.[contenthash].css', {
        allChunks: true
      }),
      new webpack.optimize.CommonsChunkPlugin('vendors', 'dist/vendors.[hash].js')
    ]
  });
}
