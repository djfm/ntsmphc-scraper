import {
  makeURLHelpers,
  urlString,
  canonicalUrlString,
  URLPredicate,
} from '../util/url';

import {
  flattenNodeTree,
} from '../util/tree';

import {
  ChromeProtocol,
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

const scrapeURL = (
  protocol: ChromeProtocol,
  isInternalURL: URLPredicate,
) =>
  async (url: urlString): Promise<ScrapeResult> =>
    new Promise((resolve, reject) => {
      const result: ScrapeResult = {
        url,
        title: undefined,
        canonical: undefined,
        internalURLs: new Map<urlString, canonicalUrlString>(),
        externalURLs: new Map<urlString, canonicalUrlString>(),
        problematicURLs: new Map<urlString, URLProblem[]>(),
      };

      protocol.Page.loadEventFired(async () => {
        const doc = await protocol.DOM.getDocument({
          // retrieve the full DOM tree, we'll need it
          depth: -1,
        });

        const titleRef = await protocol.DOM.querySelector({
          nodeId: doc.root.nodeId,
          selector: 'title',
        });

        const titleDesc = await protocol.DOM.describeNode({
          nodeId: titleRef.nodeId,
          depth: -1,
        });

        result.title = titleDesc.node.children[0].nodeValue;

        const allFlatNodes = flattenNodeTree(doc.root);

        resolve(result);
      });
      try {
        protocol.Page.navigate({ url });
      } catch (e) {
        if (e?.response?.code === -32000) {
          // This error is: "Cannot navigate to invalid URL".
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
    } = makeURLHelpers(params.startURL);

    const protocol = await chromeProvider();

    const result = await scrapeURL(protocol, isInternalURL)(params.startURL);
    notifiers.notifyPageScraped(result);

    return result;
  };
