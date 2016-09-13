var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:8080',
    'webpack/hot/only-dev-server',
    path.resolve(__dirname, 'docs/index.jsx')
  ],
  output: {
    path: path.resolve(__dirname, 'docs/dist'),
    filename: 'dist/index.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  devServer: {
    port: 8080,
    historyApiFallback: true,
    stats: {
      colors: true
    },
    inline: true,
    contentBase: 'docs'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['react-hot-loader', 'babel-loader'],
        exclude: path.join(__dirname, 'node_modules')
      },
      {
        test: /\.scss$/,
        loader: 'style!css!sass'
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
          'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
       }
    })
  ]
};
