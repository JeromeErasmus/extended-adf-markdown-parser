/**
 * @file EnhancedMarkdownParser.ts
 * @description Enhanced parser with micromark extensions and remark plugin support
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import { remarkAdf } from '../remark/remark-adf.js';
import type { Root } from 'mdast';
import type { VFile } from 'vfile';
import { ADFDocument } from '../../types/adf.types.js';
import { ASTBuilder } from './ASTBuilder.js';
import { processMetadataComments } from '../../utils/metadata-comments.js';

/**
 * Enhanced parser options that support micromark extensions
 */
export interface EnhancedMarkdownParseOptions {
  /**
   * Enable strict parsing mode
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
  
  /**
   * Enable GitHub Flavored Markdown extensions
   */
  gfm?: boolean;
  
  /**
   * Enable frontmatter parsing
   */
  frontmatter?: boolean;
  
  /**
   * Enable ADF fence block extensions
   */
  adfExtensions?: boolean;
}

/**
 * Enhanced Markdown parser with micromark and remark plugin support
 */
export class EnhancedMarkdownParser {
  private processor: ReturnType<typeof unified>;
  private astBuilder: ASTBuilder;
  private options: EnhancedMarkdownParseOptions;

  constructor(options: EnhancedMarkdownParseOptions = {}) {
    this.options = {
      strict: false,
      gfm: true,
      frontmatter: true,
      adfExtensions: true,
      maxNestingDepth: 5,
      ...options
    };

    this.astBuilder = new ASTBuilder({
      strict: this.options.strict,
      maxDepth: this.options.maxNestingDepth
    });

    this.processor = this.createProcessor();
  }

  /**
   * Create the unified processor with plugins
   */
  private createProcessor() {
    let processor = unified()
      .use(remarkParse);

    // Add frontmatter support
    if (this.options.frontmatter) {
      processor = processor.use(remarkFrontmatter, ['yaml', 'toml']);
    }

    // Add GitHub Flavored Markdown support
    if (this.options.gfm) {
      processor = processor.use(remarkGfm);
    }

    // Add ADF extensions
    if (this.options.adfExtensions) {
      processor = processor.use(remarkAdf, {
        strict: this.options.strict,
        customBlockTypes: this.options.customBlockTypes,
        maxNestingDepth: this.options.maxNestingDepth
      });
    }

    return processor;
  }

