import {
  makeURLHelpers,
} from '../util/url';

import {
  chromeProvider,
} from './chromeProvider';

import {
  URLScrapingResult,
  scrapeURL,
} from './scrapeURL';

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

export type ScraperNotifiers = {
  notifyPageScraped: (result: URLScrapingResult) => any;
};

const scrapingProgressesReducer = (
  accumulator: ScrapingProgress,
  current: ScrapingProgress,
): ScrapingProgress => {
  accumulator.results.push(...current.results);
  accumulator.nURLsScraped += current.nURLsScraped;
  return accumulator;
};

const reduceScrapingProgresses = (progresses: ScrapingProgress[]): ScrapingProgress =>
  progresses.reduce(scrapingProgressesReducer, {
    nURLsScraped: 0,
    results: [],
  });

export const startScraping = (notifiers: ScraperNotifiers) =>
  async (params: ScrapingTaskParams) : Promise<ScrapingProgress> => {
    const {
      isInternalURL,
      normalizeURL,
    } = makeURLHelpers(params.startURL);

    const scrape = scrapeURL(isInternalURL, normalizeURL);

    const remainingURLs = new Set();
    const seenURLs = new Set();
    let nChromesRunning = 0;

    remainingURLs.add(params.startURL);

    const addNewURLSFromResult = (result: URLScrapingResult) => {
      for (const [regularURL, canonicalURL] of result.internalURLs.entries()) {
        const url = normalizeURL(canonicalURL || regularURL);
        if (!seenURLs.has(url)) {
          remainingURLs.add(url);
        }
      }
    };

    const scrapeWithChrome = async (nextURL: string): Promise<ScrapingProgress> => {
      nChromesRunning += 1;
      // console.log(`Starting A chrome !! Now ${nChromesRunning} running.`);

      const chrome = await chromeProvider();
      const result = await scrape(chrome)(nextURL);

      notifiers.notifyPageScraped(result);
      addNewURLSFromResult(result);

      nChromesRunning -= 1;
      chrome.terminate();
      // console.log(`[!!!] Killed a chrome! Now ${nChromesRunning} remaining.`);

      return {
        nURLsScraped: 1,
        results: [result],
      };
    };

    const processNextURLs = async (): Promise<ScrapingProgress> => {
      const scrapingProgresses: Promise<ScrapingProgress>[] = [];

      if (remainingURLs.size === 0) {
        return {
          nURLsScraped: 0,
          results: [],
        };
      }

      while (remainingURLs.size > 0 && nChromesRunning < params.nParallel) {
        const nextURL = remainingURLs.values().next().value;
        remainingURLs.delete(nextURL);
        seenURLs.add(normalizeURL(nextURL));

        const next = scrapeWithChrome(nextURL);

        scrapingProgresses.push(next);

        next.then(() => {
          scrapingProgresses.push(processNextURLs());
        });
      }

      return Promise.all(scrapingProgresses).then(reduceScrapingProgresses);
    };

    return processNextURLs();
  };
