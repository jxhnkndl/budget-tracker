// Import modules
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');

// Configure Webpack
const config = {
  // Basic Webpack properties
  entry: './public/index.js',
  output: {
    path: __dirname + '/public/dist',
    filename: 'bundle.js',
  },
  mode: 'development',

  // Configure the PWA Manifest module
  plugins: [
    new WebpackPwaManifest({
      name: 'Budget Tracker',
      short_name: 'Budget Tracker',
      description:
        'An online/offline application for tracking income and expenses.',
      start_url: '/',
      background_color: '#ffffff',
      theme_color: '#317EFB',
      'theme-color': '#317EFB',
      icons: [
        {
          src: path.resolve('public/icons/icon-512x512.png'),
          sizes: [192, 512],
          destination: path.join('assets', 'icons'),
        },
      ],
    }),
  ],

  // Configure Webpack to use babel-loader to transpile and bundle the code
  module: {
    rules: [
      {
        test: /\.js$/, 
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};

// Export configuration
module.exports = config;
