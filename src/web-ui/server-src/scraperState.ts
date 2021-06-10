import {
  ScrapingStatistics,
} from '../../scraper/types';

import {
  ScraperState,
  ScraperProjectState,
  IsScrapingState,
  defaultScraperProjectState,
} from './types';

export const scraperState: ScraperState = {};

export const getScraperProjectState = (projectId: number = undefined) =>
  scraperState[projectId] || defaultScraperProjectState();

const updateProjectState = (projectId: number) => (fn: (st: ScraperProjectState) => object) => {
  if (!scraperState[projectId]) {
    scraperState[projectId] = defaultScraperProjectState();
  }

  scraperState[projectId] = {
    ...scraperState[projectId],
    ...fn(scraperState[projectId]),
  };

  return scraperState;
};

export const setIsScraping = (projectId: number, isScraping: IsScrapingState) =>
  updateProjectState(projectId)(() => ({
    isScraping,
  }));

export const setStatistics = (projectId: number, statistics: ScrapingStatistics) =>
  updateProjectState(projectId)(() => ({
    statistics,
  }));

export default scraperState;
