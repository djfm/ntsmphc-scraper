import { launch as launchChrome } from 'chrome-launcher';
import CDP from 'chrome-remote-interface';

type GetDocumentOptions = {
  depth: number,
};

type QuerySelectorOptions = {
  nodeId: number,
  selector: string,
}

export type DescribeNodeOptions = {
  nodeId: number;
  /**
   * The depth at which to retrieve nodes.
   * Use -1 for the entire subtree.
   */
  depth: number;
};

export type NodeAttributes = string[];

// Taken from the definition of `Node` in
// https://github.com/cyrus-and/chrome-remote-interface/blob/master/lib/protocol.json
// TODO should automate the creation of the correct TypeScript types for this lib
export type ChromeNode = {
  nodeId: number;
  parentId?: number;
  backendNodeId: number;
  nodeType: number;
  nodeName: string;
  localName: string;
  nodeValue: string;
  childNodeCount?: number;
  children?: ChromeNode[];
  attributes?: NodeAttributes[];
  documentURL?: string;
  baseURL?: string;
  publicId?: string;
  systemId?: string;
  internalSubset?: string;
  xmlVersion?: string;
  name?: string;
  value?: string;
  pseudoType?: any;
  shadowRootType?: any;
  frameId?: any;
  contentDocument?: ChromeNode;
  shadowRoots?: ChromeNode[];
  templateContent?: ChromeNode;
  pseudoElements?: ChromeNode[];
  importedDocument?: ChromeNode;
  distributedNodes?: any[];
  isSVG?: boolean;
};

export type ChromeDocument = {
  root: ChromeNode;
};

export type JustTheNodeId = {
  nodeId: number;
};

export type JustRawAttributes = {
  attributes: string[];
};

export type ChromeDOM = {
  getDocument: (options: GetDocumentOptions) => Promise<ChromeDocument>;
  // the nodeId in the returned object will be 0 if the selector doesn't match
  querySelector: (options: QuerySelectorOptions) => Promise<JustTheNodeId>;
  getAttributes: (options: JustTheNodeId) => Promise<JustRawAttributes>;
  describeNode: (options: DescribeNodeOptions) => Promise<{ node: ChromeNode }>;
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
