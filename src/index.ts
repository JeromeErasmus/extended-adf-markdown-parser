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
import { RuleConverter } from './parser/adf-to-markdown/nodes/RuleConverter';
// Import new node converters
import { HardBreakConverter } from './parser/adf-to-markdown/nodes/HardBreakConverter';
import { MentionConverter } from './parser/adf-to-markdown/nodes/MentionConverter';
import { DateConverter } from './parser/adf-to-markdown/nodes/DateConverter';
import { EmojiConverter } from './parser/adf-to-markdown/nodes/EmojiConverter';
import { StatusConverter } from './parser/adf-to-markdown/nodes/StatusConverter';
import { InlineCardConverter } from './parser/adf-to-markdown/nodes/InlineCardConverter';
import { MediaGroupConverter } from './parser/adf-to-markdown/nodes/MediaGroupConverter';
import { DocConverter } from './parser/adf-to-markdown/nodes/DocConverter';

// Import mark converters
import { StrongConverter } from './parser/adf-to-markdown/marks/StrongConverter';
import { EmConverter } from './parser/adf-to-markdown/marks/EmConverter';
import { CodeConverter } from './parser/adf-to-markdown/marks/CodeConverter';
import { LinkConverter } from './parser/adf-to-markdown/marks/LinkConverter';
import { StrikeConverter } from './parser/adf-to-markdown/marks/StrikeConverter';
import { UnderlineConverter } from './parser/adf-to-markdown/marks/UnderlineConverter';
import { TextColorConverter } from './parser/adf-to-markdown/marks/TextColorConverter';
// Import new mark converters
import { BackgroundColorConverter } from './parser/adf-to-markdown/marks/BackgroundColorConverter';
import { SubsupConverter } from './parser/adf-to-markdown/marks/SubsupConverter';

// Export all types
export * from './types';
export { ParserError, ConversionError } from './errors';

// Export converter registry for external use
export { ConverterRegistry } from './parser/ConverterRegistry.js';

// Export test utilities  
export { normalizeMarkdownForComparison, expectMarkdownEqual, toMatchMarkdown } from './utils/test-utils.js';

// Export markdown parser components
export { MarkdownParser } from './parser/markdown-to-adf/MarkdownParser.js';
export { EnhancedMarkdownParser } from './parser/markdown-to-adf/EnhancedMarkdownParser.js';
import { EnhancedMarkdownParser } from './parser/markdown-to-adf/EnhancedMarkdownParser.js';
import { measureSync, measureAsync, globalPerformanceMonitor } from './performance/PerformanceMonitor.js';
import { ErrorRecoveryManager } from './errors/ErrorRecovery.js';
import { getSafeJSONLength } from './utils/json-utils.js';

// Export enhanced parser components
export { adfMicromarkExtension } from './parser/micromark/index.js';
export { remarkAdf } from './parser/remark/index.js';
export type { AdfFenceNode } from './parser/remark/index.js';

// Export performance monitoring
export { 
  PerformanceMonitor, 
  globalPerformanceMonitor, 
  measureAsync, 
  measureSync 
} from './performance/PerformanceMonitor.js';
export type { 
  PerformanceMetrics, 
  BenchmarkResult, 
  PerformanceValidation 
} from './performance/PerformanceMonitor.js';

// Export streaming parser
export { StreamingParser } from './parser/StreamingParser.js';
export type { 
  StreamingOptions, 
  StreamingResult 
} from './parser/StreamingParser.js';

// Export error recovery
export { ErrorRecoveryManager } from './errors/ErrorRecovery.js';
export type {
  RecoveryOptions,
  RecoveryContext,
  RecoveryResult
} from './errors/ErrorRecovery.js';

/**
 * Main parser class - wraps unified/remark complexity
 */
export class Parser {
  private remarkProcessor;
  private registry: ConverterRegistry;
  private options: ConversionOptions;
  private enhancedParser?: EnhancedMarkdownParser;
  private errorRecovery: ErrorRecoveryManager;
  
