import {
  JSONParseError,
} from '../../errors';

import {
  objectToMap,
} from '../../util/functional';

type ResolveCallback = (data: any) => any;
type RejectCallback = (reason: any) => any;
type OnInfoCallback = (data: Map<string, any>) => any;

type PromiseSettler = {
  resolve: ResolveCallback;
  reject: RejectCallback;
}

export type WSRequest = {
  id: number;
  action: string;
  params: object;
};

const { host } = window.location;
let socket: WebSocket;
let nextRequestId = 0;
const pendingRequests = new Map<number, PromiseSettler>();
const onInfoReceivedCallbacks: OnInfoCallback[] = [];

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

const resolveRequest = (data: Map<string, any>): boolean => {
  const id = data.get('id');
  if (pendingRequests.has(id)) {
    const { resolve, reject } = pendingRequests.get(id);
    if (data.has('err')) {
      reject(data.get('err'));
    } else {
      resolve(data.get('response'));
    }
    pendingRequests.delete(id);
    // eslint-disable-next-line no-console
    console.log(`[Pending Request Settled] ${pendingRequests.size} remaining`);
    return true;
  }

  // eslint-disable-next-line no-console
  console.error(`Could not resolve request with id "${id}".`);
  return false;
};

const handleInfoReceivedFromServer = (payload: Map<string, any>) => {
  for (const cb of onInfoReceivedCallbacks) {
    cb(payload);
  }
};

const setupEventListeners = (s: WebSocket) => {
  s.addEventListener('message', (event: MessageEvent) => {
    try {
      const data = objectToMap(tryToParseJSON(event.data));
      // TODO find a better way to encode the fact that this
      // is a response to a request
      if (data.has('id')) {
        resolveRequest(data);
      } else if (data.has('payload')) {
        // when we get a message we didn't ask for
        const payloadReceived = data.get('payload');

        if (typeof payloadReceived !== 'object') {
          throw new Error('The "payload" should be an object.');
        }

        if (payloadReceived instanceof Array) {
          throw new Error('Received an array as "payload".');
        }

        const payload = objectToMap(payloadReceived);

        handleInfoReceivedFromServer(payload);
      }
    } catch (err) {
      if (!(err instanceof JSONParseError)) {
        throw err;
      }

      // eslint-disable-next-line no-console
      console.error(err);
    }
  });
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
    setupEventListeners(socket);
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

export const addOnInfoCallback = (cb: OnInfoCallback) => {
  onInfoReceivedCallbacks.push(cb);
};

export const clearOnInfoCallbacks = () => {
  onInfoReceivedCallbacks.splice(
    0,
    onInfoReceivedCallbacks.length,
  );
};

export default askServer;
