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

const scrapingProgressesReducer = (
  accumulator: ScrapingProgress,
  current: ScrapingProgress,
): ScrapingProgress => {
  accumulator.results.push(...current.results);
  accumulator.nURLsScraped += current.nURLsScraped;
  return accumulator;
};

/**
 * A dirty hack:
 * Like promise.all except only successful promises
 * are let through.
 */
const allFulfillingPromises = (promises: Promise<any>[]): Promise<any[]> =>
  new Promise((resolve) => {
    const resolved = [];
    const rejected = [];

    const maybeResolve = () => {
      if (resolved.length + rejected.length === promises.length) {
        resolve(resolved);
      }
    };

    promises.forEach((promise) => {
      promise.then((ok) => {
        resolved.push(ok);
        maybeResolve();
      }, (ko) => {
        rejected.push(ko);
        console.error(ko);
        maybeResolve();
      });
    });
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
    const failedURLsRetries = new Map<string, number>();
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

      const killChrome = () => {
        nChromesRunning -= 1;
        chrome.terminate();
        // console.log(`[!!!] Killed a chrome! Now ${nChromesRunning} remaining.`);
      };

      let result: URLScrapingResult;
      try {
        result = await scrape(chrome)(nextURL);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(`[OOPS] Encountered error while trying to scrape page "${nextURL}":`);
        // eslint-disable-next-line no-console
        console.error(err);

        killChrome();
        return {
          nURLsScraped: 0,
          results: [],
        };
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

      killChrome();

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

        const next = scrapeWithChrome(nextURL);

        // eslint-disable-next-line no-loop-func
        next.catch((err) => {
          const retried = failedURLsRetries.get(nextURL) || 0;

          if (retried < 3) {
            // eslint-disable-next-line no-console
            console.error('Error on URL', nextURL, err);
            seenURLs.delete(nextURL);
            remainingURLs.add(nextURL);
            failedURLsRetries.set(
              nextURL,
              retried + 1,
            );
          }

          throw err;
        });

        progresses.push(next);
      }

      // TODO dirty hack to resolve properly
      // only makes things slightly better
      const reducedProgresses = allFulfillingPromises(progresses)
        .then(reduceScrapingProgresses);

      return reducedProgresses.then(async (settledProgresses) => {
        const processed = await processNextURLs();

        return reduceScrapingProgresses([settledProgresses, processed]);
      });
    };

    return processNextURLs();
  };
