/**
 * @file Strong mark converter
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/marks/strong/
 */

import type { MarkConverter, ConversionContext } from '../../types';

/**
 * Strong Mark Converter
 * 
 * Official Documentation:
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/marks/strong/
 * 
 * Purpose:
 * Strong marks make text bold/emphasized
 * 
 * ADF Schema:
 * ```json
 * {
 *   "type": "strong"
 * }
 * ```
 * 
 * Markdown Representation:
 * ```markdown
 * **bold text**
 * ```
 */
export class StrongConverter implements MarkConverter {
  markType = 'strong';

  toMarkdown(text: string, mark: any, context: ConversionContext): string {
    // Add metadata if mark has custom attributes
    if (mark.attrs && Object.keys(mark.attrs).length > 0) {
      return `**${text}**<!-- adf:strong attrs='${JSON.stringify(mark.attrs)}' -->`;
    }
    
    return `**${text}**`;
  }
}