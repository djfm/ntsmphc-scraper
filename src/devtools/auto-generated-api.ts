export type GetPartialAXTreeParams = {
  /**
   Identifier of the node to get the partial accessibility tree
   for.
  */
  nodeId: DOM.NodeId;

  /**
   Identifier of the backend node to get the partial accessibility
   tree for.
  */
  backendNodeId: DOM.BackendNodeId;

  /**
   JavaScript object id of the node wrapper to get the partial accessibility
   tree for.
  */
  objectId: Runtime.RemoteObjectId;

  /**
   Whether to fetch this nodes ancestors, siblings and children.
   Defaults to true.
  */
  fetchRelatives: boolean;
}

export type GetPartialAXTreeResult = {
  /**
   The `Accessibility.AXNode` for this DOM node, if it exists,
   plus its ancestors, siblings and children, if requested.
  */
  nodes: AXNode[];
}

export type GetCurrentTimeParams = {
  /**
   Id of animation.
  */
  id: string;
}

export type GetCurrentTimeResult = {
  /**
   Current time of the page.
  */
  currentTime: number;
}

export type ReleaseAnimationsParams = {
  /**
   List of animation ids to seek.
  */
  animations: undefined[];
}

export type ResolveAnimationParams = {
  /**
   Animation id.
  */
  animationId: string;
}

export type ResolveAnimationResult = {
  /**
   Corresponding remote object.
  */
  remoteObject: Runtime.RemoteObject;
}

export type SeekAnimationsParams = {
  /**
   List of animation ids to seek.
  */
  animations: undefined[];

  /**
   Set the current time of each animation.
  */
  currentTime: number;
}

export type SetPausedParams = {
  /**
   Animations to set the pause state of.
  */
  animations: undefined[];

  /**
   Paused state to set to.
  */
  paused: boolean;
}

export type SetPlaybackRateParams = {
  /**
   Playback rate for animations on page
  */
  playbackRate: number;
}

export type SetTimingParams = {
  /**
   Animation id.
  */
  animationId: string;

  /**
   Duration of the animation.
  */
  duration: number;

  /**
   Delay of the animation.
  */
  delay: number;
}

export type GetApplicationCacheForFrameParams = {
  /**
   Identifier of the frame containing document whose application
   cache is retrieved.
  */
  frameId: Page.FrameId;
}

export type GetApplicationCacheForFrameResult = {
  /**
   Relevant application cache data for the document in given frame.
  */
  applicationCache: ApplicationCache;
}

export type GetManifestForFrameParams = {
  /**
   Identifier of the frame containing document whose manifest
   is retrieved.
  */
  frameId: Page.FrameId;
}

export type GetManifestForFrameResult = {
  /**
   Manifest URL for document in the given frame.
  */
  manifestURL: string;
}

export type GetEncodedResponseParams = {
  /**
   Identifier of the network request to get content for.
  */
  requestId: Network.RequestId;

  /**
   The encoding to use.
  */
  encoding: string;

  /**
   The quality of the encoding (0-1). (defaults to 1)
  */
  quality: number;

  /**
   Whether to only return the size information (defaults to false).
  */
  sizeOnly: boolean;
}

export type GetEncodedResponseResult = {
  /**
   The encoded body as a base64 string. Omitted if sizeOnly is true.
  */
  body: string;

  /**
   Size before re-encoding.
  */
  originalSize: number;

  /**
   Size after re-encoding.
  */
  encodedSize: number;
}

export type StartObservingParams = {
  service: ServiceName;
}

export type StopObservingParams = {
  service: ServiceName;
}

export type SetRecordingParams = {
  shouldRecord: boolean;

  service: ServiceName;
}

export type ClearEventsParams = {
  service: ServiceName;
}

export type GrantPermissionsParams = {
  origin: string;

  permissions: PermissionType[];

  /**
   BrowserContext to override permissions. When omitted, default
   browser context is used.
  */
  browserContextId: Target.BrowserContextID;
}

export type ResetPermissionsParams = {
  /**
   BrowserContext to reset permissions. When omitted, default
   browser context is used.
  */
  browserContextId: Target.BrowserContextID;
}

export type GetHistogramsParams = {
  /**
   Requested substring in name. Only histograms which have query
   as a substring in their name are extracted. An empty or absent
   query returns all histograms.
  */
  query: string;

  /**
   If true, retrieve delta since last call.
  */
  delta: boolean;
}

export type GetHistogramsResult = {
  /**
   Histograms.
  */
  histograms: Histogram[];
}

export type GetHistogramParams = {
  /**
   Requested histogram name.
  */
  name: string;

  /**
   If true, retrieve delta since last call.
  */
  delta: boolean;
}

export type GetHistogramResult = {
  /**
   Histogram.
  */
  histogram: Histogram;
}

export type GetWindowBoundsParams = {
  /**
   Browser window id.
  */
  windowId: WindowID;
}

export type GetWindowBoundsResult = {
  /**
   Bounds information of the window. When window state is 'minimized',
   the restored window position and size are returned.
  */
  bounds: Bounds;
}

export type GetWindowForTargetParams = {
  /**
   Devtools agent host id. If called as a part of the session, associated
   targetId is used.
  */
  targetId: Target.TargetID;
}

export type GetWindowForTargetResult = {
  /**
   Browser window id.
  */
  windowId: WindowID;

  /**
   Bounds information of the window. When window state is 'minimized',
   the restored window position and size are returned.
  */
  bounds: Bounds;
}

export type SetWindowBoundsParams = {
  /**
   Browser window id.
  */
  windowId: WindowID;

  /**
   New window bounds. The 'minimized', 'maximized' and 'fullscreen'
   states cannot be combined with 'left', 'top', 'width' or 'height'.
   Leaves unspecified fields unchanged.
  */
  bounds: Bounds;
}

export type SetDockTileParams = {
  badgeLabel: string;

  /**
   Png encoded image.
  */
  image: string;
}

export type AddRuleParams = {
  /**
   The css style sheet identifier where a new rule should be inserted.
  */
  styleSheetId: StyleSheetId;

  /**
   The text of a new rule.
  */
  ruleText: string;

  /**
   Text position of a new rule in the target style sheet.
  */
  location: SourceRange;
}

export type AddRuleResult = {
  /**
   The newly created rule.
  */
  rule: CSSRule;
}

export type CollectClassNamesParams = {
  styleSheetId: StyleSheetId;
}

export type CollectClassNamesResult = {
  /**
   Class name list.
  */
  classNames: undefined[];
}

export type CreateStyleSheetParams = {
  /**
   Identifier of the frame where "via-inspector" stylesheet should
   be created.
  */
  frameId: Page.FrameId;
}

export type CreateStyleSheetResult = {
  /**
   Identifier of the created "via-inspector" stylesheet.
  */
  styleSheetId: StyleSheetId;
}

export type ForcePseudoStateParams = {
  /**
   The element id for which to force the pseudo state.
  */
  nodeId: DOM.NodeId;

  /**
   Element pseudo classes to force when computing the element's
   style.
  */
  forcedPseudoClasses: undefined[];
}

export type GetBackgroundColorsParams = {
  /**
   Id of the node to get background colors for.
  */
  nodeId: DOM.NodeId;
}

export type GetBackgroundColorsResult = {
  /**
   The range of background colors behind this element, if it contains
   any visible text. If no visible text is present, this will be undefined.
   In the case of a flat background color, this will consist of simply
   that color. In the case of a gradient, this will consist of each
   of the color stops. For anything more complicated, this will
   be an empty array. Images will be ignored (as if the image had failed
   to load).
  */
  backgroundColors: undefined[];

  /**
   The computed font size for this node, as a CSS computed value string
   (e.g. '12px').
  */
  computedFontSize: string;

  /**
   The computed font weight for this node, as a CSS computed value
   string (e.g. 'normal' or '100').
  */
  computedFontWeight: string;
}

export type GetComputedStyleForNodeParams = {
  nodeId: DOM.NodeId;
}

export type GetComputedStyleForNodeResult = {
  /**
   Computed style for the specified DOM node.
  */
  computedStyle: CSSComputedStyleProperty[];
}

export type GetInlineStylesForNodeParams = {
  nodeId: DOM.NodeId;
}

export type GetInlineStylesForNodeResult = {
  /**
   Inline style for the specified DOM node.
  */
  inlineStyle: CSSStyle;

  /**
   Attribute-defined element style (e.g. resulting from "width=20
   height=100%").
  */
  attributesStyle: CSSStyle;
}

export type GetMatchedStylesForNodeParams = {
  nodeId: DOM.NodeId;
}

export type GetMatchedStylesForNodeResult = {
  /**
   Inline style for the specified DOM node.
  */
  inlineStyle: CSSStyle;

  /**
   Attribute-defined element style (e.g. resulting from "width=20
   height=100%").
  */
  attributesStyle: CSSStyle;

  /**
   CSS rules matching this node, from all applicable stylesheets.
  */
  matchedCSSRules: RuleMatch[];

  /**
   Pseudo style matches for this node.
  */
  pseudoElements: PseudoElementMatches[];

  /**
   A chain of inherited styles (from the immediate node parent up
   to the DOM tree root).
  */
  inherited: InheritedStyleEntry[];

  /**
   A list of CSS keyframed animations matching this node.
  */
  cssKeyframesRules: CSSKeyframesRule[];
}

export type GetPlatformFontsForNodeParams = {
  nodeId: DOM.NodeId;
}

export type GetPlatformFontsForNodeResult = {
  /**
   Usage statistics for every employed platform font.
  */
  fonts: PlatformFontUsage[];
}

export type GetStyleSheetTextParams = {
  styleSheetId: StyleSheetId;
}

export type GetStyleSheetTextResult = {
  /**
   The stylesheet text.
  */
  text: string;
}

export type SetEffectivePropertyValueForNodeParams = {
  /**
   The element id for which to set property.
  */
  nodeId: DOM.NodeId;

  propertyName: string;

  value: string;
}

export type SetKeyframeKeyParams = {
  styleSheetId: StyleSheetId;

  range: SourceRange;

  keyText: string;
}

export type SetKeyframeKeyResult = {
  /**
   The resulting key text after modification.
  */
  keyText: Value;
}

export type SetMediaTextParams = {
  styleSheetId: StyleSheetId;

  range: SourceRange;

  text: string;
}

export type SetMediaTextResult = {
  /**
   The resulting CSS media rule after modification.
  */
  media: CSSMedia;
}

export type SetRuleSelectorParams = {
  styleSheetId: StyleSheetId;

  range: SourceRange;

  selector: string;
}

export type SetRuleSelectorResult = {
  /**
   The resulting selector list after modification.
  */
  selectorList: SelectorList;
}

export type SetStyleSheetTextParams = {
  styleSheetId: StyleSheetId;

  text: string;
}

export type SetStyleSheetTextResult = {
  /**
   URL of source map associated with script (if any).
  */
  sourceMapURL: string;
}

export type SetStyleTextsParams = {
  edits: StyleDeclarationEdit[];
}

export type SetStyleTextsResult = {
  /**
   The resulting styles after modification.
  */
  styles: CSSStyle[];
}

export type DeleteCacheParams = {
  /**
   Id of cache for deletion.
  */
  cacheId: CacheId;
}

export type DeleteEntryParams = {
  /**
   Id of cache where the entry will be deleted.
  */
  cacheId: CacheId;

  /**
   URL spec of the request.
  */
  request: string;
}

export type RequestCacheNamesParams = {
  /**
   Security origin.
  */
  securityOrigin: string;
}

export type RequestCacheNamesResult = {
  /**
   Caches for the security origin.
  */
  caches: Cache[];
}

export type RequestCachedResponseParams = {
  /**
   Id of cache that contains the entry.
  */
  cacheId: CacheId;

  /**
   URL spec of the request.
  */
  requestURL: string;

  /**
   headers of the request.
  */
  requestHeaders: Header[];
}

export type RequestCachedResponseResult = {
  /**
   Response read from the cache.
  */
  response: CachedResponse;
}

export type RequestEntriesParams = {
  /**
   ID of cache to get entries from.
  */
  cacheId: CacheId;

  /**
   Number of records to skip.
  */
  skipCount: number;

  /**
   Number of records to fetch.
  */
  pageSize: number;

  /**
   If present, only return the entries containing this substring
   in the path
  */
  pathFilter: string;
}

export type RequestEntriesResult = {
  /**
   Array of object store data entries.
  */
  cacheDataEntries: DataEntry[];

  /**
   Count of returned entries from this storage. If pathFilter is
   empty, it is the count of all entries from this storage.
  */
  returnCount: number;
}

export type EnableParams = {
  /**
   The maximum size in bytes of collected scripts (not referenced
   by other heap objects) the debugger can hold. Puts no limit if
   paramter is omitted.
  */
  maxScriptsCacheSize: number;
}

export type SetSinkToUseParams = {
  sinkName: string;
}

export type StartTabMirroringParams = {
  sinkName: string;
}

export type StopCastingParams = {
  sinkName: string;
}

export type CollectClassNamesFromSubtreeParams = {
  /**
   Id of the node to collect class names.
  */
  nodeId: NodeId;
}

export type CollectClassNamesFromSubtreeResult = {
  /**
   Class name list.
  */
  classNames: undefined[];
}

export type CopyToParams = {
  /**
   Id of the node to copy.
  */
  nodeId: NodeId;

  /**
   Id of the element to drop the copy into.
  */
  targetNodeId: NodeId;

  /**
   Drop the copy before this node (if absent, the copy becomes the
   last child of `targetNodeId`).
  */
  insertBeforeNodeId: NodeId;
}

export type CopyToResult = {
  /**
   Id of the node clone.
  */
  nodeId: NodeId;
}

export type DescribeNodeParams = {
  /**
   Identifier of the node.
  */
  nodeId: NodeId;

  /**
   Identifier of the backend node.
  */
  backendNodeId: BackendNodeId;

  /**
   JavaScript object id of the node wrapper.
  */
  objectId: Runtime.RemoteObjectId;

  /**
   The maximum depth at which children should be retrieved, defaults
   to 1. Use -1 for the entire subtree or provide an integer larger
   than 0.
  */
  depth: number;

  /**
   Whether or not iframes and shadow roots should be traversed when
   returning the subtree (default is false).
  */
  pierce: boolean;
}

export type DescribeNodeResult = {
  /**
   Node description.
  */
  node: Node;
}

export type DiscardSearchResultsParams = {
  /**
   Unique search session identifier.
  */
  searchId: string;
}

export type FocusParams = {
  /**
   Identifier of the node.
  */
  nodeId: NodeId;

  /**
   Identifier of the backend node.
  */
  backendNodeId: BackendNodeId;

  /**
   JavaScript object id of the node wrapper.
  */
  objectId: Runtime.RemoteObjectId;
}

export type GetAttributesParams = {
  /**
   Id of the node to retrieve attibutes for.
  */
  nodeId: NodeId;
}

export type GetAttributesResult = {
  /**
   An interleaved array of node attribute names and values.
  */
  attributes: undefined[];
}

export type GetBoxModelParams = {
  /**
   Identifier of the node.
  */
  nodeId: NodeId;

  /**
   Identifier of the backend node.
  */
  backendNodeId: BackendNodeId;

  /**
   JavaScript object id of the node wrapper.
  */
  objectId: Runtime.RemoteObjectId;
}

export type GetBoxModelResult = {
  /**
   Box model for the node.
  */
  model: BoxModel;
}

export type GetContentQuadsParams = {
  /**
   Identifier of the node.
  */
  nodeId: NodeId;

  /**
   Identifier of the backend node.
  */
  backendNodeId: BackendNodeId;

  /**
   JavaScript object id of the node wrapper.
  */
  objectId: Runtime.RemoteObjectId;
}

export type GetContentQuadsResult = {
  /**
   Quads that describe node layout relative to viewport.
  */
  quads: Quad[];
}

export type GetDocumentParams = {
  /**
   The maximum depth at which children should be retrieved, defaults
   to 1. Use -1 for the entire subtree or provide an integer larger
   than 0.
  */
  depth: number;

  /**
   Whether or not iframes and shadow roots should be traversed when
   returning the subtree (default is false).
  */
  pierce: boolean;
}

export type GetDocumentResult = {
  /**
   Resulting node.
  */
  root: Node;
}

export type GetFlattenedDocumentParams = {
  /**
   The maximum depth at which children should be retrieved, defaults
   to 1. Use -1 for the entire subtree or provide an integer larger
   than 0.
  */
  depth: number;

  /**
   Whether or not iframes and shadow roots should be traversed when
   returning the subtree (default is false).
  */
  pierce: boolean;
}

export type GetFlattenedDocumentResult = {
  /**
   Resulting node.
  */
  nodes: Node[];
}

export type GetNodeForLocationParams = {
  /**
   X coordinate.
  */
  x: number;

  /**
   Y coordinate.
  */
  y: number;

  /**
   False to skip to the nearest non-UA shadow root ancestor (default:
   false).
  */
  includeUserAgentShadowDOM: boolean;
}

export type GetNodeForLocationResult = {
  /**
   Resulting node.
  */
  backendNodeId: BackendNodeId;

  /**
   Id of the node at given coordinates, only when enabled and requested
   document.
  */
  nodeId: NodeId;
}

export type GetOuterHTMLParams = {
  /**
   Identifier of the node.
  */
  nodeId: NodeId;

  /**
   Identifier of the backend node.
  */
  backendNodeId: BackendNodeId;

  /**
   JavaScript object id of the node wrapper.
  */
  objectId: Runtime.RemoteObjectId;
}

export type GetOuterHTMLResult = {
  /**
   Outer HTML markup.
  */
  outerHTML: string;
}

export type GetRelayoutBoundaryParams = {
  /**
   Id of the node.
  */
  nodeId: NodeId;
}

export type GetRelayoutBoundaryResult = {
  /**
   Relayout boundary node id for the given node.
  */
  nodeId: NodeId;
}

export type GetSearchResultsParams = {
  /**
   Unique search session identifier.
  */
  searchId: string;

  /**
   Start index of the search result to be returned.
  */
  fromIndex: number;

  /**
   End index of the search result to be returned.
  */
  toIndex: number;
}

export type GetSearchResultsResult = {
  /**
   Ids of the search result nodes.
  */
  nodeIds: NodeId[];
}

export type MoveToParams = {
  /**
   Id of the node to move.
  */
  nodeId: NodeId;

  /**
   Id of the element to drop the moved node into.
  */
  targetNodeId: NodeId;

  /**
   Drop node before this one (if absent, the moved node becomes the
   last child of `targetNodeId`).
  */
  insertBeforeNodeId: NodeId;
}

export type MoveToResult = {
  /**
   New id of the moved node.
  */
  nodeId: NodeId;
}

export type PerformSearchParams = {
  /**
   Plain text or query selector or XPath search query.
  */
  query: string;

  /**
   True to search in user agent shadow DOM.
  */
  includeUserAgentShadowDOM: boolean;
}

export type PerformSearchResult = {
  /**
   Unique search session identifier.
  */
  searchId: string;

  /**
   Number of search results.
  */
  resultCount: number;
}

export type PushNodeByPathToFrontendParams = {
  /**
   Path to node in the proprietary format.
  */
  path: string;
}

export type PushNodeByPathToFrontendResult = {
  /**
   Id of the node for given path.
  */
  nodeId: NodeId;
}

export type PushNodesByBackendIdsToFrontendParams = {
  /**
   The array of backend node ids.
  */
  backendNodeIds: BackendNodeId[];
}

export type PushNodesByBackendIdsToFrontendResult = {
  /**
   The array of ids of pushed nodes that correspond to the backend
   ids specified in backendNodeIds.
  */
  nodeIds: NodeId[];
}

export type QuerySelectorParams = {
  /**
   Id of the node to query upon.
  */
  nodeId: NodeId;

  /**
   Selector string.
  */
  selector: string;
}

export type QuerySelectorResult = {
  /**
   Query selector result.
  */
  nodeId: NodeId;
}

export type QuerySelectorAllParams = {
  /**
   Id of the node to query upon.
  */
  nodeId: NodeId;

  /**
   Selector string.
  */
  selector: string;
}

export type QuerySelectorAllResult = {
  /**
   Query selector result.
  */
  nodeIds: NodeId[];
}

export type RemoveAttributeParams = {
  /**
   Id of the element to remove attribute from.
  */
  nodeId: NodeId;

  /**
   Name of the attribute to remove.
  */
  name: string;
}

export type RemoveNodeParams = {
  /**
   Id of the node to remove.
  */
  nodeId: NodeId;
}

export type RequestChildNodesParams = {
  /**
   Id of the node to get children for.
  */
  nodeId: NodeId;

  /**
   The maximum depth at which children should be retrieved, defaults
   to 1. Use -1 for the entire subtree or provide an integer larger
   than 0.
  */
  depth: number;

  /**
   Whether or not iframes and shadow roots should be traversed when
   returning the sub-tree (default is false).
  */
  pierce: boolean;
}

