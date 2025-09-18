/**
 * @file Background color mark converter
 */

import type { MarkConverter, ConversionContext } from '../../types';

/**
 * Background Color Mark Converter
 * 
 * Purpose:
 * Background color marks add background color highlighting to text
 * 
 * Markdown Representation:
 * ```markdown
 * <mark style="background-color: yellow">highlighted text</mark><!-- adf:backgroundColor attrs='{"color":"yellow"}' -->
 * ```
 */
export class BackgroundColorConverter implements MarkConverter {
  markType = 'backgroundColor';

  toMarkdown(text: string, mark: any, context: ConversionContext): string {
    const { color } = mark.attrs || {};
    
    const result = `<mark style="background-color: ${color || 'yellow'}">${text}</mark>`;
    
    // Add metadata comment to preserve background color attributes if needed
    if (mark.attrs && Object.keys(mark.attrs).length > 0) {
      const metadata = `<!-- adf:backgroundColor attrs='${JSON.stringify(mark.attrs)}' -->`;
      return `${result}${metadata}`;
    }
    
    return result;
  }
}