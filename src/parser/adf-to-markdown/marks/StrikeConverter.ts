/**
 * @file Strike mark converter
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/marks/strike/
 */

import type { MarkConverter, ConversionContext } from '../../types';
import type { StrikeMark } from '../../../types';

/**
 * Strike Mark Converter
 * 
 * Official Documentation:
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/marks/strike/
 * 
 * Purpose:
 * Strike marks add strikethrough formatting to text
 * 
 * ADF Schema:
 * ```json
 * {
 *   "type": "strike"
 * }
 * ```
 * 
 * Markdown Representation:
 * ```markdown
 * ~~strikethrough text~~
 * ```
 */
export class StrikeConverter implements MarkConverter {
  markType = 'strike';

  toMarkdown(text: string, mark: any, context: ConversionContext): string {
    const strikeMark = mark as StrikeMark;
    
    // Add metadata if mark has custom attributes
    if (strikeMark.attrs && Object.keys(strikeMark.attrs).length > 0) {
      return `~~${text}~~<!-- adf:strike attrs='${JSON.stringify(strikeMark.attrs)}' -->`;
    }
    
    return `~~${text}~~`;
  }
}