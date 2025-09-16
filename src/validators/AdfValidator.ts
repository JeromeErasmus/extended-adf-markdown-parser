/**
 * @file ADF document validator
 */

import Ajv from 'ajv';
import type { ADFDocument, ValidationResult } from '../types';

export class AdfValidator {
  private ajv: Ajv;
  
  constructor() {
    this.ajv = new Ajv({
      allErrors: true,
      verbose: true
    });
    
    this.registerSchemas();
  }
  
  validate(adf: unknown): ValidationResult {
    // Basic structure validation
    if (!this.isValidAdfStructure(adf)) {
      return {
        valid: false,
        errors: [
          {
            message: 'Invalid ADF structure: must have type "doc" and content array',
            code: 'INVALID_STRUCTURE'
          }
        ]
      };
    }
    
    // TODO: Add schema-based validation
    
    return {
      valid: true,
      errors: []
    };
  }
  
  isValidAdf(content: unknown): content is ADFDocument {
    return this.isValidAdfStructure(content);
  }
  
  private isValidAdfStructure(content: unknown): content is ADFDocument {
    if (typeof content !== 'object' || content === null) {
      return false;
    }
    
    const doc = content as any;
    return doc.type === 'doc' && Array.isArray(doc.content);
  }
  
  private registerSchemas(): void {
    // TODO: Register ADF JSON schemas
  }
}