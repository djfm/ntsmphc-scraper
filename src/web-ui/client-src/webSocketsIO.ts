import {
  serialize,
  deserialize,
} from '../../util/serialization';

type ResolveCallback = (data: any) => any;
type RejectCallback = (reason: Error) => any;
type OnDataReceivedFromServerCallback = (data: any) => any;

type PromiseSettler = {
  resolve: ResolveCallback;
  reject: RejectCallback;
}

export type WSRequest = {
  id: number;
  action: string;
  params: any;
};

const { host } = window.location;
let socket: WebSocket;

let nextRequestId = 0;
const pendingRequests = new Map<number, PromiseSettler>();
const serverListeners: OnDataReceivedFromServerCallback[] = [];

const resolveRequest = (data: any) => {
  const { id } = data;

  if (pendingRequests.has(id)) {
    const { resolve, reject } = pendingRequests.get(id);
    pendingRequests.delete(id);
    if (data.err) {
      reject(data.err);
      return;
    }
    resolve(data.response);
    return;
  }
  throw new Error('Tried to resolve a non-existant request.');
};

const handlePayloadReceivedFromServer = (payload: any) => {
  for (const cb of serverListeners) {
    cb(payload);
  }
};

const defaultSocketMessageListener = (event: MessageEvent) => {
  const data = deserialize(event.data);

  if (Object.prototype.hasOwnProperty.call(data, 'id')) {
    resolveRequest(data);
  } else if (data.payload) {
    // when we get a message we didn't explicitly ask for
    handlePayloadReceivedFromServer(data.payload);
  }
};

const setupMessageEventListeners = (s: WebSocket) => {
  s.addEventListener('message', defaultSocketMessageListener);
};

const createNewSocket = async (): Promise<WebSocket> => {
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const s = new WebSocket(`${wsProtocol}//${host}/wss-internal`);

  return new Promise<WebSocket>((resolve, reject) => {
    if (s.readyState > 1) {
      reject(new Error('Could not create socket.'));
      return;
    }

    if (s.readyState === 1) {
      resolve(s);
    } else {
      s.addEventListener('open', () => resolve(s));
    }
  });
};

let connecting: Promise<WebSocket>;
export const ensureConnectionToServer = async (): Promise<WebSocket> => {
  // TODO check that a new socket is really obtained when needed
  // readyState can be:
  //  - 0 => CONNECTING
  //  - 1 => OPEN
  //  - 2 => CLOSING
  //  - 3 => CLOSED
  // see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
  if (connecting) {
    return connecting;
  }

  if (!socket || socket.readyState > 1) {
    connecting = createNewSocket().then((s) => {
      socket = s;
      setupMessageEventListeners(s);
      return socket;
    });
    return connecting;
  }

  return socket;
};

export const askServer = async (action: string, params: any) => {
  const s = await ensureConnectionToServer();

  const id = nextRequestId;
  nextRequestId += 1;

  const request = {
    id,
    action,
    params,
  };

  s.send(serialize(request));

  let resolver: PromiseSettler;

  const promise = new Promise((resolve, reject) => {
    resolver = { resolve, reject };
  });

  pendingRequests.set(id, resolver);

  return promise;
};

export const addServerListener = (cb: OnDataReceivedFromServerCallback) => {
  serverListeners.push(cb);
};

export const clearServerListeners = () => {
  serverListeners.splice(
    0,
    serverListeners.length,
  );
};

export default askServer;
