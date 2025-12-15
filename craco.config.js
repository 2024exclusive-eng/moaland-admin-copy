const path = require('path')

module.exports = {
  reactScriptsVersion: 'react-scripts',
  babel: {
    plugins: [
      ['@babel/plugin-transform-class-properties', { loose: true }],
      ['@babel/plugin-transform-logical-assignment-operators'],
      ['@babel/plugin-proposal-private-methods', { loose: true }],
      ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
      '@babel/plugin-syntax-numeric-separator'
    ]
  },
  style: {
    sass: {
      loaderOptions: {
        sassOptions: {
          includePaths: ['node_modules', 'src/assets']
        }
      }
    },
    postcss: {
      plugins: [require('postcss-rtlcss')()]
    }
  },
  webpack: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/@core/assets'),
      '@components': path.resolve(__dirname, 'src/@core/components'),
      '@layouts': path.resolve(__dirname, 'src/@core/layouts'),
      '@store': path.resolve(__dirname, 'src/redux'),
      '@styles': path.resolve(__dirname, 'src/@core/scss'),
      '@configs': path.resolve(__dirname, 'src/configs'),
      '@utils': path.resolve(__dirname, 'src/utility/Utils'),
      '@hooks': path.resolve(__dirname, 'src/utility/hooks')
    },
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push({
        test: /\.(js|jsx)?$/,
        include: [
          path.resolve(__dirname, '../node_modules/@ckeditor/ckeditor5-html-embed'),
          path.resolve(__dirname, '../node_modules/@ckeditor/ckeditor5-upload')
        ],
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                ['@babel/plugin-transform-class-properties', { loose: true }],
                ['@babel/plugin-proposal-private-methods', { loose: true }],
                ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
                '@babel/plugin-syntax-numeric-separator'
              ]
            }
          }
        ]
      })
      return webpackConfig
    }
  }
}
