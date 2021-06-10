import {
  makeURLHelpers,
} from '../util/url';

import {
  chromeProvider,
} from './chromeProvider';

import {
  URLScrapingResult,
  createURLScrapingResult,
  createURLProblem,
  ScrapeParams,
  ScrapingProgress,
  ScraperNotifiers,
  ScrapingTaskParams,
} from './types';

import {
  scrapeURL,
  addURLProblem,
} from './scrapeURL';

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

    const scrape = scrapeURL({
      isInternalURL,
      normalizeURL,
    });

    const remainingURLs = new Map();
    const seenURLs = new Set();
    let nChromesRunning = 0;

    remainingURLs.set(params.startURL, '');

    const addNewURLSFromResult = (result: URLScrapingResult) => {
      for (const [regularURL, canonicalURL] of result.internalURLs.entries()) {
        const url = normalizeURL(canonicalURL || regularURL);
        if (!seenURLs.has(url)) {
          remainingURLs.set(url, result.url);
        }
      }
    };

    const scrapeWithChrome = async ({
      nonNormalizedURL,
      foundOnURL,
    } : ScrapeParams,
    tryCount: number = 0): Promise<ScrapingProgress> => {
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
        result = await (scrape(chrome)({
          nonNormalizedURL,
          foundOnURL,
        }));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(`[OOPS] Encountered error while trying to scrape page "${nonNormalizedURL}":`);
        // eslint-disable-next-line no-console
        console.error(err);
        if (tryCount < 3) {
          await waitMs(1000);
          const retry = await scrapeWithChrome({
            nonNormalizedURL,
            foundOnURL,
          },
          tryCount + 1);
          return retry;
        }

        const failedResult = createURLScrapingResult();
        failedResult.url = normalizeURL(nonNormalizedURL);
        addURLProblem(failedResult)({
          ...createURLProblem(),
          url: failedResult.url,
          message: `The page could not be scraped after ${tryCount} tries.`,
        });

        return {
          nURLsScraped: 1,
          results: [failedResult],
        };
      } finally {
        await killChrome();
      }

      notifiers.notifyPageScraped(result);

      notifiers.notifyStatistics({
        nSeenURLs: seenURLs.size,
        nRemainingURLs: remainingURLs.size,
        nDiscoveredURLs: seenURLs.size + remainingURLs.size,
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
        const [nonNormalizedURL, foundOnURL] = remainingURLs.entries().next().value;
        remainingURLs.delete(nonNormalizedURL);
        seenURLs.add(normalizeURL(nonNormalizedURL));

        const next = scrapeWithChrome({
          nonNormalizedURL,
          foundOnURL,
        }, 0).then(
          (p) => processNextURLs().then((ps) => reduceScrapingProgresses([p, ps])),
        );

        progresses.push(next);
      }

      return Promise.all(progresses).then(reduceScrapingProgresses);
    };

    return processNextURLs();
  };

export default startScraping;
