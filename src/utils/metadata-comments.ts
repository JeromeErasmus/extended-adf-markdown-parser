/**
 * @file metadata-comments.ts
 * @description Utilities for parsing and processing ADF metadata comments in markdown
 */

import type { Node, Parent, Root } from 'mdast';
import { visit } from 'unist-util-visit';

/**
 * Interface for parsed ADF metadata from comments
 */
export interface AdfMetadata {
  nodeType: string;
  attrs?: Record<string, any>;
  raw: string;
}

/**
 * Regular expression patterns for different metadata comment formats
 */
const METADATA_PATTERNS = {
  // <!-- adf:paragraph attrs='{"textAlign":"center"}' -->
  withAttrs: /^<!--\s*adf:([a-zA-Z][a-zA-Z0-9]*)\s+attrs='({.*?})'\s*-->$/,
  
  // <!-- adf:paragraph -->
  simple: /^<!--\s*adf:([a-zA-Z][a-zA-Z0-9]*)\s*-->$/,
  
  // <!-- /adf:paragraph -->
  closing: /^<!--\s*\/adf:([a-zA-Z][a-zA-Z0-9]*)\s*-->$/
};

/**
 * Check if a string is an ADF metadata comment
 */
export function isAdfMetadataComment(value: string): boolean {
  return METADATA_PATTERNS.withAttrs.test(value) || 
         METADATA_PATTERNS.simple.test(value) ||
         METADATA_PATTERNS.closing.test(value);
}

/**
 * Parse ADF metadata from a comment string
 */
export function parseAdfMetadataComment(value: string): AdfMetadata | null {
  // Try with attributes pattern first
  let match = METADATA_PATTERNS.withAttrs.exec(value);
  if (match) {
    const [, nodeType, attrsJson] = match;
    try {
      const attrs = JSON.parse(attrsJson);
      return {
        nodeType,
        attrs,
        raw: value
      };
    } catch (error) {
      // Invalid JSON in attributes, return simple metadata
      return {
        nodeType,
        raw: value
      };
    }
  }

  // Try simple pattern
  match = METADATA_PATTERNS.simple.exec(value);
  if (match) {
    const [, nodeType] = match;
    return {
      nodeType,
      raw: value
    };
  }

  // Try closing pattern (for now we ignore closing tags)
  match = METADATA_PATTERNS.closing.exec(value);
  if (match) {
    const [, nodeType] = match;
    return {
      nodeType,
      attrs: { closing: true },
      raw: value
    };
  }

  return null;
}

/**
 * Find the target node that a metadata comment should be associated with
 */
export function findMetadataTarget(parent: Parent, commentIndex: number): Node | null {
  // Strategy 1: Next sibling that's not an HTML comment (most common case - comments come before content)
  for (let i = commentIndex + 1; i < parent.children.length; i++) {
    const candidate = parent.children[i];
    if (candidate.type !== 'html' || !isAdfMetadataComment((candidate as any).value)) {
      return candidate;
    }
  }
  
  // Strategy 2: Previous sibling that's not an HTML comment (fallback for trailing comments)
  for (let i = commentIndex - 1; i >= 0; i--) {
    const candidate = parent.children[i];
    if (candidate.type !== 'html' || !isAdfMetadataComment((candidate as any).value)) {
      return candidate;
    }
  }
  
  // Strategy 3: Parent node (for block-level metadata)
  if (parent.type !== 'root') {
    return parent as Node;
  }
  
  return null;
}

/**
 * Process metadata comments in an mdast tree
 * Associates comments with target nodes and removes the comment nodes
 */
