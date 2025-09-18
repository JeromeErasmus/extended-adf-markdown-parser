/**
 * @file Media group node converter
 */

import type { NodeConverter, ConversionContext } from '../../types';
import type { ADFNode } from '../../../types';

/**
 * Media Group Node Converter
 * 
 * Purpose:
 * Media group nodes contain multiple media items displayed together
 * 
 * Markdown Representation:
 * ```markdown
 * ![Image 1](url1) ![Image 2](url2)
 * ```
 */
export class MediaGroupConverter implements NodeConverter {
  nodeType = 'mediaGroup';

  toMarkdown(node: ADFNode, context: ConversionContext): string {
    const content = node.content || [];
    
    // Convert all media children
    const mediaItems = content.map(childNode => {
      // Use the registry to convert child nodes
      const converter = context.options.registry?.getNodeConverter(childNode.type);
      if (converter) {
        return converter.toMarkdown(childNode, context);
      }
      return '';
    }).filter(item => item.length > 0);
    
    // Join media items on the same line (gallery style)
    return mediaItems.join(' ') + '\n\n';
  }
}