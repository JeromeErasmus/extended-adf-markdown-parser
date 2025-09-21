/**
 * @file ASTBuilder.ts
 * @description Converts markdown tokens into ADF (Atlassian Document Format) structure
 * @author Extended ADF Parser
 */

import { Token, TokenType, ADFMetadata } from './types.js';
import { ADFDocument, ADFNode, ADFMark } from '../../types/adf.types.js';
import type { Root } from 'mdast';
import type { AdfFenceNode } from '../remark/adf-from-markdown.js';
import { getNodeMetadata, applyMetadataToAdfNode, generateMetadataComment, isAdfMetadataComment } from '../../utils/metadata-comments.js';

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
    
    // Use inline tokens if available, otherwise parse content string
    const content = token.children && token.children.length > 0 
      ? this.convertInlineTokensToNodes(token.children)
      : this.convertInlineContent(token.content);
    
    const node: ADFNode = {
      type: 'paragraph',
      content
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

  private convertInlineTokensToNodes(tokens: Token[]): ADFNode[] {
    const nodes: ADFNode[] = [];
    
    for (const token of tokens) {
      const convertedNodes = this.convertInlineTokenToNode(token);
      nodes.push(...convertedNodes);
    }
    
    return nodes;
  }
  
  private convertInlineTokenToNode(token: Token): ADFNode[] {
    switch (token.type) {
      case 'text':
        return [{
          type: 'text',
          text: token.content
        }];
        
      case 'strong':
      case 'emphasis': 
      case 'strikethrough':
      case 'inlineCode':
      case 'underline':
        return this.convertFormattingToken(token);
        
      case 'link':
        return this.convertLinkToken(token);
        
      default:
        // Unknown inline token type, treat as plain text
        return [{
          type: 'text',
          text: token.content || token.raw
        }];
    }
  }
  
  private convertFormattingToken(token: Token): ADFNode[] {
    const markType = this.getADFMarkType(token.type);
    
    // If token has children (nested formatting), process them
    if (token.children && token.children.length > 0) {
      const childNodes = this.convertInlineTokensToNodes(token.children);
      
      // Apply the mark to all child text nodes
      return childNodes.map(node => {
        if (node.type === 'text') {
          const marks = node.marks ? [...node.marks] : [];
          marks.push({ type: markType });
          return {
            ...node,
            marks
          };
        }
        return node;
      });
    } else {
      // Simple formatting token
      return [{
        type: 'text',
        text: token.content,
        marks: [{ type: markType }]
      }];
    }
  }
  
  private getADFMarkType(tokenType: string): string {
    switch (tokenType) {
      case 'strong': return 'strong';
      case 'emphasis': return 'em';
      case 'strikethrough': return 'strike';
      case 'inlineCode': return 'code';
      case 'underline': return 'underline';
      default: return 'unknown';
    }
  }
  
  private convertLinkToken(token: Token): ADFNode[] {
    const href = token.metadata?.attrs?.href;
    const title = token.metadata?.attrs?.title;
    
    if (!href) {
      // Invalid link, treat as plain text
      return [{
        type: 'text',
        text: token.content || token.raw
      }];
    }
    
    // Create link mark attributes
    const linkAttrs: any = { href };
    if (title) {
      linkAttrs.title = title;
    }
    
    // If token has children (formatted link text), process them
    if (token.children && token.children.length > 0) {
      const childNodes = this.convertInlineTokensToNodes(token.children);
      
      // Apply the link mark to all child text nodes
      return childNodes.map(node => {
        if (node.type === 'text') {
          const marks = node.marks ? [...node.marks] : [];
          marks.push({ type: 'link', attrs: linkAttrs });
          return {
            ...node,
            marks
          };
        }
        return node;
      });
    } else {
      // Simple link token
      return [{
        type: 'text',
        text: token.content || 'link',
        marks: [{ type: 'link', attrs: linkAttrs }]
      }];
    }
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

  /**
   * Build ADF document from mdast tree (for enhanced parser)
   */
  buildADFFromMdast(tree: Root, frontmatter?: any): ADFDocument {
    // Extract document metadata from frontmatter
    const documentMetadata = this.extractDocumentMetadata(frontmatter);
    
    // Convert mdast nodes to ADF nodes
    const content = this.convertMdastNodesToADF(tree.children);

    return {
      version: this.options.defaultVersion!,
      type: 'doc',
      content
    };
  }

  /**
   * Build mdast tree from ADF document (for stringify)
   */
  buildMdastFromADF(adf: ADFDocument): Root {
    const children = this.convertAdfNodesToMdast(adf.content);
    
    return {
      type: 'root',
      children
    };
  }

  /**
   * Convert mdast nodes to ADF nodes
   */
  private convertMdastNodesToADF(nodes: any[]): ADFNode[] {
    const adfNodes: ADFNode[] = [];
    
    for (const node of nodes) {
      const adfNode = this.convertMdastNodeToADF(node);
      if (adfNode) {
        adfNodes.push(adfNode);
      }
    }
    
    return adfNodes;
  }

  /**
   * Convert single mdast node to ADF node
   */
  private convertMdastNodeToADF(node: any): ADFNode | null {
    let adfNode: ADFNode | null = null;
    
    switch (node.type) {
      case 'heading':
        adfNode = this.convertMdastHeading(node);
        break;
      case 'paragraph':
        adfNode = this.convertMdastParagraph(node);
        break;
      case 'blockquote':
        adfNode = this.convertMdastBlockquote(node);
        break;
      case 'code':
        adfNode = this.convertMdastCodeBlock(node);
        break;
      case 'list':
        adfNode = this.convertMdastList(node);
        break;
      case 'listItem':
        adfNode = this.convertMdastListItem(node);
        break;
      case 'table':
        adfNode = this.convertMdastTable(node);
        break;
      case 'tableRow':
        adfNode = this.convertMdastTableRow(node);
        break;
      case 'tableCell':
        adfNode = this.convertMdastTableCell(node);
        break;
      case 'thematicBreak':
        adfNode = { type: 'rule' };
        break;
      case 'adfFence':
        adfNode = this.convertAdfFenceNode(node as AdfFenceNode);
        break;
      case 'yaml':
      case 'toml':
        // Skip frontmatter nodes - they're handled separately
        return null;
      case 'text':
        adfNode = { type: 'text', text: node.value };
        break;
      case 'image':
        adfNode = this.convertMdastImage(node);
        break;
      case 'html':
        // Skip ADF metadata comments - they should have been processed already
        if (node.value && isAdfMetadataComment(node.value)) {
          return null;
        }
        // For other HTML nodes, preserve as unknown if option is set
        if (this.options.preserveUnknownNodes) {
          adfNode = {
            type: 'paragraph',
            content: [{ type: 'text', text: `[HTML: ${node.value}]` }]
          };
        } else {
          return null;
        }
        break;
      default:
        if (this.options.preserveUnknownNodes) {
          adfNode = {
            type: 'paragraph',
            content: [{ type: 'text', text: `[Unknown node: ${node.type}]` }]
          };
        } else {
          return null;
        }
        break;
    }

    // Apply metadata from HTML comments if present
    if (adfNode) {
      const metadata = getNodeMetadata(node);
      if (metadata.length > 0) {
        adfNode = applyMetadataToAdfNode(adfNode, metadata);
      }
    }

    return adfNode;
  }

  /**
   * Convert ADF fence node from micromark extension
   */
  private convertAdfFenceNode(node: AdfFenceNode): ADFNode {
    const { nodeType, attributes, value } = node;
    
    // Parse the content as markdown if it exists
    let content: ADFNode[] = [];
    if (value && value.trim()) {
      // For now, create a simple paragraph with the content
      // TODO: Parse content recursively for nested markdown
      content = [{
        type: 'paragraph',
        content: [{ type: 'text', text: value.trim() }]
      }];
    }

    // Create the appropriate ADF node based on nodeType
    switch (nodeType) {
      case 'panel':
        return {
          type: 'panel',
          attrs: {
            panelType: attributes.type || 'info',
            ...this.filterAttributes(attributes, ['type'])
          },
          content
        };
      
      case 'expand':
        return {
          type: 'expand',
          attrs: {
            ...(attributes.title && { title: attributes.title }),
            ...this.filterAttributes(attributes, ['title'])
          },
          content
        };
      
      case 'nestedExpand':
        return {
          type: 'nestedExpand',
          attrs: {
            ...(attributes.title && { title: attributes.title }),
            ...this.filterAttributes(attributes, ['title'])
          },
          content
        };
      
      case 'mediaSingle':
        const mediaNodes = this.extractMediaFromContent(value);
        return {
          type: 'mediaSingle',
          attrs: {
            ...(attributes.layout && { layout: attributes.layout }),
            ...(attributes.width && { width: attributes.width }),
            ...this.filterAttributes(attributes, ['layout', 'width'])
          },
          content: mediaNodes.length > 0 ? mediaNodes : content
        };
      
      case 'mediaGroup':
        const groupMediaNodes = this.extractMediaFromContent(value);
        return {
          type: 'mediaGroup',
          content: groupMediaNodes.length > 0 ? groupMediaNodes : content
        };
      
      default:
        // Unknown ADF node type, preserve as a generic node
        return {
          type: 'paragraph',
          content: [
            { 
              type: 'text', 
              text: `[ADF ${nodeType}]: ${value || ''}`
            }
          ]
        };
    }
  }

  /**
   * Convert mdast nodes to corresponding format
   */
  private convertMdastHeading(node: any): ADFNode {
    return {
      type: 'heading',
      attrs: { level: node.depth },
      content: this.convertMdastInlineNodes(node.children)
    };
  }

  private convertMdastParagraph(node: any): ADFNode | null {
    // Check if this paragraph contains only a single image that's an ADF media placeholder
    if (node.children && node.children.length === 1 && node.children[0].type === 'image') {
      const imageNode = node.children[0];
      if (imageNode.url && imageNode.url.match(/^adf:media:/)) {
        // This is a standalone media element - convert it to block-level media/mediaSingle
        // Transfer any paragraph-level metadata to the image node
        const paragraphMetadata = getNodeMetadata(node);
        if (paragraphMetadata.length > 0) {
          // Add paragraph metadata to image node
          if (!imageNode.data) {
            imageNode.data = {};
          }
          if (!imageNode.data.adfMetadata) {
            imageNode.data.adfMetadata = [];
          }
          imageNode.data.adfMetadata.push(...paragraphMetadata);
        }
        
        const mediaNode = this.convertMdastImage(imageNode);
        if (mediaNode) {
          return mediaNode;
        }
      }
    }
    
    const content = this.convertMdastInlineNodes(node.children);
    
    // If paragraph content is completely empty, return null to filter it out
    // This happens when all content was ignored (e.g., regular images)
    if (content.length === 0) {
      return null;
    }
    
    return {
      type: 'paragraph',
      content
    };
  }

  private convertMdastBlockquote(node: any): ADFNode {
    return {
      type: 'blockquote',
      content: this.convertMdastNodesToADF(node.children)
    };
  }

  private convertMdastCodeBlock(node: any): ADFNode {
    return {
      type: 'codeBlock',
      attrs: node.lang ? { language: node.lang } : {},
      content: [{ type: 'text', text: node.value }]
    };
  }

  private convertMdastList(node: any): ADFNode {
    return {
      type: node.ordered ? 'orderedList' : 'bulletList',
      ...(node.start && node.start !== 1 && { attrs: { order: node.start } }),
      content: this.convertMdastNodesToADF(node.children)
    };
  }

  private convertMdastListItem(node: any): ADFNode {
    return {
      type: 'listItem',
      content: this.convertMdastNodesToADF(node.children)
    };
  }

  private convertMdastTable(node: any): ADFNode {
    return {
      type: 'table',
      content: this.convertMdastNodesToADF(node.children)
    };
  }

  private convertMdastTableRow(node: any): ADFNode {
    return {
      type: 'tableRow',
      content: this.convertMdastNodesToADF(node.children)
    };
  }

  private convertMdastTableCell(node: any): ADFNode {
    return {
      type: 'tableCell',
      content: this.convertMdastNodesToADF(node.children)
    };
  }

  /**
   * Convert mdast image node to ADF media/mediaSingle node
   */
  private convertMdastImage(node: any): ADFNode | null {
    if (!node.url) {
      return null;
    }

    // Check if this is an ADF media placeholder
    const adfMediaMatch = node.url.match(/^adf:media:(.+)$/);
    if (!adfMediaMatch) {
      // Regular image - not a media placeholder
      // For now, we'll treat regular images as unsupported and return null
      // In the future, this could be expanded to convert regular images to media nodes
      return null;
    }

    const mediaId = adfMediaMatch[1];
    
    // Handle empty media ID
    if (!mediaId) {
      return null;
    }
    
    // Get metadata from the node
    const metadata = getNodeMetadata(node);
    
    // Find media and mediaSingle metadata
    let mediaAttrs: Record<string, any> = { id: mediaId, type: 'file' };
    let mediaSingleAttrs: Record<string, any> = {};
    
    for (const meta of metadata) {
      if (meta.nodeType === 'media' && meta.attrs) {
        mediaAttrs = { ...mediaAttrs, ...meta.attrs };
      } else if (meta.nodeType === 'mediaSingle' && meta.attrs) {
        mediaSingleAttrs = { ...meta.attrs };
      }
    }

    // Add alt text if present and not empty
    if (node.alt && node.alt.trim()) {
      mediaAttrs.alt = node.alt;
    }

    // Create media node
    const mediaNode: ADFNode = {
      type: 'media',
      attrs: mediaAttrs
    };

    // If we have mediaSingle attributes, wrap the media node
    if (Object.keys(mediaSingleAttrs).length > 0) {
      return {
        type: 'mediaSingle',
        attrs: mediaSingleAttrs,
        content: [mediaNode]
      };
    }

    // Return just the media node
    return mediaNode;
  }

  /**
   * Convert inline mdast nodes to ADF text nodes with marks
   */
  private convertMdastInlineNodes(nodes: any[]): ADFNode[] {
    const adfNodes: ADFNode[] = [];
    
    for (const node of nodes) {
      const adfNode = this.convertMdastInlineNode(node);
      if (adfNode) {
        adfNodes.push(adfNode);
      }
    }
    
    return adfNodes;
  }

  /**
   * Convert single inline mdast node to ADF
   */
  private convertMdastInlineNode(node: any): ADFNode | null {
    switch (node.type) {
      case 'text':
        return { type: 'text', text: node.value };
      
      case 'strong':
        return this.wrapWithMark(node.children, 'strong');
      
      case 'emphasis':
        return this.wrapWithMark(node.children, 'em');
      
      case 'inlineCode':
        return { type: 'text', text: node.value, marks: [{ type: 'code' }] };
      
      case 'delete':
        return this.wrapWithMark(node.children, 'strike');
      
      case 'link':
        return this.wrapWithMark(node.children, 'link', { href: node.url, ...(node.title && { title: node.title }) });
      
      case 'break':
        return { type: 'hardBreak' };
      
      case 'image':
        return this.convertMdastImage(node);
      
      default:
        // Unknown inline node, treat as text
        return { type: 'text', text: node.value || `[${node.type}]` };
    }
  }

  /**
   * Wrap mdast children with an ADF mark
   */
  private wrapWithMark(children: any[], markType: string, attrs?: any): ADFNode {
    const childNodes = this.convertMdastInlineNodes(children);
    
    if (childNodes.length === 1 && childNodes[0].type === 'text') {
      // Simple case - single text node
      const marks = childNodes[0].marks ? [...childNodes[0].marks] : [];
      marks.push(attrs ? { type: markType, attrs } : { type: markType });
      
      return {
        ...childNodes[0],
        marks
      };
    } else {
      // Complex case - multiple children or non-text nodes
      // For now, merge text content
      const text = childNodes
        .filter(node => node.type === 'text')
        .map(node => node.text)
        .join('');
      
      return {
        type: 'text',
        text,
        marks: [attrs ? { type: markType, attrs } : { type: markType }]
      };
    }
  }

  /**
   * Convert ADF nodes back to mdast
   */
  private convertAdfNodesToMdast(nodes: ADFNode[]): any[] {
    const result: any[] = [];
    
    for (const node of nodes) {
      const converted = this.convertAdfNodeToMdast(node);
      if (converted) {
        if (Array.isArray(converted)) {
          result.push(...converted);
        } else {
          result.push(converted);
        }
      }
    }
    
    return result;
  }

  /**
   * Convert single ADF node back to mdast
   */
  private convertAdfNodeToMdast(node: ADFNode): any | any[] {
    let mdastNode: any;

    switch (node.type) {
      case 'heading':
        mdastNode = {
          type: 'heading',
          depth: (node.attrs as any)?.level || 1,
          children: this.convertAdfInlineToMdast(node.content || [])
        };
        break;
      
      case 'paragraph':
        mdastNode = {
          type: 'paragraph',
          children: this.convertAdfInlineToMdast(node.content || [])
        };
        break;
      
      case 'panel':
        mdastNode = {
          type: 'adfFence',
          nodeType: 'panel',
          attributes: { type: (node.attrs as any)?.panelType || 'info', ...node.attrs },
          value: this.extractContentAsText(node.content || [])
        };
        break;
      
      case 'media':
        const mediaAttrs = node.attrs as any;
        const altText = mediaAttrs?.alt || 'Media';
        mdastNode = {
          type: 'image',
          url: `adf:media:${mediaAttrs?.id || 'unknown'}`,
          alt: altText,
          title: null
        };
        
        // Generate media metadata comment manually (including all attributes except alt)
        const mediaMetadataAttrs: Record<string, any> = {};
        if (mediaAttrs?.id) mediaMetadataAttrs.id = mediaAttrs.id;
        if (mediaAttrs?.type) mediaMetadataAttrs.type = mediaAttrs.type;
        if (mediaAttrs?.collection) mediaMetadataAttrs.collection = mediaAttrs.collection;
        if (mediaAttrs?.width) mediaMetadataAttrs.width = mediaAttrs.width;
        if (mediaAttrs?.height) mediaMetadataAttrs.height = mediaAttrs.height;
        // Add any other custom attributes (excluding alt)
        Object.keys(mediaAttrs || {}).forEach(key => {
          if (!['id', 'type', 'collection', 'width', 'height', 'alt'].includes(key)) {
            mediaMetadataAttrs[key] = mediaAttrs[key];
          }
        });
        
        if (Object.keys(mediaMetadataAttrs).length > 0) {
          const metadataString = Object.entries(mediaMetadataAttrs)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');
          const mediaComment = `<!-- adf:media ${metadataString} -->`;
          
          // Return array with metadata comment followed by the image
          return [
            { type: 'html', value: mediaComment },
            mdastNode
          ];
        }
        
        break;
      
      case 'mediaSingle':
        // Convert mediaSingle by converting its inner media content
        const mediaContent = node.content ? this.convertAdfNodesToMdast(node.content) : [];
        
        // Generate mediaSingle metadata comment
        const mediaSingleComment = generateMetadataComment(node.type, node.attrs);
        
        if (mediaContent.length > 0) {
          // If we have media content (which may be [comment, image] array), handle accordingly
          const result = [];
          
          // Add mediaSingle metadata comment first if it exists
          if (mediaSingleComment) {
            result.push({ type: 'html', value: mediaSingleComment });
          }
          
          // Add all media content (comments and images)
          result.push(...mediaContent);
          
          return result;
        } else {
          // Fallback case
          mdastNode = {
            type: 'image',
            url: 'adf:media:unknown',
            alt: 'Media',
            title: null
          };
        }
        break;
      
      default:
        // Return a generic paragraph for unknown nodes
        mdastNode = {
          type: 'paragraph',
          children: [{ type: 'text', value: `[${node.type}]` }]
        };
        break;
    }

    // Generate metadata comment if the node has custom attributes
    const metadataComment = generateMetadataComment(node.type, node.attrs);
    
    if (metadataComment) {
      // Return array with metadata comment followed by the node
      return [
        { type: 'html', value: metadataComment },
        mdastNode
      ];
    }

    return mdastNode;
  }

  /**
   * Convert ADF inline content to mdast
   */
  private convertAdfInlineToMdast(content: ADFNode[]): any[] {
    return content.map(node => {
      if (node.type === 'text') {
        let result: any = { type: 'text', value: node.text };
        
        // Apply marks
        if (node.marks) {
          for (const mark of node.marks) {
            switch (mark.type) {
              case 'strong':
                result = { type: 'strong', children: [result] };
                break;
              case 'em':
                result = { type: 'emphasis', children: [result] };
                break;
              case 'code':
                result = { type: 'inlineCode', value: node.text };
                break;
              case 'link':
                result = { 
                  type: 'link', 
                  url: (mark.attrs as any)?.href,
                  children: [result] 
                };
                break;
            }
          }
        }
        
        return result;
      }
      
      return { type: 'text', value: `[${node.type}]` };
    });
  }

  /**
   * Extract content as plain text
   */
  private extractContentAsText(content: ADFNode[]): string {
    return content
      .map(node => {
        if (node.type === 'text') {
          return node.text;
        }
        if (node.content) {
          return this.extractContentAsText(node.content);
        }
        return '';
      })
      .join('');
  }

  /**
   * Filter attributes excluding specified keys
   */
  private filterAttributes(attrs: Record<string, any>, excludeKeys: string[]): Record<string, any> {
    const filtered: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(attrs)) {
      if (!excludeKeys.includes(key)) {
        filtered[key] = value;
      }
    }
    
    return filtered;
  }
}