export type RequestNodeParams = {
  /**
   JavaScript object id to convert into node.
  */
  objectId: Runtime.RemoteObjectId;
}

export type RequestNodeResult = {
  /**
   Node id for given object.
  */
  nodeId: NodeId;
}

export type ResolveNodeParams = {
  /**
   Id of the node to resolve.
  */
  nodeId: NodeId;

  /**
   Backend identifier of the node to resolve.
  */
  backendNodeId: DOM.BackendNodeId;

  /**
   Symbolic group name that can be used to release multiple objects.
  */
  objectGroup: string;

  /**
   Execution context in which to resolve the node.
  */
  executionContextId: Runtime.ExecutionContextId;
}

export type ResolveNodeResult = {
  /**
   JavaScript object wrapper for given node.
  */
  object: Runtime.RemoteObject;
}

export type SetAttributeValueParams = {
  /**
   Id of the element to set attribute for.
  */
  nodeId: NodeId;

  /**
   Attribute name.
  */
  name: string;

  /**
   Attribute value.
  */
  value: string;
}

export type SetAttributesAsTextParams = {
  /**
   Id of the element to set attributes for.
  */
  nodeId: NodeId;

  /**
   Text with a number of attributes. Will parse this text using HTML
   parser.
  */
  text: string;

  /**
   Attribute name to replace with new attributes derived from text
   in case text parsed successfully.
  */
  name: string;
}

export type SetFileInputFilesParams = {
  /**
   Array of file paths to set.
  */
  files: undefined[];

  /**
   Identifier of the node.
  */
  nodeId: NodeId;

  /**
   Identifier of the backend node.
  */
  backendNodeId: BackendNodeId;

  /**
   JavaScript object id of the node wrapper.
  */
  objectId: Runtime.RemoteObjectId;
}

export type GetFileInfoParams = {
  /**
   JavaScript object id of the node wrapper.
  */
  objectId: Runtime.RemoteObjectId;
}

export type GetFileInfoResult = {
  path: string;
}

export type SetInspectedNodeParams = {
  /**
   DOM node id to be accessible by means of $x command line API.
  */
  nodeId: NodeId;
}

export type SetNodeNameParams = {
  /**
   Id of the node to set name for.
  */
  nodeId: NodeId;

  /**
   New node's name.
  */
  name: string;
}

export type SetNodeNameResult = {
  /**
   New node's id.
  */
  nodeId: NodeId;
}

export type SetNodeValueParams = {
  /**
   Id of the node to set value for.
  */
  nodeId: NodeId;

  /**
   New node's value.
  */
  value: string;
}

export type SetOuterHTMLParams = {
  /**
   Id of the node to set markup for.
  */
  nodeId: NodeId;

  /**
   Outer HTML markup to set.
  */
  outerHTML: string;
}

export type GetFrameOwnerParams = {
  frameId: Page.FrameId;
}

export type GetFrameOwnerResult = {
  /**
   Resulting node.
  */
  backendNodeId: BackendNodeId;

  /**
   Id of the node at given coordinates, only when enabled and requested
   document.
  */
  nodeId: NodeId;
}

export type GetEventListenersParams = {
  /**
   Identifier of the object to return listeners for.
  */
  objectId: Runtime.RemoteObjectId;

  /**
   The maximum depth at which Node children should be retrieved,
   defaults to 1. Use -1 for the entire subtree or provide an integer
   larger than 0.
  */
  depth: number;

  /**
   Whether or not iframes and shadow roots should be traversed when
   returning the subtree (default is false). Reports listeners
   for all contexts if pierce is enabled.
  */
  pierce: boolean;
}

export type GetEventListenersResult = {
  /**
   Array of relevant listeners.
  */
  listeners: EventListener[];
}

export type RemoveDOMBreakpointParams = {
  /**
   Identifier of the node to remove breakpoint from.
  */
  nodeId: DOM.NodeId;

  /**
   Type of the breakpoint to remove.
  */
  type: DOMBreakpointType;
}

export type RemoveEventListenerBreakpointParams = {
  /**
   Event name.
  */
  eventName: string;

  /**
   EventTarget interface name.
  */
  targetName: string;
}

export type RemoveInstrumentationBreakpointParams = {
  /**
   Instrumentation name to stop on.
  */
  eventName: string;
}

export type RemoveXHRBreakpointParams = {
  /**
   Resource URL substring.
  */
  url: string;
}

export type SetDOMBreakpointParams = {
  /**
   Identifier of the node to set breakpoint on.
  */
  nodeId: DOM.NodeId;

  /**
   Type of the operation to stop upon.
  */
  type: DOMBreakpointType;
}

export type SetEventListenerBreakpointParams = {
  /**
   DOM Event name to stop on (any DOM event will do).
  */
  eventName: string;

  /**
   EventTarget interface name to stop on. If equal to `"*"` or not
   provided, will stop on any EventTarget.
  */
  targetName: string;
}

export type SetInstrumentationBreakpointParams = {
  /**
   Instrumentation name.
  */
  instrumentation: string;
}

export type SetXHRBreakpointParams = {
  /**
   Resource URL substring. All XHRs having this substring in the
   URL will get stopped upon.
  */
  url: string;
}

export type GetSnapshotParams = {
  /**
   Whitelist of computed styles to return.
  */
  computedStyleWhitelist: undefined[];

  /**
   Whether or not to retrieve details of DOM listeners (default
   false).
  */
  includeEventListeners: boolean;

  /**
   Whether to determine and include the paint order index of LayoutTreeNodes
   (default false).
  */
  includePaintOrder: boolean;

  /**
   Whether to include UA shadow tree in the snapshot (default false).
  */
  includeUserAgentShadowTree: boolean;
}

export type GetSnapshotResult = {
  /**
   The nodes in the DOM tree. The DOMNode at index 0 corresponds to
   the root document.
  */
  domNodes: DOMNode[];

  /**
   The nodes in the layout tree.
  */
  layoutTreeNodes: LayoutTreeNode[];

  /**
   Whitelisted ComputedStyle properties for each node in the layout
   tree.
  */
  computedStyles: ComputedStyle[];
}

export type CaptureSnapshotParams = {
  /**
   Format (defaults to mhtml).
  */
  format: string;
}

export type CaptureSnapshotResult = {
  /**
   Serialized page data.
  */
  data: string;
}

export type ClearParams = {
  storageId: StorageId;
}

export type GetDOMStorageItemsParams = {
  storageId: StorageId;
}

export type GetDOMStorageItemsResult = {
  entries: Item[];
}

export type RemoveDOMStorageItemParams = {
  storageId: StorageId;

  key: string;
}

export type SetDOMStorageItemParams = {
  storageId: StorageId;

  key: string;

  value: string;
}

export type ExecuteSQLParams = {
  databaseId: DatabaseId;

  query: string;
}

export type ExecuteSQLResult = {
  columnNames: undefined[];

  values: undefined[];

  sqlError: Error;
}

export type GetDatabaseTableNamesParams = {
  databaseId: DatabaseId;
}

export type GetDatabaseTableNamesResult = {
  tableNames: undefined[];
}

export type SetDeviceOrientationOverrideParams = {
  /**
   Mock alpha
  */
  alpha: number;

  /**
   Mock beta
  */
  beta: number;

  /**
   Mock gamma
  */
  gamma: number;
}

export type SetFocusEmulationEnabledParams = {
  /**
   Whether to enable to disable focus emulation.
  */
  enabled: boolean;
}

export type SetCPUThrottlingRateParams = {
  /**
   Throttling rate as a slowdown factor (1 is no throttle, 2 is 2x
   slowdown, etc).
  */
  rate: number;
}

export type SetDefaultBackgroundColorOverrideParams = {
  /**
   RGBA of the default background color. If not specified, any existing
   override will be cleared.
  */
  color: DOM.RGBA;
}

export type SetDeviceMetricsOverrideParams = {
  /**
   Overriding width value in pixels (minimum 0, maximum 10000000).
   0 disables the override.
  */
  width: number;

  /**
   Overriding height value in pixels (minimum 0, maximum 10000000).
   0 disables the override.
  */
  height: number;

  /**
   Overriding device scale factor value. 0 disables the override.
  */
  deviceScaleFactor: number;

  /**
   Whether to emulate mobile device. This includes viewport meta
   tag, overlay scrollbars, text autosizing and more.
  */
  mobile: boolean;

  /**
   Scale to apply to resulting view image.
  */
  scale: number;

  /**
   Overriding screen width value in pixels (minimum 0, maximum
   10000000).
  */
  screenWidth: number;

  /**
   Overriding screen height value in pixels (minimum 0, maximum
   10000000).
  */
  screenHeight: number;

  /**
   Overriding view X position on screen in pixels (minimum 0, maximum
   10000000).
  */
  positionX: number;

  /**
   Overriding view Y position on screen in pixels (minimum 0, maximum
   10000000).
  */
  positionY: number;

  /**
   Do not set visible view size, rely upon explicit setVisibleSize
   call.
  */
  dontSetVisibleSize: boolean;

  /**
   Screen orientation override.
  */
  screenOrientation: Emulation.ScreenOrientation;

  /**
   The viewport dimensions and scale. If not set, the override is
   cleared.
  */
  viewport: Viewport;
}

export type SetScrollbarsHiddenParams = {
  /**
   Whether scrollbars should be always hidden.
  */
  hidden: boolean;
}

export type SetDocumentCookieDisabledParams = {
  /**
   Whether document.coookie API should be disabled.
  */
  disabled: boolean;
}

export type SetEmitTouchEventsForMouseParams = {
  /**
   Whether touch emulation based on mouse input should be enabled.
  */
  enabled: boolean;

  /**
   Touch/gesture events configuration. Default: current platform.
  */
  configuration: string;
}

export type SetEmulatedMediaParams = {
  /**
   Media type to emulate. Empty string disables the override.
  */
  media: string;
}

export type SetGeolocationOverrideParams = {
  /**
   Mock latitude
  */
  latitude: number;

  /**
   Mock longitude
  */
  longitude: number;

  /**
   Mock accuracy
  */
  accuracy: number;
}

export type SetNavigatorOverridesParams = {
  /**
   The platform navigator.platform should return.
  */
  platform: string;
}

export type SetPageScaleFactorParams = {
  /**
   Page scale factor.
  */
  pageScaleFactor: number;
}

export type SetScriptExecutionDisabledParams = {
  /**
   Whether script execution should be disabled in the page.
  */
  value: boolean;
}

export type SetTouchEmulationEnabledParams = {
  /**
   Whether the touch event emulation should be enabled.
  */
  enabled: boolean;

  /**
   Touch/gesture events configuration. Default: current platform.
  */
  configuration: string;
}

export type SetVirtualTimePolicyParams = {
  policy: VirtualTimePolicy;

  /**
   If set, after this many virtual milliseconds have elapsed virtual
   time will be paused and a virtualTimeBudgetExpired event is
   sent.
  */
  budget: number;

  /**
   If set this specifies the maximum number of tasks that can be run
   before virtual is forced forwards to prevent deadlock.
  */
  maxVirtualTimeTaskStarvationCount: number;

  /**
   If set the virtual time policy change should be deferred until
   any frame starts navigating. Note any previous deferred policy
   change is superseded.
  */
  waitForNavigation: boolean;

  /**
   If set, base::Time::Now will be overriden to initially return
   this value.
  */
  initialVirtualTime: Network.TimeSinceEpoch;
}

export type SetVirtualTimePolicyResult = {
  /**
   Absolute timestamp at which virtual time was first enabled (up
   time in milliseconds).
  */
  virtualTimeTicksBase: number;
}

export type SetTimezoneOverrideParams = {
  /**
   The timezone identifier. If empty, disables the override and
   restores default host system timezone.
  */
  timezoneId: string;
}

export type SetVisibleSizeParams = {
  /**
   Frame width (DIP).
  */
  width: number;

  /**
   Frame height (DIP).
  */
  height: number;
}

export type SetUserAgentOverrideParams = {
  /**
   User agent to use.
  */
  userAgent: string;

  /**
   Browser langugage to emulate.
  */
  acceptLanguage: string;

  /**
   The platform navigator.platform should return.
  */
  platform: string;
}

export type BeginFrameParams = {
  /**
   Timestamp of this BeginFrame in Renderer TimeTicks (milliseconds
   of uptime). If not set, the current time will be used.
  */
  frameTimeTicks: number;

  /**
   The interval between BeginFrames that is reported to the compositor,
   in milliseconds. Defaults to a 60 frames/second interval, i.e.
   about 16.666 milliseconds.
  */
  interval: number;

  /**
   Whether updates should not be committed and drawn onto the display.
   False by default. If true, only side effects of the BeginFrame
   will be run, such as layout and animations, but any visual updates
   may not be visible on the display or in screenshots.
  */
  noDisplayUpdates: boolean;

  /**
   If set, a screenshot of the frame will be captured and returned
   in the response. Otherwise, no screenshot will be captured.
   Note that capturing a screenshot can fail, for example, during
   renderer initialization. In such a case, no screenshot data
   will be returned.
  */
  screenshot: ScreenshotParams;
}

export type BeginFrameResult = {
  /**
   Whether the BeginFrame resulted in damage and, thus, a new frame
   was committed to the display. Reported for diagnostic uses,
   may be removed in the future.
  */
  hasDamage: boolean;

  /**
   Base64-encoded image data of the screenshot, if one was requested
   and successfully taken.
  */
  screenshotData: string;
}

export type CloseParams = {
  /**
   Handle of the stream to close.
  */
  handle: StreamHandle;
}

export type ReadParams = {
  /**
   Handle of the stream to read.
  */
  handle: StreamHandle;

  /**
   Seek to the specified offset before reading (if not specificed,
   proceed with offset following the last read). Some types of streams
   may only support sequential reads.
  */
  offset: number;

  /**
   Maximum number of bytes to read (left upon the agent discretion
   if not specified).
  */
  size: number;
}

export type ReadResult = {
  /**
   Set if the data is base64-encoded
  */
  base64Encoded: boolean;

  /**
   Data that were read.
  */
  data: string;

  /**
   Set if the end-of-file condition occured while reading.
  */
  eof: boolean;
}

export type ResolveBlobParams = {
  /**
   Object id of a Blob object wrapper.
  */
  objectId: Runtime.RemoteObjectId;
}

export type ResolveBlobResult = {
  /**
   UUID of the specified Blob.
  */
  uuid: string;
}

export type ClearObjectStoreParams = {
  /**
   Security origin.
  */
  securityOrigin: string;

  /**
   Database name.
  */
  databaseName: string;

  /**
   Object store name.
  */
  objectStoreName: string;
}

export type DeleteDatabaseParams = {
  /**
   Security origin.
  */
  securityOrigin: string;

  /**
   Database name.
  */
  databaseName: string;
}

export type DeleteObjectStoreEntriesParams = {
  securityOrigin: string;

  databaseName: string;

  objectStoreName: string;

  /**
   Range of entry keys to delete
  */
  keyRange: KeyRange;
}

export type RequestDataParams = {
  /**
   Security origin.
  */
  securityOrigin: string;

  /**
   Database name.
  */
  databaseName: string;

  /**
   Object store name.
  */
  objectStoreName: string;

  /**
   Index name, empty string for object store data requests.
  */
  indexName: string;

  /**
   Number of records to skip.
  */
  skipCount: number;

  /**
   Number of records to fetch.
  */
  pageSize: number;

  /**
   Key range.
  */
  keyRange: KeyRange;
}

export type RequestDataResult = {
  /**
   Array of object store data entries.
  */
  objectStoreDataEntries: DataEntry[];

  /**
   If true, there are more entries to fetch in the given range.
  */
  hasMore: boolean;
}

export type GetMetadataParams = {
  /**
   Security origin.
  */
  securityOrigin: string;

  /**
   Database name.
  */
  databaseName: string;

  /**
   Object store name.
  */
  objectStoreName: string;
}

export type GetMetadataResult = {
  /**
   the entries count
  */
  entriesCount: number;

  /**
   the current value of key generator, to become the next inserted
   key into the object store. Valid if objectStore.autoIncrement
   is true.
  */
  keyGeneratorValue: number;
}

export type RequestDatabaseParams = {
  /**
   Security origin.
  */
  securityOrigin: string;

  /**
   Database name.
  */
  databaseName: string;
}

export type RequestDatabaseResult = {
  /**
   Database with an array of object stores.
  */
  databaseWithObjectStores: DatabaseWithObjectStores;
}

export type RequestDatabaseNamesParams = {
  /**
   Security origin.
  */
  securityOrigin: string;
}

export type RequestDatabaseNamesResult = {
  /**
   Database names for origin.
  */
  databaseNames: undefined[];
}

export type DispatchKeyEventParams = {
  /**
   Type of the key event.
  */
  type: string;

  /**
   Bit field representing pressed modifier keys. Alt=1, Ctrl=2,
   Meta/Command=4, Shift=8 (default: 0).
  */
  modifiers: number;

  /**
   Time at which the event occurred.
  */
  timestamp: TimeSinceEpoch;

  /**
   Text as generated by processing a virtual key code with a keyboard
   layout. Not needed for for `keyUp` and `rawKeyDown` events (default:
   "")
  */
  text: string;

  /**
   Text that would have been generated by the keyboard if no modifiers
   were pressed (except for shift). Useful for shortcut (accelerator)
   key handling (default: "").
  */
  unmodifiedText: string;

  /**
   Unique key identifier (e.g., 'U+0041') (default: "").
  */
  keyIdentifier: string;

  /**
   Unique DOM defined string value for each physical key (e.g.,
   'KeyA') (default: "").
  */
  code: string;

  /**
   Unique DOM defined string value describing the meaning of the
   key in the context of active modifiers, keyboard layout, etc
   (e.g., 'AltGr') (default: "").
  */
  key: string;

  /**
   Windows virtual key code (default: 0).
  */
  windowsVirtualKeyCode: number;

  /**
   Native virtual key code (default: 0).
  */
  nativeVirtualKeyCode: number;

  /**
   Whether the event was generated from auto repeat (default: false).
  */
  autoRepeat: boolean;

  /**
   Whether the event was generated from the keypad (default: false).
  */
  isKeypad: boolean;

  /**
   Whether the event was a system key event (default: false).
  */
  isSystemKey: boolean;

  /**
   Whether the event was from the left or right side of the keyboard.
   1=Left, 2=Right (default: 0).
  */
  location: number;
}

export type InsertTextParams = {
  /**
   The text to insert.
  */
  text: string;
}

export type DispatchMouseEventParams = {
  /**
   Type of the mouse event.
  */
  type: string;

  /**
   X coordinate of the event relative to the main frame's viewport
   in CSS pixels.
  */
  x: number;

  /**
   Y coordinate of the event relative to the main frame's viewport
   in CSS pixels. 0 refers to the top of the viewport and Y increases
   as it proceeds towards the bottom of the viewport.
  */
  y: number;

  /**
   Bit field representing pressed modifier keys. Alt=1, Ctrl=2,
   Meta/Command=4, Shift=8 (default: 0).
  */
  modifiers: number;

  /**
   Time at which the event occurred.
  */
  timestamp: TimeSinceEpoch;

  /**
   Mouse button (default: "none").
  */
  button: string;

  /**
   A number indicating which buttons are pressed on the mouse when
   a mouse event is triggered. Left=1, Right=2, Middle=4, Back=8,
   Forward=16, None=0.
  */
  buttons: number;

  /**
   Number of times the mouse button was clicked (default: 0).
  */
  clickCount: number;

  /**
   X delta in CSS pixels for mouse wheel event (default: 0).
  */
  deltaX: number;

  /**
   Y delta in CSS pixels for mouse wheel event (default: 0).
  */
  deltaY: number;

  /**
   Pointer type (default: "mouse").
  */
  pointerType: string;
}

export type DispatchTouchEventParams = {
  /**
   Type of the touch event. TouchEnd and TouchCancel must not contain
   any touch points, while TouchStart and TouchMove must contains
   at least one.
  */
  type: string;

  /**
   Active touch points on the touch device. One event per any changed
   point (compared to previous touch event in a sequence) is generated,
   emulating pressing/moving/releasing points one by one.
  */
  touchPoints: TouchPoint[];

  /**
   Bit field representing pressed modifier keys. Alt=1, Ctrl=2,
   Meta/Command=4, Shift=8 (default: 0).
  */
  modifiers: number;

  /**
   Time at which the event occurred.
  */
  timestamp: TimeSinceEpoch;
}

export type EmulateTouchFromMouseEventParams = {
  /**
   Type of the mouse event.
  */
  type: string;

  /**
   X coordinate of the mouse pointer in DIP.
  */
  x: number;

  /**
   Y coordinate of the mouse pointer in DIP.
  */
  y: number;

  /**
   Mouse button.
  */
  button: string;

  /**
   Time at which the event occurred (default: current time).
  */
  timestamp: TimeSinceEpoch;

  /**
   X delta in DIP for mouse wheel event (default: 0).
  */
  deltaX: number;

  /**
   Y delta in DIP for mouse wheel event (default: 0).
  */
  deltaY: number;

  /**
   Bit field representing pressed modifier keys. Alt=1, Ctrl=2,
   Meta/Command=4, Shift=8 (default: 0).
  */
  modifiers: number;

  /**
   Number of times the mouse button was clicked (default: 0).
  */
  clickCount: number;
}

