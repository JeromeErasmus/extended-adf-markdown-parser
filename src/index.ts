/**
 * @file Main entry point for the ADF parser library
 * @description Bidirectional parser for ADF and Extended Markdown
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import type { ADFDocument, ADFNode, ConversionOptions, ValidationResult } from './types';
import { AdfValidator } from './validators/AdfValidator';
import { MarkdownValidator } from './validators/MarkdownValidator';
import { ParserError, ValidationError } from './errors';

// Export all types
export * from './types';
export { ParserError, ConversionError } from './errors';

/**
 * Main parser class - wraps unified/remark complexity
 */
export class Parser {
  private remarkProcessor;
  private adfConverters: Map<string, any>;
  
  constructor(options?: ConversionOptions) {
    // Initialize remark with our custom plugins
    this.remarkProcessor = unified()
      .use(remarkParse)
      // TODO: Add custom ADF plugin here
      .use(remarkStringify);
      
    this.adfConverters = new Map();
    this.registerConverters();
  }
  
  /**
   * Convert ADF to Extended Markdown
   * Direct transformation - no remark needed
   */
  adfToMarkdown(adf: ADFDocument, options?: ConversionOptions): string {
    // Validate ADF structure
    const validation = this.validateAdf(adf);
    if (!validation.valid && options?.strict) {
      throw new ValidationError('Invalid ADF', validation.errors);
    }
    
    // Direct conversion using registered converters
    return this.convertAdfToMarkdown(adf);
  }
  
  /**
   * Convert Extended Markdown to ADF
   * Uses remark for parsing
   */
  markdownToAdf(markdown: string, options?: ConversionOptions): ADFDocument {
    try {
      // Parse markdown to mdast
      const mdast = this.remarkProcessor.parse(markdown);
      
      // Convert mdast to ADF
      return this.convertMdastToAdf(mdast);
    } catch (error) {
      if (options?.strict) throw error;
      
      // Best-effort conversion
      return this.fallbackConversion(markdown);
    }
  }
  
  /**
   * Validate ADF structure
   */
  validateAdf(adf: unknown): ValidationResult {
    return new AdfValidator().validate(adf);
  }
  
  /**
   * Validate Extended Markdown
   */
  validateMarkdown(markdown: string): ValidationResult {
    return new MarkdownValidator().validate(markdown);
  }
  
  // Private implementation methods
  private registerConverters(): void {
    // TODO: Register all node converters
  }
  
  private convertAdfToMarkdown(adf: ADFDocument): string {
    // TODO: Implement ADF to Markdown conversion
    return '';
  }
  
  private convertMdastToAdf(mdast: any): ADFDocument {
    // TODO: Implement mdast to ADF conversion
    return {
      type: 'doc',
      content: []
    };
  }
  
  private fallbackConversion(markdown: string): ADFDocument {
    // TODO: Implement fallback conversion
    return {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: markdown
            }
          ]
        }
      ]
    };
  }
}

// Default export for convenience
export default Parser;