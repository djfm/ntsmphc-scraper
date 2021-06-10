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

export const defaultScraperProjectState = (): ScraperProjectState => ({
  isScraping: false,
  statistics: defaultScrapingStatistics(),
});
