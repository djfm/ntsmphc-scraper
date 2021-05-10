/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import webpack from 'webpack';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

const isDevelopment = process.env.NODE_ENV !== 'production';

const plugins = [];

if (isDevelopment) {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  plugins.push(new ReactRefreshWebpackPlugin());
}

type ConfMode = 'development' | 'production';

const mode: ConfMode = isDevelopment ? 'development' : 'production';

const config = {
  mode,
  entry: './src/web-ui/client-src/index.ts',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, './src/web-ui/public/'),
    filename: 'index.js',
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
      }],
    }],
  },
  plugins,
};

export default config;
