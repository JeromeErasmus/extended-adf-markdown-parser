/**
 * @file Media Single node converter
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/nodes/mediasingle/
 */

import type { NodeConverter, ConversionContext } from '../../types';
import type { ADFNode, MediaSingleNode } from '../../../types';

/**
 * Media Single Node Converter
 * 
 * Official Documentation:
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/nodes/mediasingle/
 * 
 * Purpose:
 * Media Single nodes wrap media elements with layout and sizing information
 * 
 * ADF Schema:
 * ```json
 * {
 *   "type": "mediaSingle",
 *   "attrs": {
 *     "layout": "center",
 *     "width": 80
 *   },
 *   "content": [
 *     {
 *       "type": "media",
 *       "attrs": { "id": "abc-123-def", "type": "file" }
 *     }
 *   ]
 * }
 * ```
 * 
 * Extended Markdown Representation:
 * ```markdown
 * ![Media](adf:media:abc-123-def)
 * <!-- adf:mediaSingle layout="center" width="80" -->
 * ```
 */
export class MediaSingleConverter implements NodeConverter {
  nodeType = 'mediaSingle';

  toMarkdown(node: ADFNode, context: ConversionContext): string {
    const mediaSingleNode = node as MediaSingleNode;
    
    if (!mediaSingleNode.content || mediaSingleNode.content.length === 0) {
      return '';
    }

    // Convert the inner media node
    const mediaContent = context.convertChildren(mediaSingleNode.content);
    
    // Add mediaSingle attributes as metadata
    if (mediaSingleNode.attrs && Object.keys(mediaSingleNode.attrs).length > 0) {
      const attrs = Object.entries(mediaSingleNode.attrs)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');
      
      const metadata = `<!-- adf:mediaSingle ${attrs} -->`;
      return `${mediaContent}\n${metadata}`;
    }
    
    return mediaContent;
  }
}