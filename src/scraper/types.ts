import {
  canonicalUrlString,
  URLPredicate,
} from '../util/url';

export type ScrapingTaskParams = {
  projectId: number;
  startURL: string;
  /**
   * How many headless chrome instances to launch.
   */
  nParallel: number;
};

export type ScrapingProgress = {
  nURLsScraped: number,
  results: URLScrapingResult[],
}

export type ScrapingStatistics = {
  nRemainingURLs: number;
  nSeenURLs: number;
  nDiscoveredURLs: number;
  approximatePctComplete: number;
};

export const defaultScrapingStatistics = () => ({
  nRemainingURLs: 0,
  nSeenURLs: 0,
  nDiscoveredURLs: 0,
  approximatePctComplete: 0,
});

export type URLProblem = {
  url: string;
  isValid: boolean;
  status: number;
  message: string;
  referer: string;
};

export const createURLProblem = () => ({
  url: '',
  isValid: true,
  status: -1,
  message: '',
  referer: '',
});

export type NetworkResponse = {
  url: string,
  referer?: string,
  status: number,
};

export type URLScrapingResult = {
  url: string;
  status: number;
  title: string;
  canonical: string;
  internalURLs: Map<string, canonicalUrlString>;
  externalURLs: Map<string, canonicalUrlString>;
  internalResources: Map<string, NetworkResponse>;
  externalResources: Map<string, NetworkResponse>;
  problematicURLs: URLProblem[];
};

export const createURLScrapingResult = () => ({
  url: '',
  status: 0,
  title: '',
  canonical: '',
  internalURLs: new Map(),
  externalURLs: new Map(),
  internalResources: new Map(),
  externalResources: new Map(),
  problematicURLs: [],
});

export type StrToStrFunc = (input: string) => string;

export type ScrapeParams = {
  nonNormalizedURL: string,
  foundOnURL: string,
};

export type ScrapeURLUtils = {
  isInternalURL: URLPredicate,
  normalizeURL: StrToStrFunc,
};

export type ScraperNotifiers = {
  notifyPageScraped: (result: URLScrapingResult) => any;
  notifyStatistics: (statistics: ScrapingStatistics) => any;
};

export type ScrapingAbortFlagHolder = {
  abort: boolean;
};

export const emptyProgress = (): ScrapingProgress => ({
  nURLsScraped: 0,
  results: [],
});
