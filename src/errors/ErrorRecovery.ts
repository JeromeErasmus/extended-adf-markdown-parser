/**
 * @file ErrorRecovery.ts
 * @description Production-grade error recovery strategies for parser operations
 */

import type { ADFDocument, ADFNode } from '../types';
import { ParserError, ConversionError, ValidationError } from './index.js';

export interface RecoveryOptions {
  maxRetries?: number;
  retryDelay?: number;
  fallbackStrategy?: 'skip' | 'placeholder' | 'best-effort' | 'throw';
  onError?: (error: Error, context: RecoveryContext) => void;
  onRecovery?: (strategy: string, context: RecoveryContext) => void;
  enableLogging?: boolean;
}

export interface RecoveryContext {
  operation: string;
  input: string | ADFDocument;
  attempt: number;
  previousErrors: Error[];
  nodeType?: string;
  position?: { line: number; column: number };
}

export interface RecoveryResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  strategy?: string;
  fallback?: boolean;
  warnings: string[];
}

/**
 * Error recovery manager for robust error handling
 */
export class ErrorRecoveryManager {
  private options: Required<RecoveryOptions>;

  constructor(options: RecoveryOptions = {}) {
    this.options = {
      maxRetries: 3,
      retryDelay: 100,
      fallbackStrategy: 'best-effort',
      onError: () => {},
      onRecovery: () => {},
      enableLogging: false,
      ...options
    };
  }

  /**
   * Execute operation with retry and recovery strategies
   */
  async executeWithRecovery<T>(
    operation: () => Promise<T> | T,
    context: Partial<RecoveryContext>
  ): Promise<RecoveryResult<T>> {
    const fullContext: RecoveryContext = {
      operation: 'unknown',
      input: '',
      attempt: 0,
      previousErrors: [],
      ...context
    };

    const warnings: string[] = [];
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= this.options.maxRetries; attempt++) {
      fullContext.attempt = attempt;

      try {
        const result = await operation();
        
        if (attempt > 0 && this.options.onRecovery) {
          this.options.onRecovery('retry-success', fullContext);
        }
        
        return {
          success: true,
          data: result,
          warnings
        };
        
      } catch (error) {
        lastError = error as Error;
        fullContext.previousErrors.push(lastError);
        
        if (this.options.onError) {
          this.options.onError(lastError, fullContext);
        }
        
        if (this.options.enableLogging) {
          console.warn(`Attempt ${attempt + 1} failed:`, lastError.message);
        }
        
        // Don't retry for certain error types
        if (this.isNonRetryableError(lastError)) {
          break;
        }
        
        // Apply retry delay
        if (attempt < this.options.maxRetries) {
          await this.delay(this.options.retryDelay);
        }
      }
    }

