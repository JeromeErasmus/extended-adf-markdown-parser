/**
 * @file Date node converter
 */

import type { NodeConverter, ConversionContext } from '../../types';
import type { ADFNode } from '../../../types';

/**
 * Date Node Converter
 * 
 * Purpose:
 * Date nodes represent date/time values in content
 * 
 * Markdown Representation:
 * ```markdown
 * 2023-12-25<!-- adf:date attrs='{"timestamp":"1703462400000"}' -->
 * ```
 */
export class DateConverter implements NodeConverter {
  nodeType = 'date';

  toMarkdown(node: ADFNode, context: ConversionContext): string {
    const { timestamp } = node.attrs || {};
    
    if (!timestamp) {
      return '[Date]';
    }
    
    // Convert timestamp to readable date
    const date = new Date(parseInt(timestamp));
    
    // Handle invalid dates
    if (isNaN(date.getTime())) {
      if (node.attrs && Object.keys(node.attrs).length > 0) {
        const metadata = `<!-- adf:date attrs='${JSON.stringify(node.attrs)}' -->`;
        return `[Invalid Date]${metadata}`;
      }
      return `[Invalid Date]`;
    }
    
    // Format as YYYY-MM-DD
    const dateString = date.toISOString().split('T')[0];
    
    // Add metadata comment to preserve attributes for round-trip conversion
    if (node.attrs && Object.keys(node.attrs).length > 0) {
      const metadata = `<!-- adf:date attrs='${JSON.stringify(node.attrs)}' -->`;
      return `${dateString}${metadata}`;
    }
    
    return dateString;
  }
}