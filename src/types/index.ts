/**
 * @file Type definitions for ADF and Extended Markdown
 */

export * from './adf.types';
export * from './markdown.types';

// Common types
export interface ConversionOptions {
  strict?: boolean;
  preserveWhitespace?: boolean;
  validateInput?: boolean;
  
  // Enhanced parser options
  enableAdfExtensions?: boolean;
  gfm?: boolean;
  frontmatter?: boolean;
  maxDepth?: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings?: string[];
}

export interface ValidationError {
  path?: string;
  message: string;
  code?: string;
}