export type SetIgnoreInputEventsParams = {
  /**
   Ignores input events processing when set to true.
  */
  ignore: boolean;
}

export type SynthesizePinchGestureParams = {
  /**
   X coordinate of the start of the gesture in CSS pixels.
  */
  x: number;

  /**
   Y coordinate of the start of the gesture in CSS pixels.
  */
  y: number;

  /**
   Relative scale factor after zooming (>1.0 zooms in, <1.0 zooms
   out).
  */
  scaleFactor: number;

  /**
   Relative pointer speed in pixels per second (default: 800).
  */
  relativeSpeed: number;

  /**
   Which type of input events to be generated (default: 'default',
   which queries the platform for the preferred input type).
  */
  gestureSourceType: GestureSourceType;
}

export type SynthesizeScrollGestureParams = {
  /**
   X coordinate of the start of the gesture in CSS pixels.
  */
  x: number;

  /**
   Y coordinate of the start of the gesture in CSS pixels.
  */
  y: number;

  /**
   The distance to scroll along the X axis (positive to scroll left).
  */
  xDistance: number;

  /**
   The distance to scroll along the Y axis (positive to scroll up).
  */
  yDistance: number;

  /**
   The number of additional pixels to scroll back along the X axis,
   in addition to the given distance.
  */
  xOverscroll: number;

  /**
   The number of additional pixels to scroll back along the Y axis,
   in addition to the given distance.
  */
  yOverscroll: number;

  /**
   Prevent fling (default: true).
  */
  preventFling: boolean;

  /**
   Swipe speed in pixels per second (default: 800).
  */
  speed: number;

  /**
   Which type of input events to be generated (default: 'default',
   which queries the platform for the preferred input type).
  */
  gestureSourceType: GestureSourceType;

  /**
   The number of times to repeat the gesture (default: 0).
  */
  repeatCount: number;

  /**
   The number of milliseconds delay between each repeat. (default:
   250).
  */
  repeatDelayMs: number;

  /**
   The name of the interaction markers to generate, if not empty
   (default: "").
  */
  interactionMarkerName: string;
}

export type SynthesizeTapGestureParams = {
  /**
   X coordinate of the start of the gesture in CSS pixels.
  */
  x: number;

  /**
   Y coordinate of the start of the gesture in CSS pixels.
  */
  y: number;

  /**
   Duration between touchdown and touchup events in ms (default:
   50).
  */
  duration: number;

  /**
   Number of times to perform the tap (e.g. 2 for double tap, default:
   1).
  */
  tapCount: number;

  /**
   Which type of input events to be generated (default: 'default',
   which queries the platform for the preferred input type).
  */
  gestureSourceType: GestureSourceType;
}

export type CompositingReasonsParams = {
  /**
   The id of the layer for which we want to get the reasons it was composited.
  */
  layerId: LayerId;
}

export type CompositingReasonsResult = {
  /**
   A list of strings specifying reasons for the given layer to become
   composited.
  */
  compositingReasons: undefined[];
}

export type LoadSnapshotParams = {
  /**
   An array of tiles composing the snapshot.
  */
  tiles: PictureTile[];
}

export type LoadSnapshotResult = {
  /**
   The id of the snapshot.
  */
  snapshotId: SnapshotId;
}

export type MakeSnapshotParams = {
  /**
   The id of the layer.
  */
  layerId: LayerId;
}

export type MakeSnapshotResult = {
  /**
   The id of the layer snapshot.
  */
  snapshotId: SnapshotId;
}

export type ProfileSnapshotParams = {
  /**
   The id of the layer snapshot.
  */
  snapshotId: SnapshotId;

  /**
   The maximum number of times to replay the snapshot (1, if not specified).
  */
  minRepeatCount: number;

  /**
   The minimum duration (in seconds) to replay the snapshot.
  */
  minDuration: number;

  /**
   The clip rectangle to apply when replaying the snapshot.
  */
  clipRect: DOM.Rect;
}

export type ProfileSnapshotResult = {
  /**
   The array of paint profiles, one per run.
  */
  timings: PaintProfile[];
}

export type ReleaseSnapshotParams = {
  /**
   The id of the layer snapshot.
  */
  snapshotId: SnapshotId;
}

export type ReplaySnapshotParams = {
  /**
   The id of the layer snapshot.
  */
  snapshotId: SnapshotId;

  /**
   The first step to replay from (replay from the very start if not
   specified).
  */
  fromStep: number;

  /**
   The last step to replay to (replay till the end if not specified).
  */
  toStep: number;

  /**
   The scale to apply while replaying (defaults to 1).
  */
  scale: number;
}

export type ReplaySnapshotResult = {
  /**
   A data: URL for resulting image.
  */
  dataURL: string;
}

export type SnapshotCommandLogParams = {
  /**
   The id of the layer snapshot.
  */
  snapshotId: SnapshotId;
}

export type SnapshotCommandLogResult = {
  /**
   The array of canvas function calls.
  */
  commandLog: undefined[];
}

export type StartViolationsReportParams = {
  /**
   Configuration for violations.
  */
  config: ViolationSetting[];
}

export type SetPressureNotificationsSuppressedParams = {
  /**
   If true, memory pressure notifications will be suppressed.
  */
  suppressed: boolean;
}

export type SimulatePressureNotificationParams = {
  /**
   Memory pressure level of the notification.
  */
  level: PressureLevel;
}

export type StartSamplingParams = {
  /**
   Average sample interval in bytes. Poisson distribution is used
   for the intervals. The default value is 32768 bytes.
  */
  samplingInterval: number;
}

export type ContinueInterceptedRequestParams = {
  interceptionId: InterceptionId;

  /**
   If set this causes the request to fail with the given reason. Passing
   `Aborted` for requests marked with `isNavigationRequest`
   also cancels the navigation. Must not be set in response to an
   authChallenge.
  */
  errorReason: ErrorReason;

  /**
   If set the requests completes using with the provided base64
   encoded raw response, including HTTP status line and headers
   etc... Must not be set in response to an authChallenge.
  */
  rawResponse: string;

  /**
   If set the request url will be modified in a way that's not observable
   by page. Must not be set in response to an authChallenge.
  */
  url: string;

  /**
   If set this allows the request method to be overridden. Must not
   be set in response to an authChallenge.
  */
  method: string;

  /**
   If set this allows postData to be set. Must not be set in response
   to an authChallenge.
  */
  postData: string;

  /**
   If set this allows the request headers to be changed. Must not
   be set in response to an authChallenge.
  */
  headers: Headers;

  /**
   Response to a requestIntercepted with an authChallenge. Must
   not be set otherwise.
  */
  authChallengeResponse: AuthChallengeResponse;
}

export type DeleteCookiesParams = {
  /**
   Name of the cookies to remove.
  */
  name: string;

  /**
   If specified, deletes all the cookies with the given name where
   domain and path match provided URL.
  */
  url: string;

  /**
   If specified, deletes only cookies with the exact domain.
  */
  domain: string;

  /**
   If specified, deletes only cookies with the exact path.
  */
  path: string;
}

export type EmulateNetworkConditionsParams = {
  /**
   True to emulate internet disconnection.
  */
  offline: boolean;

  /**
   Minimum latency from request sent to response headers received
   (ms).
  */
  latency: number;

  /**
   Maximal aggregated download throughput (bytes/sec). -1 disables
   download throttling.
  */
  downloadThroughput: number;

  /**
   Maximal aggregated upload throughput (bytes/sec). -1 disables
   upload throttling.
  */
  uploadThroughput: number;

  /**
   Connection type if known.
  */
  connectionType: ConnectionType;
}

export type GetCertificateParams = {
  /**
   Origin to get certificate for.
  */
  origin: string;
}

export type GetCertificateResult = {
  tableNames: undefined[];
}

export type GetCookiesParams = {
  /**
   The list of URLs for which applicable cookies will be fetched
  */
  urls: undefined[];
}

export type GetCookiesResult = {
  /**
   Array of cookie objects.
  */
  cookies: Cookie[];
}

export type GetResponseBodyParams = {
  /**
   Identifier for the intercepted request to get body for.
  */
  requestId: RequestId;
}

export type GetResponseBodyResult = {
  /**
   Response body.
  */
  body: string;

  /**
   True, if content was sent as base64.
  */
  base64Encoded: boolean;
}

export type GetRequestPostDataParams = {
  /**
   Identifier of the network request to get content for.
  */
  requestId: RequestId;
}

export type GetRequestPostDataResult = {
  /**
   Request body string, omitting files from multipart requests
  */
  postData: string;
}

export type GetResponseBodyForInterceptionParams = {
  /**
   Identifier for the intercepted request to get body for.
  */
  interceptionId: InterceptionId;
}

export type GetResponseBodyForInterceptionResult = {
  /**
   Response body.
  */
  body: string;

  /**
   True, if content was sent as base64.
  */
  base64Encoded: boolean;
}

export type TakeResponseBodyForInterceptionAsStreamParams = {
  interceptionId: InterceptionId;
}

export type TakeResponseBodyForInterceptionAsStreamResult = {
  stream: IO.StreamHandle;
}

export type ReplayXHRParams = {
  /**
   Identifier of XHR to replay.
  */
  requestId: RequestId;
}

export type SearchInResponseBodyParams = {
  /**
   Identifier of the network response to search.
  */
  requestId: RequestId;

  /**
   String to search for.
  */
  query: string;

  /**
   If true, search is case sensitive.
  */
  caseSensitive: boolean;

  /**
   If true, treats string parameter as regex.
  */
  isRegex: boolean;
}

export type SearchInResponseBodyResult = {
  /**
   List of search matches.
  */
  result: Debugger.SearchMatch[];
}

export type SetBlockedURLsParams = {
  /**
   URL patterns to block. Wildcards ('*') are allowed.
  */
  urls: undefined[];
}

export type SetBypassServiceWorkerParams = {
  /**
   Bypass service worker and load from network.
  */
  bypass: boolean;
}

export type SetCacheDisabledParams = {
  /**
   Cache disabled state.
  */
  cacheDisabled: boolean;
}

export type SetCookieParams = {
  /**
   Cookie name.
  */
  name: string;

  /**
   Cookie value.
  */
  value: string;

  /**
   The request-URI to associate with the setting of the cookie.
   This value can affect the default domain and path values of the
   created cookie.
  */
  url: string;

  /**
   Cookie domain.
  */
  domain: string;

  /**
   Cookie path.
  */
  path: string;

  /**
   True if cookie is secure.
  */
  secure: boolean;

  /**
   True if cookie is http-only.
  */
  httpOnly: boolean;

  /**
   Cookie SameSite type.
  */
  sameSite: CookieSameSite;

  /**
   Cookie expiration date, session cookie if not set
  */
  expires: TimeSinceEpoch;
}

export type SetCookieResult = {
  /**
   True if successfully set cookie.
  */
  success: boolean;
}

export type SetCookiesParams = {
  /**
   Cookies to be set.
  */
  cookies: CookieParam[];
}

export type SetDataSizeLimitsForTestParams = {
  /**
   Maximum total buffer size.
  */
  maxTotalSize: number;

  /**
   Maximum per-resource size.
  */
  maxResourceSize: number;
}

export type SetExtraHTTPHeadersParams = {
  /**
   Map with extra HTTP headers.
  */
  headers: Headers;
}

export type SetRequestInterceptionParams = {
  /**
   Requests matching any of these patterns will be forwarded and
   wait for the corresponding continueInterceptedRequest call.
  */
  patterns: RequestPattern[];
}

export type GetHighlightObjectForTestParams = {
  /**
   Id of the node to get highlight object for.
  */
  nodeId: DOM.NodeId;

  /**
   Whether to include distance info.
  */
  includeDistance: boolean;

  /**
   Whether to include style info.
  */
  includeStyle: boolean;
}

export type GetHighlightObjectForTestResult = {
  /**
   Highlight data for the node.
  */
  highlight: object;
}

export type HighlightFrameParams = {
  /**
   Identifier of the frame to highlight.
  */
  frameId: Page.FrameId;

  /**
   The content box highlight fill color (default: transparent).
  */
  contentColor: DOM.RGBA;

  /**
   The content box highlight outline color (default: transparent).
  */
  contentOutlineColor: DOM.RGBA;
}

export type HighlightNodeParams = {
  /**
   A descriptor for the highlight appearance.
  */
  highlightConfig: HighlightConfig;

  /**
   Identifier of the node to highlight.
  */
  nodeId: DOM.NodeId;

  /**
   Identifier of the backend node to highlight.
  */
  backendNodeId: DOM.BackendNodeId;

  /**
   JavaScript object id of the node to be highlighted.
  */
  objectId: Runtime.RemoteObjectId;

  /**
   Selectors to highlight relevant nodes.
  */
  selector: string;
}

export type HighlightQuadParams = {
  /**
   Quad to highlight
  */
  quad: DOM.Quad;

  /**
   The highlight fill color (default: transparent).
  */
  color: DOM.RGBA;

  /**
   The highlight outline color (default: transparent).
  */
  outlineColor: DOM.RGBA;
}

export type HighlightRectParams = {
  /**
   X coordinate
  */
  x: number;

  /**
   Y coordinate
  */
  y: number;

  /**
   Rectangle width
  */
  width: number;

  /**
   Rectangle height
  */
  height: number;

  /**
   The highlight fill color (default: transparent).
  */
  color: DOM.RGBA;

  /**
   The highlight outline color (default: transparent).
  */
  outlineColor: DOM.RGBA;
}

export type SetInspectModeParams = {
  /**
   Set an inspection mode.
  */
  mode: InspectMode;

  /**
   A descriptor for the highlight appearance of hovered-over nodes.
   May be omitted if `enabled == false`.
  */
  highlightConfig: HighlightConfig;
}

export type SetShowAdHighlightsParams = {
  /**
   True for showing ad highlights
  */
  show: boolean;
}

export type SetPausedInDebuggerMessageParams = {
  /**
   The message to display, also triggers resume and step over controls.
  */
  message: string;
}

export type SetShowDebugBordersParams = {
  /**
   True for showing debug borders
  */
  show: boolean;
}

export type SetShowFPSCounterParams = {
  /**
   True for showing the FPS counter
  */
  show: boolean;
}

export type SetShowPaintRectsParams = {
  /**
   True for showing paint rectangles
  */
  result: boolean;
}

export type SetShowLayoutShiftRegionsParams = {
  /**
   True for showing layout shift regions
  */
  result: boolean;
}

export type SetShowScrollBottleneckRectsParams = {
  /**
   True for showing scroll bottleneck rects
  */
  show: boolean;
}

export type SetShowHitTestBordersParams = {
  /**
   True for showing hit-test borders
  */
  show: boolean;
}

export type SetShowViewportSizeOnResizeParams = {
  /**
   Whether to paint size or not.
  */
  show: boolean;
}

export type AddScriptToEvaluateOnLoadParams = {
  scriptSource: string;
}

export type AddScriptToEvaluateOnLoadResult = {
  /**
   Identifier of the added script.
  */
  identifier: ScriptIdentifier;
}

export type AddScriptToEvaluateOnNewDocumentParams = {
  source: string;

  /**
   If specified, creates an isolated world with the given name and
   evaluates given script in it. This world name will be used as the
   ExecutionContextDescription::name when the corresponding
   event is emitted.
  */
  worldName: string;
}

export type AddScriptToEvaluateOnNewDocumentResult = {
  /**
   Identifier of the added script.
  */
  identifier: ScriptIdentifier;
}

export type CaptureScreenshotParams = {
  /**
   Image compression format (defaults to png).
  */
  format: string;

  /**
   Compression quality from range [0..100] (jpeg only).
  */
  quality: number;

  /**
   Capture the screenshot of a given region only.
  */
  clip: Viewport;

  /**
   Capture the screenshot from the surface, rather than the view.
   Defaults to true.
  */
  fromSurface: boolean;
}

export type CaptureScreenshotResult = {
  /**
   Base64-encoded image data.
  */
  data: string;
}

export type CreateIsolatedWorldParams = {
  /**
   Id of the frame in which the isolated world should be created.
  */
  frameId: FrameId;

  /**
   An optional name which is reported in the Execution Context.
  */
  worldName: string;

  /**
   Whether or not universal access should be granted to the isolated
   world. This is a powerful option, use with caution.
  */
  grantUniveralAccess: boolean;
}

export type CreateIsolatedWorldResult = {
  /**
   Execution context of the isolated world.
  */
  executionContextId: Runtime.ExecutionContextId;
}

export type DeleteCookieParams = {
  /**
   Name of the cookie to remove.
  */
  cookieName: string;

  /**
   URL to match cooke domain and path.
  */
  url: string;
}

export type GetResourceContentParams = {
  /**
   Frame id to get resource for.
  */
  frameId: FrameId;

  /**
   URL of the resource to get content for.
  */
  url: string;
}

export type GetResourceContentResult = {
  /**
   Resource content.
  */
  content: string;

  /**
   True, if content was served as base64.
  */
  base64Encoded: boolean;
}

export type HandleJavaScriptDialogParams = {
  /**
   Whether to accept or dismiss the dialog.
  */
  accept: boolean;

  /**
   The text to enter into the dialog prompt before accepting. Used
   only if this is a prompt dialog.
  */
  promptText: string;
}

export type NavigateParams = {
  /**
   URL to navigate the page to.
  */
  url: string;

  /**
   Referrer URL.
  */
  referrer: string;

  /**
   Intended transition type.
  */
  transitionType: TransitionType;

  /**
   Frame id to navigate, if not specified navigates the top frame.
  */
  frameId: FrameId;
}

export type NavigateResult = {
  /**
   Frame id that has navigated (or failed to navigate)
  */
  frameId: FrameId;

  /**
   Loader identifier.
  */
  loaderId: Network.LoaderId;

  /**
   User friendly error message, present if and only if navigation
   has failed.
  */
  errorText: string;
}

export type NavigateToHistoryEntryParams = {
  /**
   Unique id of the entry to navigate to.
  */
  entryId: number;
}

export type PrintToPDFParams = {
  /**
   Paper orientation. Defaults to false.
  */
  landscape: boolean;

  /**
   Display header and footer. Defaults to false.
  */
  displayHeaderFooter: boolean;

  /**
   Print background graphics. Defaults to false.
  */
  printBackground: boolean;

  /**
   Scale of the webpage rendering. Defaults to 1.
  */
  scale: number;

  /**
   Paper width in inches. Defaults to 8.5 inches.
  */
  paperWidth: number;

  /**
   Paper height in inches. Defaults to 11 inches.
  */
  paperHeight: number;

  /**
   Top margin in inches. Defaults to 1cm (~0.4 inches).
  */
  marginTop: number;

  /**
   Bottom margin in inches. Defaults to 1cm (~0.4 inches).
  */
  marginBottom: number;

  /**
   Left margin in inches. Defaults to 1cm (~0.4 inches).
  */
  marginLeft: number;

  /**
   Right margin in inches. Defaults to 1cm (~0.4 inches).
  */
  marginRight: number;

  /**
   Paper ranges to print, e.g., '1-5, 8, 11-13'. Defaults to the
   empty string, which means print all pages.
  */
  pageRanges: string;

  /**
   Whether to silently ignore invalid but successfully parsed
   page ranges, such as '3-2'. Defaults to false.
  */
  ignoreInvalidPageRanges: boolean;

  /**
   HTML template for the print header. Should be valid HTML markup
   with following classes used to inject printing values into them:
   - `date`: formatted print date - `title`: document title - `url`:
   document location - `pageNumber`: current page number - `totalPages`:
   total pages in the document For example, `<span class=title></span>`
   would generate span containing the title.
  */
  headerTemplate: string;

  /**
   HTML template for the print footer. Should use the same format
   as the `headerTemplate`.
  */
  footerTemplate: string;

  /**
   Whether or not to prefer page size as defined by css. Defaults
   to false, in which case the content will be scaled to fit the paper
   size.
  */
  preferCSSPageSize: boolean;

  /**
   return as stream
  */
  transferMode: string;
}

export type PrintToPDFResult = {
  /**
   Base64-encoded pdf data. Empty if |returnAsStream| is specified.
  */
  data: string;

  /**
   A handle of the stream that holds resulting PDF data.
  */
  stream: IO.StreamHandle;
}

export type ReloadParams = {
  /**
   If true, browser cache is ignored (as if the user pressed Shift+refresh).
  */
  ignoreCache: boolean;

  /**
   If set, the script will be injected into all frames of the inspected
   page after reload. Argument will be ignored if reloading dataURL
   origin.
  */
  scriptToEvaluateOnLoad: string;
}

export type RemoveScriptToEvaluateOnLoadParams = {
  identifier: ScriptIdentifier;
}

