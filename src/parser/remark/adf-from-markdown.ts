/**
 * @file adf-from-markdown.ts
 * @description mdast-util extension for converting ADF tokens to AST nodes
 */

import { CompileContext, Extension as FromMarkdownExtension, Handle } from 'mdast-util-from-markdown';
import { parseAdfAttributes } from '../micromark/adf-fence.js';

/**
 * ADF fence block node for mdast
 */
export interface AdfFenceNode {
  type: 'adfFence';
  nodeType: string;
  attributes: Record<string, any>;
  value: string;
  data?: {
    hName?: string;
    hProperties?: Record<string, any>;
    hChildren?: any[];
  };
}

declare module 'mdast' {
  interface RootContentMap {
    adfFence: AdfFenceNode;
  }
  
  interface BlockContentMap {
    adfFence: AdfFenceNode;
  }
  
  interface FrontmatterContentMap {
    adfFence: AdfFenceNode;
  }
  
  interface PhrasingContentMap {
    // ADF fence blocks are not phrasing content
  }
}

/**
 * Handle entering an ADF fence token
 */
const enterAdfFence: Handle = function (token) {
  const context = this as CompileContext;
  
  const node: AdfFenceNode = {
    type: 'adfFence',
    nodeType: '',
    attributes: {},
    value: ''
  };
  
  context.enter(node, token);
};

/**
 * Handle entering ADF fence type token
 */
const enterAdfFenceType: Handle = function (token) {
  const context = this as CompileContext;
  const parent = context.stack[context.stack.length - 1] as AdfFenceNode;
  
  if (parent.type === 'adfFence') {
    parent.nodeType = context.sliceSerialize(token);
  }
};

/**
 * Handle entering ADF fence attributes token
 */
const enterAdfFenceAttributes: Handle = function (token) {
  const context = this as CompileContext;
  const parent = context.stack[context.stack.length - 1] as AdfFenceNode;
  
  if (parent.type === 'adfFence') {
    const attributeString = context.sliceSerialize(token);
    parent.attributes = parseAdfAttributes(attributeString);
  }
};

/**
 * Handle entering ADF fence content token
 */
const enterAdfFenceContent: Handle = function (token) {
  const context = this as CompileContext;
  const parent = context.stack[context.stack.length - 1] as AdfFenceNode;
  
  if (parent.type === 'adfFence') {
    parent.value = context.sliceSerialize(token);
  }
};

/**
 * Handle exiting an ADF fence token
 */
const exitAdfFence: Handle = function (token) {
  const context = this as CompileContext;
  context.exit(token);
};

/**
 * Extension for parsing ADF fence blocks from markdown
 */
export function adfFromMarkdown(): FromMarkdownExtension {
  return {
    enter: {
      adfFence: enterAdfFence,
      adfFenceType: enterAdfFenceType,
      adfFenceAttributes: enterAdfFenceAttributes,
      adfFenceContent: enterAdfFenceContent
    },
    exit: {
      adfFence: exitAdfFence
    }
  };
}