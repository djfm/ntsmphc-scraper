import {
  ChromeNode,
  ChromeDOM,
} from '../scraper/chromeProvider';

import {
  keyValueArrayToMap,
} from './functional';

type NodeWithAttributes = {
  attributes: Map<string, string>;
  originalNode: ChromeNode;
  name: string;
  children?: NodeWithAttributes[];
  selector: string[];
};

type FlatNode = {
  attributes: Map<string, string>;
  originalNode: ChromeNode;
  name: string;
  selector: string;
};

// Flatten an array of nodes, returning all nodes
// of the tree without their children.
export const flattenNodeTree = (node: any) => {
  const { children, ...otherProps } = node;

  const hasChildrenProp = Object.prototype.hasOwnProperty.call(node, 'children');
  const childrenIsArray = hasChildrenProp && (node.children instanceof Array);
  const childrenIsEmpty = !childrenIsArray || (node.children.length === 0);

  if (childrenIsEmpty) {
    return [{ ...otherProps }];
  }

  return [{ ...otherProps }, ...[].concat(...children.map(flattenNodeTree))];
};

const attributesIgnoreSet = new Set(['', 'document', 'html', 'head', 'body', 'script', 'link']);
const nameIgnoreSet = new Set(['#text', 'style', 'link', 'script', '#comment', '#document']);

const waitMs = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getAttributes = (DOM: ChromeDOM) =>
  async (node: ChromeNode, tryCount: number = 0): Promise<Map<string, string>> => {
    try {
      const { attributes } = await DOM.getAttributes({
        nodeId: node.nodeId,
      });
      return keyValueArrayToMap(attributes);
    } catch (err) {
      if (tryCount > 2) {
        return new Map();
      }
      await waitMs(1000);
      return getAttributes(DOM)(node, tryCount + 1);
    }
  };

type UpdateSelectorsAcc = {
  newNodes: NodeWithAttributes[];
  namesSeen: Set<string>;
  lastSibling: string[];
};

const updateSelectorsReducer = (parentSelector: string[]) => (
  acc: UpdateSelectorsAcc,
  node: NodeWithAttributes,
): UpdateSelectorsAcc => {
  if (node.attributes.has('id')) {
    return {
      ...acc,
      newNodes: acc.newNodes.concat({
        ...node,
        selector: [`#${node.attributes.get('id')}`],
      }),
    };
  }

  const idCandidates = [node.name];

  if (node.attributes.has('class')) {
    const classNames = node.attributes.get('class');
    for (const className of classNames.split(' ')) {
      idCandidates.push(`${node.name}.${className}`);
    }
  }

  for (const candidate of idCandidates) {
    if (!acc.namesSeen.has(candidate)) {
      const namesSeen = new Set(acc.namesSeen);
      namesSeen.add(candidate);

      const selector = parentSelector.concat(node.name);

      return {
        ...acc,
        newNodes: acc.newNodes.concat({
          ...node,
          selector,
        }),
        namesSeen,
        lastSibling: selector,
      };
    }
  }

  const selector = acc.lastSibling.concat(`+ ${node.name}`);
  return {
    ...acc,
    newNodes: acc.newNodes.concat({
      ...node,
      selector,
    }),
    lastSibling: selector,
  };
};

const updateSelectors = (parentSelector: string[]) =>
  (node: NodeWithAttributes): NodeWithAttributes => {
    if (!node.children) {
      return node;
    }

    return {
      ...node,
      children: node.children.reduce(
        updateSelectorsReducer(parentSelector),
        {
          newNodes: [],
          namesSeen: new Set<string>(),
          lastSibling: [],
        },
      ).newNodes.map(
        (child) => updateSelectors(child.selector)(child),
      ),
    };
  };

const convertChromeNode = (DOM: ChromeDOM) =>
  async (node: ChromeNode): Promise<NodeWithAttributes> => {
    const name = node.nodeName.toLowerCase();
    let attributes = new Map<string, string>();

    if (!attributesIgnoreSet.has(name)) {
      attributes = await getAttributes(DOM)(node);
    }

    let children: NodeWithAttributes[];

    if (node.children) {
      children = await Promise.all(node.children.map(convertChromeNode(DOM)));
    }

    return {
      originalNode: node,
      name,
      attributes,
      children,
      selector: [],
    };
  };

const findHTMLRoot = (node: NodeWithAttributes) => {
  if (!node.children) {
    return undefined;
  }

  if (node.name === 'html') {
    return node;
  }

  for (const child of node.children) {
    const html = findHTMLRoot(child);
    if (html) {
      return html;
    }
  }

  throw new Error('Could not find HTML root node.');
};

export const flattenNodeTreeAndGenerateSelectors = (DOM: ChromeDOM) =>
  async (node: ChromeNode): Promise<FlatNode[]> => {
    const nodeWithAttributes = await convertChromeNode(DOM)(node);

    const newRoot = updateSelectors([])(
      findHTMLRoot(nodeWithAttributes),
    );

    return flattenNodeTree(newRoot)
      .filter(
        ({ name }) => !nameIgnoreSet.has(name),
      )
      .map((n) => ({
        originalNode: n.originalNode,
        name: n.name,
        selector: n.selector.join(' '),
        attributes: n.attributes,
      }));
  };

const nonStylableNodes = new Set([
  'html',
  'head',
  'script',
  'meta',
  'title',
  'link',
  'style',
]);

// Returns true if a node with the provided "localName"
// e.g. div, a, link, main, head
// is stylable, meaning that CSS can be applied to it
// to change the page's appearance.
const isStylable = (localName) => {
  if (!localName) {
    return false;
  }

  if (nonStylableNodes.has(localName)) {
    return false;
  }

  return true;
};

export const filterStylableNodes = (nodeList) =>
  nodeList.filter(({ localName }) => isStylable(localName));

export default flattenNodeTree;
