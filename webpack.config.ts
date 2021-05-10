/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import webpack from 'webpack';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

const isDevelopment = process.env.NODE_ENV !== 'production';

const plugins = [];
const babelLoaderPlugins = [];
const entry = ['./src/web-ui/client-src/router.tsx'];

if (isDevelopment) {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  plugins.push(new ReactRefreshWebpackPlugin());
  babelLoaderPlugins.push(require.resolve('react-refresh/babel'));
  entry.push('webpack-hot-middleware/client');
}

type ConfMode = 'development' | 'production';

const mode: ConfMode = isDevelopment ? 'development' : 'production';

const config = {
  mode,
  entry,
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, './src/web-ui/public/'),
    filename: 'index.js',
    publicPath: '/',
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          plugins: babelLoaderPlugins,
        },
      }, {
        loader: 'ts-loader',
      }],
    }],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  devServer: {
    hot: true,
  },
  plugins,
};

export default config;
