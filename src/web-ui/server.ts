/* eslint-disable no-console */
import path from 'path';
import express from 'express';

/*
import https, {
  ServerOptions,
} from 'https';
*/

import http from 'http';

import WebSocket from 'ws';

import webpack from 'webpack';

import {
  readFile,
} from 'fs/promises';

import webpackConfig from '../../webpack.config';
import messageReceived from './server-src/webSocketsServerSide';

import {
  serialize,
} from '../util/serialization';

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

app.get('/a-404', (req, res) => {
  res.status(404);
  res.send('This is a 404 error');
});

app.get('/a-500', (req, res) => {
  res.status(500);
  res.send('This is a 500 error');
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

const main = async () => {
  // bit dirty I think, I'm using apache's keys...

  /*
  const [key, cert] = await Promise.all([
    readFile(path.resolve(__dirname, '../../keys/key.pem'), 'utf8'),
    readFile(path.resolve(__dirname, '../../keys/server.crt'), 'utf8'),
  ]);

  const serverOptions: ServerOptions = {
    key,
    cert,
  };

   const server = http.createServer(app);
  */

  const port = process.env.PORT || 8080;

  const server = app.listen(port, () => {
    console.log(`Head over to http://localhost:${port}/ and happy scraping!`);
  });

  const wss = new WebSocket.Server({
    server,
    path: '/wss-internal',
  });

  const sendPayloadToUI = (ws: WebSocket) =>
    async (payload: object) => {
      ws.send(serialize({
        type: 'payloadFromServer',
        payload,
      }));
    };

  wss.on('connection', (ws: WebSocket) => {
    ws.on('message', (message: any) => {
      // TODO rename messageReceived to something like handleMessageReceived
      // because it took me 5 minutes to grasp what this line meant
      messageReceived(ws, sendPayloadToUI(ws))(message);
    });

    ws.on('close', () => {
      console.log('Websocket is closed.');
    });
  });
};

main();
