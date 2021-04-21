import parseArgv from 'minimist';
import chromeLauncher from 'chrome-launcher';
import CRI from 'chrome-remote-interface';

const options = parseArgv(process.argv.slice(2));

const startURL = options._[0];

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
  const { Page, Runtime } = protocol;

  await Page.enable();

  Page.navigate({ url: startURL });

  Page.loadEventFired(async () => {
    const js = 'document.querySelector("title").textContent';
    const result = await Runtime.evaluate({ expression: js });

    console.log(`Title: ${result.result.value}`);

    protocol.close();
    chrome.kill();
  });
};

main();
