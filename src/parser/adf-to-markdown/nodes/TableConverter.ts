/**
 * @file Table node converter
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/nodes/table/
 */

import type { NodeConverter, ConversionContext } from '../../types';
import type { ADFNode, TableNode } from '../../../types';

/**
 * Table Node Converter
 * 
 * Official Documentation:
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/nodes/table/
 * 
 * Purpose:
 * Table nodes create structured data tables with rows, headers, and cells
 * 
 * ADF Schema:
 * ```json
 * {
 *   "type": "table",
 *   "attrs": {
 *     "isNumberColumnEnabled": false,
 *     "layout": "default"
 *   },
 *   "content": [
 *     {
 *       "type": "tableRow",
 *       "content": [
 *         { "type": "tableHeader", "content": [...] },
 *         { "type": "tableCell", "content": [...] }
 *       ]
 *     }
 *   ]
 * }
 * ```
 * 
 * Markdown Representation:
 * ```markdown
 * | Header 1 | Header 2 |
 * |----------|----------|
 * | Cell 1   | Cell 2   |
 * ```
 */
export class TableConverter implements NodeConverter {
  nodeType = 'table';

  toMarkdown(node: ADFNode, context: ConversionContext): string {
    const tableNode = node as TableNode;
    
    if (!tableNode.content || tableNode.content.length === 0) {
      return '';
    }

    // Convert all table rows
    const rows = tableNode.content.map(rowNode => {
      const rowConverter = context.options.registry?.getNodeConverter('tableRow');
      if (rowConverter) {
        return rowConverter.toMarkdown(rowNode, { 
          ...context, 
          depth: context.depth + 1,
          parent: tableNode 
        });
      }
      return '';
    }).filter(row => row.length > 0);

    if (rows.length === 0) {
      return '';
    }

    // Check if first row contains headers
    const firstRow = tableNode.content[0];
    const hasHeaders = firstRow.content?.some(cell => cell.type === 'tableHeader');
    
    let result = rows.join('\n');
    
    // Add separator row after headers if we have headers
    if (hasHeaders && rows.length > 0) {
      // Calculate actual column count based on ADF structure, not markdown output
      let actualColumnCount = 0;
      const firstRow = tableNode.content[0]; // First row should be headers
      if (firstRow && firstRow.content) {
        actualColumnCount = firstRow.content.reduce((total: number, cell: any) => {
          const colspan = cell.attrs?.colspan || 1;
          return total + colspan;
        }, 0);
      }
      
      // Fallback to counting pipes if ADF analysis fails
      if (actualColumnCount === 0) {
        actualColumnCount = (rows[0].match(/\|/g) || []).length - 1;
      }
      
      const separator = '|' + ' -------- |'.repeat(Math.max(1, actualColumnCount));
      result = `${rows[0]}\n${separator}${rows.slice(1).length > 0 ? '\n' + rows.slice(1).join('\n') : ''}`;
    }
    
    // Add metadata for custom attributes (excluding default values)
    const customAttrs = { ...tableNode.attrs };
    
    // Remove default values that shouldn't show in metadata
    if ((customAttrs as any).isNumberColumnEnabled === false) {
      delete (customAttrs as any).isNumberColumnEnabled;
    }
    if ((customAttrs as any).layout === 'default') {
      delete (customAttrs as any).layout;
    }
    
    if (Object.keys(customAttrs).length > 0) {
      result += `\n<!-- adf:table attrs='${JSON.stringify(customAttrs)}' -->`;
    }
    
    return result;
  }
}