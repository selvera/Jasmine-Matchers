module.exports = {
  entry: {
    'jasmine-matchers': './src/index.ts',
    'jasmine-matchers.spec': './test/index.ts'
  },
  output: {
    path: require('path').join(__dirname, 'dist'),
    filename: '[name].js'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        enforce: 'pre',
        loader: 'awesome-typescript-loader'
      },
      {
        test: /\.js$/,
        loader: 'source-map-loader'
      }
    ]
  }
};
