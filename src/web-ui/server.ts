/* eslint-disable no-console */
import path from 'path';
import express from 'express';

import WebSocket from 'ws';

import webpack from 'webpack';

import webpackConfig from '../../webpack.config';
import messageReceived from './server-src/webSocketsServerSide';

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
const server = app.listen(port, () => {
  console.log(`Head over to http://localhost:${port}/ and happy scraping!`);
});

const wss = new WebSocket.Server({
  server,
  path: '/wss-internal',
});

const sendPayloadToUI = (ws: WebSocket) =>
  async (payload: object) => {
    if (payload instanceof Array) {
      throw new Error([
        'Sending an array payload to the UI is not supported.',
        'The payload must be a Plain Old Data Object.',
        'Not even a literal value. An object that is serializable to JSON.',
      ].join(' '));
    }

    ws.send(JSON.stringify({
      type: 'payloadFromServer',
      payload,
    }));
  };

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (message: any) => {
    messageReceived(ws, sendPayloadToUI(ws))(message);
  });

  ws.on('close', () => {
    console.log('Websocket is closed.');
  });
});
