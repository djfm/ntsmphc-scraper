import parseArgv from 'minimist';
import chromeLauncher from 'chrome-launcher';
import CRI from 'chrome-remote-interface';
import URL from 'url';

// Converts an array of keys and values
// like [key1, value1, key2, value2]
// to a map like { key1 => value1, key2 => value2 }.
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

// Normalizes URLs to avoid scraping the same URL twice
// because of subtle variations in the URL string.
// Also adds the protocol for links starting in "//",
// which the chrome driver considers invalid.
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

// Determines if a URL should be scraped.
// It should be scraped if it's not a javascript:void() or something link,
// and of course if it is on the same domain as the domain
// we started scraping from.
// attrs is a Map of all attributes found on the link.
const shouldScrapeURL = (url, attrs) => {
  if (attrs && attrs.get('rel') === 'nofollow') {
    return false;
  }

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

// Pops one item from the queue of URLs to scrape
// and starts scraping it.
const scrape = async ({
  queueSet,
  seenSet,
  Page,
  chromePort,
}) => {
  const nLeft = queueSet.size;
  const nSeen = seenSet.size;

  // The progress percentage based on the number of remaining URLs discovered
  // SO FAR.
  // nLeft will keep increasing randomly as more pages are discovered.
  const pct = `${Math.round((100 * nSeen) / (nLeft + nSeen))}`.padStart(3, ' ');

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
        // This error is: "Cannot navigate to invalid URL".
        console.error(`Cannot navigate to ${URL}.`);
        // Continue by recursing into scrape(...) because
        // normally loadEventFired does it once an URL
        // is finished being scraped,
        // but when Page.navigate throws an exception,
        // obviously loadEventFired is not fired...
        // So the instance would remain alive like a zombie.
        scrape({
          queueSet,
          seenSet,
          Page,
          chromePort,
        });
        return;
      }
      throw e;
    }
  }
};

// Starts a chrome instance and returns an object
// whose most important property is the method "startScraping"
// that starts scraping the provided queue using this
// specific chrome instance.
const createScraperProcess = async ({
  addURLAndScrape,
  queueSet,
  seenSet,
  onKill,
}) => {
  // Starts a new headless chrome instance.
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

  // Apparently this needs to be done before starting to use
  // the APIs.
  await Promise.all([Network.enable(), Page.enable(), DOM.enable(), Runtime.enable()]);

  // Just some optional logging for now.
  Network.requestWillBeSent(({ type, requestId, request: { url } }) => {
    if (verbose) {
      console.log(`[${type}] Will be sent: request #${requestId} to "${url}".`);
    }
  });

  // Just some optional logging for now.
  Network.loadingFinished(({ requestId, timestamp }) => {
    if (verbose) {
      console.log(`Loading of request #${requestId} finished at ${timestamp}.`);
    }
  });

  // Just some optional logging for now.
  Page.domContentEventFired(({ timestamp }) => {
    if (verbose) {
      console.log(`domContentEventFired at ${timestamp}`);
    }
  });

  // This is apparently the event that gets fired
  // when the page is fully loaded,
  // meaning the DOM is there and all the static resources
  // have finished downloading.
  // That's when we start analyzing the page and queuing the
  // next links to process.
  Page.loadEventFired(async () => {
    const doc = await DOM.getDocument();

    const extractTitleJS = 'document.querySelector("title").textContent';
    const titleResult = await Runtime.evaluate({ expression: extractTitleJS });
    console.log(`Reached page: ${titleResult.result.value}`);

    const { nodeId: canonicalNodeId } = await DOM.querySelector({
      nodeId: doc.root.nodeId,
      selector: 'head link[rel=canonical]',
    });

    let ignoreNonCanonicalPage = false;

    if (canonicalNodeId !== 0) {
      const { attributes } = await DOM.getAttributes({ nodeId: canonicalNodeId });
      const attrMap = keyValueArrayToMap(attributes);
      const canonical = normalizeURL(attrMap.get('href'));
      if (seenSet.has(canonical)) {
        ignoreNonCanonicalPage = true;
      }
      addURLAndScrape(canonical);
    }

    if (!ignoreNonCanonicalPage) {
      const { nodeIds } = await DOM.querySelectorAll({ nodeId: doc.root.nodeId, selector: 'a' });

      const linkAttributesArrays = await Promise.all(
        nodeIds.map((nodeId) => DOM.getAttributes({ nodeId })),
      );

      const linkAttributes = linkAttributesArrays.map(
        ({ attributes }) => keyValueArrayToMap(attributes),
      );

      for (const attrs of linkAttributes) {
        const whichURL = attrs.get('canonical') || attrs.get('href');
        const href = normalizeURL(whichURL);
        addURLAndScrape(href, attrs);
      }
    }

    if (queueSet.size > 0) {
      // If there is work to do,
      // week doing it.
      scrape({
        queueSet,
        seenSet,
        Page,
        chromePort: chrome.port,
      });
    } else {
      // Kill the chrome instance if it has nothing more to do.
      // This is not done by the scrape function as it has
      // minimal awareness of the technicalities of which
      // chrome instance is calling it.
      // The onKill method is responsible for decrementing
      // the number of running instances and checking
      // if we are done scraping.
      onKill();
      protocol.close();
      chrome.kill();
    }
  });

  // A convenient wrapper to start scraping the queue
  // using this chrome instance.
  const startScraping = async () => scrape({
    queueSet,
    seenSet,
    Page,
    chromePort: chrome.port,
  });

  // Well only "startScraping" is really useful,
  // but I thought the calling function might be interested
  // in accessing the chrome process or the protocol instance.
  return { chrome, protocol, startScraping };
};

