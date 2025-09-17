/**
 * @file ASTBuilder.ts
 * @description Converts markdown tokens into ADF (Atlassian Document Format) structure
 * @author Extended ADF Parser
 */

import { Token, TokenType, ADFMetadata } from './types.js';
import { ADFDocument, ADFNode, ADFMark } from '../../types/adf.types.js';

export interface ASTBuildOptions {
  strict?: boolean;
  preserveUnknownNodes?: boolean;
  defaultVersion?: number;
}

export class ASTBuilder {
  private options: ASTBuildOptions;

  constructor(options: ASTBuildOptions = {}) {
    this.options = {
      strict: false,
      preserveUnknownNodes: true,
      defaultVersion: 1,
      ...options
    };
  }

  /**
   * Build ADF document from markdown tokens
   */
  buildADF(tokens: Token[], frontmatter?: any): ADFDocument {
    // Filter out frontmatter token from content
    const contentTokens = tokens.filter(token => token.type !== 'frontmatter');
    
    // Extract document-level metadata from frontmatter
    const documentMetadata = this.extractDocumentMetadata(frontmatter);
    
    // Convert tokens to ADF nodes
    const content = this.convertTokensToNodes(contentTokens);

    return {
      version: this.options.defaultVersion!, // Always use default ADF version (1)
      type: 'doc',
      content
    };
  }

