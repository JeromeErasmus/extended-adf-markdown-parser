/**
 * @file Text node converter
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/nodes/text/
 */

import type { NodeConverter, ConversionContext } from '../../types';
import type { ADFNode, TextNode } from '../../../types';

/**
 * Text Node Converter
 * 
 * Official Documentation:
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/nodes/text/
 * 
 * Purpose:
 * Text nodes contain the actual text content and formatting marks
 * 
 * ADF Schema:
 * ```json
 * {
 *   "type": "text",
 *   "text": "Hello World",
 *   "marks": [
 *     { "type": "strong" },
 *     { "type": "em" }
 *   ]
 * }
 * ```
 * 
 * Markdown Representation:
 * ```markdown
 * ***Hello World***
 * ```
 */
export class TextConverter implements NodeConverter {
  nodeType = 'text';

  toMarkdown(node: ADFNode, context: ConversionContext): string {
    const textNode = node as TextNode;
    let text = textNode.text || '';
    
    if (!textNode.marks || textNode.marks.length === 0) {
      return text;
    }

    // Apply marks in order
    for (const mark of textNode.marks) {
      const markConverter = context.options.registry?.getMarkConverter(mark.type);
      if (markConverter) {
        text = markConverter.toMarkdown(text, mark, context);
      }
    }

    return text;
  }
}