export type RemoveScriptToEvaluateOnNewDocumentParams = {
  identifier: ScriptIdentifier;
}

export type ScreencastFrameAckParams = {
  /**
   Frame number.
  */
  sessionId: number;
}

export type SearchInResourceParams = {
  /**
   Frame id for resource to search in.
  */
  frameId: FrameId;

  /**
   URL of the resource to search in.
  */
  url: string;

  /**
   String to search for.
  */
  query: string;

  /**
   If true, search is case sensitive.
  */
  caseSensitive: boolean;

  /**
   If true, treats string parameter as regex.
  */
  isRegex: boolean;
}

export type SearchInResourceResult = {
  /**
   List of search matches.
  */
  result: Debugger.SearchMatch[];
}

export type SetAdBlockingEnabledParams = {
  /**
   Whether to block ads.
  */
  enabled: boolean;
}

export type SetBypassCSPParams = {
  /**
   Whether to bypass page CSP.
  */
  enabled: boolean;
}

export type SetFontFamiliesParams = {
  /**
   Specifies font families to set. If a font family is not specified,
   it won't be changed.
  */
  fontFamilies: FontFamilies;
}

export type SetFontSizesParams = {
  /**
   Specifies font sizes to set. If a font size is not specified, it
   won't be changed.
  */
  fontSizes: FontSizes;
}

export type SetDocumentContentParams = {
  /**
   Frame id to set HTML for.
  */
  frameId: FrameId;

  /**
   HTML content to set.
  */
  html: string;
}

export type SetDownloadBehaviorParams = {
  /**
   Whether to allow all or deny all download requests, or use default
   Chrome behavior if available (otherwise deny).
  */
  behavior: string;

  /**
   The default path to save downloaded files to. This is requred
   if behavior is set to 'allow'
  */
  downloadPath: string;
}

export type SetLifecycleEventsEnabledParams = {
  /**
   If true, starts emitting lifecycle events.
  */
  enabled: boolean;
}

export type StartScreencastParams = {
  /**
   Image compression format.
  */
  format: string;

  /**
   Compression quality from range [0..100].
  */
  quality: number;

  /**
   Maximum screenshot width.
  */
  maxWidth: number;

  /**
   Maximum screenshot height.
  */
  maxHeight: number;

  /**
   Send every n-th frame.
  */
  everyNthFrame: number;
}

export type SetWebLifecycleStateParams = {
  /**
   Target lifecycle state
  */
  state: string;
}

export type SetProduceCompilationCacheParams = {
  enabled: boolean;
}

export type AddCompilationCacheParams = {
  url: string;

  /**
   Base64-encoded data
  */
  data: string;
}

export type GenerateTestReportParams = {
  /**
   Message to be displayed in the report.
  */
  message: string;

  /**
   Specifies the endpoint group to deliver the report to.
  */
  group: string;
}

export type SetInterceptFileChooserDialogParams = {
  enabled: boolean;
}

export type HandleFileChooserParams = {
  action: string;

  /**
   Array of absolute file paths to set, only respected with `accept`
   action.
  */
  files: undefined[];
}

export type SetTimeDomainParams = {
  /**
   Time domain
  */
  timeDomain: string;
}

export type SetIgnoreCertificateErrorsParams = {
  /**
   If true, all certificate errors will be ignored.
  */
  ignore: boolean;
}

export type HandleCertificateErrorParams = {
  /**
   The ID of the event.
  */
  eventId: number;

  /**
   The action to take on the certificate error.
  */
  action: CertificateErrorAction;
}

export type SetOverrideCertificateErrorsParams = {
  /**
   If true, certificate errors will be overridden.
  */
  override: boolean;
}

export type DeliverPushMessageParams = {
  origin: string;

  registrationId: RegistrationID;

  data: string;
}

export type DispatchSyncEventParams = {
  origin: string;

  registrationId: RegistrationID;

  tag: string;

  lastChance: boolean;
}

export type InspectWorkerParams = {
  versionId: string;
}

export type SetForceUpdateOnPageLoadParams = {
  forceUpdateOnPageLoad: boolean;
}

export type SkipWaitingParams = {
  scopeURL: string;
}

export type StartWorkerParams = {
  scopeURL: string;
}

export type StopWorkerParams = {
  versionId: string;
}

export type UnregisterParams = {
  scopeURL: string;
}

export type UpdateRegistrationParams = {
  scopeURL: string;
}

export type ClearDataForOriginParams = {
  /**
   Security origin.
  */
  origin: string;

  /**
   Comma separated list of StorageType to clear.
  */
  storageTypes: string;
}

export type GetUsageAndQuotaParams = {
  /**
   Security origin.
  */
  origin: string;
}

export type GetUsageAndQuotaResult = {
  /**
   Storage usage (bytes).
  */
  usage: number;

  /**
   Storage quota (bytes).
  */
  quota: number;

  /**
   Storage usage per type (bytes).
  */
  usageBreakdown: UsageForType[];
}

export type TrackCacheStorageForOriginParams = {
  /**
   Security origin.
  */
  origin: string;
}

export type TrackIndexedDBForOriginParams = {
  /**
   Security origin.
  */
  origin: string;
}

export type UntrackCacheStorageForOriginParams = {
  /**
   Security origin.
  */
  origin: string;
}

export type UntrackIndexedDBForOriginParams = {
  /**
   Security origin.
  */
  origin: string;
}

export type ActivateTargetParams = {
  targetId: TargetID;
}

export type AttachToTargetParams = {
  targetId: TargetID;

  /**
   Enables "flat" access to the session via specifying sessionId
   attribute in the commands.
  */
  flatten: boolean;
}

export type AttachToTargetResult = {
  /**
   Id assigned to the session.
  */
  sessionId: SessionID;
}

export type CloseTargetParams = {
  targetId: TargetID;
}

export type CloseTargetResult = {
  success: boolean;
}

export type ExposeDevToolsProtocolParams = {
  targetId: TargetID;

  /**
   Binding name, 'cdp' if not specified.
  */
  bindingName: string;
}

export type CreateTargetParams = {
  /**
   The initial URL the page will be navigated to.
  */
  url: string;

  /**
   Frame width in DIP (headless chrome only).
  */
  width: number;

  /**
   Frame height in DIP (headless chrome only).
  */
  height: number;

  /**
   The browser context to create the page in.
  */
  browserContextId: BrowserContextID;

  /**
   Whether BeginFrames for this target will be controlled via DevTools
   (headless chrome only, not supported on MacOS yet, false by default).
  */
  enableBeginFrameControl: boolean;

  /**
   Whether to create a new Window or Tab (chrome-only, false by default).
  */
  newWindow: boolean;

  /**
   Whether to create the target in background or foreground (chrome-only,
   false by default).
  */
  background: boolean;
}

export type CreateTargetResult = {
  /**
   The id of the page opened.
  */
  targetId: TargetID;
}

export type DetachFromTargetParams = {
  /**
   Session to detach.
  */
  sessionId: SessionID;

  /**
   Deprecated.
  */
  targetId: TargetID;
}

export type DisposeBrowserContextParams = {
  browserContextId: BrowserContextID;
}

export type GetTargetInfoParams = {
  targetId: TargetID;
}

export type GetTargetInfoResult = {
  targetInfo: TargetInfo;
}

export type SendMessageToTargetParams = {
  message: string;

  /**
   Identifier of the session.
  */
  sessionId: SessionID;

  /**
   Deprecated.
  */
  targetId: TargetID;
}

export type SetAutoAttachParams = {
  /**
   Whether to auto-attach to related targets.
  */
  autoAttach: boolean;

  /**
   Whether to pause new targets when attaching to them. Use `Runtime.runIfWaitingForDebugger`
   to run paused targets.
  */
  waitForDebuggerOnStart: boolean;

  /**
   Enables "flat" access to the session via specifying sessionId
   attribute in the commands.
  */
  flatten: boolean;
}

export type SetDiscoverTargetsParams = {
  /**
   Whether to discover available targets.
  */
  discover: boolean;
}

export type SetRemoteLocationsParams = {
  /**
   List of remote locations.
  */
  locations: RemoteLocation[];
}

export type BindParams = {
  /**
   Port number to bind.
  */
  port: number;
}

export type UnbindParams = {
  /**
   Port number to unbind.
  */
  port: number;
}

export type RecordClockSyncMarkerParams = {
  /**
   The ID of this clock sync marker
  */
  syncId: string;
}

export type StartParams = {
  /**
   Category/tag filter
  */
  categories: string;

  /**
   Tracing options
  */
  options: string;

  /**
   If set, the agent will issue bufferUsage events at this interval,
   specified in milliseconds
  */
  bufferUsageReportingInterval: number;

  /**
   Whether to report trace events as series of dataCollected events
   or to save trace to a stream (defaults to `ReportEvents`).
  */
  transferMode: string;

  /**
   Trace data format to use. This only applies when using `ReturnAsStream`
   transfer mode (defaults to `json`).
  */
  streamFormat: StreamFormat;

  /**
   Compression format to use. This only applies when using `ReturnAsStream`
   transfer mode (defaults to `none`)
  */
  streamCompression: StreamCompression;

  traceConfig: TraceConfig;
}

export type FailRequestParams = {
  /**
   An id the client received in requestPaused event.
  */
  requestId: RequestId;

  /**
   Causes the request to fail with the given reason.
  */
  errorReason: Network.ErrorReason;
}

export type FulfillRequestParams = {
  /**
   An id the client received in requestPaused event.
  */
  requestId: RequestId;

  /**
   An HTTP response code.
  */
  responseCode: number;

  /**
   Response headers.
  */
  responseHeaders: HeaderEntry[];

  /**
   A response body.
  */
  body: string;

  /**
   A textual representation of responseCode. If absent, a standard
   phrase mathcing responseCode is used.
  */
  responsePhrase: string;
}

export type ContinueRequestParams = {
  /**
   An id the client received in requestPaused event.
  */
  requestId: RequestId;

  /**
   If set, the request url will be modified in a way that's not observable
   by page.
  */
  url: string;

  /**
   If set, the request method is overridden.
  */
  method: string;

  /**
   If set, overrides the post data in the request.
  */
  postData: string;

  /**
   If set, overrides the request headrts.
  */
  headers: HeaderEntry[];
}

export type ContinueWithAuthParams = {
  /**
   An id the client received in authRequired event.
  */
  requestId: RequestId;

  /**
   Response to with an authChallenge.
  */
  authChallengeResponse: AuthChallengeResponse;
}

export type TakeResponseBodyAsStreamParams = {
  requestId: RequestId;
}

export type TakeResponseBodyAsStreamResult = {
  stream: IO.StreamHandle;
}

export type GetRealtimeDataParams = {
  contextId: ContextId;
}

export type GetRealtimeDataResult = {
  realtimeData: ContextRealtimeData;
}

export type AddVirtualAuthenticatorParams = {
  options: VirtualAuthenticatorOptions;
}

export type AddVirtualAuthenticatorResult = {
  authenticatorId: AuthenticatorId;
}

export type RemoveVirtualAuthenticatorParams = {
  authenticatorId: AuthenticatorId;
}

export type AddCredentialParams = {
  authenticatorId: AuthenticatorId;

  credential: Credential;
}

export type GetCredentialsParams = {
  authenticatorId: AuthenticatorId;
}

export type GetCredentialsResult = {
  credentials: Credential[];
}

export type ClearCredentialsParams = {
  authenticatorId: AuthenticatorId;
}

export type SetUserVerifiedParams = {
  authenticatorId: AuthenticatorId;

  isUserVerified: boolean;
}

export type ContinueToLocationParams = {
  /**
   Location to continue to.
  */
  location: Location;

  targetCallFrames: string;
}

export type EnableResult = {
  /**
   Unique identifier of the debugger.
  */
  debuggerId: Runtime.UniqueDebuggerId;
}

export type EvaluateOnCallFrameParams = {
  /**
   Call frame identifier to evaluate on.
  */
  callFrameId: CallFrameId;

  /**
   Expression to evaluate.
  */
  expression: string;

  /**
   String object group name to put result into (allows rapid releasing
   resulting object handles using `releaseObjectGroup`).
  */
  objectGroup: string;

  /**
   Specifies whether command line API should be available to the
   evaluated expression, defaults to false.
  */
  includeCommandLineAPI: boolean;

  /**
   In silent mode exceptions thrown during evaluation are not reported
   and do not pause execution. Overrides `setPauseOnException`
   state.
  */
  silent: boolean;

  /**
   Whether the result is expected to be a JSON object that should
   be sent by value.
  */
  returnByValue: boolean;

  /**
   Whether preview should be generated for the result.
  */
  generatePreview: boolean;

  /**
   Whether to throw an exception if side effect cannot be ruled out
   during evaluation.
  */
  throwOnSideEffect: boolean;

  /**
   Terminate execution after timing out (number of milliseconds).
  */
  timeout: Runtime.TimeDelta;
}

export type EvaluateOnCallFrameResult = {
  /**
   Object wrapper for the evaluation result.
  */
  result: Runtime.RemoteObject;

  /**
   Exception details.
  */
  exceptionDetails: Runtime.ExceptionDetails;
}

export type GetPossibleBreakpointsParams = {
  /**
   Start of range to search possible breakpoint locations in.
  */
  start: Location;

  /**
   End of range to search possible breakpoint locations in (excluding).
   When not specified, end of scripts is used as end of range.
  */
  end: Location;

  /**
   Only consider locations which are in the same (non-nested) function
   as start.
  */
  restrictToFunction: boolean;
}

export type GetPossibleBreakpointsResult = {
  /**
   List of the possible breakpoint locations.
  */
  locations: BreakLocation[];
}

export type GetScriptSourceParams = {
  /**
   Id of the script to get source for.
  */
  scriptId: Runtime.ScriptId;
}

export type GetScriptSourceResult = {
  /**
   Script source.
  */
  scriptSource: string;
}

export type GetStackTraceParams = {
  stackTraceId: Runtime.StackTraceId;
}

export type GetStackTraceResult = {
  stackTrace: Runtime.StackTrace;
}

export type PauseOnAsyncCallParams = {
  /**
   Debugger will pause when async call with given stack trace is
   started.
  */
  parentStackTraceId: Runtime.StackTraceId;
}

export type RemoveBreakpointParams = {
  breakpointId: BreakpointId;
}

export type RestartFrameParams = {
  /**
   Call frame identifier to evaluate on.
  */
  callFrameId: CallFrameId;
}

export type RestartFrameResult = {
  /**
   New stack trace.
  */
  callFrames: CallFrame[];

  /**
   Async stack trace, if any.
  */
  asyncStackTrace: Runtime.StackTrace;

  /**
   Async stack trace, if any.
  */
  asyncStackTraceId: Runtime.StackTraceId;
}

export type SearchInContentParams = {
  /**
   Id of the script to search in.
  */
  scriptId: Runtime.ScriptId;

  /**
   String to search for.
  */
  query: string;

  /**
   If true, search is case sensitive.
  */
  caseSensitive: boolean;

  /**
   If true, treats string parameter as regex.
  */
  isRegex: boolean;
}

export type SearchInContentResult = {
  /**
   List of search matches.
  */
  result: SearchMatch[];
}

export type SetAsyncCallStackDepthParams = {
  /**
   Maximum depth of async call stacks. Setting to `0` will effectively
   disable collecting async call stacks (default).
  */
  maxDepth: number;
}

export type SetBlackboxPatternsParams = {
  /**
   Array of regexps that will be used to check script url for blackbox
   state.
  */
  patterns: undefined[];
}

export type SetBlackboxedRangesParams = {
  /**
   Id of the script.
  */
  scriptId: Runtime.ScriptId;

  positions: ScriptPosition[];
}

export type SetBreakpointParams = {
  /**
   Location to set breakpoint in.
  */
  location: Location;

  /**
   Expression to use as a breakpoint condition. When specified,
   debugger will only stop on the breakpoint if this expression
   evaluates to true.
  */
  condition: string;
}

export type SetBreakpointResult = {
  /**
   Id of the created breakpoint for further reference.
  */
  breakpointId: BreakpointId;

  /**
   Location this breakpoint resolved into.
  */
  actualLocation: Location;
}

export type SetInstrumentationBreakpointResult = {
  /**
   Id of the created breakpoint for further reference.
  */
  breakpointId: BreakpointId;
}

export type SetBreakpointByUrlParams = {
  /**
   Line number to set breakpoint at.
  */
  lineNumber: number;

  /**
   URL of the resources to set breakpoint on.
  */
  url: string;

  /**
   Regex pattern for the URLs of the resources to set breakpoints
   on. Either `url` or `urlRegex` must be specified.
  */
  urlRegex: string;

  /**
   Script hash of the resources to set breakpoint on.
  */
  scriptHash: string;

  /**
   Offset in the line to set breakpoint at.
  */
  columnNumber: number;

  /**
   Expression to use as a breakpoint condition. When specified,
   debugger will only stop on the breakpoint if this expression
   evaluates to true.
  */
  condition: string;
}

export type SetBreakpointByUrlResult = {
  /**
   Id of the created breakpoint for further reference.
  */
  breakpointId: BreakpointId;

  /**
   List of the locations this breakpoint resolved into upon addition.
  */
  locations: Location[];
}

export type SetBreakpointOnFunctionCallParams = {
  /**
   Function object id.
  */
  objectId: Runtime.RemoteObjectId;

  /**
   Expression to use as a breakpoint condition. When specified,
   debugger will stop on the breakpoint if this expression evaluates
   to true.
  */
  condition: string;
}

export type SetBreakpointOnFunctionCallResult = {
  /**
   Id of the created breakpoint for further reference.
  */
  breakpointId: BreakpointId;
}

export type SetBreakpointsActiveParams = {
  /**
   New value for breakpoints active state.
  */
  active: boolean;
}

export type SetPauseOnExceptionsParams = {
  /**
   Pause on exceptions mode.
  */
  state: string;
}

export type SetReturnValueParams = {
  /**
   New return value.
  */
  newValue: Runtime.CallArgument;
}

export type SetScriptSourceParams = {
  /**
   Id of the script to edit.
  */
  scriptId: Runtime.ScriptId;

  /**
   New content of the script.
  */
  scriptSource: string;

  /**
   If true the change will not actually be applied. Dry run may be
   used to get result description without actually modifying the
   code.
  */
  dryRun: boolean;
}

export type SetScriptSourceResult = {
  /**
   New stack trace in case editing has happened while VM was stopped.
  */
  callFrames: CallFrame[];

  /**
   Whether current call stack was modified after applying the changes.
  */
  stackChanged: boolean;

  /**
   Async stack trace, if any.
  */
  asyncStackTrace: Runtime.StackTrace;

  /**
   Async stack trace, if any.
  */
  asyncStackTraceId: Runtime.StackTraceId;

  /**
   Exception details if any.
  */
  exceptionDetails: Runtime.ExceptionDetails;
}

export type SetSkipAllPausesParams = {
  /**
   New value for skip pauses state.
  */
  skip: boolean;
}

export type SetVariableValueParams = {
  /**
   0-based number of scope as was listed in scope chain. Only 'local',
   'closure' and 'catch' scope types are allowed. Other scopes
   could be manipulated manually.
  */
  scopeNumber: number;

  /**
   Variable name.
  */
  variableName: string;

  /**
   New variable value.
  */
  newValue: Runtime.CallArgument;

  /**
   Id of callframe that holds variable.
  */
  callFrameId: CallFrameId;
}

export type StepIntoParams = {
  /**
   Debugger will issue additional Debugger.paused notification
   if any async task is scheduled before next pause.
  */
  breakOnAsyncCall: boolean;
}

export type AddInspectedHeapObjectParams = {
  /**
   Heap snapshot object id to be accessible by means of $x command
   line API.
  */
  heapObjectId: HeapSnapshotObjectId;
}

export type GetHeapObjectIdParams = {
  /**
   Identifier of the object to get heap object id for.
  */
  objectId: Runtime.RemoteObjectId;
}

export type GetHeapObjectIdResult = {
  /**
   Id of the heap snapshot object corresponding to the passed remote
   object id.
  */
  heapSnapshotObjectId: HeapSnapshotObjectId;
}

export type GetObjectByHeapObjectIdParams = {
  objectId: HeapSnapshotObjectId;

  /**
   Symbolic group name that can be used to release multiple objects.
  */
  objectGroup: string;
}

export type GetObjectByHeapObjectIdResult = {
  /**
   Evaluation result.
  */
  result: Runtime.RemoteObject;
}

export type StartTrackingHeapObjectsParams = {
  trackAllocations: boolean;
}

export type StopTrackingHeapObjectsParams = {
  /**
   If true 'reportHeapSnapshotProgress' events will be generated
   while snapshot is being taken when the tracking is stopped.
  */
  reportProgress: boolean;
}

export type TakeHeapSnapshotParams = {
  /**
   If true 'reportHeapSnapshotProgress' events will be generated
   while snapshot is being taken.
  */
  reportProgress: boolean;
}

export type SetSamplingIntervalParams = {
  /**
   New sampling interval in microseconds.
  */
  interval: number;
}

