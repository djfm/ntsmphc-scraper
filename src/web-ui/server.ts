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

let globalWebSocket: WebSocket;

const createNewWebSocket = async (): Promise<WebSocket> => {
  const wss = new WebSocket.Server({
    server,
    path: '/wss-internal',
  });

  return new Promise<WebSocket>((resolve) => {
    wss.on('connection', (ws) => {
      resolve(ws);
    });
  });
};

export type ObtainedWebSocket = {
  ws: WebSocket;
  isNew: true | false;
};

const obtainWebSocket = async (): Promise<ObtainedWebSocket> => {
  if (globalWebSocket === undefined || globalWebSocket.readyState !== 1) {
    const ws = await createNewWebSocket();
    globalWebSocket = ws;

    return {
      ws,
      isNew: true,
    };
  }

  return {
    ws: globalWebSocket,
    isNew: false,
  };
};

const connectToUIUsingWebSocket = async () => {
  const { ws, isNew } = await obtainWebSocket();

  if (isNew) {
    ws.on('message', (message: any) => {
      messageReceived(ws)(message);
    });
  }
};

connectToUIUsingWebSocket();

export const sendPayloadToUI = async (payload: object) => {
  if (payload instanceof Array) {
    throw new Error([
      'Sending array payload to the UI is not supported.',
      'The payload must be a Plain Old Data Object.',
    ].join(' '));
  }

  const { ws } = await obtainWebSocket();
  ws.send(JSON.stringify({
    type: 'payloadFromServer',
    payload,
  }));
};
