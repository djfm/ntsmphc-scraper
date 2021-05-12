import {
  JSONParseError,
} from '../../errors';

const { host } = window.location;

type ResolveCallback = (data: any) => any;
type RejectCallback = (reason: any) => any;

type PromiseSettler = {
  resolve: ResolveCallback;
  reject: RejectCallback;
}

export type WSRequest = {
  id: number;
  action: string;
  params: object;
};

let socket: WebSocket;
let nextRequestId = 0;
const pendingRequests = new Map<number, PromiseSettler>();

const createNewSocket = async (): Promise<WebSocket> => {
  const s = new WebSocket(`ws://${host}/wss-internal`);

  return new Promise<WebSocket>((resolve, reject) => {
    if (s.readyState === 1) {
      resolve(s);
    } else if (s.readyState !== 0) {
      reject(new Error('Could not create socket.'));
      return;
    }

    s.addEventListener('open', () => resolve(s));
  });
};

const tryToParseJSON = (str: string): any => {
  try {
    return JSON.parse(str);
  } catch (err) {
    throw new JSONParseError(err.message ?? 'Could not parse string as JSON.');
  }
};

const ensureConnectionToServer = async (): Promise<WebSocket> => {
  const oldSocket = socket;

  // TODO check that a new socket is really obtained when needed
  // readyState can be:
  //  - 0 => CONNECTING
  //  - 1 => OPEN
  //  - 2 => CLOSING
  //  - 3 => CLOSED
  // see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
  if (!socket || socket.readyState >= 2) {
    // eslint-disable-next-line no-console
    console.warn('[WS] creating a new socket connection to our server...');
    socket = await createNewSocket();
  }

  // we got a new socket, so we need to setup
  // its handlers for the app to function properly
  if (oldSocket !== socket) {
    socket.addEventListener('message', (event: MessageEvent) => {
      // eslint-disable-next-line no-console
      console.log(`Currently, ${pendingRequests.size} requests are pending.`);
      try {
        const data = tryToParseJSON(event.data);
        if (pendingRequests.has(data.id)) {
          const { resolve, reject } = pendingRequests.get(data.id);
          if (data.err) {
            reject(data.err);
          } else {
            resolve(data.response);
          }
          pendingRequests.delete(data.id);
          // eslint-disable-next-line no-console
          console.log(`I settled one, so now, ${pendingRequests.size} are pending.`);
        } else {
          // eslint-disable-next-line no-console
          console.error('Received JSON message I could not understand: ', data);
        }
      } catch (err) {
        if (!(err instanceof JSONParseError)) {
          throw err;
        }

        // eslint-disable-next-line no-console
        console.error(err);
      }
    });
  }

  return socket;
};

export const askServer = async (action: string, params: object) => {
  const s = await ensureConnectionToServer();

  const request = {
    id: nextRequestId,
    action,
    params,
  };

  s.send(JSON.stringify(request));

  let resolver: PromiseSettler;

  const promise = new Promise((resolve, reject) => {
    resolver = { resolve, reject };
  });

  pendingRequests.set(nextRequestId, resolver);

  nextRequestId += 1;

  return promise;
};

export default askServer;
