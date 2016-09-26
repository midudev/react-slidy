const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const merge = require('webpack-merge')

const APP_PATH = path.join(__dirname, '/src')
const TARGET = process.env.npm_lifecycle_event

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
}

if (TARGET === 'dist') {
  module.exports = merge(base, {
    entry: path.resolve(__dirname, 'docs/index.jsx'),
    output: {
      filename: 'dist/index.js'
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new ExtractTextPlugin('dist/index.css', {
        allChunks: true
      })
    ]
  })
}

if (TARGET === 'start:server' || !TARGET) {
  module.exports = merge(base, {
    entry: [
      'webpack-dev-server/client?http://0.0.0.0:3000',
      'webpack/hot/only-dev-server',
      path.resolve(__dirname, 'docs/index.jsx')
    ],
    output: {
      path: path.resolve(__dirname, 'docs/dist'),
      filename: 'dist/index.js'
    },
    devServer: {
      port: 3000,
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
  })
}
