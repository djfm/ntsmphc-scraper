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
  id: string,
  message: string,
  severity: NotificationSeverity,
  createdAt: number,
  selfDestroyDelay: Milliseconds,
  userDismissible: boolean,
};

let totalNumberOfNotificationsCreated = 0;

const isBrowser = () => process.env.APP_ENV === 'browser';

const makeUniqueNotificationId = () => {
  totalNumberOfNotificationsCreated += 1;
  return `${isBrowser() ? 'browser' : 'node'}#${totalNumberOfNotificationsCreated}`;
};

export const createDefaultNotification = (): Notification => ({
  id: makeUniqueNotificationId(),
  message: '',
  // TODO not used yet graphically
  severity: 'info',
  createdAt: Date.now(),
  // TODO not implemented
  selfDestroyDelay: 0,
  // actually implemented :)
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
      return [...state, action.notification];
    }

    default: {
      return state;
    }
  }
};

export default notificationsReducer;