// The core of the program.
// It uses async/await so it needs to be encapsulated in a function.
const main = async () => {
  const URLQueue = new Set();
  const URLSeen = new Set();
  const URLIgnored = new Set();

  const nMaxInstances = options.p || 1;

  console.log(`Starting scraping of ${startURL} with ${nMaxInstances} parallel chrome instances.`);

  // The number of instances of chrome currently scraping something.
  let nInstances = 0;

  // The function that coordinates all the work.
  // It returns a promise that fulfills when every URL is done being scraped.
  const run = async () => new Promise((resolve) => {
    const onKill = () => {
      nInstances -= 1;
      // We're done when the queue is empty
      // and no chrome instance is processing something.
      if (URLQueue.size === 0 && nInstances === 0) {
        resolve();
      }
    };

    // Adds an URL to the queue of URLs to scrape.
    // If we add an URL and we have less than
    // the maximum number of chrome instances allowed
    // for the scraping, it starts a new instance.
    // attrs is an optional Map of attributes found on the link.
    const addURLAndScrape = async (url, attrs) => {
      const normalizedURL = normalizeURL(url);
      const shouldScrape = shouldScrapeURL(normalizedURL, attrs);

      if (!shouldScrape) {
        URLIgnored.add(normalizedURL);
        return;
      }

      const notAlreadyQueued = !URLQueue.has(normalizedURL);
      const notAlreadySeen = !URLSeen.has(normalizedURL);

      if (notAlreadyQueued && notAlreadySeen) {
        URLQueue.add(normalizedURL);
        URLSeen.add(normalizedURL);

        // If we added some URL to scrape and we can
        // start a new instance, then we do it.
        if (nInstances < nMaxInstances) {
          nInstances += 1;
          const scraper = await createScraperProcess({
            addURLAndScrape,
            queueSet: URLQueue,
            seenSet: URLSeen,
            onKill,
          });

          scraper.startScraping();
        }
      }
    };

    // This is where it all begins.
    // Adds the first URL to the queue,
    // which starts the first chrome instance and
    // starts the whole scraping madness.
    addURLAndScrape(startURL);
  });

  await run();
};

// Sit back and relax.
main();
