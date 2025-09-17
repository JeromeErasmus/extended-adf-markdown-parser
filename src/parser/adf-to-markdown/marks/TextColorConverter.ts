/**
 * @file Text Color mark converter
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/marks/textcolor/
 */

import type { MarkConverter, ConversionContext } from '../../types';
import type { TextColorMark } from '../../../types';

/**
 * Text Color Mark Converter
 * 
 * Official Documentation:
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/marks/textcolor/
 * 
 * Purpose:
 * Text Color marks apply color styling to text content
 * 
 * Note: Standard Markdown doesn't support text colors natively,
 * so we use HTML <span> tags with style attributes
 * 
 * ADF Schema:
 * ```json
 * {
 *   "type": "textColor",
 *   "attrs": {
 *     "color": "#ff5630"
 *   }
 * }
 * ```
 * 
 * Markdown Representation:
 * ```markdown
 * <span style="color: #ff5630">colored text</span>
 * ```
 */
export class TextColorConverter implements MarkConverter {
  markType = 'textColor';

  toMarkdown(text: string, mark: any, context: ConversionContext): string {
    const textColorMark = mark as TextColorMark;
    
    if (!textColorMark.attrs?.color) {
      // Fallback if no color specified
      return text;
    }

    const { color, ...customAttrs } = textColorMark.attrs;
    
    // Use HTML span with style for color
    let result = `<span style="color: ${color}">${text}</span>`;
    
    // Add metadata for custom attributes beyond color
    if (Object.keys(customAttrs).length > 0) {
      result += `<!-- adf:textColor attrs='${JSON.stringify(customAttrs)}' -->`;
    }
    
    return result;
  }
}