/**
 * @file Expand node converter
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/nodes/expand/
 */

import type { NodeConverter, ConversionContext } from '../../types';
import type { ADFNode, ExpandNode } from '../../../types';

/**
 * Expand Node Converter
 * 
 * Official Documentation:
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/nodes/expand/
 * 
 * Purpose:
 * Expand nodes create collapsible content sections with optional titles
 * 
 * ADF Schema:
 * ```json
 * {
 *   "type": "expand",
 *   "attrs": {
 *     "title": "Click to expand"
 *   },
 *   "content": [
 *     {
 *       "type": "paragraph",
 *       "content": [
 *         { "type": "text", "text": "Hidden content here" }
 *       ]
 *     }
 *   ]
 * }
 * ```
 * 
 * Extended Markdown Representation:
 * ```markdown
 * ~~~expand title="Click to expand"
 * Hidden content here
 * ~~~
 * ```
 */
export class ExpandConverter implements NodeConverter {
  nodeType = 'expand';

  toMarkdown(node: ADFNode, context: ConversionContext): string {
    const expandNode = node as ExpandNode;
    
    if (!expandNode.content || expandNode.content.length === 0) {
      // Empty expand with just title
      const title = expandNode.attrs?.title || '';
      return `~~~expand title="${title}"\n\n~~~`;
    }

    const title = expandNode.attrs?.title || '';
    // For expand content, we need block-level spacing between elements
    const content = expandNode.content.map(node => {
      const converter = context.options.registry?.getNodeConverter(node.type);
      if (!converter) return '';
      return converter.toMarkdown(node, context);
    }).filter(content => content.trim().length > 0).join('\n\n');
    
    // Add custom attributes if present (beyond title)
    const customAttrs = { ...expandNode.attrs };
    if ('title' in customAttrs) {
      delete (customAttrs as any).title;
    }
    
    let attributeString = `title="${title}"`;
    if (Object.keys(customAttrs).length > 0) {
      const attrsJson = JSON.stringify(customAttrs);
      attributeString += ` attrs='${attrsJson}'`;
    }
    
    return `~~~expand ${attributeString}\n${content}\n~~~`;
  }
}

/**
 * Nested Expand Node Converter
 * 
 * Purpose:
 * Nested Expand nodes are expand sections within other expand sections
 * Uses the same conversion logic but with different node type
 */
export class NestedExpandConverter implements NodeConverter {
  nodeType = 'nestedExpand';

  toMarkdown(node: ADFNode, context: ConversionContext): string {
    const nestedExpandNode = node as ExpandNode;
    
    if (!nestedExpandNode.content || nestedExpandNode.content.length === 0) {
      const title = nestedExpandNode.attrs?.title || '';
      return `~~~expand title="${title}" nested=true\n\n~~~`;
    }

    const title = nestedExpandNode.attrs?.title || '';
    // For nested expand content, we need block-level spacing between elements
    const content = nestedExpandNode.content.map(node => {
      const converter = context.options.registry?.getNodeConverter(node.type);
      if (!converter) return '';
      return converter.toMarkdown(node, context);
    }).filter(content => content.trim().length > 0).join('\n\n');
    
    // Add custom attributes and nested indicator
    const customAttrs = { ...nestedExpandNode.attrs, nested: true };
    if ('title' in customAttrs) {
      delete (customAttrs as any).title;
    }
    
    let attributeString = `title="${title}"`;
    if (Object.keys(customAttrs).length > 0) {
      const attrsJson = JSON.stringify(customAttrs);
      attributeString += ` attrs='${attrsJson}'`;
    }
    
    return `~~~expand ${attributeString}\n${content}\n~~~`;
  }
}