import {
  PAYLOAD_TYPE_REDUX_ACTION,
} from '../../constants';

export const handleServerDispatchedReduxAction = (store: any) =>
  (payload: any) => {
    if (
      Object.prototype.hasOwnProperty.call(payload, 'type') &&
      payload.type === PAYLOAD_TYPE_REDUX_ACTION
    ) {
      store.dispatch(payload.action);
    }
  };

export default handleServerDispatchedReduxAction;
