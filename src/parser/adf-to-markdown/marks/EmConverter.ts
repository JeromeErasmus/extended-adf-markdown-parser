/**
 * @file Em mark converter
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/marks/em/
 */

import type { MarkConverter, ConversionContext } from '../../types';

/**
 * Em Mark Converter
 * 
 * Official Documentation:
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/marks/em/
 * 
 * Purpose:
 * Em marks make text italic/emphasized
 * 
 * ADF Schema:
 * ```json
 * {
 *   "type": "em"
 * }
 * ```
 * 
 * Markdown Representation:
 * ```markdown
 * *italic text*
 * ```
 */
export class EmConverter implements MarkConverter {
  markType = 'em';

  toMarkdown(text: string, mark: any, context: ConversionContext): string {
    // Add metadata if mark has custom attributes
    if (mark.attrs && Object.keys(mark.attrs).length > 0) {
      return `*${text}*<!-- adf:em attrs='${JSON.stringify(mark.attrs)}' -->`;
    }
    
    return `*${text}*`;
  }
}