  private extractDocumentMetadata(frontmatter?: any): { version?: number; [key: string]: any } {
    if (!frontmatter) return {};
    
    // Parse YAML frontmatter if it's a string
    if (typeof frontmatter === 'string') {
      try {
        // Simple YAML parsing for basic key: value pairs
        const lines = frontmatter.split('\n');
        const metadata: any = {};
        
        for (const line of lines) {
          const match = line.match(/^(\w+):\s*(.+)$/);
          if (match) {
            const [, key, value] = match;
            // Try to parse numbers and booleans
            if (value === 'true') metadata[key] = true;
            else if (value === 'false') metadata[key] = false;
            else if (/^\d+$/.test(value)) metadata[key] = parseInt(value);
            else metadata[key] = value.replace(/['"]/g, ''); // Remove quotes
          }
        }
        
        return metadata;
      } catch {
        return {};
      }
    }
    
    return frontmatter;
  }

  private convertTokensToNodes(tokens: Token[]): ADFNode[] {
    const nodes: ADFNode[] = [];
    
    for (const token of tokens) {
      const node = this.convertTokenToNode(token);
      if (node) {
        nodes.push(node);
      }
    }
    
    return nodes;
  }

  private convertTokenToNode(token: Token): ADFNode | null {
    switch (token.type) {
      case 'heading':
        return this.convertHeading(token);
      case 'paragraph':
        return this.convertParagraph(token);
      case 'blockquote':
        return this.convertBlockquote(token);
      case 'codeBlock':
        return this.convertCodeBlock(token);
      case 'list':
        return this.convertList(token);
      case 'listItem':
        return this.convertListItem(token);
      case 'table':
        return this.convertTable(token);
      case 'tableRow':
        return this.convertTableRow(token);
      case 'tableHeader':
      case 'tableCell':
        return this.convertTableCell(token);
      case 'panel':
        return this.convertPanel(token);
      case 'expand':
        return this.convertExpand(token);
      case 'mediaSingle':
        return this.convertMediaSingle(token);
      case 'mediaGroup':
        return this.convertMediaGroup(token);
      case 'rule':
        return this.convertRule(token);
      case 'text':
        return this.convertText(token);
      case 'hardBreak':
        return this.convertHardBreak(token);
      default:
        return this.convertUnknownNode(token);
    }
  }

  private convertHeading(token: Token): ADFNode {
    const level = token.metadata?.attrs?.level || 1;
    const customAttrs = this.extractCustomAttributes(token.metadata, ['level']);
    
    return {
      type: 'heading',
      attrs: {
        level: Math.min(Math.max(level, 1), 6), // Clamp between 1-6
        ...customAttrs
      },
      content: this.convertInlineContent(token.content)
    };
  }

  private convertParagraph(token: Token): ADFNode {
    const customAttrs = this.extractCustomAttributes(token.metadata);
    
    const node: ADFNode = {
      type: 'paragraph',
      content: this.convertInlineContent(token.content)
    };

    if (Object.keys(customAttrs).length > 0) {
      node.attrs = customAttrs;
    }

    return node;
  }

  private convertBlockquote(token: Token): ADFNode {
    const customAttrs = this.extractCustomAttributes(token.metadata);
    
    const content = token.children ? 
      this.convertTokensToNodes(token.children) :
      [this.convertParagraph({ ...token, type: 'paragraph' })];

    const node: ADFNode = {
      type: 'blockquote',
      content
    };

    if (Object.keys(customAttrs).length > 0) {
      node.attrs = customAttrs;
    }

    return node;
  }

  private convertCodeBlock(token: Token): ADFNode {
    const language = token.metadata?.attrs?.language;
    const customAttrs = this.extractCustomAttributes(token.metadata, ['language']);
    
    const attrs: any = {};
    if (language) attrs.language = language;
    Object.assign(attrs, customAttrs);

    const node: ADFNode = {
      type: 'codeBlock',
      content: [
        {
          type: 'text',
          text: token.content
        }
      ]
    };

    if (Object.keys(attrs).length > 0) {
      node.attrs = attrs;
    }

    return node;
  }

  private convertList(token: Token): ADFNode {
    const listToken = token as any; // ListToken
    const isOrdered = listToken.ordered || false;
    const customAttrs = this.extractCustomAttributes(token.metadata);
    
    const attrs: any = {};
    if (isOrdered && listToken.start && listToken.start !== 1) {
      attrs.order = listToken.start;
    }
    Object.assign(attrs, customAttrs);

    const node: ADFNode = {
      type: isOrdered ? 'orderedList' : 'bulletList',
      content: token.children ? this.convertTokensToNodes(token.children) : []
    };

    if (Object.keys(attrs).length > 0) {
      node.attrs = attrs;
    }

    return node;
  }

  private convertListItem(token: Token): ADFNode {
    const customAttrs = this.extractCustomAttributes(token.metadata);
    
    const content = token.children ? 
      this.convertTokensToNodes(token.children) :
      token.content ? [this.convertParagraph({ ...token, type: 'paragraph' })] : [];

    const node: ADFNode = {
      type: 'listItem',
      content
    };

    if (Object.keys(customAttrs).length > 0) {
      node.attrs = customAttrs;
    }

    return node;
  }

  private convertTable(token: Token): ADFNode {
    const tableToken = token as any; // TableToken
    const customAttrs = this.extractCustomAttributes(token.metadata);
    
    const attrs: any = {
      isNumberColumnEnabled: false,
      layout: 'default',
      ...customAttrs
    };

    return {
      type: 'table',
      attrs,
      content: token.children ? this.convertTokensToNodes(token.children) : []
    };
  }

  private convertTableRow(token: Token): ADFNode {
    const customAttrs = this.extractCustomAttributes(token.metadata);
    
    const node: ADFNode = {
      type: 'tableRow',
      content: token.children ? this.convertTokensToNodes(token.children) : []
    };

    if (Object.keys(customAttrs).length > 0) {
      node.attrs = customAttrs;
    }

    return node;
  }

  private convertTableCell(token: Token): ADFNode {
    const isHeader = token.type === 'tableHeader';
    const customAttrs = this.extractCustomAttributes(token.metadata);
    
    const node: ADFNode = {
      type: isHeader ? 'tableHeader' : 'tableCell',
      content: this.convertInlineContent(token.content)
    };

    const attrs: any = { ...customAttrs };
    
    // Handle cell spanning attributes
    if (attrs.colspan && attrs.colspan !== 1) {
      // Keep colspan as is
    } else {
      delete attrs.colspan;
    }
    
    if (attrs.rowspan && attrs.rowspan !== 1) {
      // Keep rowspan as is
    } else {
      delete attrs.rowspan;
    }

    if (Object.keys(attrs).length > 0) {
      node.attrs = attrs;
    }

    return node;
  }

  private convertPanel(token: Token): ADFNode {
    const fenceToken = token as any; // FenceToken
    const panelType = fenceToken.attributes?.type || 'info';
    const customAttrs = this.extractCustomAttributes(token.metadata, ['type']);
    
    // Also get attributes from fence parsing
    const fenceAttrs = { ...fenceToken.attributes };
    delete fenceAttrs.type; // Remove type as it's handled separately
    
    const content = token.children ? 
      this.convertTokensToNodes(token.children) :
      token.content ? [this.convertParagraph({ ...token, type: 'paragraph' })] : [];

    return {
      type: 'panel',
      attrs: {
        panelType,
        ...fenceAttrs,
        ...customAttrs
      },
      content
    };
  }

  private convertExpand(token: Token): ADFNode {
    const fenceToken = token as any; // FenceToken
    const title = fenceToken.attributes?.title || '';
    const customAttrs = this.extractCustomAttributes(token.metadata, ['title']);
    
    // Also get attributes from fence parsing
    const fenceAttrs = { ...fenceToken.attributes };
    delete fenceAttrs.title; // Remove title as it's handled separately
    
    const content = token.children ? 
      this.convertTokensToNodes(token.children) :
      token.content ? [this.convertParagraph({ ...token, type: 'paragraph' })] : [];

    const attrs: any = { ...fenceAttrs, ...customAttrs };
    if (title) attrs.title = title;

    return {
      type: 'expand',
      attrs,
      content
    };
  }

  private convertMediaSingle(token: Token): ADFNode {
    const fenceToken = token as any; // FenceToken
    const layout = fenceToken.attributes?.layout || 'center';
    const width = fenceToken.attributes?.width;
    const customAttrs = this.extractCustomAttributes(token.metadata, ['layout', 'width']);
    
    const attrs: any = { layout, ...customAttrs };
    if (width) attrs.width = parseInt(width) || width;

    // Extract media nodes from content
    const mediaNodes = this.extractMediaFromContent(token.content);

    return {
      type: 'mediaSingle',
      attrs,
      content: mediaNodes
    };
  }

  private convertMediaGroup(token: Token): ADFNode {
    const customAttrs = this.extractCustomAttributes(token.metadata);
    
    // Extract media nodes from content
    const mediaNodes = this.extractMediaFromContent(token.content);

    const node: ADFNode = {
      type: 'mediaGroup',
      content: mediaNodes
    };

    if (Object.keys(customAttrs).length > 0) {
      node.attrs = customAttrs;
    }

    return node;
  }

  private convertRule(token: Token): ADFNode {
    const customAttrs = this.extractCustomAttributes(token.metadata);
    
    const node: ADFNode = {
      type: 'rule'
    };

    if (Object.keys(customAttrs).length > 0) {
      node.attrs = customAttrs;
    }

    return node;
  }

  private convertText(token: Token): ADFNode {
    return {
      type: 'text',
      text: token.content
    };
  }

  private convertHardBreak(token: Token): ADFNode {
    const customAttrs = this.extractCustomAttributes(token.metadata);
    
    const node: ADFNode = {
      type: 'hardBreak'
    };

    if (Object.keys(customAttrs).length > 0) {
      node.attrs = customAttrs;
    }

    return node;
  }

  private convertUnknownNode(token: Token): ADFNode | null {
    if (!this.options.preserveUnknownNodes) {
      return null;
    }

    // Convert unknown nodes to comments or fallback format
    return {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: `[Unknown node type: ${token.type}]`
        }
      ]
    };
  }

