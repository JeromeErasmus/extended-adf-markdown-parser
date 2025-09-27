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
    const { text, color } = node.attrs || {};
    
    const statusText = text || 'Status';
    
    // Use the new inline syntax for round-trip compatibility
    if (color && color !== 'neutral') {
      return `{status:${statusText}|color:${color}}`;
    } else {
      // For neutral color (default), use simple syntax
      return `{status:${statusText}}`;
    }
  }
}