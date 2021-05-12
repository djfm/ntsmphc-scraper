import {
  AnyAction,
} from 'redux';

import {
  createDefaultNotification,
  Notification,
} from './reducers/notifications';

export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';
export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';

export const SET_PROJECTS = 'SET_PROJECTS';
export const DELETE_PROJECT = 'DELETE_PROJECT';

export const addNotificationAction = (data: any = {}) => {
  const notification = {
    ...createDefaultNotification(),
    ...data,
  };
  return {
    type: ADD_NOTIFICATION,
    notification,
  };
};

export function removeNotificationAction(id: number): AnyAction;
export function removeNotificationAction(notification: Notification): AnyAction;
export function removeNotificationAction(idOrObject: number | Notification): AnyAction {
  if (typeof idOrObject === 'number') {
    return {
      type: REMOVE_NOTIFICATION,
      id: idOrObject,
    };
  }
  return {
    type: REMOVE_NOTIFICATION,
    id: idOrObject.id,
  };
}

export const setProjectsAction = (projects: object[]) => ({
  type: SET_PROJECTS,
  projects,
});

export const deleteProjectAction = (id: number) => ({
  type: DELETE_PROJECT,
  id,
});
