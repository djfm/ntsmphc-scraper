import {
  URLProblem,
  createURLProblem,
  createURLScrapingResult,
  URLScrapingResult,
  ScrapeURLUtils,
  ScrapeParams,
  NetworkResponse,
} from './types';

import {
  isParsable,
  isJavascriptURL,
} from '../util/url';

import {
  keyValueArrayToMap,
} from '../util/functional';

import {
  flattenNodeTreeAndGenerateSelectors,
} from '../util/tree';

import {
  ChromeProtocol,
  ChromeDOM,
} from './chromeProvider';

const extractCanonical = async (
  rootNodeId: number,
  DOM: ChromeDOM,
): Promise<string | undefined> => {
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

export const addURLProblem = (result: URLScrapingResult) => (oops: URLProblem) => {
  result.problematicURLs.push(oops);
};

export const scrapeURL = ({
  isInternalURL,
  normalizeURL,
}: ScrapeURLUtils) => (protocol: ChromeProtocol) =>
  async ({ nonNormalizedURL, foundOnURL }: ScrapeParams): Promise<URLScrapingResult> => {
    const currentURL = normalizeURL(nonNormalizedURL);

    const result: URLScrapingResult = {
      ...createURLScrapingResult(),
      url: currentURL,
    };

    protocol.Network.responseReceived(({ response }) => {
      const { status } = response;
      const responseURL = normalizeURL(response.url);
      const referer = response?.requestHeaders?.Referer || normalizeURL(foundOnURL);
      // console.log(`[EVENT] response for ${responseURL}
      // from ${ referer } received with status ${ status }.`);

      if (response.status >= 400) {
        addURLProblem(result)({
          ...createURLProblem(),
          url: responseURL,
          status: response.status,
          message: 'Page has an error status code (>= 400).',
          referer,
        });
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
        addURLProblem(result)({
          ...createURLProblem(),
          url: currentURL,
          isValid: false,
          message: 'Invalid URL found.',
          referer: normalizeURL(foundOnURL),
        });
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
      addURLProblem(result)({
        ...createURLProblem(),
        url: currentURL,
        message: 'Page has no title tag in <head>.',
        // TODO determine status of response
        referer: normalizeURL(foundOnURL),
      });
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

    const flatNodes = await flattenNodeTreeAndGenerateSelectors(
      protocol.DOM,
    )(
      doc.root,
    );

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
