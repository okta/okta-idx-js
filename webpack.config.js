const path = require('path');

const config  = {
  entry: './src/index.js',
  devtoo: 'source-map', 
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: { 
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-optional-chaining']
          }
        }
      }
    ]
  },
};

module.exports = config;