export type StartPreciseCoverageParams = {
  /**
   Collect accurate call counts beyond simple 'covered' or 'not
   covered'.
  */
  callCount: boolean;

  /**
   Collect block-based coverage.
  */
  detailed: boolean;
}

export type AwaitPromiseParams = {
  /**
   Identifier of the promise.
  */
  promiseObjectId: RemoteObjectId;

  /**
   Whether the result is expected to be a JSON object that should
   be sent by value.
  */
  returnByValue: boolean;

  /**
   Whether preview should be generated for the result.
  */
  generatePreview: boolean;
}

export type AwaitPromiseResult = {
  /**
   Promise result. Will contain rejected value if promise was rejected.
  */
  result: RemoteObject;

  /**
   Exception details if stack strace is available.
  */
  exceptionDetails: ExceptionDetails;
}

export type CallFunctionOnParams = {
  /**
   Declaration of the function to call.
  */
  functionDeclaration: string;

  /**
   Identifier of the object to call function on. Either objectId
   or executionContextId should be specified.
  */
  objectId: RemoteObjectId;

  /**
   Call arguments. All call arguments must belong to the same JavaScript
   world as the target object.
  */
  arguments: CallArgument[];

  /**
   In silent mode exceptions thrown during evaluation are not reported
   and do not pause execution. Overrides `setPauseOnException`
   state.
  */
  silent: boolean;

  /**
   Whether the result is expected to be a JSON object which should
   be sent by value.
  */
  returnByValue: boolean;

  /**
   Whether preview should be generated for the result.
  */
  generatePreview: boolean;

  /**
   Whether execution should be treated as initiated by user in the
   UI.
  */
  userGesture: boolean;

  /**
   Whether execution should `await` for resulting value and return
   once awaited promise is resolved.
  */
  awaitPromise: boolean;

  /**
   Specifies execution context which global object will be used
   to call function on. Either executionContextId or objectId
   should be specified.
  */
  executionContextId: ExecutionContextId;

  /**
   Symbolic group name that can be used to release multiple objects.
   If objectGroup is not specified and objectId is, objectGroup
   will be inherited from object.
  */
  objectGroup: string;
}

export type CallFunctionOnResult = {
  /**
   Call result.
  */
  result: RemoteObject;

  /**
   Exception details.
  */
  exceptionDetails: ExceptionDetails;
}

export type CompileScriptParams = {
  /**
   Expression to compile.
  */
  expression: string;

  /**
   Source url to be set for the script.
  */
  sourceURL: string;

  /**
   Specifies whether the compiled script should be persisted.
  */
  persistScript: boolean;

  /**
   Specifies in which execution context to perform script run.
   If the parameter is omitted the evaluation will be performed
   in the context of the inspected page.
  */
  executionContextId: ExecutionContextId;
}

export type CompileScriptResult = {
  /**
   Id of the script.
  */
  scriptId: ScriptId;

  /**
   Exception details.
  */
  exceptionDetails: ExceptionDetails;
}

export type EvaluateParams = {
  /**
   Expression to evaluate.
  */
  expression: string;

  /**
   Symbolic group name that can be used to release multiple objects.
  */
  objectGroup: string;

  /**
   Determines whether Command Line API should be available during
   the evaluation.
  */
  includeCommandLineAPI: boolean;

  /**
   In silent mode exceptions thrown during evaluation are not reported
   and do not pause execution. Overrides `setPauseOnException`
   state.
  */
  silent: boolean;

  /**
   Specifies in which execution context to perform evaluation.
   If the parameter is omitted the evaluation will be performed
   in the context of the inspected page.
  */
  contextId: ExecutionContextId;

  /**
   Whether the result is expected to be a JSON object that should
   be sent by value.
  */
  returnByValue: boolean;

  /**
   Whether preview should be generated for the result.
  */
  generatePreview: boolean;

  /**
   Whether execution should be treated as initiated by user in the
   UI.
  */
  userGesture: boolean;

  /**
   Whether execution should `await` for resulting value and return
   once awaited promise is resolved.
  */
  awaitPromise: boolean;

  /**
   Whether to throw an exception if side effect cannot be ruled out
   during evaluation.
  */
  throwOnSideEffect: boolean;

  /**
   Terminate execution after timing out (number of milliseconds).
  */
  timeout: TimeDelta;
}

export type EvaluateResult = {
  /**
   Evaluation result.
  */
  result: RemoteObject;

  /**
   Exception details.
  */
  exceptionDetails: ExceptionDetails;
}

export type GetPropertiesParams = {
  /**
   Identifier of the object to return properties for.
  */
  objectId: RemoteObjectId;

  /**
   If true, returns properties belonging only to the element itself,
   not to its prototype chain.
  */
  ownProperties: boolean;

  /**
   If true, returns accessor properties (with getter/setter)
   only; internal properties are not returned either.
  */
  accessorPropertiesOnly: boolean;

  /**
   Whether preview should be generated for the results.
  */
  generatePreview: boolean;
}

export type GetPropertiesResult = {
  /**
   Object properties.
  */
  result: PropertyDescriptor[];

  /**
   Internal object properties (only of the element itself).
  */
  internalProperties: InternalPropertyDescriptor[];

  /**
   Object private properties.
  */
  privateProperties: PrivatePropertyDescriptor[];

  /**
   Exception details.
  */
  exceptionDetails: ExceptionDetails;
}

export type GlobalLexicalScopeNamesParams = {
  /**
   Specifies in which execution context to lookup global scope
   variables.
  */
  executionContextId: ExecutionContextId;
}

export type GlobalLexicalScopeNamesResult = {
  names: undefined[];
}

export type QueryObjectsParams = {
  /**
   Identifier of the prototype to return objects for.
  */
  prototypeObjectId: RemoteObjectId;

  /**
   Symbolic group name that can be used to release the results.
  */
  objectGroup: string;
}

export type QueryObjectsResult = {
  /**
   Array with objects.
  */
  objects: RemoteObject;
}

export type ReleaseObjectParams = {
  /**
   Identifier of the object to release.
  */
  objectId: RemoteObjectId;
}

export type ReleaseObjectGroupParams = {
  /**
   Symbolic object group name.
  */
  objectGroup: string;
}

export type RunScriptParams = {
  /**
   Id of the script to run.
  */
  scriptId: ScriptId;

  /**
   Specifies in which execution context to perform script run.
   If the parameter is omitted the evaluation will be performed
   in the context of the inspected page.
  */
  executionContextId: ExecutionContextId;

  /**
   Symbolic group name that can be used to release multiple objects.
  */
  objectGroup: string;

  /**
   In silent mode exceptions thrown during evaluation are not reported
   and do not pause execution. Overrides `setPauseOnException`
   state.
  */
  silent: boolean;

  /**
   Determines whether Command Line API should be available during
   the evaluation.
  */
  includeCommandLineAPI: boolean;

  /**
   Whether the result is expected to be a JSON object which should
   be sent by value.
  */
  returnByValue: boolean;

  /**
   Whether preview should be generated for the result.
  */
  generatePreview: boolean;

  /**
   Whether execution should `await` for resulting value and return
   once awaited promise is resolved.
  */
  awaitPromise: boolean;
}

export type RunScriptResult = {
  /**
   Run result.
  */
  result: RemoteObject;

  /**
   Exception details.
  */
  exceptionDetails: ExceptionDetails;
}

export type SetCustomObjectFormatterEnabledParams = {
  enabled: boolean;
}

export type SetMaxCallStackSizeToCaptureParams = {
  size: number;
}

export type AddBindingParams = {
  name: string;

  executionContextId: ExecutionContextId;
}

export type RemoveBindingParams = {
  name: string;
}

export interface Accessibility {
  /**
   Disables the accessibility domain.
  */
  disable: () => Promise<void>;

  /**
   Enables the accessibility domain which causes `AXNodeId`s
   to remain consistent between method calls. This turns on accessibility
   for the page, which can impact performance until accessibility
   is disabled.
  */
  enable: () => Promise<void>;

  /**
   Fetches the accessibility node and partial accessibility tree
   for this DOM node, if it exists.
   @experimental
  */
  getPartialAXTree: (params: GetPartialAXTreeParams) => Promise<GetPartialAXTreeResult>;

  /**
   Fetches the entire accessibility tree
   @experimental
  */
  getFullAXTree: () => Promise<void>;
}

export interface Animation {
  /**
   Disables animation domain notifications.
  */
  disable: () => Promise<void>;

  /**
   Enables animation domain notifications.
  */
  enable: () => Promise<void>;

  /**
   Returns the current time of the an animation.
  */
  getCurrentTime: (params: GetCurrentTimeParams) => Promise<GetCurrentTimeResult>;

  /**
   Gets the playback rate of the document timeline.
  */
  getPlaybackRate: () => Promise<void>;

  /**
   Releases a set of animations to no longer be manipulated.
  */
  releaseAnimations: (params: ReleaseAnimationsParams) => Promise<ReleaseAnimationsResult>;

  /**
   Gets the remote object of the Animation.
  */
  resolveAnimation: (params: ResolveAnimationParams) => Promise<ResolveAnimationResult>;

  /**
   Seek a set of animations to a particular time within each animation.
  */
  seekAnimations: (params: SeekAnimationsParams) => Promise<SeekAnimationsResult>;

  /**
   Sets the paused state of a set of animations.
  */
  setPaused: (params: SetPausedParams) => Promise<SetPausedResult>;

  /**
   Sets the playback rate of the document timeline.
  */
  setPlaybackRate: (params: SetPlaybackRateParams) => Promise<SetPlaybackRateResult>;

  /**
   Sets the timing of an animation node.
  */
  setTiming: (params: SetTimingParams) => Promise<SetTimingResult>;
}

export interface ApplicationCache {
  /**
   Enables application cache domain notifications.
  */
  enable: () => Promise<void>;

  /**
   Returns relevant application cache data for the document in
   given frame.
  */
  getApplicationCacheForFrame: (params: GetApplicationCacheForFrameParams) => Promise<GetApplicationCacheForFrameResult>;

  /**
   Returns array of frame identifiers with manifest urls for each
   frame containing a document associated with some application
   cache.
  */
  getFramesWithManifests: () => Promise<void>;

  /**
   Returns manifest URL for document in the given frame.
  */
  getManifestForFrame: (params: GetManifestForFrameParams) => Promise<GetManifestForFrameResult>;
}

export interface Audits {
  /**
   Returns the response body and size if it were re-encoded with
   the specified settings. Only applies to images.
  */
  getEncodedResponse: (params: GetEncodedResponseParams) => Promise<GetEncodedResponseResult>;
}

export interface BackgroundService {
  /**
   Enables event updates for the service.
  */
  startObserving: (params: StartObservingParams) => Promise<StartObservingResult>;

  /**
   Disables event updates for the service.
  */
  stopObserving: (params: StopObservingParams) => Promise<StopObservingResult>;

  /**
   Set the recording state for the service.
  */
  setRecording: (params: SetRecordingParams) => Promise<SetRecordingResult>;

  /**
   Clears all stored data for the service.
  */
  clearEvents: (params: ClearEventsParams) => Promise<ClearEventsResult>;
}

export interface Browser {
  /**
   Grant specific permissions to the given origin and reject all
   others.
   @experimental
  */
  grantPermissions: (params: GrantPermissionsParams) => Promise<GrantPermissionsResult>;

  /**
   Reset all permission management for all origins.
   @experimental
  */
  resetPermissions: (params: ResetPermissionsParams) => Promise<ResetPermissionsResult>;

  /**
   Close browser gracefully.
  */
  close: () => Promise<void>;

  /**
   Crashes browser on the main thread.
   @experimental
  */
  crash: () => Promise<void>;

  /**
   Crashes GPU process.
   @experimental
  */
  crashGpuProcess: () => Promise<void>;

  /**
   Returns version information.
  */
  getVersion: () => Promise<void>;

  /**
   Returns the command line switches for the browser process if,
   and only if --enable-automation is on the commandline.
   @experimental
  */
  getBrowserCommandLine: () => Promise<void>;

  /**
   Get Chrome histograms.
   @experimental
  */
  getHistograms: (params: GetHistogramsParams) => Promise<GetHistogramsResult>;

  /**
   Get a Chrome histogram by name.
   @experimental
  */
  getHistogram: (params: GetHistogramParams) => Promise<GetHistogramResult>;

  /**
   Get position and size of the browser window.
   @experimental
  */
  getWindowBounds: (params: GetWindowBoundsParams) => Promise<GetWindowBoundsResult>;

  /**
   Get the browser window that contains the devtools target.
   @experimental
  */
  getWindowForTarget: (params: GetWindowForTargetParams) => Promise<GetWindowForTargetResult>;

  /**
   Set position and/or size of the browser window.
   @experimental
  */
  setWindowBounds: (params: SetWindowBoundsParams) => Promise<SetWindowBoundsResult>;

  /**
   Set dock tile details, platform-specific.
   @experimental
  */
  setDockTile: (params: SetDockTileParams) => Promise<SetDockTileResult>;
}

export interface CSS {
  /**
   Inserts a new rule with the given `ruleText` in a stylesheet with
   given `styleSheetId`, at the position specified by `location`.
  */
  addRule: (params: AddRuleParams) => Promise<AddRuleResult>;

  /**
   Returns all class names from specified stylesheet.
  */
  collectClassNames: (params: CollectClassNamesParams) => Promise<CollectClassNamesResult>;

  /**
   Creates a new special "via-inspector" stylesheet in the frame
   with given `frameId`.
  */
  createStyleSheet: (params: CreateStyleSheetParams) => Promise<CreateStyleSheetResult>;

  /**
   Disables the CSS agent for the given page.
  */
  disable: () => Promise<void>;

  /**
   Enables the CSS agent for the given page. Clients should not assume
   that the CSS agent has been enabled until the result of this command
   is received.
  */
  enable: () => Promise<void>;

  /**
   Ensures that the given node will have specified pseudo-classes
   whenever its style is computed by the browser.
  */
  forcePseudoState: (params: ForcePseudoStateParams) => Promise<ForcePseudoStateResult>;

  getBackgroundColors: (params: GetBackgroundColorsParams) => Promise<GetBackgroundColorsResult>;

  /**
   Returns the computed style for a DOM node identified by `nodeId`.
  */
  getComputedStyleForNode: (params: GetComputedStyleForNodeParams) => Promise<GetComputedStyleForNodeResult>;

  /**
   Returns the styles defined inline (explicitly in the "style"
   attribute and implicitly, using DOM attributes) for a DOM node
   identified by `nodeId`.
  */
  getInlineStylesForNode: (params: GetInlineStylesForNodeParams) => Promise<GetInlineStylesForNodeResult>;

  /**
   Returns requested styles for a DOM node identified by `nodeId`.
  */
  getMatchedStylesForNode: (params: GetMatchedStylesForNodeParams) => Promise<GetMatchedStylesForNodeResult>;

  /**
   Returns all media queries parsed by the rendering engine.
  */
  getMediaQueries: () => Promise<void>;

  /**
   Requests information about platform fonts which we used to render
   child TextNodes in the given node.
  */
  getPlatformFontsForNode: (params: GetPlatformFontsForNodeParams) => Promise<GetPlatformFontsForNodeResult>;

  /**
   Returns the current textual content for a stylesheet.
  */
  getStyleSheetText: (params: GetStyleSheetTextParams) => Promise<GetStyleSheetTextResult>;

  /**
   Find a rule with the given active property for the given node and
   set the new value for this property
  */
  setEffectivePropertyValueForNode: (params: SetEffectivePropertyValueForNodeParams) => Promise<SetEffectivePropertyValueForNodeResult>;

  /**
   Modifies the keyframe rule key text.
  */
  setKeyframeKey: (params: SetKeyframeKeyParams) => Promise<SetKeyframeKeyResult>;

  /**
   Modifies the rule selector.
  */
  setMediaText: (params: SetMediaTextParams) => Promise<SetMediaTextResult>;

  /**
   Modifies the rule selector.
  */
  setRuleSelector: (params: SetRuleSelectorParams) => Promise<SetRuleSelectorResult>;

  /**
   Sets the new stylesheet text.
  */
  setStyleSheetText: (params: SetStyleSheetTextParams) => Promise<SetStyleSheetTextResult>;

  /**
   Applies specified style edits one after another in the given
   order.
  */
  setStyleTexts: (params: SetStyleTextsParams) => Promise<SetStyleTextsResult>;

  /**
   Enables the selector recording.
  */
  startRuleUsageTracking: () => Promise<void>;

  /**
   Stop tracking rule usage and return the list of rules that were
   used since last call to `takeCoverageDelta` (or since start
   of coverage instrumentation)
  */
  stopRuleUsageTracking: () => Promise<void>;

  /**
   Obtain list of rules that became used since last call to this method
   (or since start of coverage instrumentation)
  */
  takeCoverageDelta: () => Promise<void>;
}

export interface CacheStorage {
  /**
   Deletes a cache.
  */
  deleteCache: (params: DeleteCacheParams) => Promise<DeleteCacheResult>;

  /**
   Deletes a cache entry.
  */
  deleteEntry: (params: DeleteEntryParams) => Promise<DeleteEntryResult>;

  /**
   Requests cache names.
  */
  requestCacheNames: (params: RequestCacheNamesParams) => Promise<RequestCacheNamesResult>;

  /**
   Fetches cache entry.
  */
  requestCachedResponse: (params: RequestCachedResponseParams) => Promise<RequestCachedResponseResult>;

  /**
   Requests data from cache.
  */
  requestEntries: (params: RequestEntriesParams) => Promise<RequestEntriesResult>;
}

export interface Cast {
  /**
   Starts observing for sinks that can be used for tab mirroring,
   and if set, sinks compatible with |presentationUrl| as well.
   When sinks are found, a |sinksUpdated| event is fired. Also starts
   observing for issue messages. When an issue is added or removed,
   an |issueUpdated| event is fired.
  */
  enable: (params: EnableParams) => Promise<EnableResult>;

  /**
   Stops observing for sinks and issues.
  */
  disable: () => Promise<void>;

  /**
   Sets a sink to be used when the web page requests the browser to
   choose a sink via Presentation API, Remote Playback API, or Cast
   SDK.
  */
  setSinkToUse: (params: SetSinkToUseParams) => Promise<SetSinkToUseResult>;

  /**
   Starts mirroring the tab to the sink.
  */
  startTabMirroring: (params: StartTabMirroringParams) => Promise<StartTabMirroringResult>;

  /**
   Stops the active Cast session on the sink.
  */
  stopCasting: (params: StopCastingParams) => Promise<StopCastingResult>;
}

export interface DOM {
  /**
   Collects class names for the node with given id and all of it's
   child nodes.
   @experimental
  */
  collectClassNamesFromSubtree: (params: CollectClassNamesFromSubtreeParams) => Promise<CollectClassNamesFromSubtreeResult>;

  /**
   Creates a deep copy of the specified node and places it into the
   target container before the given anchor.
   @experimental
  */
  copyTo: (params: CopyToParams) => Promise<CopyToResult>;

  /**
   Describes node given its id, does not require domain to be enabled.
   Does not start tracking any objects, can be used for automation.
  */
  describeNode: (params: DescribeNodeParams) => Promise<DescribeNodeResult>;

  /**
   Disables DOM agent for the given page.
  */
  disable: () => Promise<void>;

  /**
   Discards search results from the session with the given id. `getSearchResults`
   should no longer be called for that search.
   @experimental
  */
  discardSearchResults: (params: DiscardSearchResultsParams) => Promise<DiscardSearchResultsResult>;

  /**
   Enables DOM agent for the given page.
  */
  enable: () => Promise<void>;

  /**
   Focuses the given element.
  */
  focus: (params: FocusParams) => Promise<FocusResult>;

  /**
   Returns attributes for the specified node.
  */
  getAttributes: (params: GetAttributesParams) => Promise<GetAttributesResult>;

  /**
   Returns boxes for the given node.
  */
  getBoxModel: (params: GetBoxModelParams) => Promise<GetBoxModelResult>;

  /**
   Returns quads that describe node position on the page. This method
   might return multiple quads for inline nodes.
   @experimental
  */
  getContentQuads: (params: GetContentQuadsParams) => Promise<GetContentQuadsResult>;

  /**
   Returns the root DOM node (and optionally the subtree) to the
   caller.
  */
  getDocument: (params: GetDocumentParams) => Promise<GetDocumentResult>;

  /**
   Returns the root DOM node (and optionally the subtree) to the
   caller.
  */
  getFlattenedDocument: (params: GetFlattenedDocumentParams) => Promise<GetFlattenedDocumentResult>;

  /**
   Returns node id at given location. Depending on whether DOM domain
   is enabled, nodeId is either returned or not.
   @experimental
  */
  getNodeForLocation: (params: GetNodeForLocationParams) => Promise<GetNodeForLocationResult>;

  /**
   Returns node's HTML markup.
  */
  getOuterHTML: (params: GetOuterHTMLParams) => Promise<GetOuterHTMLResult>;