  constructor(options?: ConversionOptions) {
    this.options = options || {};
    
    // Initialize remark with our custom plugins
    this.remarkProcessor = unified()
      .use(remarkParse)
      // TODO: Add custom ADF plugin here
      .use(remarkStringify);
      
    this.registry = new ConverterRegistry();
    this.registerConverters();
    
    // Initialize error recovery manager
    this.errorRecovery = new ErrorRecoveryManager({
      maxRetries: options?.maxRetries || 3,
      retryDelay: options?.retryDelay || 100,
      fallbackStrategy: options?.fallbackStrategy || 'best-effort',
      enableLogging: options?.enableLogging || false,
      onError: options?.onError,
      onRecovery: options?.onRecovery
    });
    
    // Initialize enhanced parser if ADF extensions are enabled
    if (options?.enableAdfExtensions) {
      this.enhancedParser = new EnhancedMarkdownParser({
        strict: options.strict,
        gfm: options.gfm !== false, // Default to true
        frontmatter: options.frontmatter !== false, // Default to true
        adfExtensions: true,
        maxNestingDepth: options.maxDepth || 5
      });
    }
  }
  
  /**
   * Convert ADF to Extended Markdown
   * Direct transformation - no remark needed
   */
  adfToMarkdown(adf: ADFDocument, options?: ConversionOptions): string {
    return measureSync('adfToMarkdown', () => {
      // Validate ADF structure
      const validation = this.validateAdf(adf);
      if (!validation.valid && options?.strict) {
        throw new ValidationError('Invalid ADF', validation.errors);
      }
      
      // Direct conversion using registered converters
      return this.convertAdfToMarkdown(adf);
    }, getSafeJSONLength(adf), this.countNodes(adf.content || []));
  }

  /**
   * Convert ADF to Extended Markdown with error recovery
   */
  async adfToMarkdownWithRecovery(adf: ADFDocument, options?: ConversionOptions): Promise<string> {
    const result = await this.errorRecovery.executeWithRecovery(
      () => this.adfToMarkdown(adf, options),
      {
        operation: 'adfToMarkdown',
        input: adf,
        nodeType: adf.type
      }
    );

    if (!result.success) {
      throw result.error || new Error('ADF to Markdown conversion failed');
    }

    return result.data!;
  }
  
  /**
   * Convert Extended Markdown to ADF
   * Uses enhanced parser if available, otherwise falls back to basic parser
   */
  markdownToAdf(markdown: string, options?: ConversionOptions): ADFDocument {
    return measureSync('markdownToAdf', () => {
      // Use enhanced parser if available
      if (this.enhancedParser) {
        return this.enhancedParser.parseSync(markdown);
      }
      
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
    }, markdown.length);
  }

  /**
   * Convert Extended Markdown to ADF with error recovery
   */
  async markdownToAdfWithRecovery(markdown: string, options?: ConversionOptions): Promise<ADFDocument> {
    const result = await this.errorRecovery.executeWithRecovery(
      () => this.markdownToAdf(markdown, options),
      {
        operation: 'markdownToAdf',
        input: markdown
      }
    );

    if (!result.success) {
      throw result.error || new Error('Markdown to ADF conversion failed');
    }

    return result.data!;
  }

  /**
   * Convert Extended Markdown to ADF using enhanced parser (async)
   */
  async markdownToAdfAsync(markdown: string, options?: ConversionOptions): Promise<ADFDocument> {
    return await measureAsync('markdownToAdfAsync', async () => {
      if (this.enhancedParser) {
        return await this.enhancedParser.parse(markdown);
      }
      
      // Fallback to sync method
      return this.markdownToAdf(markdown, options);
    }, markdown.length);
  }

  /**
   * Convert Extended Markdown to ADF using enhanced parser (async) with error recovery
   */
  async markdownToAdfAsyncWithRecovery(markdown: string, options?: ConversionOptions): Promise<ADFDocument> {
    const result = await this.errorRecovery.executeWithRecovery(
      async () => this.markdownToAdfAsync(markdown, options),
      {
        operation: 'markdownToAdfAsync',
        input: markdown
      }
    );

    if (!result.success) {
      throw result.error || new Error('Async Markdown to ADF conversion failed');
    }

    return result.data!;
  }

