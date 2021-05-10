/* eslint-disable no-console */
import path from 'path';
import express from 'express';

import webpack from 'webpack';
import webpackConfig from '../../webpack.config';

const isDevelopment = process.env.NODE_ENV !== 'production';

const app = express();

console.log(`Running in "${process.env.NODE_ENV}" environment.`);

if (isDevelopment) {
  const webpackCompiler = webpack(webpackConfig);

  const devMiddleware = require('webpack-dev-middleware')(webpackCompiler, {
    publicPath: webpackConfig.output.publicPath,
  });

  const hotMiddleware = require('webpack-hot-middleware')(webpackCompiler);

  app.use(devMiddleware);
  app.use(hotMiddleware);
}

app.use(express.static(path.resolve(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

const port = 8080;
app.listen(port, () => {
  console.log(`Head over to http://localhost:${port}/ and happy scraping!`);
});