  /**
   Returns the id of the nearest ancestor that is a relayout boundary.
   @experimental
  */
  getRelayoutBoundary: (params: GetRelayoutBoundaryParams) => Promise<GetRelayoutBoundaryResult>;

  /**
   Returns search results from given `fromIndex` to given `toIndex`
   from the search with the given identifier.
   @experimental
  */
  getSearchResults: (params: GetSearchResultsParams) => Promise<GetSearchResultsResult>;

  /**
   Hides any highlight.
  */
  hideHighlight: () => Promise<void>;

  /**
   Highlights DOM node.
  */
  highlightNode: () => Promise<void>;

  /**
   Highlights given rectangle.
  */
  highlightRect: () => Promise<void>;

  /**
   Marks last undoable state.
   @experimental
  */
  markUndoableState: () => Promise<void>;

  /**
   Moves node into the new container, places it before the given
   anchor.
  */
  moveTo: (params: MoveToParams) => Promise<MoveToResult>;

  /**
   Searches for a given string in the DOM tree. Use `getSearchResults`
   to access search results or `cancelSearch` to end this search
   session.
   @experimental
  */
  performSearch: (params: PerformSearchParams) => Promise<PerformSearchResult>;

  /**
   Requests that the node is sent to the caller given its path. //
   FIXME, use XPath
   @experimental
  */
  pushNodeByPathToFrontend: (params: PushNodeByPathToFrontendParams) => Promise<PushNodeByPathToFrontendResult>;

  /**
   Requests that a batch of nodes is sent to the caller given their
   backend node ids.
   @experimental
  */
  pushNodesByBackendIdsToFrontend: (params: PushNodesByBackendIdsToFrontendParams) => Promise<PushNodesByBackendIdsToFrontendResult>;

  /**
   Executes `querySelector` on a given node.
  */
  querySelector: (params: QuerySelectorParams) => Promise<QuerySelectorResult>;

  /**
   Executes `querySelectorAll` on a given node.
  */
  querySelectorAll: (params: QuerySelectorAllParams) => Promise<QuerySelectorAllResult>;

  /**
   Re-does the last undone action.
   @experimental
  */
  redo: () => Promise<void>;

  /**
   Removes attribute with given name from an element with given
   id.
  */
  removeAttribute: (params: RemoveAttributeParams) => Promise<RemoveAttributeResult>;

  /**
   Removes node with given id.
  */
  removeNode: (params: RemoveNodeParams) => Promise<RemoveNodeResult>;

  /**
   Requests that children of the node with given id are returned
   to the caller in form of `setChildNodes` events where not only
   immediate children are retrieved, but all children down to the
   specified depth.
  */
  requestChildNodes: (params: RequestChildNodesParams) => Promise<RequestChildNodesResult>;

  /**
   Requests that the node is sent to the caller given the JavaScript
   node object reference. All nodes that form the path from the node
   to the root are also sent to the client as a series of `setChildNodes`
   notifications.
  */
  requestNode: (params: RequestNodeParams) => Promise<RequestNodeResult>;

  /**
   Resolves the JavaScript node object for a given NodeId or BackendNodeId.
  */
  resolveNode: (params: ResolveNodeParams) => Promise<ResolveNodeResult>;

  /**
   Sets attribute for an element with given id.
  */
  setAttributeValue: (params: SetAttributeValueParams) => Promise<SetAttributeValueResult>;

  /**
   Sets attributes on element with given id. This method is useful
   when user edits some existing attribute value and types in several
   attribute name/value pairs.
  */
  setAttributesAsText: (params: SetAttributesAsTextParams) => Promise<SetAttributesAsTextResult>;

  /**
   Sets files for the given file input element.
  */
  setFileInputFiles: (params: SetFileInputFilesParams) => Promise<SetFileInputFilesResult>;

  /**
   Returns file information for the given File wrapper.
   @experimental
  */
  getFileInfo: (params: GetFileInfoParams) => Promise<GetFileInfoResult>;

  /**
   Enables console to refer to the node with given id via $x (see Command
   Line API for more details $x functions).
   @experimental
  */
  setInspectedNode: (params: SetInspectedNodeParams) => Promise<SetInspectedNodeResult>;

  /**
   Sets node name for a node with given id.
  */
  setNodeName: (params: SetNodeNameParams) => Promise<SetNodeNameResult>;

  /**
   Sets node value for a node with given id.
  */
  setNodeValue: (params: SetNodeValueParams) => Promise<SetNodeValueResult>;

  /**
   Sets node HTML markup, returns new node id.
  */
  setOuterHTML: (params: SetOuterHTMLParams) => Promise<SetOuterHTMLResult>;

  /**
   Undoes the last performed action.
   @experimental
  */
  undo: () => Promise<void>;

  /**
   Returns iframe node that owns iframe with the given domain.
   @experimental
  */
  getFrameOwner: (params: GetFrameOwnerParams) => Promise<GetFrameOwnerResult>;
}

export interface DOMDebugger {
  /**
   Returns event listeners of the given object.
  */
  getEventListeners: (params: GetEventListenersParams) => Promise<GetEventListenersResult>;

  /**
   Removes DOM breakpoint that was set using `setDOMBreakpoint`.
  */
  removeDOMBreakpoint: (params: RemoveDOMBreakpointParams) => Promise<RemoveDOMBreakpointResult>;

  /**
   Removes breakpoint on particular DOM event.
  */
  removeEventListenerBreakpoint: (params: RemoveEventListenerBreakpointParams) => Promise<RemoveEventListenerBreakpointResult>;

  /**
   Removes breakpoint on particular native event.
   @experimental
  */
  removeInstrumentationBreakpoint: (params: RemoveInstrumentationBreakpointParams) => Promise<RemoveInstrumentationBreakpointResult>;

  /**
   Removes breakpoint from XMLHttpRequest.
  */
  removeXHRBreakpoint: (params: RemoveXHRBreakpointParams) => Promise<RemoveXHRBreakpointResult>;

  /**
   Sets breakpoint on particular operation with DOM.
  */
  setDOMBreakpoint: (params: SetDOMBreakpointParams) => Promise<SetDOMBreakpointResult>;

  /**
   Sets breakpoint on particular DOM event.
  */
  setEventListenerBreakpoint: (params: SetEventListenerBreakpointParams) => Promise<SetEventListenerBreakpointResult>;

  /**
   Sets breakpoint on particular native event.
   @experimental
  */
  setInstrumentationBreakpoint: (params: SetInstrumentationBreakpointParams) => Promise<SetInstrumentationBreakpointResult>;

  /**
   Sets breakpoint on XMLHttpRequest.
  */
  setXHRBreakpoint: (params: SetXHRBreakpointParams) => Promise<SetXHRBreakpointResult>;
}

export interface DOMSnapshot {
  /**
   Disables DOM snapshot agent for the given page.
  */
  disable: () => Promise<void>;

  /**
   Enables DOM snapshot agent for the given page.
  */
  enable: () => Promise<void>;

  /**
   Returns a document snapshot, including the full DOM tree of the
   root node (including iframes, template contents, and imported
   documents) in a flattened array, as well as layout and white-listed
   computed style information for the nodes. Shadow DOM in the returned
   DOM tree is flattened.
  */
  getSnapshot: (params: GetSnapshotParams) => Promise<GetSnapshotResult>;

  /**
   Returns a document snapshot, including the full DOM tree of the
   root node (including iframes, template contents, and imported
   documents) in a flattened array, as well as layout and white-listed
   computed style information for the nodes. Shadow DOM in the returned
   DOM tree is flattened.
  */
  captureSnapshot: (params: CaptureSnapshotParams) => Promise<CaptureSnapshotResult>;
}

export interface DOMStorage {
  clear: (params: ClearParams) => Promise<ClearResult>;

  /**
   Disables storage tracking, prevents storage events from being
   sent to the client.
  */
  disable: () => Promise<void>;

  /**
   Enables storage tracking, storage events will now be delivered
   to the client.
  */
  enable: () => Promise<void>;

  getDOMStorageItems: (params: GetDOMStorageItemsParams) => Promise<GetDOMStorageItemsResult>;

  removeDOMStorageItem: (params: RemoveDOMStorageItemParams) => Promise<RemoveDOMStorageItemResult>;

  setDOMStorageItem: (params: SetDOMStorageItemParams) => Promise<SetDOMStorageItemResult>;
}

export interface Database {
  /**
   Disables database tracking, prevents database events from
   being sent to the client.
  */
  disable: () => Promise<void>;

  /**
   Enables database tracking, database events will now be delivered
   to the client.
  */
  enable: () => Promise<void>;

  executeSQL: (params: ExecuteSQLParams) => Promise<ExecuteSQLResult>;

  getDatabaseTableNames: (params: GetDatabaseTableNamesParams) => Promise<GetDatabaseTableNamesResult>;
}

export interface DeviceOrientation {
  /**
   Clears the overridden Device Orientation.
  */
  clearDeviceOrientationOverride: () => Promise<void>;

  /**
   Overrides the Device Orientation.
  */
  setDeviceOrientationOverride: (params: SetDeviceOrientationOverrideParams) => Promise<SetDeviceOrientationOverrideResult>;
}

export interface Emulation {
  /**
   Tells whether emulation is supported.
  */
  canEmulate: () => Promise<void>;

  /**
   Clears the overriden device metrics.
  */
  clearDeviceMetricsOverride: () => Promise<void>;

  /**
   Clears the overriden Geolocation Position and Error.
  */
  clearGeolocationOverride: () => Promise<void>;

  /**
   Requests that page scale factor is reset to initial values.
   @experimental
  */
  resetPageScaleFactor: () => Promise<void>;

  /**
   Enables or disables simulating a focused and active page.
   @experimental
  */
  setFocusEmulationEnabled: (params: SetFocusEmulationEnabledParams) => Promise<SetFocusEmulationEnabledResult>;

  /**
   Enables CPU throttling to emulate slow CPUs.
   @experimental
  */
  setCPUThrottlingRate: (params: SetCPUThrottlingRateParams) => Promise<SetCPUThrottlingRateResult>;

  /**
   Sets or clears an override of the default background color of
   the frame. This override is used if the content does not specify
   one.
  */
  setDefaultBackgroundColorOverride: (params: SetDefaultBackgroundColorOverrideParams) => Promise<SetDefaultBackgroundColorOverrideResult>;

  /**
   Overrides the values of device screen dimensions (window.screen.width,
   window.screen.height, window.innerWidth, window.innerHeight,
   and "device-width"/"device-height"-related CSS media query
   results).
  */
  setDeviceMetricsOverride: (params: SetDeviceMetricsOverrideParams) => Promise<SetDeviceMetricsOverrideResult>;

  /**
   
   @experimental
  */
  setScrollbarsHidden: (params: SetScrollbarsHiddenParams) => Promise<SetScrollbarsHiddenResult>;

  /**
   
   @experimental
  */
  setDocumentCookieDisabled: (params: SetDocumentCookieDisabledParams) => Promise<SetDocumentCookieDisabledResult>;

  /**
   
   @experimental
  */
  setEmitTouchEventsForMouse: (params: SetEmitTouchEventsForMouseParams) => Promise<SetEmitTouchEventsForMouseResult>;

  /**
   Emulates the given media for CSS media queries.
  */
  setEmulatedMedia: (params: SetEmulatedMediaParams) => Promise<SetEmulatedMediaResult>;

  /**
   Overrides the Geolocation Position or Error. Omitting any of
   the parameters emulates position unavailable.
  */
  setGeolocationOverride: (params: SetGeolocationOverrideParams) => Promise<SetGeolocationOverrideResult>;

  /**
   Overrides value returned by the javascript navigator object.
   @experimental
  */
  setNavigatorOverrides: (params: SetNavigatorOverridesParams) => Promise<SetNavigatorOverridesResult>;

  /**
   Sets a specified page scale factor.
   @experimental
  */
  setPageScaleFactor: (params: SetPageScaleFactorParams) => Promise<SetPageScaleFactorResult>;

  /**
   Switches script execution in the page.
  */
  setScriptExecutionDisabled: (params: SetScriptExecutionDisabledParams) => Promise<SetScriptExecutionDisabledResult>;

  /**
   Enables touch on platforms which do not support them.
  */
  setTouchEmulationEnabled: (params: SetTouchEmulationEnabledParams) => Promise<SetTouchEmulationEnabledResult>;

  /**
   Turns on virtual time for all frames (replacing real-time with
   a synthetic time source) and sets the current virtual time policy.
   Note this supersedes any previous time budget.
   @experimental
  */
  setVirtualTimePolicy: (params: SetVirtualTimePolicyParams) => Promise<SetVirtualTimePolicyResult>;

  /**
   Overrides default host system timezone with the specified one.
   @experimental
  */
  setTimezoneOverride: (params: SetTimezoneOverrideParams) => Promise<SetTimezoneOverrideResult>;

  /**
   Resizes the frame/viewport of the page. Note that this does not
   affect the frame's container (e.g. browser window). Can be used
   to produce screenshots of the specified size. Not supported
   on Android.
   @experimental
  */
  setVisibleSize: (params: SetVisibleSizeParams) => Promise<SetVisibleSizeResult>;

  /**
   Allows overriding user agent with the given string.
  */
  setUserAgentOverride: (params: SetUserAgentOverrideParams) => Promise<SetUserAgentOverrideResult>;
}

export interface HeadlessExperimental {
  /**
   Sends a BeginFrame to the target and returns when the frame was
   completed. Optionally captures a screenshot from the resulting
   frame. Requires that the target was created with enabled BeginFrameControl.
   Designed for use with --run-all-compositor-stages-before-draw,
   see also https://goo.gl/3zHXhB for more background.
  */
  beginFrame: (params: BeginFrameParams) => Promise<BeginFrameResult>;

  /**
   Disables headless events for the target.
  */
  disable: () => Promise<void>;

  /**
   Enables headless events for the target.
  */
  enable: () => Promise<void>;
}

export interface IO {
  /**
   Close the stream, discard any temporary backing storage.
  */
  close: (params: CloseParams) => Promise<CloseResult>;

  /**
   Read a chunk of the stream
  */
  read: (params: ReadParams) => Promise<ReadResult>;

  /**
   Return UUID of Blob object specified by a remote object id.
  */
  resolveBlob: (params: ResolveBlobParams) => Promise<ResolveBlobResult>;
}

export interface IndexedDB {
  /**
   Clears all entries from an object store.
  */
  clearObjectStore: (params: ClearObjectStoreParams) => Promise<ClearObjectStoreResult>;

  /**
   Deletes a database.
  */
  deleteDatabase: (params: DeleteDatabaseParams) => Promise<DeleteDatabaseResult>;

  /**
   Delete a range of entries from an object store
  */
  deleteObjectStoreEntries: (params: DeleteObjectStoreEntriesParams) => Promise<DeleteObjectStoreEntriesResult>;

  /**
   Disables events from backend.
  */
  disable: () => Promise<void>;

  /**
   Enables events from backend.
  */
  enable: () => Promise<void>;

  /**
   Requests data from object store or index.
  */
  requestData: (params: RequestDataParams) => Promise<RequestDataResult>;

  /**
   Gets metadata of an object store
  */
  getMetadata: (params: GetMetadataParams) => Promise<GetMetadataResult>;

  /**
   Requests database with given name in given frame.
  */
  requestDatabase: (params: RequestDatabaseParams) => Promise<RequestDatabaseResult>;

  /**
   Requests database names for given security origin.
  */
  requestDatabaseNames: (params: RequestDatabaseNamesParams) => Promise<RequestDatabaseNamesResult>;
}

export interface Input {
  /**
   Dispatches a key event to the page.
  */
  dispatchKeyEvent: (params: DispatchKeyEventParams) => Promise<DispatchKeyEventResult>;

  /**
   This method emulates inserting text that doesn't come from a
   key press, for example an emoji keyboard or an IME.
   @experimental
  */
  insertText: (params: InsertTextParams) => Promise<InsertTextResult>;

  /**
   Dispatches a mouse event to the page.
  */
  dispatchMouseEvent: (params: DispatchMouseEventParams) => Promise<DispatchMouseEventResult>;

  /**
   Dispatches a touch event to the page.
  */
  dispatchTouchEvent: (params: DispatchTouchEventParams) => Promise<DispatchTouchEventResult>;

  /**
   Emulates touch event from the mouse event parameters.
   @experimental
  */
  emulateTouchFromMouseEvent: (params: EmulateTouchFromMouseEventParams) => Promise<EmulateTouchFromMouseEventResult>;

  /**
   Ignores input events (useful while auditing page).
  */
  setIgnoreInputEvents: (params: SetIgnoreInputEventsParams) => Promise<SetIgnoreInputEventsResult>;

  /**
   Synthesizes a pinch gesture over a time period by issuing appropriate
   touch events.
   @experimental
  */
  synthesizePinchGesture: (params: SynthesizePinchGestureParams) => Promise<SynthesizePinchGestureResult>;

  /**
   Synthesizes a scroll gesture over a time period by issuing appropriate
   touch events.
   @experimental
  */
  synthesizeScrollGesture: (params: SynthesizeScrollGestureParams) => Promise<SynthesizeScrollGestureResult>;

  /**
   Synthesizes a tap gesture over a time period by issuing appropriate
   touch events.
   @experimental
  */
  synthesizeTapGesture: (params: SynthesizeTapGestureParams) => Promise<SynthesizeTapGestureResult>;
}

export interface Inspector {
  /**
   Disables inspector domain notifications.
  */
  disable: () => Promise<void>;

  /**
   Enables inspector domain notifications.
  */
  enable: () => Promise<void>;
}

export interface LayerTree {
  /**
   Provides the reasons why the given layer was composited.
  */
  compositingReasons: (params: CompositingReasonsParams) => Promise<CompositingReasonsResult>;

  /**
   Disables compositing tree inspection.
  */
  disable: () => Promise<void>;

  /**
   Enables compositing tree inspection.
  */
  enable: () => Promise<void>;

  /**
   Returns the snapshot identifier.
  */
  loadSnapshot: (params: LoadSnapshotParams) => Promise<LoadSnapshotResult>;

  /**
   Returns the layer snapshot identifier.
  */
  makeSnapshot: (params: MakeSnapshotParams) => Promise<MakeSnapshotResult>;

  profileSnapshot: (params: ProfileSnapshotParams) => Promise<ProfileSnapshotResult>;

  /**
   Releases layer snapshot captured by the back-end.
  */
  releaseSnapshot: (params: ReleaseSnapshotParams) => Promise<ReleaseSnapshotResult>;

  /**
   Replays the layer snapshot and returns the resulting bitmap.
  */
  replaySnapshot: (params: ReplaySnapshotParams) => Promise<ReplaySnapshotResult>;

  /**
   Replays the layer snapshot and returns canvas log.
  */
  snapshotCommandLog: (params: SnapshotCommandLogParams) => Promise<SnapshotCommandLogResult>;
}

export interface Log {
  /**
   Clears the log.
  */
  clear: () => Promise<void>;

  /**
   Disables log domain, prevents further log entries from being
   reported to the client.
  */
  disable: () => Promise<void>;

  /**
   Enables log domain, sends the entries collected so far to the
   client by means of the `entryAdded` notification.
  */
  enable: () => Promise<void>;

  /**
   start violation reporting.
  */
  startViolationsReport: (params: StartViolationsReportParams) => Promise<StartViolationsReportResult>;

  /**
   Stop violation reporting.
  */
  stopViolationsReport: () => Promise<void>;
}

export interface Memory {
  getDOMCounters: () => Promise<void>;

  prepareForLeakDetection: () => Promise<void>;

  /**
   Simulate OomIntervention by purging V8 memory.
  */
  forciblyPurgeJavaScriptMemory: () => Promise<void>;

  /**
   Enable/disable suppressing memory pressure notifications
   in all processes.
  */
  setPressureNotificationsSuppressed: (params: SetPressureNotificationsSuppressedParams) => Promise<SetPressureNotificationsSuppressedResult>;

  /**
   Simulate a memory pressure notification in all processes.
  */
  simulatePressureNotification: (params: SimulatePressureNotificationParams) => Promise<SimulatePressureNotificationResult>;

  /**
   Start collecting native memory profile.
  */
  startSampling: (params: StartSamplingParams) => Promise<StartSamplingResult>;

  /**
   Stop collecting native memory profile.
  */
  stopSampling: () => Promise<void>;

  /**
   Retrieve native memory allocations profile collected since
   renderer process startup.
  */
  getAllTimeSamplingProfile: () => Promise<void>;

  /**
   Retrieve native memory allocations profile collected since
   browser process startup.
  */
  getBrowserSamplingProfile: () => Promise<void>;

  /**
   Retrieve native memory allocations profile collected since
   last `startSampling` call.
  */
  getSamplingProfile: () => Promise<void>;
}

export interface Network {
  /**
   Tells whether clearing browser cache is supported.
  */
  canClearBrowserCache: () => Promise<void>;

  /**
   Tells whether clearing browser cookies is supported.
  */
  canClearBrowserCookies: () => Promise<void>;

