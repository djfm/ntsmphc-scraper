import parseArgv from 'minimist';
import chromeLauncher from 'chrome-launcher';
import CRI from 'chrome-remote-interface';

const options = parseArgv(process.argv.slice(2));

const startURL = options._[0];
const verbose = options.v;

if (!startURL) {
  console.error('Please provide a start URL as an unnamed argument !');
  process.exit(-1);
}

const main = async () => {
  const chrome = await chromeLauncher.launch({
    chromeFlags: [
      '--window-size=1920,1080',
      '--headless',
    ],
  });

  const protocol = await CRI({ port: chrome.port });
  const { Network, Page, Runtime } = protocol;

  await Promise.all([Network.enable(), Page.enable()]);

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
    const result = await Runtime.evaluate({ expression: extractTitleJS });
    console.log(`Reached page: ${result.result.value}`);

    protocol.close();
    chrome.kill();
  });

  Page.navigate({ url: startURL });
};

main();