  /**
   * Validate markdown using enhanced parser if available
   */
  async validateMarkdownAsync(markdown: string): Promise<ValidationResult & { warnings?: string[] }> {
    if (this.enhancedParser) {
      const result = await this.enhancedParser.validate(markdown);
      return {
        valid: result.valid,
        errors: result.errors.map(error => ({ message: error })),
        warnings: result.warnings
      };
    }
    
    // Fallback to basic validation
    return this.validateMarkdown(markdown);
  }

  /**
   * Get parsing statistics using enhanced parser if available
   */
  async getStats(markdown: string): Promise<{
    nodeCount: number;
    adfBlockCount?: number;
    hasGfmFeatures?: boolean;
    hasFrontmatter?: boolean;
    hasAdfExtensions?: boolean;
    complexity: 'simple' | 'moderate' | 'complex';
    processingTime?: number;
  }> {
    if (this.enhancedParser) {
      return await this.enhancedParser.getStats(markdown);
    }
    
    // Basic stats for fallback
    const adf = this.markdownToAdf(markdown);
    return {
      nodeCount: this.countNodes(adf.content),
      complexity: 'simple'
    };
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

  /**
   * Get performance statistics for parser operations
   */
  getPerformanceStats(): {
    adfToMarkdown?: any;
    markdownToAdf?: any;
    markdownToAdfAsync?: any;
  } {
    return {
      adfToMarkdown: globalPerformanceMonitor.getStatistics('adfToMarkdown'),
      markdownToAdf: globalPerformanceMonitor.getStatistics('markdownToAdf'),
      markdownToAdfAsync: globalPerformanceMonitor.getStatistics('markdownToAdfAsync')
    };
  }

  /**
   * Generate performance report
   */
  getPerformanceReport(): string {
    return globalPerformanceMonitor.generateReport();
  }

  /**
   * Clear performance metrics
   */
  clearPerformanceMetrics(): void {
    globalPerformanceMonitor.clear();
  }

  /**
   * Get error recovery manager instance
   */
  getErrorRecovery(): ErrorRecoveryManager {
    return this.errorRecovery;
  }

  /**
   * Test parser performance against targets
   */
  validatePerformanceTargets(): {
    adfToMarkdown?: any;
    markdownToAdf?: any;
    markdownToAdfAsync?: any;
  } {
    return {
      adfToMarkdown: globalPerformanceMonitor.validatePerformanceTargets('adfToMarkdown'),
      markdownToAdf: globalPerformanceMonitor.validatePerformanceTargets('markdownToAdf'),
      markdownToAdfAsync: globalPerformanceMonitor.validatePerformanceTargets('markdownToAdfAsync')
    };
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
      new BlockquoteConverter(),
      new RuleConverter(),
      // New node converters
      new HardBreakConverter(),
      new MentionConverter(),
      new DateConverter(),
      new EmojiConverter(),
      new StatusConverter(),
      new InlineCardConverter(),
      new MediaGroupConverter(),
      new DocConverter()
    ]);
    
    // Register mark converters
    this.registry.registerMarks([
      new StrongConverter(),
      new EmConverter(),
      new CodeConverter(),
      new LinkConverter(),
      new StrikeConverter(),
      new UnderlineConverter(),
      new TextColorConverter(),
      // New mark converters
      new BackgroundColorConverter(),
      new SubsupConverter()
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
    
    // For the top-level document, we need to join block elements with double newlines
    const content = (adf.content || []).map(node => {
      const converter = this.registry.getNodeConverter(node.type);
      return converter.toMarkdown(node, context);
    }).filter(content => content.length > 0).join('\n\n');
    
    return content;
  }
  
  private convertMdastToAdf(mdast: any): ADFDocument {
    // TODO: Implement mdast to ADF conversion
    return {
      version: 1,
      type: 'doc',
      content: []
    };
  }
  
  private fallbackConversion(markdown: string): ADFDocument {
    // TODO: Implement fallback conversion
    return {
      version: 1,
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

  private countNodes(content: ADFNode[]): number {
    let count = 0;
    
    for (const node of content) {
      count++;
      if (node.content && Array.isArray(node.content)) {
        count += this.countNodes(node.content);
      }
    }
    
    return count;
  }
}

// Default export for convenience
export default Parser;