    // All retries exhausted, apply fallback strategy
    return this.applyFallbackStrategy(lastError!, fullContext, warnings);
  }

  /**
   * Recover from ADF to Markdown conversion errors
   */
  async recoverAdfToMarkdown(
    adf: ADFDocument,
    error: Error,
    context: RecoveryContext
  ): Promise<RecoveryResult<string>> {
    const warnings: string[] = [];
    
    try {
      // Strategy 1: Try converting individual nodes
      if (adf.content && Array.isArray(adf.content)) {
        const convertedNodes: string[] = [];
        
        for (const node of adf.content) {
          try {
            const nodeResult = await this.recoverNodeConversion(node, 'adf-to-markdown');
            if (nodeResult.success && nodeResult.data) {
              convertedNodes.push(nodeResult.data);
            } else {
              warnings.push(`Failed to convert node type: ${node.type}`);
              convertedNodes.push(this.createNodeFallback(node, 'markdown'));
            }
          } catch (nodeError) {
            warnings.push(`Node conversion error: ${nodeError}`);
            convertedNodes.push(this.createNodeFallback(node, 'markdown'));
          }
        }
        
        const result = convertedNodes.join('\n\n');
        
        if (this.options.onRecovery) {
          this.options.onRecovery('node-by-node-recovery', context);
        }
        
        return {
          success: true,
          data: result,
          strategy: 'node-by-node-recovery',
          fallback: true,
          warnings
        };
      }
      
      // Strategy 2: Minimal fallback document
      const fallbackMarkdown = this.createMinimalMarkdown(adf);
      warnings.push('Used minimal fallback conversion');
      
      return {
        success: true,
        data: fallbackMarkdown,
        strategy: 'minimal-fallback',
        fallback: true,
        warnings
      };
      
    } catch (recoveryError) {
      return {
        success: false,
        error: recoveryError as Error,
        warnings
      };
    }
  }

  /**
   * Recover from Markdown to ADF conversion errors
   */
  async recoverMarkdownToAdf(
    markdown: string,
    error: Error,
    context: RecoveryContext
  ): Promise<RecoveryResult<ADFDocument>> {
    const warnings: string[] = [];
    
    try {
      // Strategy 1: Try parsing sections separately
      const sections = this.splitMarkdownIntoSections(markdown);
      const nodes: ADFNode[] = [];
      
      for (const section of sections) {
        try {
          const sectionResult = await this.parseMarkdownSection(section);
          if (sectionResult.success && sectionResult.data) {
            nodes.push(...sectionResult.data.content);
          } else {
            warnings.push(`Failed to parse section: ${section.substring(0, 50)}...`);
            nodes.push(this.createTextFallback(section));
          }
        } catch (sectionError) {
          warnings.push(`Section parsing error: ${sectionError}`);
          nodes.push(this.createTextFallback(section));
        }
      }
      
      const result: ADFDocument = {
        version: 1,
        type: 'doc',
        content: nodes
      };
      
      if (this.options.onRecovery) {
        this.options.onRecovery('section-by-section-recovery', context);
      }
      
      return {
        success: true,
        data: result,
        strategy: 'section-by-section-recovery',
        fallback: true,
        warnings
      };
      
    } catch (recoveryError) {
      // Final fallback: create simple text document
      const fallbackDoc: ADFDocument = {
        version: 1,
        type: 'doc',
        content: [this.createTextFallback(markdown)]
      };
      
      warnings.push('Used text-only fallback conversion');
      
      return {
        success: true,
        data: fallbackDoc,
        strategy: 'text-fallback',
        fallback: true,
        warnings
      };
    }
  }

  /**
   * Apply configured fallback strategy
   */
  private async applyFallbackStrategy<T>(
    error: Error,
    context: RecoveryContext,
    warnings: string[]
  ): Promise<RecoveryResult<T>> {
    switch (this.options.fallbackStrategy) {
      case 'skip':
        warnings.push('Operation skipped due to errors');
        return { success: false, error, warnings };
        
      case 'placeholder':
        const placeholder = this.createPlaceholder(context) as T;
        warnings.push('Used placeholder due to errors');
        return { 
          success: true, 
          data: placeholder, 
          strategy: 'placeholder',
          fallback: true,
          warnings 
        };
        
      case 'best-effort':
        return await this.attemptBestEffortRecovery<T>(error, context, warnings);
        
      case 'throw':
      default:
        return { success: false, error, warnings };
    }
  }

  /**
   * Attempt best-effort recovery based on operation type
   */
  private async attemptBestEffortRecovery<T>(
    error: Error,
    context: RecoveryContext,
    warnings: string[]
  ): Promise<RecoveryResult<T>> {
    try {
      if (context.operation.includes('adfToMarkdown')) {
        const result = await this.recoverAdfToMarkdown(
          context.input as ADFDocument,
          error,
          context
        );
        return result as RecoveryResult<T>;
        
      } else if (context.operation.includes('markdownToAdf')) {
        const result = await this.recoverMarkdownToAdf(
          context.input as string,
          error,
          context
        );
        return result as RecoveryResult<T>;
      }
      
      // Generic fallback
      warnings.push('Applied generic fallback recovery');
      return { 
        success: false, 
        error, 
        strategy: 'generic-fallback',
        warnings 
      };
      
    } catch (recoveryError) {
      return { 
        success: false, 
        error: recoveryError as Error, 
        warnings 
      };
    }
  }

  /**
   * Check if error should not be retried
   */
  private isNonRetryableError(error: Error): boolean {
    // Don't retry validation errors or syntax errors
    return error instanceof ValidationError ||
           error.message.includes('Invalid JSON') ||
           error.message.includes('Syntax error');
  }

  /**
   * Create delay for retry
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Recover individual node conversion
   */
  private async recoverNodeConversion(
    node: ADFNode,
    direction: 'adf-to-markdown' | 'markdown-to-adf'
  ): Promise<RecoveryResult<string>> {
    try {
      // Simplified node conversion logic would go here
      // For now, return a basic fallback
      if (direction === 'adf-to-markdown') {
        return {
          success: true,
          data: this.createNodeFallback(node, 'markdown'),
          warnings: []
        };
      } else {
        return {
          success: true,
          data: JSON.stringify(node),
          warnings: []
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error as Error,
        warnings: []
      };
    }
  }

  /**
   * Create fallback representation for a node
   */
  private createNodeFallback(node: ADFNode, format: 'markdown' | 'adf'): string {
    if (format === 'markdown') {
      switch (node.type) {
        case 'paragraph':
          return node.content 
            ? this.extractTextFromNodes(node.content)
            : '[Paragraph]';
        case 'heading':
          const level = node.attrs?.level || 1;
          const text = node.content 
            ? this.extractTextFromNodes(node.content)
            : '[Heading]';
          return '#'.repeat(level) + ' ' + text;
        case 'codeBlock':
          return '```\n[Code Block]\n```';
        case 'panel':
          return `> [${node.attrs?.panelType || 'info'} panel]`;
        default:
          return `[${node.type}]`;
      }
    } else {
      return JSON.stringify(node, null, 2);
    }
  }

  /**
   * Extract plain text from ADF nodes
   */
  private extractTextFromNodes(nodes: ADFNode[]): string {
    return nodes
      .map(node => {
        if (node.type === 'text' && node.text) {
          return node.text;
        } else if (node.content) {
          return this.extractTextFromNodes(node.content);
        }
        return '';
      })
      .join('');
  }

  /**
   * Create minimal markdown from ADF
   */
  private createMinimalMarkdown(adf: ADFDocument): string {
    const title = '# Document';
    const content = adf.content 
      ? adf.content.map(node => this.createNodeFallback(node, 'markdown')).join('\n\n')
      : '[No content]';
    
    return `${title}\n\n${content}`;
  }

  /**
   * Split markdown into logical sections
   */
  private splitMarkdownIntoSections(markdown: string): string[] {
    // Split by headings or double line breaks
    const sections = markdown
      .split(/(?=^#{1,6}\s)|(?:\n\s*\n)/m)
      .filter(section => section.trim().length > 0);
    
    return sections.length > 0 ? sections : [markdown];
  }

  /**
   * Parse a markdown section
   */
  private async parseMarkdownSection(section: string): Promise<RecoveryResult<ADFDocument>> {
    try {
      // Simplified parsing - in real implementation this would use the actual parser
      const nodes: ADFNode[] = [this.createTextFallback(section)];
      
      return {
        success: true,
        data: {
          version: 1,
          type: 'doc',
          content: nodes
        },
        warnings: []
      };
    } catch (error) {
      return {
        success: false,
        error: error as Error,
        warnings: []
      };
    }
  }

  /**
   * Create text fallback node
   */
  private createTextFallback(text: string): ADFNode {
    return {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: text.trim()
        }
      ]
    };
  }

  /**
   * Create placeholder based on context
   */
  private createPlaceholder(context: RecoveryContext): unknown {
    if (context.operation.includes('adfToMarkdown')) {
      return `[Error converting ADF to Markdown: ${context.operation}]`;
    } else if (context.operation.includes('markdownToAdf')) {
      return {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: `[Error converting Markdown to ADF: ${context.operation}]`
              }
            ]
          }
        ]
      };
    }
    
    return `[Error in operation: ${context.operation}]`;
  }
}