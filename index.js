import parseArgv from 'minimist';
import chromeLauncher from 'chrome-launcher';
import CRI from 'chrome-remote-interface';
import URL from 'url';

const keyValueArrayToMap = (arr) => {
  const map = new Map();
  const len = arr.length;
  for (let i = 0; i < len - 1; i += 2) {
    map.set(arr[i], arr[i + 1]);
  }
  return map;
};

const options = parseArgv(process.argv.slice(2));

const startURL = options._[0];
const verbose = options.v;

if (!startURL) {
  console.error('Please provide a start URL as an unnamed argument !');
  process.exit(-1);
}

const parsedStartURL = URL.parse(startURL);

if (!parsedStartURL.protocol) {
  console.error('Please include the protocol in the start URL.');
  process.exit(-2);
}

const normalizeURL = (url) => {
  if (typeof url !== 'string') {
    return '';
  }

  const sanitizedURL = url.toLowerCase().trim();

  if (sanitizedURL.startsWith('//')) {
    return normalizeURL(`${parsedStartURL.protocol}${sanitizedURL}`);
  }

  if (sanitizedURL.endsWith('/')) {
    return normalizeURL(sanitizedURL.slice(0, -1));
  }

  return sanitizedURL;
};

const shouldScrapeURL = (url) => {
  const parsedURL = URL.parse(url);
  // eslint-disable-next-line no-script-url
  if (parsedURL.protocol === 'javascript:') {
    return false;
  }

  if (parsedURL.hostname !== parsedStartURL.hostname) {
    return false;
  }

  return true;
};

const URLQueue = new Set();
const URLSeen = new Set();

const main = async () => {
  const chrome = await chromeLauncher.launch({
    chromeFlags: [
      '--window-size=1920,1080',
      '--headless',
    ],
  });

  const protocol = await CRI({ port: chrome.port });
  const {
    Network,
    Page,
    Runtime,
    DOM,
  } = protocol;

  const scrape = async () => {
    const nLeft = URLQueue.size;
    const nSeen = URLSeen.size;
    console.info(`[INFO] There are ${nLeft} URLs left to scrape. We've already seen ${nSeen}.`);
    if (nLeft > 0) {
      const { value: nextURL } = URLQueue.values().next();
      console.log(`Now scraping URL: ${nextURL}...`);
      URLQueue.delete(nextURL);
      URLSeen.add(nextURL);
      try {
        await Page.navigate({ url: nextURL });
      } catch (e) {
        if (e?.response?.code === -32000) {
          // "Cannot navigate to invalid URL"
          console.log(`Cannot navigate to ${URL}.`);
          // Continue by recursing into scrape() because
          // normally loadEventFired does it once an URL
          // is finished being scraped,
          // but when Page.navigate throws an exception,
          // obviously loadEventFired is not fired...
          return scrape();
        }
        throw e;
      }
      return true;
    }
    return false;
  };

  await Promise.all([Network.enable(), Page.enable(), DOM.enable()]);

  Page.lifecycleEvent(({
    frameId,
    loaderId,
    name,
    timestamp,
  }) => {
    console.log(`Event by frame ${frameId} loader ${loaderId}: "${name}" at ${timestamp}.`);
  });

  Network.requestWillBeSent(({ type, requestId, request: { url } }) => {
    if (verbose) {
      console.log(`[${type}] Will be sent: request #${requestId} to "${url}".`);
    }
  });

  Network.loadingFinished(({ requestId, timestamp }) => {
    if (verbose) {
      console.log(`Loading of request #${requestId} finished at ${timestamp}.`);
    }
  });

  Page.domContentEventFired(({ timestamp }) => {
    if (verbose) {
      console.log(`domContentEventFired at ${timestamp}`);
    }
  });

  Page.loadEventFired(async () => {
    const extractTitleJS = 'document.querySelector("title").textContent';
    const titleResult = await Runtime.evaluate({ expression: extractTitleJS });
    console.log(`Reached page: ${titleResult.result.value}`);

    const doc = await DOM.getDocument();
    const { nodeIds } = await DOM.querySelectorAll({ nodeId: doc.root.nodeId, selector: 'a' });

    const linkAttributesArrays = await Promise.all(
      nodeIds.map((nodeId) => DOM.getAttributes({ nodeId })),
    );

    const linkAttributes = linkAttributesArrays.map(
      ({ attributes }) => keyValueArrayToMap(attributes),
    );

    for (const attrs of linkAttributes) {
      const href = normalizeURL(attrs.get('href'));
      if (!URLSeen.has(href) && shouldScrapeURL(href)) {
        URLQueue.add(href);
      }
    }

    const keepGoing = await scrape();

    if (!keepGoing) {
      protocol.close();
      chrome.kill();
    }
  });

  scrape();
};

URLQueue.add(startURL);
main();
