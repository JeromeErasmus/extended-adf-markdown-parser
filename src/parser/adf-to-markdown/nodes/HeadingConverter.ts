/**
 * @file Heading node converter
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/nodes/heading/
 */

import type { NodeConverter, ConversionContext } from '../../types';
import type { ADFNode, HeadingNode } from '../../../types';

/**
 * Heading Node Converter
 * 
 * Official Documentation:
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/nodes/heading/
 * 
 * Purpose:
 * Heading nodes provide document structure with levels 1-6
 * 
 * ADF Schema:
 * ```json
 * {
 *   "type": "heading",
 *   "attrs": {
 *     "level": 2
 *   },
 *   "content": [
 *     { "type": "text", "text": "Chapter Title" }
 *   ]
 * }
 * ```
 * 
 * Markdown Representation:
 * ```markdown
 * ## Chapter Title
 * ```
 */
export class HeadingConverter implements NodeConverter {
  nodeType = 'heading';

  toMarkdown(node: ADFNode, context: ConversionContext): string {
    const headingNode = node as HeadingNode;
    
    if (!headingNode.content || headingNode.content.length === 0) {
      return '';
    }

    const level = headingNode.attrs?.level || 1;
    const hashes = '#'.repeat(Math.max(1, Math.min(6, level)));
    const content = context.convertChildren(headingNode.content);
    
    // Add metadata if heading has custom attributes beyond level
    const customAttrs = { ...headingNode.attrs };
    if ('level' in customAttrs) {
      delete (customAttrs as any).level;
    }
    
    if (Object.keys(customAttrs).length > 0) {
      return `${hashes} ${content} <!-- adf:heading attrs='${JSON.stringify(customAttrs)}' -->`;
    }
    
    return `${hashes} ${content}`;
  }
}