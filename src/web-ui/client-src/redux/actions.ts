import {
  AnyAction,
} from 'redux';

import {
  createDefaultNotification,
  Notification,
} from './reducers/notifications';

import {
  URLScrapingResult,
} from '../../../scraper/scrapeURL';

import {
  ScrapingStatistics,
} from '../../../scraper/scraper';

export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';
export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';

export const SET_PROJECTS = 'SET_PROJECTS';
export const DELETE_PROJECT = 'DELETE_PROJECT';
export const ADD_PROJECT = 'ADD_PROJECT';

export const NOTIFY_PAGE_SCRAPED = 'NOTIFY_PAGE_SCRAPED';
export const NOTIFY_SCRAPING_STATISTICS = 'NOTIFY_SCRAPING_STATISTICS';

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

export const deleteProjectAction = ({ projectId }) => ({
  type: DELETE_PROJECT,
  projectId,
});

export const addProjectAction = (project: any) => ({
  type: ADD_PROJECT,
  project,
});

export type PageScrapedAction = {
  type: typeof NOTIFY_PAGE_SCRAPED;
  projectId: number;
  result: {
    url: string;
  };
};

export const notifyPageScrapedAction =
  (projectId: number, result: URLScrapingResult): PageScrapedAction => ({
    type: NOTIFY_PAGE_SCRAPED,
    projectId,
    result: {
      url: result.url,
    },
  });

export const notifyScrapingStatisticsAction =
  (projectId: number, statistics: ScrapingStatistics) => ({
    type: NOTIFY_SCRAPING_STATISTICS,
    projectId,
    statistics,
  });
