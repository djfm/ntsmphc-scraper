/* eslint-disable no-console */
import path from 'path';
import express from 'express';

import webpack from 'webpack';
import webpackConfig from '../../webpack.config';

const webpackCompiler = webpack(webpackConfig);

const devMiddleware = require('webpack-dev-middleware')(webpackCompiler, {
  publicPath: webpackConfig.output.publicPath,
});

const hotMiddleware = require('webpack-hot-middleware')(webpackCompiler);

const app = express();

app.use(express.static(path.resolve(__dirname, 'public')));
app.use(devMiddleware);
app.use(hotMiddleware);

const port = 8080;
app.listen(port, () => {
  console.log(`Head over to http://localhost:${port}/ and happy scraping!`);
});
