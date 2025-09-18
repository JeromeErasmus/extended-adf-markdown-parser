/**
 * @file Hard break node converter
 */

import type { NodeConverter, ConversionContext } from '../../types';
import type { ADFNode } from '../../../types';

/**
 * Hard Break Node Converter
 * 
 * Purpose:
 * Hard breaks represent forced line breaks within text content
 * 
 * Markdown Representation:
 * ```markdown
 * Line one  
 * Line two
 * ```
 */
export class HardBreakConverter implements NodeConverter {
  nodeType = 'hardBreak';

  toMarkdown(node: ADFNode, context: ConversionContext): string {
    return '  \n';
  }
}