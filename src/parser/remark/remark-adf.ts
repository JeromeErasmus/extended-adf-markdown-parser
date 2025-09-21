/**
 * @file remark-adf.ts
 * @description Main remark plugin for ADF syntax support
 */

import { Plugin } from 'unified';
import { adfMicromarkExtension } from '../micromark/adf-extension.js';
import { adfFromMarkdown } from './adf-from-markdown.js';
import { adfToMarkdown } from './adf-to-markdown.js';

/**
 * Options for the remark ADF plugin
 */
export interface RemarkAdfOptions {
  /**
   * Enable strict mode for ADF parsing
   */
  strict?: boolean;
  
  /**
   * Custom ADF block types to support
   */
  customBlockTypes?: string[];
  
  /**
   * Maximum nesting depth allowed
   */
  maxNestingDepth?: number;
}

/**
 * Remark plugin that adds support for ADF fence blocks
 */
export const remarkAdf: Plugin<[RemarkAdfOptions?]> = function (options = {}) {
  const data = this.data();
  
  // Add micromark extension for parsing
  add('micromarkExtensions', adfMicromarkExtension());
  
  // Add mdast extensions for AST conversion
  add('fromMarkdownExtensions', adfFromMarkdown());
  add('toMarkdownExtensions', adfToMarkdown());
  
  /**
   * Helper to add extensions to the data object
   */
  function add(field: string, value: any) {
    const list = (data as any)[field] ? (data as any)[field] : ((data as any)[field] = []);
    list.push(value);
  }
};

/**
 * Default export for convenience
 */
export default remarkAdf;