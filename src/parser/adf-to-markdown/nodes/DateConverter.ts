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
 * [2023-12-25](adf://date/1703462400000)<!-- adf:date attrs='{"timestamp":"1703462400000"}' -->
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
      const dateUrl = `adf://date/${timestamp}`;
      if (node.attrs && Object.keys(node.attrs).length > 0) {
        const metadata = `<!-- adf:date attrs='${JSON.stringify(node.attrs)}' -->`;
        return `[Invalid Date](${dateUrl})${metadata}`;
      }
      return `[Invalid Date](${dateUrl})`;
    }
    
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Use placeholder URL scheme for dates
    const dateUrl = `adf://date/${timestamp}`;
    
    // Add metadata comment to preserve attributes if needed
    if (node.attrs && Object.keys(node.attrs).length > 0) {
      const metadata = `<!-- adf:date attrs='${JSON.stringify(node.attrs)}' -->`;
      return `[${dateString}](${dateUrl})${metadata}`;
    }
    
    return `[${dateString}](${dateUrl})`;
  }
}