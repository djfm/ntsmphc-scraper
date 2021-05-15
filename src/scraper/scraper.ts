import {
  makeURLHelpers,
  urlString,
  canonicalUrlString,
  URLPredicate,
  isJavascriptURL,
} from '../util/url';

import {
  keyValueArrayToMap,
} from '../util/functional';

import {
  ChromeProtocol,
  ChromeDOM,
  chromeProvider,
} from './chromeProvider';

export type ScrapingTaskParams = {
  projectId: number;
  startURL: string;
  /**
   * How many headless chrome instances to launch.
   */
  nParallel: number;
};

export type URLProblem = {
  url: urlString;
  isValid: boolean;
  statusCode: number;
  message: string;
};

export type ScrapeResult = {
  url: urlString;
  title: string;
  canonical: urlString;
  internalURLs: Map<urlString, canonicalUrlString>;
  externalURLs: Map<urlString, canonicalUrlString>;
  problematicURLs: Map<urlString, URLProblem[]>;
};

export type ScraperNotifiers = {
  notifyPageScraped: (result: ScrapeResult) => any;
};

type StrToStrFunc = (input: string) => string;

const extractCanonical = async (
  rootNodeId: number,
  DOM: ChromeDOM,
): Promise<urlString | undefined> => {
  const link = await DOM.querySelector({
    nodeId: rootNodeId,
    selector: 'head link[rel=canonical]',
  });

  if (link.nodeId === 0) {
    return undefined;
  }

  const { attributes } = await DOM.getAttributes({
    nodeId: link.nodeId,
  });

  const attributesMap = keyValueArrayToMap(attributes);
  return attributesMap.get('href');
};

const scrapeURL = (
  isInternalURL: URLPredicate,
  normalizeURL: StrToStrFunc,
) => (protocol: ChromeProtocol) =>
  async (nonNormalizedURL: urlString): Promise<ScrapeResult> =>
    new Promise((resolve, reject) => {
      const url = normalizeURL(nonNormalizedURL);

      const result: ScrapeResult = {
        url,
        title: undefined,
        canonical: undefined,
        internalURLs: new Map<urlString, canonicalUrlString>(),
        externalURLs: new Map<urlString, canonicalUrlString>(),
        problematicURLs: new Map<urlString, URLProblem[]>(),
      };

      const addURLProblem = (oops: URLProblem) => {
        if (!result.problematicURLs.has(url)) {
          result.problematicURLs.set(url, []);
        }
        result.problematicURLs.get(url).push(oops);
      };

      protocol.Page.loadEventFired(async () => {
        const doc = await protocol.DOM.getDocument({
          // retrieve the full DOM tree, we'll need it
          depth: -1,
        });

        const maybeCanonical = await extractCanonical(
          doc.root.nodeId,
          protocol.DOM,
        );

        if (maybeCanonical !== undefined) {
          result.canonical = normalizeURL(maybeCanonical);
        }

        const titleRef = await protocol.DOM.querySelector({
          nodeId: doc.root.nodeId,
          selector: 'head title',
        });

        if (titleRef.nodeId === 0) {
          const oops: URLProblem = {
            url,
            isValid: true,
            message: 'Page has no title tag in <head>.',
            // TODO determine status
            // probably using Network.LoaderId
            // that is MAYBE returned by Page.navigate
            // and then using the Network API
            // see: https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-navigate
            statusCode: 0,
          };

          addURLProblem(oops);
        } else {
          const titleDesc = await protocol.DOM.describeNode({
            nodeId: titleRef.nodeId,
            depth: -1,
          });

          result.title = titleDesc.node.children[0].nodeValue;
        }

        // now for the fun part, getting ready to recurse
        const links = await protocol.DOM.querySelectorAll({
          nodeId: doc.root.nodeId,
          selector: 'a',
        });

        const linksAttributes = await Promise.all(
          links.nodeIds.map(
            (nodeId) => protocol.DOM.getAttributes({ nodeId }),
          ),
        );

        for (const link of linksAttributes) {
          const attrsMap = keyValueArrayToMap(
            link.attributes,
          );

          const linkCanonical = normalizeURL(attrsMap.get('canonical'));
          const href = normalizeURL(attrsMap.get('href'));

          const to = linkCanonical || href;

          if (!to) {
            // TODO handle this case properly
            // dunno what it means...
            // eslint-disable-next-line no-console
            console.log(`[!!!] Link with no URL found on page ${url}, dunno if bad or not.`);
          } else if (isJavascriptURL(to)) {
            // TODO handle javascript URLs
            // we have chrome, we can click on them!
            // but I wanna get the base scenario running
            // before tackling that issue
            // eslint-disable-next-line no-console
            console.log(`[###] Javascript link found on page ${url}: ${to}`);
          } else {
            const targetMap = isInternalURL(to) ?
              result.internalURLs :
              result.externalURLs;

            targetMap.set(href, linkCanonical);
          }
        }

        resolve(result);
      });

      try {
        protocol.Page.navigate({ url });
      } catch (e) {
        if (e?.response?.code === -32000) {
          // This error is: "Cannot navigate to invalid URL".
          // This should happen rarely as we won't try to
          // navigate to "javascript:" URLs, but we record the
          // issue if it happens.
          const oops: URLProblem = {
            url,
            isValid: false,
            message: 'Invalid URL found.',
            statusCode: -1,
          };
          addURLProblem(oops);
        } else {
          reject(e);
        }
      }
    });

export const waitMs = async (milliseconds: number) => new Promise((resolve) => {
  setTimeout(resolve, milliseconds);
});

export const startScraping = (notifiers: ScraperNotifiers) =>
  async (params: ScrapingTaskParams) => {
    const {
      isInternalURL,
      normalizeURL,
    } = makeURLHelpers(params.startURL);

    const scrape = scrapeURL(isInternalURL, normalizeURL);

    const urlsRemaining = new Set();
    const urlsSeen = new Set();
    let nChromesRunning = 0;

    urlsRemaining.add(params.startURL);

    const startAChrome = async (): Promise<number> => {
      let urlsScrapedCount = 0;
      if (urlsRemaining.size > 0 && nChromesRunning < params.nParallel) {
        nChromesRunning += 1;

        const protocol = await chromeProvider();

        const processOneURL = async (): Promise<number> => {
          if (urlsRemaining.size === 0) {
            return urlsScrapedCount;
          }

          const { value: nextURL } = urlsRemaining.values().next();

          console.log(`Now scraping URL: ${nextURL} and there remain ${urlsRemaining.size}...`);

          urlsRemaining.delete(nextURL);
          urlsSeen.add(normalizeURL(nextURL));

          const result = await scrape(protocol)(params.startURL);

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
            processOneURL();
            const chromesStarted = [];
            while (nChromesRunning < params.nParallel && nChromesRunning < urlsRemaining.size) {
              // wait a bit in order not to overload chrome
              waitMs(500);
              console.log('Starting a chrome!');
              chromesStarted.push(startAChrome());
            }
            return Promise.all(chromesStarted).then(
              (counts) => counts.reduce((total, current) => total + current, 0),
            );
          }
          protocol.terminate();
          nChromesRunning -= 1;
          return urlsScrapedCount;
        };

        return processOneURL();
      }

      return urlsScrapedCount;
    };

    return startAChrome();
  };