  /**
   * Parse Enhanced Markdown to ADF using unified/remark
   */
  async parse(markdown: string): Promise<ADFDocument> {
    try {
      // Parse markdown to mdast using unified
      const tree = this.processor.parse(markdown);
      const processedTree = await this.processor.run(tree) as Root;

      // Convert mdast to ADF using our AST builder
      const adf = await this.convertMdastToAdf(processedTree);
      return adf;

    } catch (error) {
      if (this.options.strict) {
        throw new Error(`Enhanced parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Return fallback ADF document
      return {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: `[Enhanced Parser Error: ${error instanceof Error ? error.message : 'Failed to parse markdown'}]`
              }
            ]
          }
        ]
      };
    }
  }

  /**
   * Parse markdown synchronously (for backward compatibility)
   */
  parseSync(markdown: string): ADFDocument {
    try {
      // Parse markdown to mdast using unified
      const tree = this.processor.parse(markdown);
      const processedTree = this.processor.runSync(tree) as Root;

      // Convert to ADF synchronously
      return this.convertMdastToAdfSync(processedTree);

    } catch (error) {
      if (this.options.strict) {
        throw new Error(`Enhanced parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      return {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: `[Enhanced Parser Error: ${error instanceof Error ? error.message : 'Failed to parse markdown'}]`
              }
            ]
          }
        ]
      };
    }
  }

  /**
   * Validate markdown structure using enhanced parser
   */
  async validate(markdown: string): Promise<{ valid: boolean; errors: string[]; warnings: string[] }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const tree = this.processor.parse(markdown);
      const processedTree = await this.processor.run(tree) as Root;

      // Additional validation of the AST structure
      this.validateMdastTree(processedTree, errors, warnings);

      // Try to convert to ADF to catch conversion issues
      try {
        await this.convertMdastToAdf(processedTree);
      } catch (conversionError) {
        errors.push(`ADF conversion failed: ${conversionError instanceof Error ? conversionError.message : 'Unknown error'}`);
      }

    } catch (parseError) {
      errors.push(`Parse failed: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get enhanced parsing statistics
   */
  async getStats(markdown: string): Promise<{
    nodeCount: number;
    adfBlockCount: number;
    hasGfmFeatures: boolean;
    hasFrontmatter: boolean;
    hasAdfExtensions: boolean;
    complexity: 'simple' | 'moderate' | 'complex';
    processingTime: number;
  }> {
    const startTime = Date.now();
    
    try {
      const tree = this.processor.parse(markdown);
      const processedTree = await this.processor.run(tree) as Root;
      
      // Post-process for ADF fence blocks and convert to ADF to analyze the final result
      const processedTreeWithAdf = this.postProcessAdfFenceBlocks(processedTree);
      const adf = await this.convertMdastToAdf(processedTreeWithAdf);
      const stats = this.analyzeAdfDocument(adf, processedTreeWithAdf);
      const processingTime = Date.now() - startTime;
      
      return {
        ...stats,
        processingTime
      };

    } catch {
      return {
        nodeCount: 0,
        adfBlockCount: 0,
        hasGfmFeatures: false,
        hasFrontmatter: false,
        hasAdfExtensions: false,
        complexity: 'simple',
        processingTime: Date.now() - startTime
      };
    }
  }

  /**
   * Convert markdown back to string using enhanced processor
   */
  async stringify(adf: ADFDocument): Promise<string> {
    // First convert ADF back to mdast
    const tree = await this.convertAdfToMdast(adf);
    
    // Then stringify using remark
    const processor = unified()
      .use(remarkParse) // Need parser for the processor to work
      .use(remarkStringify, {
        bullet: '-',
        fence: '~',
        fences: true,
        resourceLink: true
      });

    if (this.options.frontmatter) {
      processor.use(remarkFrontmatter, ['yaml']);
    }

    if (this.options.gfm) {
      processor.use(remarkGfm);
    }

    if (this.options.adfExtensions) {
      processor.use(remarkAdf);
    }

    const file = await processor.stringify(tree);
    return String(file);
  }

  /**
   * Convert mdast tree to ADF document
   */
  private async convertMdastToAdf(tree: Root): Promise<ADFDocument> {
    // Post-process the tree in stages
    let processedTree = tree;
    
    // 1. Process metadata comments first (before ADF fence block processing)
    processedTree = processMetadataComments(processedTree);
    
    // 2. Convert ADF fence blocks
    processedTree = this.postProcessAdfFenceBlocks(processedTree);

    // Extract frontmatter if present
    let frontmatter: any = null;
    const frontmatterNode = processedTree.children.find(node => node.type === 'yaml' || node.type === 'toml');
    
    if (frontmatterNode && 'value' in frontmatterNode) {
      try {
        if (frontmatterNode.type === 'yaml') {
          const yaml = await import('js-yaml');
          frontmatter = yaml.load(frontmatterNode.value);
        } else if (frontmatterNode.type === 'toml') {
          const toml = await import('@ltd/j-toml');
          frontmatter = toml.parse(frontmatterNode.value);
        }
      } catch (error) {
        // Ignore frontmatter parsing errors in non-strict mode
        if (this.options.strict) {
          throw new Error(`Frontmatter parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    // Convert the tree using AST builder
    return this.astBuilder.buildADFFromMdast(processedTree, frontmatter);
  }

  /**
   * Synchronous version of mdast to ADF conversion
   */
  private convertMdastToAdfSync(tree: Root): ADFDocument {
    try {
      // Post-process the tree in stages
      let processedTree = tree;
      
      // 1. Process metadata comments first (before ADF fence block processing)
      processedTree = processMetadataComments(processedTree);
      
      // 2. Convert ADF fence blocks
      processedTree = this.postProcessAdfFenceBlocks(processedTree);
      
      // For sync version, handle frontmatter more simply
      let frontmatter: any = null;
      const frontmatterNode = processedTree.children.find(node => node.type === 'yaml');
      
      if (frontmatterNode && 'value' in frontmatterNode) {
        try {
          // Use a sync YAML parser or basic JSON parsing
          const yamlContent = frontmatterNode.value as string;
          
          // Try to parse as JSON first (simpler)
          if (yamlContent.trim().startsWith('{')) {
            frontmatter = JSON.parse(yamlContent);
          } else {
            // For proper YAML parsing in sync mode, we'd need a sync YAML library
            // For now, extract basic key-value pairs
            const lines = yamlContent.split('\n');
            frontmatter = {};
            for (const line of lines) {
              const match = line.match(/^(\w+):\s*(.+)$/);
              if (match) {
                frontmatter[match[1]] = match[2].replace(/^['"]|['"]$/g, ''); // Remove quotes
              }
            }
          }
        } catch {
          // Ignore frontmatter parsing errors
        }
      }

      return this.astBuilder.buildADFFromMdast(processedTree, frontmatter);
    } catch (error) {
      return this.createErrorDocument(`Failed to convert mdast to ADF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Post-process mdast tree to convert code blocks with ADF languages to ADF fence nodes
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
        else if (/^\d+$/.test(parsedValue)) parsedValue = parseInt(parsedValue, 10);
        else if (/^\d*\.\d+$/.test(parsedValue)) parsedValue = parseFloat(parsedValue);
        
        attributes[key] = parsedValue;
      }
    }
    
    return attributes;
  }

  /**
   * Create error document for failed parsing
   */
  private createErrorDocument(message: string): ADFDocument {
    return {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: `[Enhanced Parser Error: ${message}]`
            }
          ]
        }
      ]
    };
  }

  /**
   * Convert ADF back to mdast tree
   */
  private async convertAdfToMdast(adf: ADFDocument): Promise<Root> {
    return this.astBuilder.buildMdastFromADF(adf);
  }

  /**
   * Validate mdast tree structure
   */
  private validateMdastTree(tree: Root, errors: string[], warnings: string[]): void {
    // Basic tree validation
    if (!tree.children || !Array.isArray(tree.children)) {
      errors.push('Invalid AST: missing or invalid children array');
      return;
    }

    // Check for ADF fence blocks and validate them
    this.walkTree(tree, (node) => {
      if (node.type === 'adfFence') {
        const adfNode = node as any; // We know this has ADF properties
        
        if (!adfNode.nodeType) {
          warnings.push(`ADF fence block missing nodeType`);
        }
        
        if (adfNode.nodeType && !['panel', 'expand', 'mediaSingle', 'mediaGroup', 'nestedExpand'].includes(adfNode.nodeType)) {
          warnings.push(`Unknown ADF node type: ${adfNode.nodeType}`);
        }
      }
    });
  }

  /**
   * Analyze ADF document and mdast tree for statistics
   */
  private analyzeAdfDocument(adf: ADFDocument, tree: Root): {
    nodeCount: number;
    adfBlockCount: number;
    hasGfmFeatures: boolean;
    hasFrontmatter: boolean;
    hasAdfExtensions: boolean;
    complexity: 'simple' | 'moderate' | 'complex';
  } {
    let nodeCount = 0;
    let adfBlockCount = 0;
    let hasGfmFeatures = false;
    let hasFrontmatter = false;
    let hasAdfExtensions = false;

    // Analyze ADF document
    this.walkAdfNodes(adf.content, (node) => {
      nodeCount++;
      
      if (['panel', 'expand', 'nestedExpand', 'mediaSingle', 'mediaGroup'].includes(node.type)) {
        adfBlockCount++;
        hasAdfExtensions = true;
      }
      
      // Check for GFM features
      if (['table', 'tableRow', 'tableCell'].includes(node.type)) {
        hasGfmFeatures = true;
      }
    });

    // Check mdast tree for additional features
    this.walkTree(tree, (node) => {
      if (node.type === 'yaml' || node.type === 'toml') {
        hasFrontmatter = true;
      }
      
      if (node.type === 'delete') {
        hasGfmFeatures = true;
      }
    });

    let complexity: 'simple' | 'moderate' | 'complex';
    if (nodeCount <= 10 && !hasAdfExtensions) complexity = 'simple';
    else if (nodeCount <= 50 && adfBlockCount <= 3) complexity = 'moderate';
    else complexity = 'complex';

    return {
      nodeCount,
      adfBlockCount,
      hasGfmFeatures,
      hasFrontmatter,
      hasAdfExtensions,
      complexity
    };
  }

  /**
   * Walk ADF nodes and call visitor for each node
   */
  private walkAdfNodes(nodes: any[], visitor: (node: any) => void): void {
    for (const node of nodes) {
      visitor(node);
      
      if (node.content && Array.isArray(node.content)) {
        this.walkAdfNodes(node.content, visitor);
      }
    }
  }

  /**
   * Walk the AST tree and call visitor for each node
   */
  private walkTree(node: any, visitor: (node: any) => void): void {
    visitor(node);
    
    if (node.children && Array.isArray(node.children)) {
      for (const child of node.children) {
        this.walkTree(child, visitor);
      }
    }
  }
}