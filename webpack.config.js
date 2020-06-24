const path = require('path');

const config  = {
  entry: './src/index.js',
  devtool: 'source-map',
  output: {
    filename: 'idx.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'idx',
    libraryTarget: 'umd',
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
            plugins: [
              '@babel/plugin-proposal-optional-chaining',
              '@babel/plugin-proposal-nullish-coalescing-operator',
            ],
          }
        }
      }
    ]
  },
};

module.exports = config;

