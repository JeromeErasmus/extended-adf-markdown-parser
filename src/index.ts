/**
 * @file Main entry point for the ADF parser library
 * @description Bidirectional parser for ADF and Extended Markdown
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import { remarkAdf } from './parser/remark/remark-adf.js';
import type { ADFDocument, ADFNode, ConversionOptions, ValidationResult } from './types';
import type { ConversionContext } from './parser/types';
import { AdfValidator } from './validators/AdfValidator';
import { MarkdownValidator } from './validators/MarkdownValidator';
import { ParserError, ValidationError } from './errors';
import { ConverterRegistry } from './parser/ConverterRegistry';
import { ASTBuilder } from './parser/markdown-to-adf/ASTBuilder';

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
    try {
      this.options = options || {};
      
      // Initialize remark with ADF plugins by default
      this.remarkProcessor = unified()
        .use(remarkParse)
        .use(remarkFrontmatter, ['yaml'])  // Enable frontmatter support
        .use(remarkGfm)                    // Enable tables, strikethrough, etc.
        .use(remarkAdf, {                  // Enable ADF social elements
          strict: options?.strict || false
        })
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
      
      // Always initialize enhanced parser for ADF fence block support
      try {
        this.enhancedParser = new EnhancedMarkdownParser({
          strict: options?.strict,
          gfm: options?.gfm !== false, // Default to true
          frontmatter: options?.frontmatter !== false, // Default to true
          adfExtensions: true,
          maxNestingDepth: options?.maxDepth || 5
        });
      } catch (error) {
        if (options?.strict) {
          throw new ParserError('Failed to initialize enhanced parser', 'INIT_ERROR');
        }
        // Continue without enhanced parser in non-strict mode
        if (options?.enableLogging) {
          console.warn('Enhanced parser initialization failed, continuing with basic parser:', error);
        }
      }
    } catch {
      throw new ParserError('Failed to initialize Parser', 'INIT_ERROR');
    }
  }
  
  /**
   * Convert ADF to Extended Markdown
   * Direct transformation - no remark needed
   */
  adfToMarkdown(adf: ADFDocument, options?: ConversionOptions): string {
    if (!adf || typeof adf !== 'object') {
      if (options?.strict) {
        throw new ParserError('Invalid ADF document: must be a non-null object', 'INVALID_INPUT');
      }
      // Graceful fallback for non-strict mode
      return '';
    }

    if (adf.type !== 'doc') {
      if (options?.strict) {
        throw new ParserError('Invalid ADF document: root node must be of type "doc"', 'INVALID_INPUT');
      }
      // Graceful fallback: try to convert anyway
    }

    return measureSync('adfToMarkdown', () => {
      // Validate ADF structure
      const validation = this.validateAdf(adf);
      if (!validation.valid && options?.strict) {
        throw new ValidationError('Invalid ADF structure', validation.errors);
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

    return result.data as string;
  }
  
  /**
   * Convert Extended Markdown to ADF
   * Uses enhanced parser if available, otherwise falls back to basic parser
   */
  markdownToAdf(markdown: string, options?: ConversionOptions): ADFDocument {
    if (!markdown || typeof markdown !== 'string') {
      if (options?.strict) {
        throw new ParserError('Invalid markdown input: must be a non-empty string', 'INVALID_INPUT');
      }
      // Graceful fallback for non-strict mode
      return {
        version: 1,
        type: 'doc',
        content: []
      };
    }

    if (markdown.trim().length === 0) {
      // Return empty ADF document for empty markdown
      return {
        version: 1,
        type: 'doc',
        content: []
      };
    }

    return measureSync('markdownToAdf', () => {
      // Use enhanced parser if available
      if (this.enhancedParser) {
        try {
          return this.enhancedParser.parseSync(markdown);
        } catch {
          if (options?.strict) {
            throw new ParserError('Enhanced parser failed to convert markdown', 'CONVERSION_ERROR');
          }
          // Fall back to basic parser
        }
      }
      
      try {
        // Parse markdown to mdast
        const mdast = this.remarkProcessor.parse(markdown);
        
        if (this.options.enableLogging) {
          console.log('DEBUG: Basic parser - parsed mdast successfully');
        }
        
        // Convert mdast to ADF
        return this.convertMdastToAdf(mdast);
      } catch (error) {
        if (this.options.enableLogging) {
          console.log('DEBUG: Basic parser failed, error:', error);
        }
        
        if (options?.strict) {
          throw new ParserError('Failed to convert markdown to ADF', 'CONVERSION_ERROR');
        }
        
        // Best-effort conversion as last resort
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

    return result.data as ADFDocument;
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

    return result.data as ADFDocument;
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
  getPerformanceStats() {
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
  validatePerformanceTargets() {
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
        if (!Array.isArray(nodes)) return '';
        return nodes.map(node => {
          try {
            const converter = this.registry.getNodeConverter(node.type);
            return converter.toMarkdown(node, context);
          } catch (error: unknown) {
            // Graceful degradation for unknown node types
            if (this.options.enableLogging) {
              console.warn(`Failed to convert node type "${node.type}":`, error);
            }
            return '';
          }
        }).join('');
      },
      depth: 0,
      options: {
        ...this.options,
        registry: this.registry
      }
    };
    
    // Handle missing or invalid content array
    if (!adf.content || !Array.isArray(adf.content)) {
      return '';
    }
    
    // For the top-level document, we need to join block elements with double newlines
    const content = adf.content.map(node => {
      try {
        const converter = this.registry.getNodeConverter(node.type);
        return converter.toMarkdown(node, context);
      } catch (error: unknown) {
        // Graceful degradation for unknown node types
        if (this.options.enableLogging) {
          console.warn(`Failed to convert node type "${node.type}":`, error);
        }
        return '';
      }
    }).filter(content => content.length > 0).join('\n\n');
    
    return content;
  }
  
  private convertMdastToAdf(mdast: any): ADFDocument {
    // Use ASTBuilder to convert mdast to ADF
    const builder = new ASTBuilder({
      strict: this.options.strict || false,
      preserveUnknownNodes: true,
      defaultVersion: 1
    });

    try {
      // Debug: Check initial state
      if (this.options.enableLogging) {
        console.log('DEBUG: Original mdast children types:', mdast.children?.map((c: any) => ({ type: c.type, lang: c.lang })));
      }
      
      // Post-process for ADF fence blocks (same as EnhancedParser)
      const processedMdast = this.postProcessAdfFenceBlocks(mdast);
      
      // Debug: Check after post-processing
      if (this.options.enableLogging) {
        console.log('DEBUG: After postProcessing children types:', processedMdast.children?.map((c: any) => ({ type: c.type, nodeType: c.nodeType })));
      }
      
      // Convert mdast tree to ADF using the same logic as EnhancedParser
      const content = builder.convertMdastNodesToADF(processedMdast.children);
      
      return {
        version: 1,
        type: 'doc',
        content
      };
    } catch (error) {
      if (this.options.strict) {
        throw new ParserError('Failed to convert mdast to ADF', 'CONVERSION_ERROR');
      }
      
      // Fallback to empty document
      return {
        version: 1,
        type: 'doc',
        content: []
      };
    }
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

  /**
   * Post-process mdast tree to convert code blocks with ADF languages to ADF fence nodes
   * Same method as used in MarkdownParser and EnhancedMarkdownParser
   */
  private postProcessAdfFenceBlocks(tree: any): any {
    const adfBlockTypes = new Set(['panel', 'expand', 'nestedExpand', 'mediaSingle', 'mediaGroup']);
    
    const processedTree = JSON.parse(JSON.stringify(tree)); // Deep clone
    
    const processNode = (node: any): void => {
      if (node.type === 'code' && node.lang && adfBlockTypes.has(node.lang)) {
        // Convert code block to adfFence node
        const attributes = this.parseAdfLanguageString(node.lang, node.meta || '');
        
        node.type = 'adfFence';
        node.nodeType = node.lang;
        node.attributes = attributes;
        node.value = node.value;
        
        // Remove code block properties
        delete node.lang;
        delete node.meta;
      }
      
      if (node.children) {
        node.children.forEach(processNode);
      }
    };
    
    processedTree.children.forEach(processNode);
    
    return processedTree;
  }

  /**
   * Parse ADF language string with attributes like "panel type=info title=Test"
   * Same method as used in MarkdownParser and EnhancedMarkdownParser
   */
  private parseAdfLanguageString(lang: string, meta: string): Record<string, any> {
    const attributes: Record<string, any> = {};
    
    // Combine lang and meta for parsing
    const fullString = `${lang} ${meta}`.trim();
    
    // Simple key=value parser
    const pairs = fullString.match(/(\w+)=([^"'\s]+|"[^"]*"|'[^']*')/g) || [];
    
    for (const pair of pairs) {
      const [, key, value] = pair.match(/(\w+)=([^"'\s]+|"[^"]*"|'[^']*')/) || [];
      if (key && value && key !== lang) { // Skip the language itself
        let parsedValue: any = value;
        
        // Remove quotes if present
        if ((parsedValue.startsWith('"') && parsedValue.endsWith('"')) ||
            (parsedValue.startsWith("'") && parsedValue.endsWith("'"))) {
          parsedValue = parsedValue.slice(1, -1);
        }
        
        // Try to parse as number or boolean
        if (parsedValue === 'true') parsedValue = true;
        else if (parsedValue === 'false') parsedValue = false;
        else if (!isNaN(Number(parsedValue)) && parsedValue !== '') parsedValue = Number(parsedValue);
        
        attributes[key] = parsedValue;
      }
    }
    
    return attributes;
  }
}

// Default export for convenience
export default Parser;