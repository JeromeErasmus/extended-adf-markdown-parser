/**
 * @file adf-extension.ts
 * @description Main micromark extension for ADF syntax
 */

import { Extension } from 'micromark-util-types';
import { adfFence } from './adf-fence.js';

/**
 * Micromark extension that adds support for ADF fence blocks
 * Temporarily disabled due to splice buffer issues - will implement post-processing approach
 */
export function adfMicromarkExtension(): Extension {
  return {
    flow: {
      // Temporarily disable the ADF fence tokenizer to fix buffer issues
      // 126: adfFence  // Register for '~' character (tilde)
    }
  };
}

/**
 * Extension options for customizing ADF parsing
 */
export interface AdfMicromarkOptions {
  /**
   * Enable strict mode - reject invalid ADF syntax
   */
  strict?: boolean;
  
  /**
   * Custom ADF block types to support
   */
  customBlockTypes?: string[];
  
  /**
   * Maximum nesting depth for ADF blocks
   */
  maxNestingDepth?: number;
}

/**
 * Create ADF micromark extension with options
 */
export function adfMicromarkExtensionWithOptions(options: AdfMicromarkOptions = {}): Extension {
  const extension = adfMicromarkExtension();
  
  // TODO: Apply options to customize behavior
  // This would require modifying the tokenizer to respect options
  
  return extension;
}