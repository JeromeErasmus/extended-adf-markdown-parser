/**
 * @file Status node converter
 */

import type { NodeConverter, ConversionContext } from '../../types';
import type { ADFNode } from '../../../types';

/**
 * Status Node Converter
 * 
 * Purpose:
 * Status nodes represent status badges/labels in content
 * 
 * Markdown Representation:
 * ```markdown
 * `In Progress`<!-- adf:status attrs='{"text":"In Progress","color":"blue"}' -->
 * ```
 */
export class StatusConverter implements NodeConverter {
  nodeType = 'status';

  toMarkdown(node: ADFNode, context: ConversionContext): string {
    const { text, color, localId, style } = node.attrs || {};
    
    // Use a badge-like format for status
    const statusText = text || 'Status';
    const result = `\`${statusText}\``;
    
    // Add metadata comment to preserve attributes if needed
    if (node.attrs && Object.keys(node.attrs).length > 0) {
      const metadata = `<!-- adf:status attrs='${JSON.stringify(node.attrs)}' -->`;
      return `${result}${metadata}`;
    }
    
    return result;
  }
}