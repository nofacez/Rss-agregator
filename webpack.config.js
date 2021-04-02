const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
  },

  devtool: 'source-map',

  entry: {
    main: './src/index.js',
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: 'babel-loader',
      //   },
      // },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],

};
