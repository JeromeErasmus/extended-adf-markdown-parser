/**
 * @file RuleConverter.ts
 * @description Converts ADF rule nodes to horizontal rules in Extended Markdown
 */

import type { NodeConverter, ConversionContext } from '../../types';
import type { ADFNode } from '../../../types';

/**
 * Converts ADF rule nodes to horizontal rules (---) in markdown
 */
export class RuleConverter implements NodeConverter {
  nodeType = 'rule';

  toMarkdown(node: ADFNode, context: ConversionContext): string {
    // Convert to horizontal rule
    return '---';
  }
}