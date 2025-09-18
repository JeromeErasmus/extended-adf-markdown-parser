/**
 * @file Emoji node converter
 */

import type { NodeConverter, ConversionContext } from '../../types';
import type { ADFNode } from '../../../types';

/**
 * Emoji Node Converter
 * 
 * Purpose:
 * Emoji nodes represent emoji characters in content
 * 
 * Markdown Representation:
 * ```markdown
 * 😀<!-- adf:emoji attrs='{"shortName":"grinning"}' -->
 * :smile:<!-- adf:emoji attrs='{"shortName":"smile"}' -->
 * ```
 */
export class EmojiConverter implements NodeConverter {
  nodeType = 'emoji';

  toMarkdown(node: ADFNode, context: ConversionContext): string {
    const { shortName, id, text } = node.attrs || {};
    
    // If we have the actual emoji text, use it directly
    if (text) {
      if (node.attrs && Object.keys(node.attrs).length > 0) {
        const metadata = `<!-- adf:emoji attrs='${JSON.stringify(node.attrs)}' -->`;
        return `${text}${metadata}`;
      }
      return text;
    }
    
    // Otherwise, use the shortName format (e.g. :smile:)
    if (shortName) {
      const result = `:${shortName}:`;
      if (node.attrs && Object.keys(node.attrs).length > 0) {
        const metadata = `<!-- adf:emoji attrs='${JSON.stringify(node.attrs)}' -->`;
        return `${result}${metadata}`;
      }
      return result;
    }
    
    // Fallback to placeholder
    return ':emoji:';
  }
}