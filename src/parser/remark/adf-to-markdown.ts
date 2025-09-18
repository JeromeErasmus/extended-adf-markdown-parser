/**
 * @file adf-to-markdown.ts
 * @description mdast-util extension for converting ADF AST nodes back to markdown
 */

import { ConstructName, Options as ToMarkdownExtension, Handle } from 'mdast-util-to-markdown';
import { AdfFenceNode } from './adf-from-markdown.js';

/**
 * Handle converting ADF fence node back to markdown
 */
const adfFenceHandler: Handle = function (node, parent, context, info) {
  const adfNode = node as AdfFenceNode;
  const fence = '~~~';
  
  // Build the opening fence line
  let openingLine = fence + adfNode.nodeType;
  
  // Add attributes if present
  if (Object.keys(adfNode.attributes).length > 0) {
    const attributePairs = Object.entries(adfNode.attributes)
      .map(([key, value]) => {
        if (typeof value === 'string' && value.includes(' ')) {
          return `${key}="${value}"`;
        }
        return `${key}=${value}`;
      });
    
    openingLine += ' ' + attributePairs.join(' ');
  }
  
  // Build the content
  const content = adfNode.value || '';
  const closingLine = fence;
  
  // Combine all parts
  const result = [openingLine, content, closingLine].join('\n');
  
  return result;
};

/**
 * Extension for serializing ADF fence blocks to markdown
 */
export function adfToMarkdown(): ToMarkdownExtension {
  return {
    handlers: {
      adfFence: adfFenceHandler
    },
    unsafe: [
      {
        character: '~',
        inConstruct: 'phrasing'
      }
    ],
    fences: true,
    tightDefinitions: true
  };
}