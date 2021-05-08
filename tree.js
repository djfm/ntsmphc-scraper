// Flatten an array of nodes, returning all nodes
// of the tree without their children.
const flattenNodeTree = (node) => {
  const { children, ...otherProps } = node;

  if (!children) {
    return [{ ...otherProps }];
  }

  return [{ ...otherProps }, ...[].concat(...children.map(flattenNodeTree))];
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
