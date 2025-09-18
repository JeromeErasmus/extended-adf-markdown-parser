/**
 * @file Subsup mark converter
 */

import type { MarkConverter, ConversionContext } from '../../types';

/**
 * Subsup Mark Converter
 * 
 * Purpose:
 * Subsup marks add subscript or superscript formatting to text
 * 
 * Markdown Representation:
 * ```markdown
 * H<sub>2</sub>O<!-- adf:subsup attrs='{"type":"sub"}' -->
 * E=mc<sup>2</sup><!-- adf:subsup attrs='{"type":"sup"}' -->
 * ```
 */
export class SubsupConverter implements MarkConverter {
  markType = 'subsup';

  toMarkdown(text: string, mark: any, context: ConversionContext): string {
    const { type } = mark.attrs || {};
    
    let result: string;
    
    // Use HTML sub/sup tags
    if (type === 'sub') {
      result = `<sub>${text}</sub>`;
    } else if (type === 'sup') {
      result = `<sup>${text}</sup>`;
    } else {
      // Default to superscript if type is unclear
      result = `<sup>${text}</sup>`;
    }
    
    // Add metadata comment to preserve subsup attributes if needed
    if (mark.attrs && Object.keys(mark.attrs).length > 0) {
      const metadata = `<!-- adf:subsup attrs='${JSON.stringify(mark.attrs)}' -->`;
      return `${result}${metadata}`;
    }
    
    return result;
  }
}