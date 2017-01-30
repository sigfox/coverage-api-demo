const path = require('path');

module.exports = {
  title: 'Sigfox UI',
  components: './src/app/modules/common/**/*.js',
  updateWebpackConfig(webpackConfig) {
    // Your source files folder or array of folders, should not include node_modules
    const dir = path.join(__dirname, 'src/lib/components');
    webpackConfig.module.loaders.push(
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
              includePaths: ['./node_modules/susy/sass', './src/app/modules/main/assets']
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
    })
    return webpackConfig;
  }
};
