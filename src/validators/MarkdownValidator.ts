/**
 * @file Extended Markdown validator
 */

import type { ValidationResult } from '../types';

export class MarkdownValidator {
  validate(markdown: string): ValidationResult {
    const errors: Array<{ path?: string; message: string; code?: string }> = [];
    const warnings: string[] = [];
    
    // Check for basic markdown structure
    if (typeof markdown !== 'string') {
      return {
        valid: false,
        errors: [
          {
            message: 'Input must be a string',
            code: 'INVALID_TYPE'
          }
        ]
      };
    }
    
    // Check for unmatched fence blocks
    const fenceMatches = markdown.match(/~~~\w+/g) || [];
    const closeFences = markdown.match(/~~~/g) || [];
    
    if (fenceMatches.length !== Math.floor(closeFences.length / 2)) {
      warnings.push('Possible unmatched fence blocks detected');
    }
    
    // TODO: Add more validation rules for Extended Markdown syntax
    
    return {
      valid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }
}