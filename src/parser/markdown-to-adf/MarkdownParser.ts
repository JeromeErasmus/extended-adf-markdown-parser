/**
 * @file MarkdownParser.ts
 * @description Main parser class that converts Extended Markdown to ADF
 * @author Extended ADF Parser
 */

import { MarkdownTokenizer } from './MarkdownTokenizer.js';
import { TokenizeOptions } from './types.js';
import { ASTBuilder, ASTBuildOptions } from './ASTBuilder.js';
import { ADFDocument } from '../../types/adf.types.js';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { remarkAdf } from '../remark/remark-adf.js';
import { processMetadataComments } from '../../utils/metadata-comments.js';
import type { Root } from 'mdast';

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
      // Step 1: Check if markdown contains metadata comments
      const hasMetadataComments = this.hasMetadataComments(markdown);

      if (hasMetadataComments) {
        // Use mdast-based processing for metadata comment support
        return this.parseWithMetadataComments(markdown);
      }

      // Step 2: Tokenize the markdown (original fast path)
      const tokens = this.tokenizer.tokenize(markdown);

      // Step 3: Extract frontmatter if present
      const frontmatterToken = tokens.find(token => token.type === 'frontmatter');
      const frontmatter = frontmatterToken?.content;

      // Step 4: Build ADF from tokens
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

  /**
   * Check if markdown contains ADF metadata comments
   */
  private hasMetadataComments(markdown: string): boolean {
    // Look for ADF metadata comment patterns
    return /<!--\s*adf:[a-zA-Z][a-zA-Z0-9]*\s+/.test(markdown);
  }

  /**
   * Parse markdown with metadata comments using mdast-based processing
   * This provides the same metadata comment support as the Enhanced Parser
   */
  private parseWithMetadataComments(markdown: string): ADFDocument {
    try {
      // Preprocess to fix consecutive HTML comments (same as Enhanced Parser)
      const preprocessedMarkdown = this.preprocessConsecutiveHtmlComments(markdown);
      
      // Parse markdown to mdast using unified with GFM support for tables and ADF extensions
      const processor = unified()
        .use(remarkParse)
        .use(remarkGfm) // Add GFM support for proper table parsing
        .use(remarkAdf, { strict: this.options.astBuilder?.strict || false }); // Add ADF fence block support
      
      const tree = processor.parse(preprocessedMarkdown);
      const transformedTree = processor.runSync(tree) as Root; // Run plugins to transform code blocks to adfFence
      
      // Process metadata comments using the same utility as Enhanced Parser
      let processedTree = processMetadataComments(transformedTree);
      
      // Post-process ADF fence blocks (same as Enhanced Parser)
      processedTree = this.postProcessAdfFenceBlocks(processedTree);
      
      // Extract frontmatter if present
      let frontmatter: any = null;
      const frontmatterNode = processedTree.children.find(node => node.type === 'yaml');
      
      if (frontmatterNode && 'value' in frontmatterNode) {
        try {
          // Simple frontmatter parsing - for full YAML support, we'd import js-yaml
          const yamlContent = frontmatterNode.value as string;
          if (yamlContent.trim().startsWith('{')) {
            frontmatter = JSON.parse(yamlContent);
          }
        } catch {
          // Ignore frontmatter parsing errors in basic parser
        }
      }
      
      // Use ASTBuilder's mdast conversion method
      return this.astBuilder.buildADFFromMdast(processedTree, frontmatter);
      
    } catch (error) {
      if (this.options.astBuilder?.strict) {
        throw new Error(`Metadata comment parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      // Fallback to token-based parsing without metadata comments
      const tokens = this.tokenizer.tokenize(markdown);
      const frontmatterToken = tokens.find(token => token.type === 'frontmatter');
      const frontmatter = frontmatterToken?.content;
      
      return this.astBuilder.buildADF(tokens, frontmatter);
    }
  }

  /**
   * Preprocess to fix consecutive HTML comments
   * Same method as used in EnhancedMarkdownParser
   */
  private preprocessConsecutiveHtmlComments(markdown: string): string {
    // Replace consecutive HTML comments with line breaks between them
    let processed = markdown.replace(/-->\s*<!--/g, '-->\n<!--');
    
    // Also ensure HTML comments are separated from following content
    processed = processed.replace(/(-->)([^\s\n])/g, '$1\n$2');
    
    return processed;
  }

  /**
   * Post-process mdast tree to convert code blocks with ADF languages to ADF fence nodes
   * Same method as used in EnhancedMarkdownParser
   */
  private postProcessAdfFenceBlocks(tree: Root): Root {
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
   * Same method as used in EnhancedMarkdownParser
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