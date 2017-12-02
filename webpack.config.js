const webpack = require('webpack')
const isProduction = process.env.NODE_ENV === 'production'
const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const stylusLoaders = [
  {
    loader: 'css-loader',
    options: { sourceMap: !isProduction }
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: [autoprefixer()],
      sourceMap: !isProduction
    }
  },
  {
    loader: 'stylus-loader',
    options: { sourceMap: !isProduction }
  }
]

const config = {
  devtool: 'source-map',
  entry: "./src/index.ts",
  output: {
    filename: "dist/index.js"
  },
  resolve: {
    // Add '.ts' and '.tsx' as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js', '.styl']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: "source-map-loader"
      },
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        use: "source-map-loader"
      },
      {
        test: /\.styl$/,
        use:
          ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: stylusLoaders
          })
          // stylusLoaders
      },
      {
        test: require.resolve('jquery'),
        use: [
          {
            loader: 'expose-loader',
            options: '$'
          }, {
            loader: 'expose-loader',
            options: 'jQuery'
          }
        ]
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('dist/index.css'),
  ]
}

if (isProduction) {
  config.devtool = false
  config.plugins = [
    ...config.plugins,
    new ExtractTextPlugin('dist/index.css'),
  ]
} else {

}

module.exports = config