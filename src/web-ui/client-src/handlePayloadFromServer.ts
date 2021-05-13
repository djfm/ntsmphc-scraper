import {
  PAYLOAD_TYPE_REDUX_ACTION,
} from '../../constants';

const handlePayloadFromServer = (store: any) =>
  (payload: Map<string, any>) => {
    // eslint-disable-next-line no-console
    console.log('Received data from server!!', payload);

    if (payload.has('type')) {
      switch (payload.get('type')) {
        case PAYLOAD_TYPE_REDUX_ACTION: {
          store.dispatch(payload.get('action'));
          break;
        }

        default: {
          // eslint-disable-next-line no-console
          console.warn(`Unhandled payload received with type "${payload.get('type')}".`);
        }
      }
    }
  };

export default handlePayloadFromServer;
