import {
  ProjectScrapingState,
} from './reducers/scraping';

import {
  IsScrapingState,
} from '../../server-src/types';

export const getAllNotifications = (store: any) => store.notifications;

export const getAllProjects = (store: any) => store.projects;

export const getProjectById = (id: number) => (store: any) => {
  const projects = store.projects as any[];
  return projects.find((project) => project.id === id);
};

export const getProjectScrapingState = (projectId: number) => (store: any): ProjectScrapingState =>
  store.scraping[projectId];

export const getProjectIsScraping = (projectId: number) => (store: any): IsScrapingState => {
  const projectState = store.scraping[projectId];
  if (projectState) {
    return projectState.isScraping;
  }

  return false;
};
