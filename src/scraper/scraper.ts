import {
  makeURLHelpers,
} from '../util/url';

import {
  chromeProvider,
  ChromeProtocol,
} from './chromeProvider';

import {
  ScrapeResult,
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
  results: ScrapeResult[],
}

export type ScraperNotifiers = {
  notifyPageScraped: (result: ScrapeResult) => any;
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

const waitMs = async (milliseconds: number) => new Promise((resolve) => {
  setTimeout(resolve, milliseconds);
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

    const processNextURLandGoOn = async (chrome: ChromeProtocol): Promise<ScrapingProgress> => {
      const nextURL = remainingURLs.values().next().value;
      remainingURLs.delete(nextURL);
      seenURLs.add(normalizeURL(nextURL));

      const result = await scrape(chrome)(nextURL);

      notifiers.notifyPageScraped(result);

      for (const [regularURL, canonicalURL] of result.internalURLs.entries()) {
        const url = normalizeURL(canonicalURL || regularURL);
        if (!seenURLs.has(url)) {
          remainingURLs.add(url);
        }
      }

      if (remainingURLs.size > 0) {
        return processNextURLandGoOn(chrome).then((progress) => ({
          nURLsScraped: progress.nURLsScraped + 1,
          results: progress.results.concat(result),
        }));
      }

      chrome.terminate();
      nChromesRunning -= 1;
      // eslint-disable-next-line no-console
      console.log(`Killed a chrome! Now ${nChromesRunning} remaining.`);

      return {
        nURLsScraped: 1,
        results: [result],
      };
    };

    const processNextURLs = async (): Promise<ScrapingProgress> => {
      const scrapingProgresses: Promise<ScrapingProgress>[] = [];

      const processWithChrome = () => {
        chromeProvider().then((chrome: ChromeProtocol) => {
          nChromesRunning += 1;
          // eslint-disable-next-line no-console
          console.log(`Created a chrome (now ${nChromesRunning} running)`);
          scrapingProgresses.push(
            processNextURLandGoOn(chrome),
          );
        });
      };

      while (remainingURLs.size > 0 && nChromesRunning < params.nParallel) {
        // I really don't understand why this makes a difference...
        // eslint-disable-next-line no-await-in-loop
        await waitMs(500);
        processWithChrome();
      }

      return Promise.all(scrapingProgresses)
        .then(reduceScrapingProgresses)
        .then((progress) => {
          if (remainingURLs.size > 0) {
            return processNextURLs();
          }
          return progress;
        });
    };

    return processNextURLs();
  };
