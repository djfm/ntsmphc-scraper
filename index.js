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

const scrape = async ({
  queueSet,
  seenSet,
  Page,
  chromePort,
}) => {
  const nLeft = queueSet.size;
  const nSeen = seenSet.size;
  const pct = `${Math.round((100 * nSeen) / nLeft)}`.padStart(3, ' ');
  console.info(`[INFO][chrome:${chromePort}][est. ${pct}% done]: ${nLeft} URLs left to scrape, ${nSeen} done.`);
  if (nLeft > 0) {
    const { value: nextURL } = queueSet.values().next();
    console.log(`Now scraping URL: ${nextURL}...`);
    queueSet.delete(nextURL);
    seenSet.add(nextURL);
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
        return scrape({
          queueSet,
          seenSet,
          Page,
          chromePort,
        });
      }
      throw e;
    }
    return true;
  }
  return false;
};

const createScraperProcess = async ({
  addURLAndScrape,
  queueSet,
  seenSet,
  ignoredSet,
  onKill,
}) => {
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

  await Promise.all([Network.enable(), Page.enable(), DOM.enable()]);

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
      const shouldScrape = shouldScrapeURL(href);

      if (!seenSet.has(href) && shouldScrape) {
        addURLAndScrape(href);
      } else if (!shouldScrape) {
        ignoredSet.add(href);
      }
    }

    const keepGoing = await scrape({
      queueSet,
      seenSet,
      Page,
      chromePort: chrome.port,
    });

    if (!keepGoing) {
      onKill();
      protocol.close();
      chrome.kill();
    }
  });

  const startScraping = async () => scrape({
    queueSet,
    seenSet,
    Page,
    chromePort: chrome.port,
  });

  return { chrome, protocol, startScraping };
};

const main = async () => {
  const URLQueue = new Set();
  const URLSeen = new Set();
  const URLIgnored = new Set();

  const nMaxInstances = options.p || 1;

  console.log(`Starting scraping of ${startURL} with ${nMaxInstances} parallel chrome instances.`);

  let nInstances = 0;

  const run = async () => new Promise((resolve) => {
    const onKill = () => {
      nInstances -= 1;
      // We're done when the queue is empty
      // and no chrome instance is processing something.
      if (URLQueue.size === 0 && nInstances === 0) {
        resolve();
      }
    };

    const addURLAndScrape = async (url) => {
      const normalizedURL = normalizeURL(url);
      if (!URLQueue.has(normalizedURL)) {
        URLQueue.add(normalizedURL);

        if (nInstances < nMaxInstances) {
          nInstances += 1;
          const scraper = await createScraperProcess({
            addURLAndScrape,
            queueSet: URLQueue,
            seenSet: URLSeen,
            ignoredSet: URLIgnored,
            onKill,
          });

          scraper.startScraping();
        }
      }
    };

    addURLAndScrape(startURL);
  });

  await run();
};

main();
