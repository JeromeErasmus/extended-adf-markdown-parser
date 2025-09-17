/**
 * @file Table Row node converter
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/nodes/tablerow/
 */

import type { NodeConverter, ConversionContext } from '../../types';
import type { ADFNode, TableRowNode } from '../../../types';

/**
 * Table Row Node Converter
 * 
 * Official Documentation:
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/nodes/tablerow/
 * 
 * Purpose:
 * Table Row nodes contain table headers and cells in a horizontal row
 * 
 * ADF Schema:
 * ```json
 * {
 *   "type": "tableRow",
 *   "content": [
 *     {
 *       "type": "tableHeader",
 *       "content": [
 *         { "type": "paragraph", "content": [...] }
 *       ]
 *     },
 *     {
 *       "type": "tableCell",
 *       "content": [
 *         { "type": "paragraph", "content": [...] }
 *       ]
 *     }
 *   ]
 * }
 * ```
 * 
 * Markdown Representation:
 * ```markdown
 * | Header | Cell |
 * ```
 */
export class TableRowConverter implements NodeConverter {
  nodeType = 'tableRow';

  toMarkdown(node: ADFNode, context: ConversionContext): string {
    const tableRowNode = node as TableRowNode;
    
    if (!tableRowNode.content || tableRowNode.content.length === 0) {
      return '|  |';
    }

    // Convert each cell/header in the row
    const cells = tableRowNode.content.map(cellNode => {
      const cellConverter = context.options.registry?.getNodeConverter(cellNode.type);
      if (cellConverter) {
        return cellConverter.toMarkdown(cellNode, { 
          ...context, 
          depth: context.depth + 1,
          parent: tableRowNode 
        });
      }
      return '';
    });

    // Build markdown table row with proper cell separation
    const row = '| ' + cells.join(' | ') + ' |';
    
    // Add metadata for custom attributes if present
    if (tableRowNode.attrs && Object.keys(tableRowNode.attrs).length > 0) {
      return `${row}<!-- adf:tableRow attrs='${JSON.stringify(tableRowNode.attrs)}' -->`;
    }
    
    return row;
  }
}