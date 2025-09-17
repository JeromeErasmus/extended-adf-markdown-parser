/**
 * @file Paragraph node converter
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/nodes/paragraph/
 */

import type { NodeConverter, ConversionContext } from '../../types';
import type { ADFNode, ParagraphNode } from '../../../types';

/**
 * Paragraph Node Converter
 * 
 * Official Documentation:
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/nodes/paragraph/
 * 
 * Purpose:
 * Paragraph nodes contain text content and inline elements
 * 
 * ADF Schema:
 * ```json
 * {
 *   "type": "paragraph",
 *   "content": [
 *     { "type": "text", "text": "Hello World" }
 *   ]
 * }
 * ```
 * 
 * Markdown Representation:
 * ```markdown
 * Hello World
 * ```
 */
export class ParagraphConverter implements NodeConverter {
  nodeType = 'paragraph';

  toMarkdown(node: ADFNode, context: ConversionContext): string {
    const paragraphNode = node as ParagraphNode;
    
    if (!paragraphNode.content || paragraphNode.content.length === 0) {
      return '';
    }

    const content = context.convertChildren(paragraphNode.content);
    
    // Add metadata if paragraph has custom attributes
    if (paragraphNode.attrs && Object.keys(paragraphNode.attrs).length > 0) {
      // Safe JSON stringify to handle circular references
      const safeStringify = (obj: any): string => {
        try {
          return JSON.stringify(obj, (key, value) => {
            if (typeof value === 'object' && value !== null) {
              // Detect circular reference by checking if object already exists
              if (JSON.stringify(value).includes('"self"')) {
                return '[Circular]';
              }
            }
            return value;
          });
        } catch (error) {
          return '[Complex Object]';
        }
      };
      
      return `${content} <!-- adf:paragraph attrs='${safeStringify(paragraphNode.attrs)}' -->`;
    }
    
    return content;
  }
}