/**
 * @file Mention node converter
 */

import type { NodeConverter, ConversionContext } from '../../types';
import type { ADFNode } from '../../../types';

/**
 * Mention Node Converter
 * 
 * Purpose:
 * Mention nodes represent user mentions in content
 * 
 * Markdown Representation:
 * ```markdown
 * [@username](adf://mention/user123)<!-- adf:mention attrs='{"id":"user123"}' -->
 * ```
 */
export class MentionConverter implements NodeConverter {
  nodeType = 'mention';

  toMarkdown(node: ADFNode, context: ConversionContext): string {
    const { id, text, userType } = node.attrs || {};
    
    // Use placeholder URL scheme for mentions
    const mentionUrl = `adf://mention/${id || 'unknown'}`;
    const displayText = text || `@${id || 'unknown'}`;
    
    // Add metadata comment to preserve attributes if needed
    if (node.attrs && Object.keys(node.attrs).length > 0) {
      const metadata = `<!-- adf:mention attrs='${JSON.stringify(node.attrs)}' -->`;
      return `[${displayText}](${mentionUrl})${metadata}`;
    }
    
    return `[${displayText}](${mentionUrl})`;
  }
}