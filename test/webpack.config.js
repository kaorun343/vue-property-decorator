const path = require('path')
const {
  ExternalsPlugin
} = require('webpack')

module.exports = {
  entry: path.resolve(`${__dirname}/decorator.spec.ts`),
  output: {
    path: path.resolve(`${__dirname}`),
    filename: 'decorator.spec.js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader'
    }]
  },
  plugins: [
    new ExternalsPlugin('commonjs', [
      'ava',
    ])
  ],
  mode: 'development'
}