  /**
   Tells whether emulation of network conditions is supported.
  */
  canEmulateNetworkConditions: () => Promise<void>;

  /**
   Clears browser cache.
  */
  clearBrowserCache: () => Promise<void>;

  /**
   Clears browser cookies.
  */
  clearBrowserCookies: () => Promise<void>;

  /**
   Response to Network.requestIntercepted which either modifies
   the request to continue with any modifications, or blocks it,
   or completes it with the provided response bytes. If a network
   fetch occurs as a result which encounters a redirect an additional
   Network.requestIntercepted event will be sent with the same
   InterceptionId. Deprecated, use Fetch.continueRequest,
   Fetch.fulfillRequest and Fetch.failRequest instead.
   @experimental
  */
  continueInterceptedRequest: (params: ContinueInterceptedRequestParams) => Promise<ContinueInterceptedRequestResult>;

  /**
   Deletes browser cookies with matching name and url or domain/path
   pair.
  */
  deleteCookies: (params: DeleteCookiesParams) => Promise<DeleteCookiesResult>;

  /**
   Disables network tracking, prevents network events from being
   sent to the client.
  */
  disable: () => Promise<void>;

  /**
   Activates emulation of network conditions.
  */
  emulateNetworkConditions: (params: EmulateNetworkConditionsParams) => Promise<EmulateNetworkConditionsResult>;

  /**
   Enables network tracking, network events will now be delivered
   to the client.
  */
  enable: (params: EnableParams) => Promise<EnableResult>;

  /**
   Returns all browser cookies. Depending on the backend support,
   will return detailed cookie information in the `cookies` field.
  */
  getAllCookies: () => Promise<void>;

  /**
   Returns the DER-encoded certificate.
   @experimental
  */
  getCertificate: (params: GetCertificateParams) => Promise<GetCertificateResult>;

  /**
   Returns all browser cookies for the current URL. Depending on
   the backend support, will return detailed cookie information
   in the `cookies` field.
  */
  getCookies: (params: GetCookiesParams) => Promise<GetCookiesResult>;

  /**
   Returns content served for the given request.
  */
  getResponseBody: (params: GetResponseBodyParams) => Promise<GetResponseBodyResult>;

  /**
   Returns post data sent with the request. Returns an error when
   no data was sent with the request.
  */
  getRequestPostData: (params: GetRequestPostDataParams) => Promise<GetRequestPostDataResult>;

  /**
   Returns content served for the given currently intercepted
   request.
   @experimental
  */
  getResponseBodyForInterception: (params: GetResponseBodyForInterceptionParams) => Promise<GetResponseBodyForInterceptionResult>;

  /**
   Returns a handle to the stream representing the response body.
   Note that after this command, the intercepted request can't
   be continued as is -- you either need to cancel it or to provide
   the response body. The stream only supports sequential read,
   IO.read will fail if the position is specified.
   @experimental
  */
  takeResponseBodyForInterceptionAsStream: (params: TakeResponseBodyForInterceptionAsStreamParams) => Promise<TakeResponseBodyForInterceptionAsStreamResult>;

  /**
   This method sends a new XMLHttpRequest which is identical to
   the original one. The following parameters should be identical:
   method, url, async, request body, extra headers, withCredentials
   attribute, user, password.
   @experimental
  */
  replayXHR: (params: ReplayXHRParams) => Promise<ReplayXHRResult>;

  /**
   Searches for given string in response content.
   @experimental
  */
  searchInResponseBody: (params: SearchInResponseBodyParams) => Promise<SearchInResponseBodyResult>;

  /**
   Blocks URLs from loading.
   @experimental
  */
  setBlockedURLs: (params: SetBlockedURLsParams) => Promise<SetBlockedURLsResult>;

  /**
   Toggles ignoring of service worker for each request.
   @experimental
  */
  setBypassServiceWorker: (params: SetBypassServiceWorkerParams) => Promise<SetBypassServiceWorkerResult>;

  /**
   Toggles ignoring cache for each request. If `true`, cache will
   not be used.
  */
  setCacheDisabled: (params: SetCacheDisabledParams) => Promise<SetCacheDisabledResult>;

  /**
   Sets a cookie with the given cookie data; may overwrite equivalent
   cookies if they exist.
  */
  setCookie: (params: SetCookieParams) => Promise<SetCookieResult>;

  /**
   Sets given cookies.
  */
  setCookies: (params: SetCookiesParams) => Promise<SetCookiesResult>;

  /**
   For testing.
   @experimental
  */
  setDataSizeLimitsForTest: (params: SetDataSizeLimitsForTestParams) => Promise<SetDataSizeLimitsForTestResult>;

  /**
   Specifies whether to always send extra HTTP headers with the
   requests from this page.
  */
  setExtraHTTPHeaders: (params: SetExtraHTTPHeadersParams) => Promise<SetExtraHTTPHeadersResult>;

  /**
   Sets the requests to intercept that match the provided patterns
   and optionally resource types. Deprecated, please use Fetch.enable
   instead.
   @experimental
  */
  setRequestInterception: (params: SetRequestInterceptionParams) => Promise<SetRequestInterceptionResult>;

  /**
   Allows overriding user agent with the given string.
  */
  setUserAgentOverride: (params: SetUserAgentOverrideParams) => Promise<SetUserAgentOverrideResult>;
}

export interface Overlay {
  /**
   Disables domain notifications.
  */
  disable: () => Promise<void>;

  /**
   Enables domain notifications.
  */
  enable: () => Promise<void>;

  /**
   For testing.
  */
  getHighlightObjectForTest: (params: GetHighlightObjectForTestParams) => Promise<GetHighlightObjectForTestResult>;

  /**
   Hides any highlight.
  */
  hideHighlight: () => Promise<void>;

  /**
   Highlights owner element of the frame with given id.
  */
  highlightFrame: (params: HighlightFrameParams) => Promise<HighlightFrameResult>;

  /**
   Highlights DOM node with given id or with the given JavaScript
   object wrapper. Either nodeId or objectId must be specified.
  */
  highlightNode: (params: HighlightNodeParams) => Promise<HighlightNodeResult>;

  /**
   Highlights given quad. Coordinates are absolute with respect
   to the main frame viewport.
  */
  highlightQuad: (params: HighlightQuadParams) => Promise<HighlightQuadResult>;

  /**
   Highlights given rectangle. Coordinates are absolute with
   respect to the main frame viewport.
  */
  highlightRect: (params: HighlightRectParams) => Promise<HighlightRectResult>;

  /**
   Enters the 'inspect' mode. In this mode, elements that user is
   hovering over are highlighted. Backend then generates 'inspectNodeRequested'
   event upon element selection.
  */
  setInspectMode: (params: SetInspectModeParams) => Promise<SetInspectModeResult>;

  /**
   Highlights owner element of all frames detected to be ads.
  */
  setShowAdHighlights: (params: SetShowAdHighlightsParams) => Promise<SetShowAdHighlightsResult>;

  setPausedInDebuggerMessage: (params: SetPausedInDebuggerMessageParams) => Promise<SetPausedInDebuggerMessageResult>;

  /**
   Requests that backend shows debug borders on layers
  */
  setShowDebugBorders: (params: SetShowDebugBordersParams) => Promise<SetShowDebugBordersResult>;

  /**
   Requests that backend shows the FPS counter
  */
  setShowFPSCounter: (params: SetShowFPSCounterParams) => Promise<SetShowFPSCounterResult>;

  /**
   Requests that backend shows paint rectangles
  */
  setShowPaintRects: (params: SetShowPaintRectsParams) => Promise<SetShowPaintRectsResult>;

  /**
   Requests that backend shows layout shift regions
  */
  setShowLayoutShiftRegions: (params: SetShowLayoutShiftRegionsParams) => Promise<SetShowLayoutShiftRegionsResult>;

  /**
   Requests that backend shows scroll bottleneck rects
  */
  setShowScrollBottleneckRects: (params: SetShowScrollBottleneckRectsParams) => Promise<SetShowScrollBottleneckRectsResult>;

  /**
   Requests that backend shows hit-test borders on layers
  */
  setShowHitTestBorders: (params: SetShowHitTestBordersParams) => Promise<SetShowHitTestBordersResult>;

  /**
   Paints viewport size upon main frame resize.
  */
  setShowViewportSizeOnResize: (params: SetShowViewportSizeOnResizeParams) => Promise<SetShowViewportSizeOnResizeResult>;
}

export interface Page {
  /**
   Deprecated, please use addScriptToEvaluateOnNewDocument
   instead.
   @experimental
  */
  addScriptToEvaluateOnLoad: (params: AddScriptToEvaluateOnLoadParams) => Promise<AddScriptToEvaluateOnLoadResult>;

  /**
   Evaluates given script in every frame upon creation (before
   loading frame's scripts).
  */
  addScriptToEvaluateOnNewDocument: (params: AddScriptToEvaluateOnNewDocumentParams) => Promise<AddScriptToEvaluateOnNewDocumentResult>;

  /**
   Brings page to front (activates tab).
  */
  bringToFront: () => Promise<void>;

  /**
   Capture page screenshot.
  */
  captureScreenshot: (params: CaptureScreenshotParams) => Promise<CaptureScreenshotResult>;

  /**
   Returns a snapshot of the page as a string. For MHTML format, the
   serialization includes iframes, shadow DOM, external resources,
   and element-inline styles.
   @experimental
  */
  captureSnapshot: (params: CaptureSnapshotParams) => Promise<CaptureSnapshotResult>;

  /**
   Clears the overriden device metrics.
   @experimental
  */
  clearDeviceMetricsOverride: () => Promise<void>;

  /**
   Clears the overridden Device Orientation.
   @experimental
  */
  clearDeviceOrientationOverride: () => Promise<void>;

  /**
   Clears the overriden Geolocation Position and Error.
  */
  clearGeolocationOverride: () => Promise<void>;

  /**
   Creates an isolated world for the given frame.
  */
  createIsolatedWorld: (params: CreateIsolatedWorldParams) => Promise<CreateIsolatedWorldResult>;

  /**
   Deletes browser cookie with given name, domain and path.
   @experimental
  */
  deleteCookie: (params: DeleteCookieParams) => Promise<DeleteCookieResult>;

  /**
   Disables page domain notifications.
  */
  disable: () => Promise<void>;

  /**
   Enables page domain notifications.
  */
  enable: () => Promise<void>;

  getAppManifest: () => Promise<void>;

  /**
   
   @experimental
  */
  getInstallabilityErrors: () => Promise<void>;

  /**
   Returns all browser cookies. Depending on the backend support,
   will return detailed cookie information in the `cookies` field.
   @experimental
  */
  getCookies: () => Promise<void>;

  /**
   Returns present frame tree structure.
  */
  getFrameTree: () => Promise<void>;

  /**
   Returns metrics relating to the layouting of the page, such as
   viewport bounds/scale.
  */
  getLayoutMetrics: () => Promise<void>;

  /**
   Returns navigation history for the current page.
  */
  getNavigationHistory: () => Promise<void>;

  /**
   Resets navigation history for the current page.
  */
  resetNavigationHistory: () => Promise<void>;

  /**
   Returns content of the given resource.
   @experimental
  */
  getResourceContent: (params: GetResourceContentParams) => Promise<GetResourceContentResult>;

  /**
   Returns present frame / resource tree structure.
   @experimental
  */
  getResourceTree: () => Promise<void>;

  /**
   Accepts or dismisses a JavaScript initiated dialog (alert,
   confirm, prompt, or onbeforeunload).
  */
  handleJavaScriptDialog: (params: HandleJavaScriptDialogParams) => Promise<HandleJavaScriptDialogResult>;

  /**
   Navigates current page to the given URL.
  */
  navigate: (params: NavigateParams) => Promise<NavigateResult>;

  /**
   Navigates current page to the given history entry.
  */
  navigateToHistoryEntry: (params: NavigateToHistoryEntryParams) => Promise<NavigateToHistoryEntryResult>;

  /**
   Print page as PDF.
  */
  printToPDF: (params: PrintToPDFParams) => Promise<PrintToPDFResult>;

  /**
   Reloads given page optionally ignoring the cache.
  */
  reload: (params: ReloadParams) => Promise<ReloadResult>;

  /**
   Deprecated, please use removeScriptToEvaluateOnNewDocument
   instead.
   @experimental
  */
  removeScriptToEvaluateOnLoad: (params: RemoveScriptToEvaluateOnLoadParams) => Promise<RemoveScriptToEvaluateOnLoadResult>;

  /**
   Removes given script from the list.
  */
  removeScriptToEvaluateOnNewDocument: (params: RemoveScriptToEvaluateOnNewDocumentParams) => Promise<RemoveScriptToEvaluateOnNewDocumentResult>;

  /**
   Acknowledges that a screencast frame has been received by the
   frontend.
   @experimental
  */
  screencastFrameAck: (params: ScreencastFrameAckParams) => Promise<ScreencastFrameAckResult>;

  /**
   Searches for given string in resource content.
   @experimental
  */
  searchInResource: (params: SearchInResourceParams) => Promise<SearchInResourceResult>;

  /**
   Enable Chrome's experimental ad filter on all sites.
   @experimental
  */
  setAdBlockingEnabled: (params: SetAdBlockingEnabledParams) => Promise<SetAdBlockingEnabledResult>;

  /**
   Enable page Content Security Policy by-passing.
   @experimental
  */
  setBypassCSP: (params: SetBypassCSPParams) => Promise<SetBypassCSPResult>;

  /**
   Overrides the values of device screen dimensions (window.screen.width,
   window.screen.height, window.innerWidth, window.innerHeight,
   and "device-width"/"device-height"-related CSS media query
   results).
   @experimental
  */
  setDeviceMetricsOverride: (params: SetDeviceMetricsOverrideParams) => Promise<SetDeviceMetricsOverrideResult>;

  /**
   Overrides the Device Orientation.
   @experimental
  */
  setDeviceOrientationOverride: (params: SetDeviceOrientationOverrideParams) => Promise<SetDeviceOrientationOverrideResult>;

  /**
   Set generic font families.
   @experimental
  */
  setFontFamilies: (params: SetFontFamiliesParams) => Promise<SetFontFamiliesResult>;

  /**
   Set default font sizes.
   @experimental
  */
  setFontSizes: (params: SetFontSizesParams) => Promise<SetFontSizesResult>;

  /**
   Sets given markup as the document's HTML.
  */
  setDocumentContent: (params: SetDocumentContentParams) => Promise<SetDocumentContentResult>;

  /**
   Set the behavior when downloading a file.
   @experimental
  */
  setDownloadBehavior: (params: SetDownloadBehaviorParams) => Promise<SetDownloadBehaviorResult>;

  /**
   Overrides the Geolocation Position or Error. Omitting any of
   the parameters emulates position unavailable.
  */
  setGeolocationOverride: (params: SetGeolocationOverrideParams) => Promise<SetGeolocationOverrideResult>;

  /**
   Controls whether page will emit lifecycle events.
   @experimental
  */
  setLifecycleEventsEnabled: (params: SetLifecycleEventsEnabledParams) => Promise<SetLifecycleEventsEnabledResult>;

  /**
   Toggles mouse event-based touch event emulation.
   @experimental
  */
  setTouchEmulationEnabled: (params: SetTouchEmulationEnabledParams) => Promise<SetTouchEmulationEnabledResult>;

  /**
   Starts sending each frame using the `screencastFrame` event.
   @experimental
  */
  startScreencast: (params: StartScreencastParams) => Promise<StartScreencastResult>;

  /**
   Force the page stop all navigations and pending resource fetches.
  */
  stopLoading: () => Promise<void>;

  /**
   Crashes renderer on the IO thread, generates minidumps.
   @experimental
  */
  crash: () => Promise<void>;

  /**
   Tries to close page, running its beforeunload hooks, if any.
   @experimental
  */
  close: () => Promise<void>;

  /**
   Tries to update the web lifecycle state of the page. It will transition
   the page to the given state according to: https://github.com/WICG/web-lifecycle/
   @experimental
  */
  setWebLifecycleState: (params: SetWebLifecycleStateParams) => Promise<SetWebLifecycleStateResult>;

  /**
   Stops sending each frame in the `screencastFrame`.
   @experimental
  */
  stopScreencast: () => Promise<void>;

  /**
   Forces compilation cache to be generated for every subresource
   script.
   @experimental
  */
  setProduceCompilationCache: (params: SetProduceCompilationCacheParams) => Promise<SetProduceCompilationCacheResult>;

  /**
   Seeds compilation cache for given url. Compilation cache does
   not survive cross-process navigation.
   @experimental
  */
  addCompilationCache: (params: AddCompilationCacheParams) => Promise<AddCompilationCacheResult>;

  /**
   Clears seeded compilation cache.
   @experimental
  */
  clearCompilationCache: () => Promise<void>;

  /**
   Generates a report for testing.
   @experimental
  */
  generateTestReport: (params: GenerateTestReportParams) => Promise<GenerateTestReportResult>;

  /**
   Pauses page execution. Can be resumed using generic Runtime.runIfWaitingForDebugger.
   @experimental
  */
  waitForDebugger: () => Promise<void>;

  /**
   Intercept file chooser requests and transfer control to protocol
   clients. When file chooser interception is enabled, native
   file chooser dialog is not shown. Instead, a protocol event `Page.fileChooserOpened`
   is emitted. File chooser can be handled with `page.handleFileChooser`
   command.
   @experimental
  */
  setInterceptFileChooserDialog: (params: SetInterceptFileChooserDialogParams) => Promise<SetInterceptFileChooserDialogResult>;

  /**
   Accepts or cancels an intercepted file chooser dialog.
   @experimental
  */
  handleFileChooser: (params: HandleFileChooserParams) => Promise<HandleFileChooserResult>;
}

export interface Performance {
  /**
   Disable collecting and reporting metrics.
  */
  disable: () => Promise<void>;

  /**
   Enable collecting and reporting metrics.
  */
  enable: () => Promise<void>;

  /**
   Sets time domain to use for collecting and reporting duration
   metrics. Note that this must be called before enabling metrics
   collection. Calling this method while metrics collection is
   enabled returns an error.
   @experimental
  */
  setTimeDomain: (params: SetTimeDomainParams) => Promise<SetTimeDomainResult>;

  /**
   Retrieve current values of run-time metrics.
  */
  getMetrics: () => Promise<void>;
}

export interface Security {
  /**
   Disables tracking security state changes.
  */
  disable: () => Promise<void>;

  /**
   Enables tracking security state changes.
  */
  enable: () => Promise<void>;

  /**
   Enable/disable whether all certificate errors should be ignored.
   @experimental
  */
  setIgnoreCertificateErrors: (params: SetIgnoreCertificateErrorsParams) => Promise<SetIgnoreCertificateErrorsResult>;

  /**
   Handles a certificate error that fired a certificateError event.
  */
  handleCertificateError: (params: HandleCertificateErrorParams) => Promise<HandleCertificateErrorResult>;

  /**
   Enable/disable overriding certificate errors. If enabled,
   all certificate error events need to be handled by the DevTools
   client and should be answered with `handleCertificateError`
   commands.
  */
  setOverrideCertificateErrors: (params: SetOverrideCertificateErrorsParams) => Promise<SetOverrideCertificateErrorsResult>;
}

export interface ServiceWorker {
  deliverPushMessage: (params: DeliverPushMessageParams) => Promise<DeliverPushMessageResult>;

  disable: () => Promise<void>;

  dispatchSyncEvent: (params: DispatchSyncEventParams) => Promise<DispatchSyncEventResult>;

  enable: () => Promise<void>;

  inspectWorker: (params: InspectWorkerParams) => Promise<InspectWorkerResult>;

  setForceUpdateOnPageLoad: (params: SetForceUpdateOnPageLoadParams) => Promise<SetForceUpdateOnPageLoadResult>;

  skipWaiting: (params: SkipWaitingParams) => Promise<SkipWaitingResult>;

  startWorker: (params: StartWorkerParams) => Promise<StartWorkerResult>;

  stopAllWorkers: () => Promise<void>;

  stopWorker: (params: StopWorkerParams) => Promise<StopWorkerResult>;

  unregister: (params: UnregisterParams) => Promise<UnregisterResult>;

  updateRegistration: (params: UpdateRegistrationParams) => Promise<UpdateRegistrationResult>;
}

export interface Storage {
  /**
   Clears storage for origin.
  */
  clearDataForOrigin: (params: ClearDataForOriginParams) => Promise<ClearDataForOriginResult>;

  /**
   Returns usage and quota in bytes.
  */
  getUsageAndQuota: (params: GetUsageAndQuotaParams) => Promise<GetUsageAndQuotaResult>;

  /**
   Registers origin to be notified when an update occurs to its cache
   storage list.
  */
  trackCacheStorageForOrigin: (params: TrackCacheStorageForOriginParams) => Promise<TrackCacheStorageForOriginResult>;

