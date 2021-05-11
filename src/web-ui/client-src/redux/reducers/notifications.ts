import {
  ADD_NOTIFICATION,
  REMOVE_NOTIFICATION,
} from '../actions';

const initialState = [];

const notificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case REMOVE_NOTIFICATION: {
      return state.filter(
        (notification) => (notification.id === action.id),
      );
    }

    case ADD_NOTIFICATION: {
      return [action.notification, ...state];
    }

    default: {
      return state;
    }
  }
};

export default notificationsReducer;
