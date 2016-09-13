var path = require('path'),
    webpack = require('webpack');

module.exports = {
  entry: [
    path.resolve(__dirname, 'docs/index.jsx')
  ],
  output: {
    path: path.resolve(__dirname, 'docs/'),
    filename: 'dist/index.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: path.join(__dirname, 'node_modules')
      },
      {
        test: /\.scss$/,
        loader: 'style!css!sass'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
          'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
       }
    })
  ]
};
