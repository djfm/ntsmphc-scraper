// Flatten an array of nodes, returning all nodes
// of the tree without their children.
export const flattenNodeTree = (node: any) => {
  const { children, ...otherProps } = node;

  const hasChildrenProp = Object.prototype.hasOwnProperty.call(node, 'children');
  const childrenIsArray = hasChildrenProp && (node.children instanceof Array);
  const childrenIsNotEmpty = childrenIsArray && (node.children.length > 0);

  if (!childrenIsNotEmpty) {
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
