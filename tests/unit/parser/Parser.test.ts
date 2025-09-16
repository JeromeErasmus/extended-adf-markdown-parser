/**
 * @file Tests for the main Parser class
 */

import Parser from '../../../src';
import type { ADFDocument } from '../../../src/types';

describe('Parser', () => {
  let parser: Parser;
  
  beforeEach(() => {
    parser = new Parser();
  });
  
  describe('constructor', () => {
    it('should create a parser instance', () => {
      expect(parser).toBeInstanceOf(Parser);
    });
  });
  
  describe('adfToMarkdown', () => {
    it('should convert simple ADF to markdown', () => {
      const adf: ADFDocument = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Hello World'
              }
            ]
          }
        ]
      };
      
      // TODO: Implement actual conversion
      const markdown = parser.adfToMarkdown(adf);
      expect(typeof markdown).toBe('string');
    });
  });
  
  describe('markdownToAdf', () => {
    it('should convert markdown to ADF', () => {
      const markdown = 'Hello World';
      
      const adf = parser.markdownToAdf(markdown);
      expect(adf).toHaveProperty('type', 'doc');
      expect(adf).toHaveProperty('content');
      expect(Array.isArray(adf.content)).toBe(true);
    });
  });
  
  describe('validateAdf', () => {
    it('should validate correct ADF structure', () => {
      const adf: ADFDocument = {
        type: 'doc',
        content: []
      };
      
      const result = parser.validateAdf(adf);
      expect(result.valid).toBe(true);
    });
    
    it('should reject invalid ADF structure', () => {
      const invalid = {
        type: 'invalid',
        content: null
      };
      
      const result = parser.validateAdf(invalid);
      expect(result.valid).toBe(false);
    });
  });
});