  /**
   Registers origin to be notified when an update occurs to its IndexedDB.
  */
  trackIndexedDBForOrigin: (params: TrackIndexedDBForOriginParams) => Promise<TrackIndexedDBForOriginResult>;

  /**
   Unregisters origin from receiving notifications for cache
   storage.
  */
  untrackCacheStorageForOrigin: (params: UntrackCacheStorageForOriginParams) => Promise<UntrackCacheStorageForOriginResult>;

  /**
   Unregisters origin from receiving notifications for IndexedDB.
  */
  untrackIndexedDBForOrigin: (params: UntrackIndexedDBForOriginParams) => Promise<UntrackIndexedDBForOriginResult>;
}

export interface SystemInfo {
  /**
   Returns information about the system.
  */
  getInfo: () => Promise<void>;

  /**
   Returns information about all running processes.
  */
  getProcessInfo: () => Promise<void>;
}

export interface Target {
  /**
   Activates (focuses) the target.
  */
  activateTarget: (params: ActivateTargetParams) => Promise<ActivateTargetResult>;

  /**
   Attaches to the target with given id.
  */
  attachToTarget: (params: AttachToTargetParams) => Promise<AttachToTargetResult>;

  /**
   Attaches to the browser target, only uses flat sessionId mode.
   @experimental
  */
  attachToBrowserTarget: () => Promise<void>;

  /**
   Closes the target. If the target is a page that gets closed too.
  */
  closeTarget: (params: CloseTargetParams) => Promise<CloseTargetResult>;

  /**
   Inject object to the target's main frame that provides a communication
   channel with browser target. Injected object will be available
   as `window[bindingName]`. The object has the follwing API:
   - `binding.send(json)` - a method to send messages over the remote
   debugging protocol - `binding.onmessage = json => handleMessage(json)`
   - a callback that will be called for the protocol notifications
   and command responses.
   @experimental
  */
  exposeDevToolsProtocol: (params: ExposeDevToolsProtocolParams) => Promise<ExposeDevToolsProtocolResult>;

  /**
   Creates a new empty BrowserContext. Similar to an incognito
   profile but you can have more than one.
   @experimental
  */
  createBrowserContext: () => Promise<void>;

  /**
   Returns all browser contexts created with `Target.createBrowserContext`
   method.
   @experimental
  */
  getBrowserContexts: () => Promise<void>;

  /**
   Creates a new page.
  */
  createTarget: (params: CreateTargetParams) => Promise<CreateTargetResult>;

  /**
   Detaches session with given id.
  */
  detachFromTarget: (params: DetachFromTargetParams) => Promise<DetachFromTargetResult>;

  /**
   Deletes a BrowserContext. All the belonging pages will be closed
   without calling their beforeunload hooks.
   @experimental
  */
  disposeBrowserContext: (params: DisposeBrowserContextParams) => Promise<DisposeBrowserContextResult>;

  /**
   Returns information about a target.
   @experimental
  */
  getTargetInfo: (params: GetTargetInfoParams) => Promise<GetTargetInfoResult>;

  /**
   Retrieves a list of available targets.
  */
  getTargets: () => Promise<void>;

  /**
   Sends protocol message over session with given id.
  */
  sendMessageToTarget: (params: SendMessageToTargetParams) => Promise<SendMessageToTargetResult>;

  /**
   Controls whether to automatically attach to new targets which
   are considered to be related to this one. When turned on, attaches
   to all existing related targets as well. When turned off, automatically
   detaches from all currently attached targets.
   @experimental
  */
  setAutoAttach: (params: SetAutoAttachParams) => Promise<SetAutoAttachResult>;

  /**
   Controls whether to discover available targets and notify via
   `targetCreated/targetInfoChanged/targetDestroyed` events.
  */
  setDiscoverTargets: (params: SetDiscoverTargetsParams) => Promise<SetDiscoverTargetsResult>;

  /**
   Enables target discovery for the specified locations, when
   `setDiscoverTargets` was set to `true`.
   @experimental
  */
  setRemoteLocations: (params: SetRemoteLocationsParams) => Promise<SetRemoteLocationsResult>;
}

export interface Tethering {
  /**
   Request browser port binding.
  */
  bind: (params: BindParams) => Promise<BindResult>;

  /**
   Request browser port unbinding.
  */
  unbind: (params: UnbindParams) => Promise<UnbindResult>;
}

export interface Tracing {
  /**
   Stop trace events collection.
  */
  end: () => Promise<void>;

  /**
   Gets supported tracing categories.
  */
  getCategories: () => Promise<void>;

  /**
   Record a clock sync marker in the trace.
  */
  recordClockSyncMarker: (params: RecordClockSyncMarkerParams) => Promise<RecordClockSyncMarkerResult>;

  /**
   Request a global memory dump.
  */
  requestMemoryDump: () => Promise<void>;

  /**
   Start trace events collection.
  */
  start: (params: StartParams) => Promise<StartResult>;
}

export interface Fetch {
  /**
   Disables the fetch domain.
  */
  disable: () => Promise<void>;

  /**
   Enables issuing of requestPaused events. A request will be paused
   until client calls one of failRequest, fulfillRequest or continueRequest/continueWithAuth.
  */
  enable: (params: EnableParams) => Promise<EnableResult>;

  /**
   Causes the request to fail with specified reason.
  */
  failRequest: (params: FailRequestParams) => Promise<FailRequestResult>;

  /**
   Provides response to the request.
  */
  fulfillRequest: (params: FulfillRequestParams) => Promise<FulfillRequestResult>;

  /**
   Continues the request, optionally modifying some of its parameters.
  */
  continueRequest: (params: ContinueRequestParams) => Promise<ContinueRequestResult>;

  /**
   Continues a request supplying authChallengeResponse following
   authRequired event.
  */
  continueWithAuth: (params: ContinueWithAuthParams) => Promise<ContinueWithAuthResult>;

  /**
   Causes the body of the response to be received from the server
   and returned as a single string. May only be issued for a request
   that is paused in the Response stage and is mutually exclusive
   with takeResponseBodyForInterceptionAsStream. Calling
   other methods that affect the request or disabling fetch domain
   before body is received results in an undefined behavior.
  */
  getResponseBody: (params: GetResponseBodyParams) => Promise<GetResponseBodyResult>;

  /**
   Returns a handle to the stream representing the response body.
   The request must be paused in the HeadersReceived stage. Note
   that after this command the request can't be continued as is --
   client either needs to cancel it or to provide the response body.
   The stream only supports sequential read, IO.read will fail
   if the position is specified. This method is mutually exclusive
   with getResponseBody. Calling other methods that affect the
   request or disabling fetch domain before body is received results
   in an undefined behavior.
  */
  takeResponseBodyAsStream: (params: TakeResponseBodyAsStreamParams) => Promise<TakeResponseBodyAsStreamResult>;
}

export interface WebAudio {
  /**
   Enables the WebAudio domain and starts sending context lifetime
   events.
  */
  enable: () => Promise<void>;

  /**
   Disables the WebAudio domain.
  */
  disable: () => Promise<void>;

  /**
   Fetch the realtime data from the registered contexts.
  */
  getRealtimeData: (params: GetRealtimeDataParams) => Promise<GetRealtimeDataResult>;
}

export interface WebAuthn {
  /**
   Enable the WebAuthn domain and start intercepting credential
   storage and retrieval with a virtual authenticator.
  */
  enable: () => Promise<void>;

  /**
   Disable the WebAuthn domain.
  */
  disable: () => Promise<void>;

  /**
   Creates and adds a virtual authenticator.
  */
  addVirtualAuthenticator: (params: AddVirtualAuthenticatorParams) => Promise<AddVirtualAuthenticatorResult>;

  /**
   Removes the given authenticator.
  */
  removeVirtualAuthenticator: (params: RemoveVirtualAuthenticatorParams) => Promise<RemoveVirtualAuthenticatorResult>;

  /**
   Adds the credential to the specified authenticator.
  */
  addCredential: (params: AddCredentialParams) => Promise<AddCredentialResult>;

  /**
   Returns all the credentials stored in the given virtual authenticator.
  */
  getCredentials: (params: GetCredentialsParams) => Promise<GetCredentialsResult>;

  /**
   Clears all the credentials from the specified device.
  */
  clearCredentials: (params: ClearCredentialsParams) => Promise<ClearCredentialsResult>;

  /**
   Sets whether User Verification succeeds or fails for an authenticator.
   The default is true.
  */
  setUserVerified: (params: SetUserVerifiedParams) => Promise<SetUserVerifiedResult>;
}

export interface Console {
  /**
   Does nothing.
  */
  clearMessages: () => Promise<void>;

  /**
   Disables console domain, prevents further console messages
   from being reported to the client.
  */
  disable: () => Promise<void>;

  /**
   Enables console domain, sends the messages collected so far
   to the client by means of the `messageAdded` notification.
  */
  enable: () => Promise<void>;
}

export interface Debugger {
  /**
   Continues execution until specific location is reached.
  */
  continueToLocation: (params: ContinueToLocationParams) => Promise<ContinueToLocationResult>;

  /**
   Disables debugger for given page.
  */
  disable: () => Promise<void>;

  /**
   Enables debugger for the given page. Clients should not assume
   that the debugging has been enabled until the result for this
   command is received.
  */
  enable: (params: EnableParams) => Promise<EnableResult>;

  /**
   Evaluates expression on a given call frame.
  */
  evaluateOnCallFrame: (params: EvaluateOnCallFrameParams) => Promise<EvaluateOnCallFrameResult>;

  /**
   Returns possible locations for breakpoint. scriptId in start
   and end range locations should be the same.
  */
  getPossibleBreakpoints: (params: GetPossibleBreakpointsParams) => Promise<GetPossibleBreakpointsResult>;

  /**
   Returns source for the script with given id.
  */
  getScriptSource: (params: GetScriptSourceParams) => Promise<GetScriptSourceResult>;

  /**
   Returns stack trace with given `stackTraceId`.
   @experimental
  */
  getStackTrace: (params: GetStackTraceParams) => Promise<GetStackTraceResult>;

  /**
   Stops on the next JavaScript statement.
  */
  pause: () => Promise<void>;

  /**
   
   @experimental
  */
  pauseOnAsyncCall: (params: PauseOnAsyncCallParams) => Promise<PauseOnAsyncCallResult>;

  /**
   Removes JavaScript breakpoint.
  */
  removeBreakpoint: (params: RemoveBreakpointParams) => Promise<RemoveBreakpointResult>;

  /**
   Restarts particular call frame from the beginning.
  */
  restartFrame: (params: RestartFrameParams) => Promise<RestartFrameResult>;

  /**
   Resumes JavaScript execution.
  */
  resume: () => Promise<void>;

  /**
   Searches for given string in script content.
  */
  searchInContent: (params: SearchInContentParams) => Promise<SearchInContentResult>;

  /**
   Enables or disables async call stacks tracking.
  */
  setAsyncCallStackDepth: (params: SetAsyncCallStackDepthParams) => Promise<SetAsyncCallStackDepthResult>;

  /**
   Replace previous blackbox patterns with passed ones. Forces
   backend to skip stepping/pausing in scripts with url matching
   one of the patterns. VM will try to leave blackboxed script by
   performing 'step in' several times, finally resorting to 'step
   out' if unsuccessful.
   @experimental
  */
  setBlackboxPatterns: (params: SetBlackboxPatternsParams) => Promise<SetBlackboxPatternsResult>;

  /**
   Makes backend skip steps in the script in blackboxed ranges.
   VM will try leave blacklisted scripts by performing 'step in'
   several times, finally resorting to 'step out' if unsuccessful.
   Positions array contains positions where blackbox state is
   changed. First interval isn't blackboxed. Array should be sorted.
   @experimental
  */
  setBlackboxedRanges: (params: SetBlackboxedRangesParams) => Promise<SetBlackboxedRangesResult>;

  /**
   Sets JavaScript breakpoint at a given location.
  */
  setBreakpoint: (params: SetBreakpointParams) => Promise<SetBreakpointResult>;

  /**
   Sets instrumentation breakpoint.
  */
  setInstrumentationBreakpoint: (params: SetInstrumentationBreakpointParams) => Promise<SetInstrumentationBreakpointResult>;

  /**
   Sets JavaScript breakpoint at given location specified either
   by URL or URL regex. Once this command is issued, all existing
   parsed scripts will have breakpoints resolved and returned
   in `locations` property. Further matching script parsing will
   result in subsequent `breakpointResolved` events issued.
   This logical breakpoint will survive page reloads.
  */
  setBreakpointByUrl: (params: SetBreakpointByUrlParams) => Promise<SetBreakpointByUrlResult>;

  /**
   Sets JavaScript breakpoint before each call to the given function.
   If another function was created from the same source as a given
   one, calling it will also trigger the breakpoint.
   @experimental
  */
  setBreakpointOnFunctionCall: (params: SetBreakpointOnFunctionCallParams) => Promise<SetBreakpointOnFunctionCallResult>;

  /**
   Activates / deactivates all breakpoints on the page.
  */
  setBreakpointsActive: (params: SetBreakpointsActiveParams) => Promise<SetBreakpointsActiveResult>;

  /**
   Defines pause on exceptions state. Can be set to stop on all exceptions,
   uncaught exceptions or no exceptions. Initial pause on exceptions
   state is `none`.
  */
  setPauseOnExceptions: (params: SetPauseOnExceptionsParams) => Promise<SetPauseOnExceptionsResult>;

  /**
   Changes return value in top frame. Available only at return break
   position.
   @experimental
  */
  setReturnValue: (params: SetReturnValueParams) => Promise<SetReturnValueResult>;

  /**
   Edits JavaScript source live.
  */
  setScriptSource: (params: SetScriptSourceParams) => Promise<SetScriptSourceResult>;

  /**
   Makes page not interrupt on any pauses (breakpoint, exception,
   dom exception etc).
  */
  setSkipAllPauses: (params: SetSkipAllPausesParams) => Promise<SetSkipAllPausesResult>;

  /**
   Changes value of variable in a callframe. Object-based scopes
   are not supported and must be mutated manually.
  */
  setVariableValue: (params: SetVariableValueParams) => Promise<SetVariableValueResult>;

  /**
   Steps into the function call.
  */
  stepInto: (params: StepIntoParams) => Promise<StepIntoResult>;

  /**
   Steps out of the function call.
  */
  stepOut: () => Promise<void>;

  /**
   Steps over the statement.
  */
  stepOver: () => Promise<void>;
}

export interface HeapProfiler {
  /**
   Enables console to refer to the node with given id via $x (see Command
   Line API for more details $x functions).
  */
  addInspectedHeapObject: (params: AddInspectedHeapObjectParams) => Promise<AddInspectedHeapObjectResult>;

  collectGarbage: () => Promise<void>;

  disable: () => Promise<void>;

  enable: () => Promise<void>;

  getHeapObjectId: (params: GetHeapObjectIdParams) => Promise<GetHeapObjectIdResult>;

  getObjectByHeapObjectId: (params: GetObjectByHeapObjectIdParams) => Promise<GetObjectByHeapObjectIdResult>;

  getSamplingProfile: () => Promise<void>;

  startSampling: (params: StartSamplingParams) => Promise<StartSamplingResult>;

  startTrackingHeapObjects: (params: StartTrackingHeapObjectsParams) => Promise<StartTrackingHeapObjectsResult>;

  stopSampling: () => Promise<void>;

  stopTrackingHeapObjects: (params: StopTrackingHeapObjectsParams) => Promise<StopTrackingHeapObjectsResult>;

  takeHeapSnapshot: (params: TakeHeapSnapshotParams) => Promise<TakeHeapSnapshotResult>;
}

export interface Profiler {
  disable: () => Promise<void>;

  enable: () => Promise<void>;

  /**
   Collect coverage data for the current isolate. The coverage
   data may be incomplete due to garbage collection.
  */
  getBestEffortCoverage: () => Promise<void>;

  /**
   Changes CPU profiler sampling interval. Must be called before
   CPU profiles recording started.
  */
  setSamplingInterval: (params: SetSamplingIntervalParams) => Promise<SetSamplingIntervalResult>;

  start: () => Promise<void>;

  /**
   Enable precise code coverage. Coverage data for JavaScript
   executed before enabling precise code coverage may be incomplete.
   Enabling prevents running optimized code and resets execution
   counters.
  */
  startPreciseCoverage: (params: StartPreciseCoverageParams) => Promise<StartPreciseCoverageResult>;

  /**
   Enable type profile.
   @experimental
  */
  startTypeProfile: () => Promise<void>;

  stop: () => Promise<void>;

  /**
   Disable precise code coverage. Disabling releases unnecessary
   execution count records and allows executing optimized code.
  */
  stopPreciseCoverage: () => Promise<void>;

  /**
   Disable type profile. Disabling releases type profile data
   collected so far.
   @experimental
  */
  stopTypeProfile: () => Promise<void>;

  /**
   Collect coverage data for the current isolate, and resets execution
   counters. Precise code coverage needs to have started.
  */
  takePreciseCoverage: () => Promise<void>;

  /**
   Collect type profile.
   @experimental
  */
  takeTypeProfile: () => Promise<void>;
}

export interface Runtime {
  /**
   Add handler to promise with given promise object id.
  */
  awaitPromise: (params: AwaitPromiseParams) => Promise<AwaitPromiseResult>;

  /**
   Calls function with given declaration on the given object. Object
   group of the result is inherited from the target object.
  */
  callFunctionOn: (params: CallFunctionOnParams) => Promise<CallFunctionOnResult>;

  /**
   Compiles expression.
  */
  compileScript: (params: CompileScriptParams) => Promise<CompileScriptResult>;

  /**
   Disables reporting of execution contexts creation.
  */
  disable: () => Promise<void>;

  /**
   Discards collected exceptions and console API calls.
  */
  discardConsoleEntries: () => Promise<void>;

  /**
   Enables reporting of execution contexts creation by means of
   `executionContextCreated` event. When the reporting gets
   enabled the event will be sent immediately for each existing
   execution context.
  */
  enable: () => Promise<void>;

  /**
   Evaluates expression on global object.
  */
  evaluate: (params: EvaluateParams) => Promise<EvaluateResult>;

  /**
   Returns the isolate id.
   @experimental
  */
  getIsolateId: () => Promise<void>;

  /**
   Returns the JavaScript heap usage. It is the total usage of the
   corresponding isolate not scoped to a particular Runtime.
   @experimental
  */
  getHeapUsage: () => Promise<void>;

  /**
   Returns properties of a given object. Object group of the result
   is inherited from the target object.
  */
  getProperties: (params: GetPropertiesParams) => Promise<GetPropertiesResult>;

  /**
   Returns all let, const and class variables from global scope.
  */
  globalLexicalScopeNames: (params: GlobalLexicalScopeNamesParams) => Promise<GlobalLexicalScopeNamesResult>;

  queryObjects: (params: QueryObjectsParams) => Promise<QueryObjectsResult>;

  /**
   Releases remote object with given id.
  */
  releaseObject: (params: ReleaseObjectParams) => Promise<ReleaseObjectResult>;

  /**
   Releases all remote objects that belong to a given group.
  */
  releaseObjectGroup: (params: ReleaseObjectGroupParams) => Promise<ReleaseObjectGroupResult>;

  /**
   Tells inspected instance to run if it was waiting for debugger
   to attach.
  */
  runIfWaitingForDebugger: () => Promise<void>;

  /**
   Runs script with given id in a given context.
  */
  runScript: (params: RunScriptParams) => Promise<RunScriptResult>;

  /**
   Enables or disables async call stacks tracking.
  */
  setAsyncCallStackDepth: (params: SetAsyncCallStackDepthParams) => Promise<SetAsyncCallStackDepthResult>;

  /**
   
   @experimental
  */
  setCustomObjectFormatterEnabled: (params: SetCustomObjectFormatterEnabledParams) => Promise<SetCustomObjectFormatterEnabledResult>;

  /**
   
   @experimental
  */
  setMaxCallStackSizeToCapture: (params: SetMaxCallStackSizeToCaptureParams) => Promise<SetMaxCallStackSizeToCaptureResult>;

  /**
   Terminate current or next JavaScript execution. Will cancel
   the termination when the outer-most script execution ends.
   @experimental
  */
  terminateExecution: () => Promise<void>;

  /**
   If executionContextId is empty, adds binding with the given
   name on the global objects of all inspected contexts, including
   those created later, bindings survive reloads. If executionContextId
   is specified, adds binding only on global object of given execution
   context. Binding function takes exactly one argument, this
   argument should be string, in case of any other input, function
   throws an exception. Each binding function call produces Runtime.bindingCalled
   notification.
   @experimental
  */
  addBinding: (params: AddBindingParams) => Promise<AddBindingResult>;

  /**
   This method does not remove binding function from global object
   but unsubscribes current runtime agent from Runtime.bindingCalled
   notifications.
   @experimental
  */
  removeBinding: (params: RemoveBindingParams) => Promise<RemoveBindingResult>;
}

export interface Schema {
  /**
   Returns supported domains.
  */
  getDomains: () => Promise<void>;
}