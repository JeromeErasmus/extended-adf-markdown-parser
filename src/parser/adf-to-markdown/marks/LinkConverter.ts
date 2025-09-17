/**
 * @file Link mark converter
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/marks/link/
 */

import type { MarkConverter, ConversionContext } from '../../types';
import type { LinkMark } from '../../../types';

/**
 * Link Mark Converter
 * 
 * Official Documentation:
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/marks/link/
 * 
 * Purpose:
 * Link marks create hyperlinks with href and optional title attributes
 * 
 * ADF Schema:
 * ```json
 * {
 *   "type": "link",
 *   "attrs": {
 *     "href": "https://example.com",
 *     "title": "Example Link"
 *   }
 * }
 * ```
 * 
 * Markdown Representation:
 * ```markdown
 * [link text](https://example.com "Example Link")
 * ```
 */
export class LinkConverter implements MarkConverter {
  markType = 'link';

  toMarkdown(text: string, mark: any, context: ConversionContext): string {
    const linkMark = mark as LinkMark;
    
    if (!linkMark.attrs?.href) {
      // Fallback for invalid link - just return text
      return text;
    }

    const { href, title, ...customAttrs } = linkMark.attrs;
    
    // Build markdown link
    let result: string;
    if (title) {
      result = `[${text}](${href} "${title}")`;
    } else {
      result = `[${text}](${href})`;
    }
    
    // Add metadata for custom attributes
    if (Object.keys(customAttrs).length > 0) {
      result += `<!-- adf:link attrs='${JSON.stringify(customAttrs)}' -->`;
    }
    
    return result;
  }
}