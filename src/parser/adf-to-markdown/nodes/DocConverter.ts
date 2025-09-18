/**
 * @file Document node converter
 */

import type { NodeConverter, ConversionContext } from '../../types';
import type { ADFNode } from '../../../types';

/**
 * Document Node Converter
 * 
 * Purpose:
 * Document nodes are the root container for all ADF content
 * 
 * Markdown Representation:
 * The document itself doesn't have a direct markdown representation,
 * but its contents are converted to markdown blocks
 */
export class DocConverter implements NodeConverter {
  nodeType = 'doc';

  toMarkdown(node: ADFNode, context: ConversionContext): string {
    const content = node.content || [];
    
    // Use the convertChildren helper from context
    const children = context.convertChildren(content);
    
    // Return with appropriate spacing
    return children.trim() + '\n';
  }
}