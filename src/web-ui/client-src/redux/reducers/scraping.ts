/* eslint-disable no-param-reassign */
import { AnyAction } from 'redux';

import { cloneDeep } from 'lodash';

import {
  NOTIFY_PAGE_SCRAPED,
  NOTIFY_SCRAPING_STATISTICS,
  SET_SCRAPER_STATE,
  PageScrapedAction,
} from '../actions';

import {
  ScraperProjectState,
  defaultScraperProjectState,
} from '../../../server-src/scraperState';

export type ProjectScrapingState = {
  lastURLsScraped: string[];
} & ScraperProjectState;

const createInitialProjectState = (): ProjectScrapingState => {
  const initialProjectState = {
    lastURLsScraped: [],
    ...defaultScraperProjectState(),
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
        projectState.isScraping = true;
        projectState.lastURLsScraped.unshift(scrapedAction.result.url);
        if (projectState.lastURLsScraped.length > nLastURLsToDisplay) {
          projectState.lastURLsScraped.pop();
        }
      });
    }

    case NOTIFY_SCRAPING_STATISTICS: {
      return mutateProjectState(action.projectId)((projectState) => {
        projectState.statistics = action.statistics;
      });
    }

    case SET_SCRAPER_STATE: {
      return Object.entries(action.scraperState).reduce(
        (scrapingState, [key, value]) => {
          const knownState = value as ScraperProjectState;
          return {
            ...scrapingState,
            [key]: { ...createInitialProjectState(), ...knownState },
          };
        },
        {},
      );
    }

    default: {
      return state;
    }
  }
};

export default scrapingReducer;
