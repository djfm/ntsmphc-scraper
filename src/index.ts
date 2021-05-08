// USAGE: node index.js https://url.example.com [-p N] [-v] [--log-file path/to/log.json]
// Scrapes website found at given URL, optionnally using N parallel
// headless chrome instances.
// The -v flag increases the verbosity.
// Pass --log-file some/path.json to log interesting stuff the scraper may have found.

import * as Minimist from 'minimist';
import { launch as launchChrome } from 'chrome-launcher';
import * as CDP from 'chrome-remote-interface';
import { URL } from 'url';
import { promises as FSP } from 'fs';

import makeURLHelpers from './url';
import { keyValueArrayToMap } from './functional';
import humanDuration from './humanDuration';
import flattenNodeTree, { filterStylableNodes } from './tree';

const options = Minimist(process.argv.slice(2));

const startURL = options._[0];
const verbose = options.v;
const logFilePath = options['log-file'];

if (!startURL) {
  console.error('Please provide a start URL as an unnamed argument !');
  process.exit(-1);
}

const parsedStartURL = new URL(startURL);

const { normalizeURL, shouldScrapeURL } = makeURLHelpers(parsedStartURL);

if (!parsedStartURL.protocol) {
  console.error('Please include the protocol in the start URL.');
  process.exit(-2);
}

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
  log,
}) => {
  // Starts a new headless chrome instance.
  const chrome = await launchChrome({
    chromeFlags: [
      '--window-size=1920,1080',
      '--headless',
    ],
  });

  const protocol = await CDP({ port: chrome.port });
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
  Network.requestWillBeSent(({ type, requestId, url }) => {
    if (verbose) {
      console.log(`[${type}] Will be sent: request #${requestId} to "${url}".`);
    }
  });

  Network.responseReceived(({ response }) => {
    // Log requests that have responded with an error status code.
    // I think all error codes are above or equal to 400.
    // Cf. https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
    if (response.status >= 400) {
      log({
        url: response.url,
        status: response.status,
        referer: response?.requestHeaders?.Referer || '',
      });
    }
  });

  // This is apparently the event that gets fired
  // when the page is fully loaded,
  // meaning the DOM is there and all the static resources
  // have finished downloading.
  // That's when we start analyzing the page and queuing the
  // next links to process.
  Page.loadEventFired(async () => {
    // Get the root node with all the subtree.
    const doc = await DOM.getDocument({
      depth: -1,
    });

    const nodes = flattenNodeTree(doc.root);
    const stylableNodes = filterStylableNodes(nodes);

    // Get the page's title.
    // This is more convenient to do by executing JS in the host chrome
    // than with the DOM api.
    const extractTitleJS = 'document.querySelector("title").textContent';
    const titleResult = await Runtime.evaluate({ expression: extractTitleJS });
    console.log(`Reached page: ${titleResult.result.value}`);

    // Check if there is a <link rel="canonical" href="...">
    // in the <head> of the page.
    const { nodeId: canonicalNodeId } = await DOM.querySelector({
      nodeId: doc.root.nodeId,
      selector: 'head link[rel=canonical]',
    });

    let ignoreNonCanonicalPage = false;

    // If the page has a canonical URL and we haven't scraped this
    // canonical URL previously, we add it to the scraping queue.
    if (canonicalNodeId !== 0) {
      const { attributes } = await DOM.getAttributes({ nodeId: canonicalNodeId });
      const attrMap = keyValueArrayToMap(attributes);
      const canonical = normalizeURL(attrMap.get('href'));
      if (seenSet.has(canonical)) {
        // We have already scraped the canonical URL of the
        // page we're currently on, so we won't follow any links
        // on this page.
        ignoreNonCanonicalPage = true;
      } else {
        // We've never scraped the canonical page, so we enqueue it.
        addURLAndScrape(canonical);
      }
    }

    // Explore the links found on this page,
    // but only if it has no canonical URL or if its canonical URL
    // has not yet been scraped.
    // This may lead to scraping a few too many pages but this feels
    // safer to me in terms of exhaustivity.
    if (!ignoreNonCanonicalPage) {
      const { nodeIds } = await DOM.querySelectorAll({ nodeId: doc.root.nodeId, selector: 'a' });

      const linkAttributesArrays = await Promise.all(
        nodeIds.map((nodeId) => DOM.getAttributes({ nodeId })),
      );

      // getAttributes returns an object of the form:
      // { attributes: [attr1, value1, attr2, value2, ...]}
      // We convert all these arrays to javacript Maps for convenience.
      const linkAttributes = linkAttributesArrays.map(
        ({ attributes }) => keyValueArrayToMap(attributes),
      );

      for (const attrs of linkAttributes) {
        // The URL to enqueue is either that of the 'href' attribute
        // or that of the 'canonical' attribute if there is one.
        const whichURL = attrs.get('canonical') || attrs.get('href');
        const href = normalizeURL(whichURL);
        addURLAndScrape(href, attrs);
      }
    }

    if (queueSet.size > 0) {
      // If there is work to do,
      // keep doing it.
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
      // Closes the connection to our chrome instance.
      protocol.close();
      // Terminates the chrome instance.
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

  // Returns the method that starts scraping with
  // the brand new chrome instance.
  // Returning it as an object because I have a feeling
  // I might need to expose more variables later.
  return { startScraping };
};

// The core of the program.
// It uses async/await so it needs to be encapsulated in a function.
const main = async () => {
  // Set of URLs that remain to be explored.
  const URLQueue = new Set();
  // Set of URLs that have already been explored.
  const URLSeen = new Set();
  // Set of URLs that have been found but ignored for some reason.
  const URLIgnored = new Set();

  // Repository for interesting things
  // logged while scraping.
  const logHistory = [];

  // A logging function that is used by the scraper
  // processes to save various things that
  // may be useful for later anlysis.
  const log = (data) => {
    if (verbose) {
      console.log('[log]', data);
    }
    logHistory.push(data);
  };

  // Max number of running parallel chrome instances.
  // Provide it to the cli with the "p" option,
  // e.g. node index.js https://mysite.example.com -p4
  const nMaxInstances = options.p || 1;

  console.log(`Starting scraping of ${startURL} with ${nMaxInstances} parallel chrome instances.`);

  // The number of instances of chrome currently scraping something.
  let nInstances = 0;

  // The function that coordinates all the work.
  // It returns a promise that fulfills once every URL is done being scraped.
  const run = async () => new Promise<void>((resolve) => {
    // The method that is called when a page
    // is finished being scraped and the queue is empty,
    // i.e. right before the destruction of the chrome instance.
    const onKill = () => {
      nInstances -= 1;
      // We're done when the queue is empty
      // and no chrome instance is processing something.
      // This function is only called when the queue is empty so
      // we don't explicitly check for that.
      if (nInstances === 0) {
        resolve();
      }
    };

    // Adds an URL to the queue of URLs to scrape.
    // If we add an URL and we have less than
    // the maximum number of chrome instances allowed
    // for the scraping, it starts a new instance.
    // attrs is an optional Map of attributes found on the link
    // element that the URL was extracted from.
    const addURLAndScrape = async (url, attrs?: object) => {
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
        // It will destroy itself once it realizes the queue is empty
        // and call onKill right before that.
        if (nInstances < nMaxInstances) {
          nInstances += 1;

          const { startScraping } = await createScraperProcess({
            addURLAndScrape,
            queueSet: URLQueue,
            seenSet: URLSeen,
            onKill,
            log,
          });

          startScraping();
        }
      }
    };

    // This is where it all begins.
    // Adds the first URL to the queue,
    // which starts the first chrome instance and
    // starts the whole scraping madness.
    addURLAndScrape(startURL);
  });

  const startedAt = Date.now();
  await run();
  const elapsed = Math.round((Date.now() - startedAt) / 1000);

  console.log('------------------');
  console.log('Scraping finished!');
  console.log(`Took ${humanDuration(elapsed)}.`);
  console.log(`Analyzed ${URLSeen.size} URLs.`);
  console.log(`Ignored ${URLIgnored.size} URLs found on the scraped pages.`);

  // Pretty-print the log array in JSON format
  // to a file if specified by the [--log-file some/path.json]
  // command-line argument.
  if (logFilePath) {
    const textLog = JSON.stringify(logHistory, null, 2);
    await FSP.writeFile(logFilePath, textLog);
    console.log(`Wrote log to "${logFilePath}".`);
  }
};

// Sit back and relax.
main();
