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

export type GetBoxModelOptions = {
  nodeId?: number;
  backendNodeId?: number;
  /**
   * https://chromedevtools.github.io/devtools-protocol/tot/Runtime/#type-RemoteObjectId
   */
  objectId?: string;
};

/**
 * https://chromedevtools.github.io/devtools-protocol/tot/DOM/#type-Quad
 */
export type Quad = number[];

/**
 * https://chromedevtools.github.io/devtools-protocol/tot/DOM/#type-ShapeOutsideInfo
 */
export type ShapeOutsideInfo = {
  bounds: Quad;
  shape: any[];
  marginShape: any[];
};

/**
 * https://chromedevtools.github.io/devtools-protocol/tot/DOM/#type-BoxModel
 */
export type BoxModel = {
  model: {
    content: Quad;
    padding: Quad;
    border: Quad;
    width: number;
    height: number;
    shapeOutside: ShapeOutsideInfo;
  };
};

export type ChromeDOM = {
  getDocument: (options: GetDocumentOptions) => Promise<ChromeDocument>;
  // the nodeId in the returned object will be 0 if the selector doesn't match
  querySelector: (options: QuerySelectorOptions) => Promise<JustTheNodeId>;
  getAttributes: (options: JustTheNodeId) => Promise<JustRawAttributes>;
  describeNode: (options: DescribeNodeOptions) => Promise<{ node: ChromeNode }>;
  querySelectorAll: (options: QuerySelectorOptions) => Promise<{ nodeIds: number[] }>;
  getBoxModel: (options: GetBoxModelOptions) => Promise<BoxModel>;
};

/**
 * https://chromedevtools.github.io/devtools-protocol/tot/Input/#method-dispatchMouseEvent
 */
export type DispatchMouseEventOptions = {
  type: 'mousePressed' | 'mouseReleased' | 'mouseMoved' | 'mouseWheel';
  x: number;
  y: number;
  button?: 'none' | 'left' | 'middle' | 'right' | 'back' | 'forward';
  clickCount?: number;
};

/**
 * https://chromedevtools.github.io/devtools-protocol/tot/Input/
 */
export type ChromeInput = {
  dispatchMouseEvent: (options: DispatchMouseEventOptions) => Promise<void>;
};

type ByeFunction = () => Promise<void>;

export type ChromeProtocol = {
  Network: any;
  Page: any;
  Runtime: any;
  DOM: ChromeDOM;
  Input: ChromeInput;
  terminate: (onTerminate?: ByeFunction) => Promise<void>;
};

// TODO support specifying window size
export const chromeProvider = async (): Promise<ChromeProtocol> => {
  const chrome = await launchChrome({
    chromeFlags: [
      '--window-size=1920,1080',
      '--headless',
    ],
    // see if that increases speed,
    // default value is 500 ms according to
    // https://github.com/GoogleChrome/chrome-launcher
    connectionPollInterval: 500,
  });

  const protocol = await CDP({ port: chrome.port });
  const {
    Network,
    Page,
    Runtime,
    DOM,
    Input,
  } = protocol;

  // don't wanna expose too much stuff inadvertently
  const myProtocol = {
    Network,
    Page,
    Runtime,
    DOM,
    Input,
    terminate: async (onTerminate?: ByeFunction) => {
      if (onTerminate) {
        await onTerminate();
      }
      await protocol.close();
      await chrome.kill();
    },
  };

  // Apparently this needs to be done before starting to use
  // the APIs.
  await Promise.all([
    Network.enable(),
    Page.enable(),
    DOM.enable(),
    Runtime.enable(),
  ]);

  return myProtocol;
};

export const clickElement = (protocol: ChromeProtocol) =>
  async (nodeId: number): Promise<void> => {
    const box = await protocol.DOM.getBoxModel({ nodeId });
    await protocol.Input.dispatchMouseEvent({
      type: 'mousePressed',
      x: (box.model.content[0] + box.model.content[2]) / 2,
      y: (box.model.content[1] + box.model.content[3]) / 2,
      button: 'left',
      clickCount: 1,
    });
  };

export default chromeProvider;
