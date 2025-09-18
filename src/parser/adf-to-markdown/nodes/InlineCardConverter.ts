/**
 * @file Inline card node converter
 */

import type { NodeConverter, ConversionContext } from '../../types';
import type { ADFNode } from '../../../types';

/**
 * Inline Card Node Converter
 * 
 * Purpose:
 * Inline card nodes represent embedded content links
 * 
 * Markdown Representation:
 * ```markdown
 * [Card Title](adf://card/https%3A%2F%2Fexample.com)<!-- adf:inlineCard attrs='{"url":"https://example.com"}' -->
 * ```
 */
export class InlineCardConverter implements NodeConverter {
  nodeType = 'inlineCard';

  toMarkdown(node: ADFNode, context: ConversionContext): string {
    const { url, data } = node.attrs || {};
    
    if (!url) {
      return '[Card]';
    }
    
    // Try to get title from data
    const title = data?.title || data?.name || 'Card';
    
    // Use placeholder URL scheme for cards
    const cardUrl = `adf://card/${encodeURIComponent(url)}`;
    
    // Add metadata comment to preserve card attributes if needed
    if (node.attrs && Object.keys(node.attrs).length > 0) {
      const metadata = `<!-- adf:inlineCard attrs='${JSON.stringify(node.attrs)}' -->`;
      return `[${title}](${cardUrl})${metadata}`;
    }
    
    return `[${title}](${cardUrl})`;
  }
}