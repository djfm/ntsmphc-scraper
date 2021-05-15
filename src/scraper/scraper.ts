import {
  makeURLHelpers,
  urlString,
  canonicalUrlString,
  URLPredicate,
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
  protocol: ChromeProtocol,
  isInternalURL: URLPredicate,
  normalizeURL: StrToStrFunc,
) =>
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

export type ScraperNotifiers = {
  notifyPageScraped: (result: ScrapeResult) => any;
};

export const startScraping = (notifiers: ScraperNotifiers) =>
  async (params: ScrapingTaskParams) => {
    const {
      isInternalURL,
      normalizeURL,
    } = makeURLHelpers(params.startURL);

    const protocol = await chromeProvider();

    const result = await scrapeURL(
      protocol,
      isInternalURL,
      normalizeURL,
    )(params.startURL);
    notifiers.notifyPageScraped(result);

    return result;
  };
