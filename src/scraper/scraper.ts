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

export type ScrapingStatistics = {
  nRemainingURLs: number;
  nSeenURLs: number;
  approximatePctComplete: number;
};

export type ScraperNotifiers = {
  notifyPageScraped: (result: URLScrapingResult) => any;
  notifyStatistics: (statistics: ScrapingStatistics) => any;
};

const waitMs = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const scrapingProgressesReducer = (
  accumulator: ScrapingProgress,
  current: ScrapingProgress,
): ScrapingProgress => ({
  nURLsScraped: accumulator.nURLsScraped + current.nURLsScraped,
  results: [...accumulator.results, ...current.results],
});

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

    const scrapeWithChrome = async (
      nextURL: string,
      tryCount: number = 0,
    ): Promise<ScrapingProgress> => {
      nChromesRunning += 1;
      // console.log(`Starting A chrome !! Now ${nChromesRunning} running.`);
      const chrome = await chromeProvider();

      const killChrome = async () => {
        await chrome.terminate();
        nChromesRunning -= 1;
        // console.log(`[!!!] Killed a chrome! Now ${nChromesRunning} remaining.`);
      };

      let result: URLScrapingResult;
      try {
        result = await (scrape(chrome)(nextURL));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(`[OOPS] Encountered error while trying to scrape page "${nextURL}":`);
        // eslint-disable-next-line no-console
        console.error(err);
        if (tryCount < 3) {
          await waitMs(1000);
          const retry = await scrapeWithChrome(nextURL, tryCount + 1);
          return retry;
        }

        return {
          nURLsScraped: 0,
          results: [],
        };
      } finally {
        await killChrome();
      }

      notifiers.notifyPageScraped(result);

      notifiers.notifyStatistics({
        nSeenURLs: seenURLs.size,
        nRemainingURLs: remainingURLs.size,
        // approximate because we discover more and more
        // pages to scrape as we go...
        approximatePctComplete: Math.round(
          (100 * seenURLs.size) / (seenURLs.size + remainingURLs.size),
        ),
      });

      addNewURLSFromResult(result);

      return {
        nURLsScraped: 1,
        results: [result],
      };
    };

    const processNextURLs = async (): Promise<ScrapingProgress> => {
      const progresses: Promise<ScrapingProgress>[] = [];

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

        const next = scrapeWithChrome(nextURL).then(
          (p) => processNextURLs().then((ps) => reduceScrapingProgresses([p, ps])),
        );

        progresses.push(next);
      }

      return Promise.all(progresses).then(reduceScrapingProgresses);
    };

    return processNextURLs();
  };
