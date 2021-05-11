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

const connectToServer = async () => new Promise<WebSocket>((resolveConnection) => {
  const s = new WebSocket(`ws://${host}/wss-internal`);
  s.addEventListener('open', () => {
    resolveConnection(s);
  });

  s.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
      if (pendingRequests.has(data.id)) {
        const { resolve, reject } = pendingRequests.get(data.id);
        if (data.err) {
          reject(data.err);
        } else {
          resolve(data.response);
        }
        pendingRequests.delete(data.id);
      } else {
        // eslint-disable-next-line no-console
        console.log('Received JSON message I could not understand: ', data);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  });
});

export const askServer = async (action: string, params: object) => {
  if (!socket) {
    socket = await connectToServer();
  }

  const request = {
    id: nextRequestId,
    action,
    params,
  };

  socket.send(JSON.stringify(request));

  let resolver: PromiseSettler;

  const promise = new Promise((resolve, reject) => {
    resolver = { resolve, reject };
  });

  pendingRequests.set(nextRequestId, resolver);

  nextRequestId += 1;

  return promise;
};

export default askServer;
