/**
 * @file Code mark converter
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/marks/code/
 */

import type { MarkConverter, ConversionContext } from '../../types';

/**
 * Code Mark Converter
 * 
 * Official Documentation:
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/marks/code/
 * 
 * Purpose:
 * Code marks format text as inline code
 * 
 * ADF Schema:
 * ```json
 * {
 *   "type": "code"
 * }
 * ```
 * 
 * Markdown Representation:
 * ```markdown
 * `inline code`
 * ```
 */
export class CodeConverter implements MarkConverter {
  markType = 'code';

  toMarkdown(text: string, mark: any, context: ConversionContext): string {
    // Add metadata if mark has custom attributes
    if (mark.attrs && Object.keys(mark.attrs).length > 0) {
      return `\`${text}\`<!-- adf:code attrs='${JSON.stringify(mark.attrs)}' -->`;
    }
    
    return `\`${text}\``;
  }
}