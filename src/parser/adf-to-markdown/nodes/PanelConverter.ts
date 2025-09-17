/**
 * @file Panel node converter
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/nodes/panel/
 */

import type { NodeConverter, ConversionContext } from '../../types';
import type { ADFNode, PanelNode } from '../../../types';

/**
 * Panel Node Converter
 * 
 * Official Documentation:
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/nodes/panel/
 * 
 * Purpose:
 * Panel nodes provide visual containers with colored backgrounds for different types of information
 * 
 * ADF Schema:
 * ```json
 * {
 *   "type": "panel",
 *   "attrs": {
 *     "panelType": "info"
 *   },
 *   "content": [
 *     { "type": "paragraph", "content": [...] }
 *   ]
 * }
 * ```
 * 
 * Extended Markdown Representation:
 * ```markdown
 * ~~~panel type=info
 * This is an info panel with content.
 * ~~~
 * ```
 */
export class PanelConverter implements NodeConverter {
  nodeType = 'panel';

  toMarkdown(node: ADFNode, context: ConversionContext): string {
    const panelNode = node as PanelNode;
    
    if (!panelNode.content || panelNode.content.length === 0) {
      return '';
    }

    const panelType = panelNode.attrs?.panelType || 'info';
    const content = context.convertChildren(panelNode.content);
    
    // Add custom attributes if present (beyond panelType)
    const customAttrs = { ...panelNode.attrs };
    if ('panelType' in customAttrs) {
      delete (customAttrs as any).panelType;
    }
    
    let attributeString = `type=${panelType}`;
    if (Object.keys(customAttrs).length > 0) {
      const attrsJson = JSON.stringify(customAttrs);
      attributeString += ` attrs='${attrsJson}'`;
    }
    
    return `~~~panel ${attributeString}\n${content}\n~~~`;
  }
}