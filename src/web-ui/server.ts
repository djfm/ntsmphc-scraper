/* eslint-disable no-console */
import path from 'path';
import express from 'express';

import WebSocket from 'ws';

import webpack from 'webpack';

import webpackConfig from '../../webpack.config';
import {
  respondToWebUIRequest,
} from './server-src/respondToWebUIRequest';

import {
  serialize,
  deserialize,
} from '../util/serialization';

import {
  PAYLOAD_TYPE_REDUX_ACTION,
} from '../constants';

import {
  setScraperStateAction,
  addNotificationAction,
} from './client-src/redux/actions';

import {
  scraperState,
} from './server-src/scraperState';

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

app.use((req, res, next) => {
  // https://web.dev/cross-origin-isolation-guide/
  res.set('Cross-Origin-Opener-Policy', 'same-origin');
  res.set('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

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

const openSockets = new Set<WebSocket>();

const sendToWebUI = (ws: WebSocket) =>
  async (data: any) =>
    ws.send(serialize(data));

export const prepareReduxActionDispatchPayload = (action: object) => ({
  payload: {
    type: PAYLOAD_TYPE_REDUX_ACTION,
    action,
  },
});

// eslint-disable-next-line import/prefer-default-export
export const prepareReduxNotificationPayload = (data: object) =>
  prepareReduxActionDispatchPayload(addNotificationAction(data));

const synchronizeUI = (ws: WebSocket) => sendToWebUI(ws)(
  prepareReduxActionDispatchPayload(setScraperStateAction(scraperState)),
);

const main = async () => {
  const port = process.env.PORT || 8080;

  const server = app.listen(port, () => {
    console.log(`Head over to http://localhost:${port}/ and happy scraping!`);
  });

  const wsDataToString = (data: WebSocket.Data): string => {
    if (data instanceof Buffer) {
      return data.toString();
    }

    if (typeof data === 'string') {
      return data;
    }

    throw new Error('unexpected data type when trying to convert to string');
  };

  const wss = new WebSocket.Server({
    server,
    path: '/wss-internal',
  });

  const broadcastDataToUI = (data: any) => {
    [...openSockets].forEach((ws: WebSocket) => sendToWebUI(ws)(data));
  };

  wss.on('connection', (ws: WebSocket) => {
    if (!openSockets.has(ws)) {
      synchronizeUI(ws);
      openSockets.add(ws);
    }

    /**
     * Ok, yes, I'm re-inventing a mechanism of request / response while we already
     * have HTTP that is designed for this.
     *
     * I know. But since I also need to have a websocket permanently open to get notifications
     * from my app I thought the overhead wouldn't be much and did it anyway. It's fun.
     */
    ws.on('message', (message: WebSocket.Data) => {
      const { id, action, params } = deserialize(wsDataToString(message));

      respondToWebUIRequest({
        respond: (response) => sendToWebUI(ws)({
          id,
          response,
        }),
        broadcast: broadcastDataToUI,
      })(action, params);
    });

    ws.on('close', () => {
      openSockets.delete(ws);
    });
  });
};

main();
