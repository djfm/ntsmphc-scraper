import WebSocket from 'ws';

import {
  WSRequest,
} from '../client-src/webSocketsUISide';

import {
  respond,
} from './wsResponder';

const dataToString = (data: WebSocket.Data): string => {
  if (data instanceof Buffer) {
    return data.toString();
  }

  if (typeof data === 'string') {
    return data;
  }

  throw new Error('unexpected data type when trying to convert to string');
};

export const messageReceived = async (message: WebSocket.Data, ws: WebSocket) => {
  // eslint-disable-next-line no-console
  console.log('Received from UI:', message);
  try {
    const { id, action, params }: WSRequest = JSON.parse(dataToString(message));
    try {
      const response = await respond(action, params);
      ws.send(JSON.stringify({
        id,
        response,
      }));
    } catch (couldNotRespondErr) {
      const props = Object.getOwnPropertyNames(couldNotRespondErr);
      const errObj = {};
      for (const prop of props) {
        errObj[prop] = couldNotRespondErr[prop];
      }
      ws.send(JSON.stringify({
        id,
        err: errObj,
      }));
    }
  } catch (err) {
    // TODO something with the error
    // eslint-disable-next-line no-console
    console.log(err);
  }
};

export default messageReceived;
