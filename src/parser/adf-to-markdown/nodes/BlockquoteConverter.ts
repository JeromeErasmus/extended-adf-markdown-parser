/**
 * @file Blockquote node converter
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/nodes/blockquote/
 */

import type { NodeConverter, ConversionContext } from '../../types';
import type { ADFNode, BlockquoteNode } from '../../../types';

/**
 * Blockquote Node Converter
 * 
 * Official Documentation:
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/nodes/blockquote/
 * 
 * Purpose:
 * Blockquote nodes create quoted text sections with indented styling
 * 
 * ADF Schema:
 * ```json
 * {
 *   "type": "blockquote",
 *   "content": [
 *     {
 *       "type": "paragraph",
 *       "content": [
 *         { "type": "text", "text": "This is a quote" }
 *       ]
 *     }
 *   ]
 * }
 * ```
 * 
 * Markdown Representation:
 * ```markdown
 * > This is a quote
 * ```
 */
export class BlockquoteConverter implements NodeConverter {
  nodeType = 'blockquote';

  toMarkdown(node: ADFNode, context: ConversionContext): string {
    const blockquoteNode = node as BlockquoteNode;
    
    if (!blockquoteNode.content || blockquoteNode.content.length === 0) {
      return '> ';
    }

    // Convert content - add line breaks between paragraphs
    const content = blockquoteNode.content.map(childNode => {
      const converter = context.options.registry?.getNodeConverter(childNode.type);
      if (converter) {
        return converter.toMarkdown(childNode, { 
          ...context, 
          depth: context.depth + 1,
          parent: blockquoteNode 
        });
      }
      return '';
    }).join('\n');
    
    // Split content into lines and prefix each with ">"
    const lines = content.split('\n');
    const quotedLines = lines.map(line => {
      // Handle empty lines in blockquotes
      if (line.trim() === '') {
        return '>';
      }
      // Prefix non-empty lines with "> "
      return `> ${line}`;
    });
    
    // Add metadata for custom attributes if present
    if (blockquoteNode.attrs && Object.keys(blockquoteNode.attrs).length > 0) {
      const result = quotedLines.join('\n');
      return `${result}<!-- adf:blockquote attrs='${JSON.stringify(blockquoteNode.attrs)}' -->`;
    }
    
    return quotedLines.join('\n');
  }
}