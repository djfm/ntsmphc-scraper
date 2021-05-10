/* eslint-disable no-console */
import { join as joinPaths } from 'path';

import makeFastify from 'fastify';
import fastifyStatic from 'fastify-static';
import fastifyHMR from 'fastify-webpack-hmr';
import webpack from 'webpack';

import webpackConfig from '../../webpack.config';

const webpackCompiler = webpack(webpackConfig);

const server = makeFastify();

server.register(fastifyHMR, { compiler: webpackCompiler });

server.register(fastifyStatic, {
  root: joinPaths(__dirname, 'public'),
  prefix: '/',
});

server.listen(8080, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Head over to ${address} and start using the scraper!`);
});
