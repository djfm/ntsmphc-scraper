import {
  AnyAction,
} from 'redux';

import {
  createDefaultNotification,
  Notification,
} from './reducers/notifications';

import {
  ScrapeResult,
} from '../../../scraper/scraper';

export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';
export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';

export const SET_PROJECTS = 'SET_PROJECTS';
export const DELETE_PROJECT = 'DELETE_PROJECT';
export const ADD_PROJECT = 'ADD_PROJECT';

export const NOTIFY_PAGE_SCRAPED = 'NOTIFY_PAGE_SCRAPED';

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

export const addProjectAction = (project: any) => ({
  type: ADD_PROJECT,
  project,
});

export type PageScrapedAction = {
  type: typeof NOTIFY_PAGE_SCRAPED;
  projectId: number;
  result: ScrapeResult;
};

export const notifyPageScrapedAction =
  (projectId: number, result: ScrapeResult): PageScrapedAction => ({
    type: NOTIFY_PAGE_SCRAPED,
    projectId,
    result,
  });
