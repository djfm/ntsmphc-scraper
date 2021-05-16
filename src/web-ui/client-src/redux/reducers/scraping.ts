import { AnyAction } from 'redux';

import { cloneDeep } from 'lodash';

import {
  NOTIFY_PAGE_SCRAPED,
  PageScrapedAction,
} from '../actions';

const initialState = {};

export type ProjectScrapingState = {
  lastURLsScraped: string[],
  totalURLsScraped: number,
  nCurrentlyDiscoveredURLs: number,
};

const createInitialProjectState = (): ProjectScrapingState => {
  const initialProjectState = {
    lastURLsScraped: [],
    totalURLsScraped: 0,
    nCurrentlyDiscoveredURLs: 0,
  };

  return initialProjectState;
};

const nLastURLsToDisplay = 15;

const scrapingReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case NOTIFY_PAGE_SCRAPED: {
      const scrapedAction = action as PageScrapedAction;

      const projectState = cloneDeep(state[scrapedAction.projectId] || createInitialProjectState());

      projectState.lastURLsScraped.unshift(scrapedAction.result.url);

      if (projectState.lastURLsScraped.length > nLastURLsToDisplay) {
        projectState.lastURLsScraped.pop();
      }

      projectState.totalURLsScraped += 1;

      return {
        ...state,
        [scrapedAction.projectId]: projectState,
      };
    }

    default: {
      return state;
    }
  }
};

export default scrapingReducer;
