import {
  URLPredicate,
  urlString,
  canonicalUrlString,
  isParsable,
  isJavascriptURL,
} from '../util/url';

import {
  keyValueArrayToMap,
} from '../util/functional';

import {
  ChromeProtocol,
  ChromeDOM,
} from './chromeProvider';

export type URLProblem = {
  url: urlString;
  isValid: boolean;
  status: number;
  message: string;
  referer: string;
};

export type NetworkResponse = {
  url: string,
  referer?: string,
  status: number,
};

export type URLScrapingResult = {
  url: urlString;
  status: number;
  title: string;
  canonical: urlString;
  internalURLs: Map<urlString, canonicalUrlString>;
  externalURLs: Map<urlString, canonicalUrlString>;
  internalResources: Map<urlString, NetworkResponse>;
  externalResources: Map<urlString, NetworkResponse>;
  problematicURLs: URLProblem[];
};

export type StrToStrFunc = (input: string) => string;

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

export const scrapeURL = (
  isInternalURL: URLPredicate,
  normalizeURL: StrToStrFunc,
) => (protocol: ChromeProtocol) =>
  async (nonNormalizedURL: urlString): Promise<URLScrapingResult> => {
    const currentURL = normalizeURL(nonNormalizedURL);

    const result: URLScrapingResult = {
      url: currentURL,
      status: 0,
      title: undefined,
      canonical: undefined,
      internalURLs: new Map(),
      externalURLs: new Map(),
      internalResources: new Map(),
      externalResources: new Map(),
      problematicURLs: [],
    };

    const addURLProblem = (oops: URLProblem) => {
      result.problematicURLs.push(oops);
    };

    protocol.Network.responseReceived(({ response }) => {
      const { status } = response;
      const responseURL = normalizeURL(response.url);
      const referer = response?.requestHeaders?.Referer || currentURL;
      // console.log(`[EVENT] response for ${responseURL}
      // from ${ referer } received with status ${ status }.`);

      if (response.status >= 400) {
        const oops: URLProblem = {
          url: responseURL,
          isValid: true,
          status: response.status,
          message: 'Page has an error status code (>= 400).',
          referer,
        };

        addURLProblem(oops);
      }

      if (currentURL === responseURL) {
        result.status = status;
        return;
      }

      const resp: NetworkResponse = {
        url: currentURL,
        referer: referer ? normalizeURL(response.referer) : undefined,
        status,
      };

      const storage = isInternalURL(responseURL) ?
        result.internalResources : result.externalResources;

      storage.set(responseURL, resp);
    });

    try {
      await protocol.Page.navigate({ url: currentURL });
    } catch (err: any) {
      if (err?.response?.code === -32000) {
        // This error is: "Cannot navigate to invalid URL".
        // This should happen rarely as we won't try to
        // navigate to "javascript:" URLs, but we record the
        // issue if it happens.
        const oops: URLProblem = {
          url: currentURL,
          isValid: false,
          message: 'Invalid URL found.',
          status: -1,
          referer: currentURL,
        };
        addURLProblem(oops);
        return result;
      }
      throw err;
    }

    await protocol.Page.loadEventFired();
    // console.log(`[EVENT] Load fired event for ${currentURL}`);

    const doc = await protocol.DOM.getDocument({
      // retrieve the full DOM tree, we will need it at some point
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
        url: currentURL,
        isValid: true,
        message: 'Page has no title tag in <head>.',
        // TODO determine status
        // probably using Network.LoaderId
        // that is MAYBE returned by Page.navigate
        // and then using the Network API
        // see: https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-navigate
        status: 0,
        referer: currentURL,
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

      if (attrsMap.has('rel')) {
        const rel: string = attrsMap.get('rel');
        if (rel.includes('nofollow')) {
          // eslint-disable-next-line no-continue
          continue;
        }
      }

      const linkCanonical = normalizeURL(attrsMap.get('canonical'));
      const href = normalizeURL(attrsMap.get('href'));

      const to = linkCanonical || href;

      if (to && isParsable(to) && !isJavascriptURL(to)) {
        const targetMap = isInternalURL(to) ?
          result.internalURLs :
          result.externalURLs;

        targetMap.set(href, linkCanonical);
      }
    }

    return result;
  };

export default scrapeURL;
