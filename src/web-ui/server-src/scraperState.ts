import {
  ScrapingStatistics,
  defaultScrapingStatistics,
} from '../../scraper/types';

export type IsScrapingState = false | true | 'done';

export type ScraperProjectState = {
  isScraping: IsScrapingState;
  statistics: ScrapingStatistics;
};

export type ScraperState = {
  [key: number]: ScraperProjectState;
};

export const scraperState: ScraperState = {};

const defaultScraperProjectState = (): ScraperProjectState => ({
  isScraping: false,
  statistics: defaultScrapingStatistics(),
});

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
