/**
 * @file metadata-comments.ts
 * @description Utilities for parsing and processing ADF metadata comments in markdown
 */

import type { Node, Parent, Root } from 'mdast';
import { visit } from 'unist-util-visit';

// Extend mdast Node interface to include our custom data properties
declare module 'mdast' {
  interface Data {
    adfMetadata?: AdfMetadata[];
  }
}

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
  withAttrsJson: /^<!--\s*adf:([a-zA-Z][a-zA-Z0-9]*)\s+attrs='({.*?})'\s*-->$/,
  
  // <!-- adf:paragraph key="value" key2="value2" -->
  withAttrs: /^<!--\s*adf:([a-zA-Z][a-zA-Z0-9]*)\s+(.+?)\s*-->$/,
  
  // <!-- adf:paragraph -->
  simple: /^<!--\s*adf:([a-zA-Z][a-zA-Z0-9]*)\s*-->$/,
  
  // <!-- /adf:paragraph -->
  closing: /^<!--\s*\/adf:([a-zA-Z][a-zA-Z0-9]*)\s*-->$/
};

/**
 * Check if a string is an ADF metadata comment
 * Excludes processing directives like inlineCard
 */
export function isAdfMetadataComment(value: string): boolean {
  // Check if it matches any metadata pattern
  const isMetadataPattern = METADATA_PATTERNS.withAttrsJson.test(value) ||
                           METADATA_PATTERNS.withAttrs.test(value) || 
                           METADATA_PATTERNS.simple.test(value) ||
                           METADATA_PATTERNS.closing.test(value);
  
  if (!isMetadataPattern) {
    return false;
  }
  
  // Exclude processing directives that should be handled differently
  const processingDirectives = ['inlineCard', 'blockCard'];
  
  return !processingDirectives.some(directive => 
    value.includes(`adf:${directive}`)
  );
}

/**
 * Parse attributes from attribute string (key="value" key2="value2")
 */
function parseAttributeString(attrString: string): Record<string, any> {
  const attrs: Record<string, any> = {};
  
  // Match key="value" patterns, accounting for spaces around =
  const attrRegex = /(\w+)\s*=\s*"([^"]*)"/g;
  let match;
  
  while ((match = attrRegex.exec(attrString)) !== null) {
    const [, key, value] = match;
    // Try to parse numeric values
    const numericValue = Number(value);
    attrs[key] = isNaN(numericValue) ? value : numericValue;
  }
  
  return attrs;
}

/**
 * Parse ADF metadata from a comment string
 */
