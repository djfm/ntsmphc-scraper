import { launch as launchChrome } from 'chrome-launcher';
import CDP from 'chrome-remote-interface';

type GetDocumentOptions = {
  depth: number,
};

type QuerySelectorOptions = {
  nodeId: number,
  selector: string,
}

export type ChromeBaseNode = {
  frameId?: number;
  backendNodeId: number;
  localName: string;
  nodeId: number;
  nodeName: string;
  nodeType: number;
  nodeValue: string;
  children?: ChromeChildNode[];
};

export type ChromeChildNode = ChromeBaseNode & {
  parentId: number;
}

export type ChromeRootNode = ChromeBaseNode & {
  baseURL: string;
  childNodeCount: number;
  documentURL: string;
  xmlVersion: string;
};

export type ChromeDocument = {
  root: ChromeRootNode;
};

export type JustTheNodeId = {
  nodeId: number;
};

type ChromeDOM = {
  getDocument: (options: GetDocumentOptions) => Promise<ChromeDocument>;
  // the nodeId in the returned object will be 0 if the selector doesn't match
  querySelector: (options: QuerySelectorOptions) => Promise<JustTheNodeId>;
};

export type ChromeProtocol = {
  Network: any;
  Page: any;
  Runtime: any;
  DOM: ChromeDOM;
};

// TODO support specifying window size
export const chromeProvider = async (): Promise<ChromeProtocol> => {
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

  return protocol;
};

export default chromeProvider;
