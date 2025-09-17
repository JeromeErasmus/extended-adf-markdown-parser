/**
 * @file Media node converter
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/nodes/media/
 */

import type { NodeConverter, ConversionContext } from '../../types';
import type { ADFNode, MediaNode } from '../../../types';

/**
 * Media Node Converter
 * 
 * Official Documentation:
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/nodes/media/
 * 
 * Purpose:
 * Media nodes represent images, files, and other media attachments
 * 
 * ADF Schema:
 * ```json
 * {
 *   "type": "media",
 *   "attrs": {
 *     "id": "abc-123-def",
 *     "type": "file",
 *     "collection": "contentId-123",
 *     "width": 400,
 *     "height": 300
 *   }
 * }
 * ```
 * 
 * Extended Markdown Representation:
 * ```markdown
 * ![Media](adf:media:abc-123-def)
 * <!-- adf:media id="abc-123-def" type="file" collection="contentId-123" width="400" height="300" -->
 * ```
 */
export class MediaConverter implements NodeConverter {
  nodeType = 'media';

  toMarkdown(node: ADFNode, context: ConversionContext): string {
    const mediaNode = node as MediaNode;
    
    if (!mediaNode.attrs?.id) {
      return '![Media](adf:media:unknown)';
    }

    const { id, type, collection, width, height, ...customAttrs } = mediaNode.attrs;
    
    // Create media reference in markdown format
    const mediaRef = `![Media](adf:media:${id})`;
    
    // Build attributes object for metadata
    const attrs: Record<string, any> = { id, type };
    if (collection) attrs.collection = collection;
    if (width) attrs.width = width;
    if (height) attrs.height = height;
    
    // Add any custom attributes
    Object.assign(attrs, customAttrs);
    
    // Add metadata comment with all attributes
    const metadata = `<!-- adf:media ${Object.entries(attrs)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ')} -->`;
    
    return `${mediaRef}\n${metadata}`;
  }
}