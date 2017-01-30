const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const version = fs.readFileSync(`${__dirname}/.version`).toString().trim();

const config = {
  devtool: 'cheap-module-eval-source-map',
  bail: true,
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    './client/index'
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: `app.${version}.js`,
    chunkFilename: '[id].chunk.js',
    publicPath: '/assets/'
  },
  context: path.resolve(__dirname, 'src'),
  resolve: {
    modules: [
      path.resolve('./src/app/modules'),
      path.resolve('./src/app/helpers'),
      path.resolve('./src/app/middleware'),
      './node_modules'
    ],
    extensions: ['.js', '.jsx', '.json', '.scss']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally
    new webpack.NamedModulesPlugin(),
    // prints more readable module names in the browser console on HMR updates
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"',
      __ENV__: '"development"',
      __VERSION__: `"${version}"`,
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DEVTOOLS__: true  // <-------- DISABLE redux-devtools HERE
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'stage-0', 'react'],
            plugins: [
              'react-hot-loader/babel',
              'add-module-exports'
            ]
          }
        }],
        exclude: /node_modules/,
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.(scss|css)$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          {
            loader: 'sass-loader',
            options: {
              includePaths: ['./node_modules/susy/sass', './node_modules/normalize.css', './src/app/modules/main/assets']
            }
          }
        ]
      },
      {
        test: /\.(ttf|otf|svg|eot)(\?.*)?$/,
        use: ['file-loader']
      },
      {
        test: /\.(woff)(\?.*)?$/,
        use: ['base64-font-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: ['url-loader']
      }
    ]
  }
};

module.exports = config;
