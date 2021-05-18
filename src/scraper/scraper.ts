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
      // console.log(`[!!!] Killed a chrome! Now ${nChromesRunning} remaining.`);

      return {
        nURLsScraped: 1,
        results: [result],
      };
    };

    const processNextURLs = async (): Promise<ScrapingProgress> => {
      const scrapingProgresses: Promise<ScrapingProgress>[] = [];

      const processWithChrome = async () => {
        nChromesRunning += 1;
        const chrome = await chromeProvider();
        // console.log(`[!!!] Created a chrome (now ${nChromesRunning} running)`);
        return processNextURLandGoOn(chrome);
      };

      while (remainingURLs.size > 0 && nChromesRunning < params.nParallel) {
        scrapingProgresses.push(processWithChrome());
      }

      const progresses = await Promise.all(scrapingProgresses);
      const summary = reduceScrapingProgresses(progresses);

      if (remainingURLs.size > 0) {
        return processNextURLs().then((nextProgress) => ({
          nURLsScraped: summary.nURLsScraped + nextProgress.nURLsScraped,
          results: summary.results.concat(...nextProgress.results),
        }));
      }

      return summary;
    };

    return processNextURLs();
  };