export function processMetadataComments(tree: Root): Root {
  const processedTree = JSON.parse(JSON.stringify(tree)) as Root;
  const toRemove: { parent: Parent; index: number }[] = [];

  visit(processedTree, (node, index, parent) => {
    // Look for HTML comment nodes
    if (node.type === 'html' && typeof node.value === 'string' && isAdfMetadataComment(node.value)) {
      const metadata = parseAdfMetadataComment(node.value);
      
      if (metadata && parent && typeof index === 'number') {
        // Find the target node
        const targetNode = findMetadataTarget(parent, index);
        
        if (targetNode) {
          // Attach metadata to the target node
          if (!targetNode.data) {
            targetNode.data = {};
          }
          
          // Store metadata for later use
          if (!targetNode.data.adfMetadata) {
            targetNode.data.adfMetadata = [];
          }
          
          (targetNode.data.adfMetadata as AdfMetadata[]).push(metadata);
          
          // Mark comment node for removal
          toRemove.push({ parent, index });
        }
      }
    }
  });

  // Remove processed comment nodes (in reverse order to maintain indices)
  toRemove.reverse().forEach(({ parent, index }) => {
    parent.children.splice(index, 1);
  });

  return processedTree;
}

/**
 * Extract ADF metadata from a node's data property
 */
export function getNodeMetadata(node: Node): AdfMetadata[] {
  if (!node.data || !node.data.adfMetadata) {
    return [];
  }
  
  return Array.isArray(node.data.adfMetadata) ? node.data.adfMetadata : [node.data.adfMetadata];
}

/**
 * Apply metadata to an ADF node during conversion
 */
export function applyMetadataToAdfNode(adfNode: any, metadata: AdfMetadata[]): any {
  if (metadata.length === 0) {
    return adfNode;
  }

  // Apply attributes from metadata
  let updatedNode = { ...adfNode };
  
  for (const meta of metadata) {
    if (meta.attrs) {
      // Merge attributes, giving priority to metadata
      updatedNode.attrs = { ...updatedNode.attrs, ...meta.attrs };
    }
  }

  return updatedNode;
}

/**
 * Generate metadata comment for ADF node with custom attributes
 */
export function generateMetadataComment(nodeType: string, attrs?: Record<string, any>): string {
  if (!attrs || Object.keys(attrs).length === 0) {
    return '';
  }

  // Filter out standard attributes that are already in the node
  const customAttrs = filterCustomAttributes(nodeType, attrs);
  
  if (Object.keys(customAttrs).length === 0) {
    return '';
  }

  // Use attribute format instead of JSON
  const attrsString = Object.entries(customAttrs)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');
  return `<!-- adf:${nodeType} ${attrsString} -->`;
}

/**
 * Filter out standard attributes, keeping only custom ones for metadata
 */
function filterCustomAttributes(nodeType: string, attrs: Record<string, any>): Record<string, any> {
  const standardAttributes: Record<string, string[]> = {
    heading: ['level'],
    panel: ['panelType'],
    expand: ['title'],
    media: ['alt'], // For media, only alt is excluded from metadata (id, type, collection, width, height all go in metadata)
    mediaSingle: [], // For mediaSingle, all attributes go in metadata
    codeBlock: ['language'],
    orderedList: ['order'],
    link: ['href', 'title'],
    textColor: ['color'],
    table: ['isNumberColumnEnabled', 'layout'],
    tableHeader: ['colwidth', 'colspan', 'rowspan'],
    tableCell: ['colwidth', 'colspan', 'rowspan', 'background']
  };

  const standard = standardAttributes[nodeType] || [];
  const custom: Record<string, any> = {};

  Object.keys(attrs).forEach(key => {
    if (!standard.includes(key)) {
      custom[key] = attrs[key];
    }
  });

  return custom;
}

/**
 * Validate metadata comment syntax
 */
export function validateMetadataComment(comment: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!isAdfMetadataComment(comment)) {
    errors.push('Comment does not match ADF metadata pattern');
    return { valid: false, errors };
  }

  const metadata = parseAdfMetadataComment(comment);
  if (!metadata) {
    errors.push('Failed to parse metadata from comment');
    return { valid: false, errors };
  }

  // Validate node type
  if (!metadata.nodeType || !/^\w+$/.test(metadata.nodeType)) {
    errors.push('Invalid node type in metadata comment');
  }

  // Validate attributes if present
  if (metadata.attrs) {
    try {
      JSON.stringify(metadata.attrs);
    } catch (error) {
      errors.push('Invalid JSON in metadata attributes');
    }
  }

  return { valid: errors.length === 0, errors };
}