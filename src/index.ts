/**
 * @file Main entry point for the ADF parser library
 * @description Bidirectional parser for ADF and Extended Markdown
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import type { ADFDocument, ADFNode, ConversionOptions, ValidationResult } from './types';
import type { ConversionContext } from './parser/types';
import { AdfValidator } from './validators/AdfValidator';
import { MarkdownValidator } from './validators/MarkdownValidator';
import { ParserError, ValidationError } from './errors';
import { ConverterRegistry } from './parser/ConverterRegistry';

// Import node converters
import { ParagraphConverter } from './parser/adf-to-markdown/nodes/ParagraphConverter';
import { TextConverter } from './parser/adf-to-markdown/nodes/TextConverter';
import { HeadingConverter } from './parser/adf-to-markdown/nodes/HeadingConverter';
import { PanelConverter } from './parser/adf-to-markdown/nodes/PanelConverter';
import { CodeBlockConverter } from './parser/adf-to-markdown/nodes/CodeBlockConverter';
import { BulletListConverter } from './parser/adf-to-markdown/nodes/BulletListConverter';
import { OrderedListConverter } from './parser/adf-to-markdown/nodes/OrderedListConverter';
import { ListItemConverter } from './parser/adf-to-markdown/nodes/ListItemConverter';
import { MediaConverter } from './parser/adf-to-markdown/nodes/MediaConverter';
import { MediaSingleConverter } from './parser/adf-to-markdown/nodes/MediaSingleConverter';
import { TableConverter } from './parser/adf-to-markdown/nodes/TableConverter';
import { TableRowConverter } from './parser/adf-to-markdown/nodes/TableRowConverter';
import { TableHeaderConverter } from './parser/adf-to-markdown/nodes/TableHeaderConverter';
import { TableCellConverter } from './parser/adf-to-markdown/nodes/TableCellConverter';
import { ExpandConverter, NestedExpandConverter } from './parser/adf-to-markdown/nodes/ExpandConverter';
import { BlockquoteConverter } from './parser/adf-to-markdown/nodes/BlockquoteConverter';

// Import mark converters
import { StrongConverter } from './parser/adf-to-markdown/marks/StrongConverter';
import { EmConverter } from './parser/adf-to-markdown/marks/EmConverter';
import { CodeConverter } from './parser/adf-to-markdown/marks/CodeConverter';
import { LinkConverter } from './parser/adf-to-markdown/marks/LinkConverter';
import { StrikeConverter } from './parser/adf-to-markdown/marks/StrikeConverter';
import { UnderlineConverter } from './parser/adf-to-markdown/marks/UnderlineConverter';
import { TextColorConverter } from './parser/adf-to-markdown/marks/TextColorConverter';

// Export all types
export * from './types';
export { ParserError, ConversionError } from './errors';

/**
 * Main parser class - wraps unified/remark complexity
 */
export class Parser {
  private remarkProcessor;
  private registry: ConverterRegistry;
  private options: ConversionOptions;
  
  constructor(options?: ConversionOptions) {
    this.options = options || {};
    
    // Initialize remark with our custom plugins
    this.remarkProcessor = unified()
      .use(remarkParse)
      // TODO: Add custom ADF plugin here
      .use(remarkStringify);
      
    this.registry = new ConverterRegistry();
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
    // Register node converters
    this.registry.registerNodes([
      new ParagraphConverter(),
      new TextConverter(),
      new HeadingConverter(),
      new PanelConverter(),
      new CodeBlockConverter(),
      new BulletListConverter(),
      new OrderedListConverter(),
      new ListItemConverter(),
      new MediaConverter(),
      new MediaSingleConverter(),
      new TableConverter(),
      new TableRowConverter(),
      new TableHeaderConverter(),
      new TableCellConverter(),
      new ExpandConverter(),
      new NestedExpandConverter(),
      new BlockquoteConverter()
    ]);
    
    // Register mark converters
    this.registry.registerMarks([
      new StrongConverter(),
      new EmConverter(),
      new CodeConverter(),
      new LinkConverter(),
      new StrikeConverter(),
      new UnderlineConverter(),
      new TextColorConverter()
    ]);
  }
  
  private convertAdfToMarkdown(adf: ADFDocument): string {
    const context: ConversionContext = {
      convertChildren: (nodes: ADFNode[]) => {
        return nodes.map(node => {
          const converter = this.registry.getNodeConverter(node.type);
          return converter.toMarkdown(node, context);
        }).join('');
      },
      depth: 0,
      options: {
        ...this.options,
        registry: this.registry
      }
    };
    
    return context.convertChildren(adf.content || []);
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