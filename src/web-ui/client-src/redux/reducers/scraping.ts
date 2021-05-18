/* eslint-disable no-param-reassign */
import { AnyAction } from 'redux';

import { cloneDeep } from 'lodash';

import {
  NOTIFY_PAGE_SCRAPED,
  NOTIFY_SCRAPING_STATISTICS,
  PageScrapedAction,
} from '../actions';

import {
  ScrapingStatistics,
} from '../../../../scraper/scraper';

export type ProjectScrapingState = {
  lastURLsScraped: string[],
  totalURLsScraped: number,
  nCurrentlyDiscoveredURLs: number,
  approximatePctComplete: number,
};

const createInitialProjectState = (): ProjectScrapingState => {
  const initialProjectState = {
    lastURLsScraped: [],
    totalURLsScraped: 0,
    nCurrentlyDiscoveredURLs: 0,
    approximatePctComplete: 0,
  };

  return initialProjectState;
};

type ScrapingState = {
  [key: number]: ProjectScrapingState;
}

const initialState: ScrapingState = {};

type ProjectStateMutator = (projectState: ProjectScrapingState) => any;

const nLastURLsToDisplay = 15;

const scrapingReducer = (state: ScrapingState = initialState, action: AnyAction) => {
  const mutateProjectState = (projectId: number) =>
    (mutator: ProjectStateMutator): ScrapingState => {
      const projectState = cloneDeep(state[projectId] || createInitialProjectState());
      mutator(projectState);
      return {
        ...state,
        [projectId]: projectState,
      };
    };

  switch (action.type) {
    case NOTIFY_PAGE_SCRAPED: {
      const scrapedAction = action as PageScrapedAction;
      return mutateProjectState(action.projectId)((projectState) => {
        projectState.lastURLsScraped.unshift(scrapedAction.result.url);
        if (projectState.lastURLsScraped.length > nLastURLsToDisplay) {
          projectState.lastURLsScraped.pop();
        }
        projectState.totalURLsScraped += 1;
      });
    }

    case NOTIFY_SCRAPING_STATISTICS: {
      return mutateProjectState(action.projectId)((projectState) => {
        const statistics = action.statistics as ScrapingStatistics;
        projectState.nCurrentlyDiscoveredURLs = statistics.nRemainingURLs + statistics.nSeenURLs;
        projectState.approximatePctComplete = statistics.approximatePctComplete;
      });
    }

    default: {
      return state;
    }
  }
};

export default scrapingReducer;
