import { launch as launchChrome } from 'chrome-launcher';
import CRI from 'chrome-remote-interface';

import {
  DOM,
} from './auto-generated-api';

const defaultChromeFlags = [
  '--window-size=1920,1080',
  '--headless',
];

export const chromeProvider = async (
  chromeFlags = defaultChromeFlags,
  connectionPollInterval = 500,
): Promise<DevTools=> {
  const chrome = await launchChrome({
    chromeFlags,
    connectionPollInterval,
  });

  const protocol = await CRI({ port: chrome.port });

  const terminate = async (onTerminate?: () => Promise<void>) => {
    if (onTerminate) {
      await onTerminate();
    }
    await protocol.close();
    await chrome.kill();
  };

  protocol.terminate = terminate;

  return protocol;
};

export default chromeProvider;
