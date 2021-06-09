import WebSocket from 'ws';

import {
  WSRequest,
} from '../client-src/webSocketsUISide';

import {
  respond,
} from './wsResponder';

import {
  serialize,
  deserialize,
} from '../../util/serialization';

const dataToString = (data: WebSocket.Data): string => {
  if (data instanceof Buffer) {
    return data.toString();
  }

  if (typeof data === 'string') {
    return data;
  }

  throw new Error('unexpected data type when trying to convert to string');
};

export type SendPayloadFunc = (payload: object) => Promise<any>;

export const messageReceived = (ws: WebSocket, sendPayload: SendPayloadFunc) =>
  async (message: WebSocket.Data) => {
    const { id, action, params } = deserialize(dataToString(message)) as WSRequest;
    try {
      const response = await respond(sendPayload)(action, params);
      ws.send(serialize({
        id,
        response,
      }));
    } catch (err) {
      ws.send(serialize({
        id,
        err,
      }));
    }
  };

export default messageReceived;
