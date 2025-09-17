/**
 * @file Underline mark converter
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/marks/underline/
 */

import type { MarkConverter, ConversionContext } from '../../types';
import type { UnderlineMark } from '../../../types';

/**
 * Underline Mark Converter
 * 
 * Official Documentation:
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/marks/underline/
 * 
 * Purpose:
 * Underline marks add underlined formatting to text
 * 
 * Note: Standard Markdown doesn't support underline natively, 
 * so we use HTML <u> tags for compatibility
 * 
 * ADF Schema:
 * ```json
 * {
 *   "type": "underline"
 * }
 * ```
 * 
 * Markdown Representation:
 * ```markdown
 * <u>underlined text</u>
 * ```
 */
export class UnderlineConverter implements MarkConverter {
  markType = 'underline';

  toMarkdown(text: string, mark: any, context: ConversionContext): string {
    const underlineMark = mark as UnderlineMark;
    
    // Use HTML <u> tags since Markdown doesn't have native underline
    const result = `<u>${text}</u>`;
    
    // Add metadata if mark has custom attributes
    if (underlineMark.attrs && Object.keys(underlineMark.attrs).length > 0) {
      return `${result}<!-- adf:underline attrs='${JSON.stringify(underlineMark.attrs)}' -->`;
    }
    
    return result;
  }
}