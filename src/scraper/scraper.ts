import {
  makeURLHelpers,
} from '../util/url';

import {
  chromeProvider,
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

    const urlsRemaining = new Set();
    const urlsSeen = new Set();
    let nChromesRunning = 0;

    urlsRemaining.add(params.startURL);

    const startAChrome = async (): Promise<ScrapingProgress> => {
      let nURLsScraped = 0;
      const protocol = await chromeProvider();

      const killChrome = () => {
        nChromesRunning -= 1;
        protocol.terminate();
        // eslint-disable-next-line no-console
        console.log(`Killed a chrome! Remaining: ${nChromesRunning}.`);
      };

      const bail = () => {
        killChrome();
        return {
          nURLsScraped,
          results: [],
        };
      };

      if (urlsRemaining.size > 0 && nChromesRunning < params.nParallel) {
        nChromesRunning += 1;

        const processOneURL = async (): Promise<ScrapingProgress> => {
          if (urlsRemaining.size === 0) {
            return bail();
          }

          const { value: nextURL } = urlsRemaining.values().next();

          // eslint-disable-next-line no-console
          console.log(`Now scraping URL: ${nextURL} and there remain ${urlsRemaining.size}...`);

          urlsRemaining.delete(nextURL);
          urlsSeen.add(normalizeURL(nextURL));

          const result = await scrape(protocol)(nextURL);

          notifiers.notifyPageScraped(result);

          for (const [url, canonical] of result.internalURLs.entries()) {
            const toScrape = canonical || url;
            if (toScrape && !urlsSeen.has(toScrape)) {
              urlsRemaining.add(toScrape);
            }
          }

          notifiers.notifyPageScraped(result);
          nURLsScraped += 1;

          // TODO clear cookies if wanted, between two pages
          // seen by the same browser

          if (urlsRemaining.size > 0) {
            const urlsScrapedPromises: Promise<ScrapingProgress>[] = [Promise.resolve({
              nURLsScraped,
              results: [result],
            })];
            while (nChromesRunning < params.nParallel && nChromesRunning < urlsRemaining.size) {
              // wait a bit in order not to overload chrome
              // eslint-disable-next-line no-await-in-loop
              await waitMs(1000);
              // eslint-disable-next-line no-console
              console.log('Starting a chrome!');
              urlsScrapedPromises.push(startAChrome());
            }
            return Promise.all(urlsScrapedPromises).then(reduceScrapingProgresses);
          }

          return bail();
        };
        return processOneURL();
      }

      return bail();
    };

    return startAChrome();
  };
