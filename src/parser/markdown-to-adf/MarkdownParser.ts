/**
 * @file MarkdownParser.ts
 * @description Main parser class that converts Extended Markdown to ADF
 * @author Extended ADF Parser
 */

import { MarkdownTokenizer } from './MarkdownTokenizer.js';
import { TokenizeOptions } from './types.js';
import { ASTBuilder, ASTBuildOptions } from './ASTBuilder.js';
import { ADFDocument } from '../../types/adf.types.js';

export interface MarkdownParseOptions {
  tokenizer?: TokenizeOptions;
  astBuilder?: ASTBuildOptions;
}

export class MarkdownParser {
  private tokenizer: MarkdownTokenizer;
  private astBuilder: ASTBuilder;
  private options: MarkdownParseOptions;

  constructor(options: MarkdownParseOptions = {}) {
    this.options = options;
    this.tokenizer = new MarkdownTokenizer(options.tokenizer);
    this.astBuilder = new ASTBuilder(options.astBuilder);
  }

  /**
   * Parse Extended Markdown string into ADF document
   */
  parse(markdown: string): ADFDocument {
    try {
      // Step 1: Tokenize the markdown
      const tokens = this.tokenizer.tokenize(markdown);

      // Step 2: Extract frontmatter if present
      const frontmatterToken = tokens.find(token => token.type === 'frontmatter');
      const frontmatter = frontmatterToken?.content;

      // Step 3: Build ADF from tokens
      const adf = this.astBuilder.buildADF(tokens, frontmatter);

      return adf;
    } catch (error) {
      if (this.options.astBuilder?.strict) {
        throw new Error(`Failed to parse markdown: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Return minimal valid ADF on error
      return {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: `[Parser Error: ${error instanceof Error ? error.message : 'Failed to parse markdown'}]`
              }
            ]
          }
        ]
      };
    }
  }

  /**
   * Parse markdown with custom options for this operation
   */
  parseWithOptions(markdown: string, options: MarkdownParseOptions): ADFDocument {
    const tempParser = new MarkdownParser(options);
    return tempParser.parse(markdown);
  }

  /**
   * Validate that markdown can be parsed successfully
   */
  validate(markdown: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    try {
      const tokens = this.tokenizer.tokenize(markdown);
      const frontmatterToken = tokens.find(token => token.type === 'frontmatter');
      const adf = this.astBuilder.buildADF(tokens, frontmatterToken?.content);
      
      // Basic ADF validation
      if (!adf.version || adf.version !== 1) {
        errors.push('Invalid ADF version');
      }
      
      if (adf.type !== 'doc') {
        errors.push('Invalid ADF document type');
      }
      
      if (!Array.isArray(adf.content)) {
        errors.push('ADF content must be an array');
      }
      
      return {
        valid: errors.length === 0,
        errors
      };
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Unknown parsing error');
      return {
        valid: false,
        errors
      };
    }
  }

  /**
   * Get parser statistics for debugging
   */
  getStats(markdown: string): {
    tokenCount: number;
    nodeCount: number;
    hasMetadata: boolean;
    hasFrontmatter: boolean;
    complexity: 'simple' | 'moderate' | 'complex';
  } {
    try {
      const tokens = this.tokenizer.tokenize(markdown);
      const adf = this.astBuilder.buildADF(tokens);
      
      const tokenCount = tokens.length;
      const nodeCount = this.countNodes(adf.content);
      const hasMetadata = tokens.some(token => token.metadata);
      const hasFrontmatter = tokens.some(token => token.type === 'frontmatter');
      
      let complexity: 'simple' | 'moderate' | 'complex';
      if (nodeCount <= 5) complexity = 'simple';
      else if (nodeCount <= 20) complexity = 'moderate';
      else complexity = 'complex';
      
      return {
        tokenCount,
        nodeCount,
        hasMetadata,
        hasFrontmatter,
        complexity
      };
    } catch {
      return {
        tokenCount: 0,
        nodeCount: 0,
        hasMetadata: false,
        hasFrontmatter: false,
        complexity: 'simple'
      };
    }
  }

  private countNodes(content: any[]): number {
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