/**
 * @file EnhancedMarkdownParser.ts
 * @description Enhanced parser - now just an alias for the unified Parser class
 * @deprecated Use the main Parser class instead, which now includes all enhanced functionality by default
 */

import { Parser } from '../../index.js';
import type { ConversionOptions, ADFDocument } from '../../types/index.js';

/**
 * Enhanced Markdown parser - now just extends Parser with no additional functionality
 * @deprecated Use the main Parser class instead, which now includes all enhanced functionality by default
 */
export class EnhancedMarkdownParser extends Parser {
  constructor(options: ConversionOptions = {}) {
    super(options);
  }

  /**
   * Parse markdown synchronously - delegates to parent
   */
  parseSync(markdown: string): ADFDocument {
    return this.markdownToAdf(markdown);
  }

  /**
   * Parse markdown asynchronously - delegates to parent
   */
  async parse(markdown: string): Promise<ADFDocument> {
    return await this.markdownToAdfAsync(markdown);
  }

  /**
   * Validate markdown - delegates to parent
   */
  async validate(markdown: string): Promise<{ valid: boolean; errors: string[]; warnings: string[] }> {
    const result = await this.validateMarkdownAsync(markdown);
    return {
      valid: result.valid,
      errors: result.errors.map(e => e.message),
      warnings: result.warnings || []
    };
  }

  /**
   * Get parsing statistics - delegates to parent
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
    return await super.getStats(markdown);
  }
}