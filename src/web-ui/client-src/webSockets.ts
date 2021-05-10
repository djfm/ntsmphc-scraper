const { host } = window.location;

type ResolvablePromise = {
  promise: Promise<any>;
  resolve: (data: any) => any;
}

let socket: WebSocket;
let nextRequestId = 0;
const pendingRequests = new Map<number, ResolvablePromise>();

const connectToServer = async () => new Promise<WebSocket>((resolve) => {
  const s = new WebSocket(`ws://${host}/wss-internal`);
  s.addEventListener('open', () => {
    resolve(s);
  });

  s.addEventListener('message', (event) => {
    const { requestId, data } = JSON.parse(event.data);
    pendingRequests.get(requestId).resolve(data);
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

  let rp: ResolvablePromise;

  rp.promise = new Promise((resolve) => {
    rp.resolve = (data) => {
      pendingRequests.delete(nextRequestId);
      resolve(data);
    };
  });

  pendingRequests.set(nextRequestId, rp);

  nextRequestId += 1;

  return rp.promise;
};

export default askServer;
