/**
 * @file Extended Markdown type definitions
 */

import type { Node } from 'mdast';

export interface ExtendedMarkdownDocument {
  frontmatter?: ADFMetadata;
  content: string;
}

export interface ADFMetadata {
  type: 'doc';
  metadata?: Record<string, any>;
}

// Custom mdast node types for ADF-specific syntax
export interface MdastPanelNode extends Node {
  type: 'panel';
  panelType: 'info' | 'warning' | 'error' | 'success' | 'note';
  children: Node[];
}

export interface MdastExpandNode extends Node {
  type: 'expand';
  title: string;
  children: Node[];
}

export interface MdastMediaSingleNode extends Node {
  type: 'mediaSingle';
  layout: 'center' | 'wide' | 'full-width';
  media: MdastMediaNode;
}

export interface MdastMediaNode extends Node {
  type: 'media';
  id: string;
  collection?: string;
  attrs?: Record<string, any>;
}

// Extend mdast module to recognize our custom nodes
declare module 'mdast' {
  interface NodeMap {
    panel: MdastPanelNode;
    expand: MdastExpandNode;
    mediaSingle: MdastMediaSingleNode;
    media: MdastMediaNode;
  }
}