export function parseAdfMetadataComment(value: string): AdfMetadata | null {
  // Try with JSON attributes pattern first (legacy format)
  let match = METADATA_PATTERNS.withAttrsJson.exec(value);
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

  // Try with new attribute pattern (key="value" format)
  match = METADATA_PATTERNS.withAttrs.exec(value);
  if (match) {
    const [, nodeType, attrString] = match;
    const attrs = parseAttributeString(attrString);
    
    if (Object.keys(attrs).length > 0) {
      return {
        nodeType,
        attrs,
        raw: value
      };
    } else {
      // If no valid attributes found, treat as simple
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
  // Strategy 1: For inline comments within content nodes (heading, paragraph, etc.)
  // If the parent is a content node (not root or other structural nodes), 
  // the comment is likely meant for the parent itself
  if (parent.type === 'heading' || parent.type === 'paragraph' || parent.type === 'tableCell' || parent.type === 'tableHeader') {
    return parent as Node;
  }
  
  // Strategy 2: Next sibling that's not an HTML comment (most common case - comments come before content)
  for (let i = commentIndex + 1; i < parent.children.length; i++) {
    const candidate = parent.children[i] as Node;
    if (candidate.type !== 'html' || !isAdfMetadataComment((candidate as any).value)) {
      return candidate;
    }
  }
  
  // Strategy 3: Previous sibling that's not an HTML comment (fallback for trailing comments)
  for (let i = commentIndex - 1; i >= 0; i--) {
    const candidate = parent.children[i] as Node;
    if (candidate.type !== 'html' || !isAdfMetadataComment((candidate as any).value)) {
      return candidate;
    }
  }
  
  // Strategy 4: Parent node (for block-level metadata)
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

  // Define mapping between metadata nodeType and ADF node type
  const nodeTypeMapping: Record<string, string> = {
    'cell': 'tableCell',
    'header': 'tableHeader',
    'heading': 'heading',
    'paragraph': 'paragraph',
    'panel': 'panel',
    'expand': 'expand'
  };

  // Apply attributes from metadata that matches the node type
  let updatedNode = { ...adfNode };
  
  for (const meta of metadata) {
    if (meta.attrs) {
      // Special handling for cell metadata - applies to both tableCell and tableHeader
      if (meta.nodeType === 'cell' && (adfNode.type === 'tableCell' || adfNode.type === 'tableHeader')) {
        updatedNode.attrs = { ...updatedNode.attrs, ...meta.attrs };
      } else {
        // Check direct match first, then mapped match
        const expectedAdfType = nodeTypeMapping[meta.nodeType] || meta.nodeType;
        if (meta.nodeType === adfNode.type || expectedAdfType === adfNode.type) {
          // Apply metadata that matches the current node type (direct or mapped)
          updatedNode.attrs = { ...updatedNode.attrs, ...meta.attrs };
        }
      }
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

  // For round-trip fidelity, always preserve all non-default attributes
  // Only filter attributes that are truly defaults or not meaningful
  const significantAttrs = filterSignificantAttributes(nodeType, attrs);
  
  if (Object.keys(significantAttrs).length === 0) {
    return '';
  }

  // Use attribute format instead of JSON
  const attrsString = Object.entries(significantAttrs)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');
  return `<!-- adf:${nodeType} ${attrsString} -->`;
}

/**
 * Filter out default attributes, keeping only significant ones for round-trip metadata
 */
function filterSignificantAttributes(nodeType: string, attrs: Record<string, any>): Record<string, any> {
  // Define attributes that should always be filtered because they're expressed in markdown syntax
  const alwaysFiltered: Record<string, string[]> = {
    heading: ['level'], // Level is expressed as #, ##, ### etc.
    panel: ['panelType'], // Panel type is expressed in fence block syntax
    codeBlock: ['language'], // Language is expressed in fence block syntax  
    orderedList: ['order'], // Order is expressed in markdown list syntax
    media: ['alt'], // Alt is expressed in image alt text
  };

  // Define default values that should be filtered when at default
  // Note: For round-trip fidelity, we preserve more attributes than strictly necessary
  const defaultValues: Record<string, Record<string, any>> = {
    // mediaSingle: { layout: 'center' }, // Preserve layout for round-trip fidelity
    table: { isNumberColumnEnabled: false, layout: 'default' }
  };

  const filtered = alwaysFiltered[nodeType] || [];
  const defaults = defaultValues[nodeType] || {};
  const significant: Record<string, any> = {};

  Object.keys(attrs).forEach(key => {
    const value = attrs[key];
    
    // Always filter certain attributes for specific node types
    if (filtered.includes(key)) {
      return;
    }
    
    // Filter attributes that are at their default value
    if (key in defaults && defaults[key] === value) {
      return;
    }
    
    // Include all other attributes
    significant[key] = value;
  });

  return significant;
}

/**
 * Filter out standard attributes, keeping only custom ones for metadata
 * @deprecated Use filterSignificantAttributes instead for better round-trip support
 */
function filterCustomAttributes(nodeType: string, attrs: Record<string, any>): Record<string, any> {
  const standardAttributes: Record<string, string[]> = {
    heading: ['level'],
    panel: ['panelType'],
    expand: ['title'],
    media: ['alt'], // For media, only alt is excluded from metadata (id, type, collection, width, height all go in metadata)
    mediaSingle: ['layout', 'width'], // For mediaSingle, layout and width are standard attributes
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