  private convertInlineContent(content: string): ADFNode[] {
    if (!content.trim()) {
      return [];
    }

    // Parse inline markdown content (simplified version)
    const inlineNodes = this.parseInlineMarkdown(content);
    return inlineNodes;
  }

  private parseInlineMarkdown(content: string): ADFNode[] {
    // Simplified inline parsing - this could be enhanced with a proper inline parser
    const nodes: ADFNode[] = [];
    
    // Handle special placeholder URLs like {media:123}, {user:456}
    content = this.expandPlaceholderURLs(content);
    
    // For now, create a simple text node
    // TODO: Enhance with proper inline mark parsing (bold, italic, links, etc.)
    if (content.trim()) {
      nodes.push({
        type: 'text',
        text: content
      });
    }
    
    return nodes;
  }

  private expandPlaceholderURLs(content: string): string {
    // Convert placeholder URLs back to descriptions
    // {media:123} -> "Media 123"
    // {user:456} -> "User 456"
    return content
      .replace(/\{media:([^}]+)\}/g, 'Media $1')
      .replace(/\{user:([^}]+)\}/g, 'User $1')
      .replace(/\{card:([^}]+)\}/g, 'Card: $1');
  }

  private extractMediaFromContent(content: string): ADFNode[] {
    const mediaNodes: ADFNode[] = [];
    
    // Look for markdown images with media placeholders
    const mediaRegex = /!\[([^\]]*)\]\(\{media:([^}]+)\}\)(?:\s*<!-- adf:media ([^>]*) -->)?/g;
    let match;
    
    while ((match = mediaRegex.exec(content)) !== null) {
      const [, alt, id, metadataStr] = match;
      
      let attrs: any = { id, type: 'file' };
      
      // Parse media metadata if present
      if (metadataStr) {
        try {
          const metadata = JSON.parse(metadataStr.replace(/'/g, '"'));
          attrs = { ...attrs, ...metadata };
        } catch {
          // Invalid metadata, use defaults
        }
      }
      
      if (alt) attrs.alt = alt;
      
      mediaNodes.push({
        type: 'media',
        attrs
      });
    }
    
    // If no media found, return empty array
    return mediaNodes;
  }

  private extractCustomAttributes(metadata?: ADFMetadata, excludeKeys: string[] = []): Record<string, any> {
    if (!metadata?.attrs) return {};
    
    const customAttrs: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(metadata.attrs)) {
      if (!excludeKeys.includes(key)) {
        customAttrs[key] = value;
      }
    }
    
    return customAttrs;
  }
}