import {
  makeURLHelpers,
} from '../util/url';

import {
  chromeProvider,
  NetworkResponse,
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

export type ProjectScrapeResult = {
  internalResponses: NetworkResponse[],
  externalResponses: NetworkResponse[],
  nPagesScraped: number,
};

export type ScraperNotifiers = {
  notifyPageScraped: (result: ScrapeResult) => any;
};

const waitMs = async (milliseconds: number) => new Promise((resolve) => {
  setTimeout(resolve, milliseconds);
});

export const startScraping = (notifiers: ScraperNotifiers) =>
  async (params: ScrapingTaskParams) : Promise<ProjectScrapeResult> => {
    const {
      isInternalURL,
      normalizeURL,
    } = makeURLHelpers(params.startURL);

    const scrape = scrapeURL(isInternalURL, normalizeURL);

    const urlsRemaining = new Set();
    const urlsSeen = new Set();
    let nChromesRunning = 0;

    const internalResponses: NetworkResponse[] = [];
    const externalResponses: NetworkResponse[] = [];
    const responsesSeen = new Set<string>();

    urlsRemaining.add(params.startURL);

    const startAChrome = async (): Promise<number> => {
      let urlsScrapedCount = 0;
      if (urlsRemaining.size > 0 && nChromesRunning < params.nParallel) {
        nChromesRunning += 1;

        const protocol = await chromeProvider();

        protocol.Network.responseReceived(({ response }) => {
          const { status } = response;
          const url = normalizeURL(response.url);
          const referer = response?.requestHeaders?.Referer || '';

          const uid = [status, url, referer].join('¤');

          const resp: NetworkResponse = {
            url,
            referer: referer ? normalizeURL(response.referer) : undefined,
            status,
          };

          if (!responsesSeen.has(uid)) {
            responsesSeen.add(uid);
            const storage = isInternalURL(url) ? internalResponses : externalResponses;
            storage.push(resp);

            // eslint-disable-next-line no-console
            console.log('[NNN] Got network response:', resp);
          }
        });

        const killChrome = () => {
          nChromesRunning -= 1;
          protocol.terminate();
          // eslint-disable-next-line no-console
          console.log(`Killed a chrome! Remaining: ${nChromesRunning}.`);
        };

        const processOneURL = async (): Promise<number> => {
          if (urlsRemaining.size === 0) {
            killChrome();
            return urlsScrapedCount;
          }

          const { value: nextURL } = urlsRemaining.values().next();

          // eslint-disable-next-line no-console
          console.log(`Now scraping URL: ${nextURL} and there remain ${urlsRemaining.size}...`);

          urlsRemaining.delete(nextURL);
          urlsSeen.add(normalizeURL(nextURL));

          const result = await scrape(protocol)(nextURL);

          for (const [url, canonical] of result.internalURLs.entries()) {
            const toScrape = canonical || url;
            if (toScrape && !urlsSeen.has(toScrape)) {
              urlsRemaining.add(toScrape);
            }
          }

          notifiers.notifyPageScraped(result);
          urlsScrapedCount += 1;

          // TODO clear cookies here if wanted, between two pages
          // seen by the same browser

          if (urlsRemaining.size > 0) {
            const urlsScrapedPromises = [processOneURL()];
            while (nChromesRunning < params.nParallel && nChromesRunning < urlsRemaining.size) {
              // wait a bit in order not to overload chrome
              // eslint-disable-next-line no-await-in-loop
              await waitMs(1000);
              // eslint-disable-next-line no-console
              console.log('Starting a chrome!');
              urlsScrapedPromises.push(startAChrome());
            }
            return Promise.all(urlsScrapedPromises).then(
              (counts) => counts.reduce((total, current) => total + current, 0),
            );
          }
          killChrome();
          return urlsScrapedCount;
        };

        return processOneURL();
      }

      return urlsScrapedCount;
    };

    return startAChrome().then((
      (nPagesScraped: number) => {
        const result: ProjectScrapeResult = {
          internalResponses,
          externalResponses,
          nPagesScraped,
        };

        return result;
      }
    ));
  };
