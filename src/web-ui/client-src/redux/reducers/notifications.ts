import {
  AnyAction,
} from 'redux';

import {
  ADD_NOTIFICATION,
  REMOVE_NOTIFICATION,
} from '../actions';

export type NotificationSeverity = 'info' | 'success' | 'error' | 'warning';
export type Milliseconds = number;

export type Notification = {
  id: number,
  message: string,
  moreInfo: '',
  severity: NotificationSeverity,
  createdAt: number,
  selfDestroyDelay: Milliseconds,
  userDismissible: boolean,
};

let totalNumberOfNotificationsCreated = 0;

const makeUniqueNotificationId = () => {
  totalNumberOfNotificationsCreated += 1;
  return totalNumberOfNotificationsCreated;
};

export const createDefaultNotification = (): Notification => ({
  id: makeUniqueNotificationId(),
  message: '',
  moreInfo: '',
  severity: 'info',
  createdAt: Date.now(),
  selfDestroyDelay: 0,
  userDismissible: true,
});

const initialState = [];

const notificationsReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case REMOVE_NOTIFICATION: {
      return state.filter(
        (notification) => (notification.id !== action.id),
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
