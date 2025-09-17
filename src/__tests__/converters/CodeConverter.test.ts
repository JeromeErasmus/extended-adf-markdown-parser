/**
 * @file Tests for CodeConverter
 */

import { describe, it, expect, jest } from '@jest/globals';
import { CodeConverter } from '../../parser/adf-to-markdown/marks/CodeConverter';
import type { ConversionContext } from '../../parser/types';

const mockContext: ConversionContext = {
  convertChildren: jest.fn(),
  depth: 0,
  options: {}
};

describe('CodeConverter', () => {
  const converter = new CodeConverter();

  describe('markType', () => {
    it('should have correct markType', () => {
      expect(converter.markType).toBe('code');
    });
  });

  describe('toMarkdown', () => {
    it('should convert code mark', () => {
      const mark = { type: 'code' };
      const text = 'console.log()';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('`console.log()`');
    });

    it('should handle empty text', () => {
      const mark = { type: 'code' };
      const text = '';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('``');
    });

    it('should handle text with special characters', () => {
      const mark = { type: 'code' };
      const text = 'const x = `template ${var}`;';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('`const x = `template ${var}`;`');
    });

    it('should include metadata for custom attributes', () => {
      const mark = {
        type: 'code',
        attrs: {
          language: 'javascript',
          highlight: true
        }
      };
      const text = 'function test()';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('`function test()`<!-- adf:code attrs=\'{"language":"javascript","highlight":true}\' -->');
    });

    it('should not include metadata for empty attributes', () => {
      const mark = {
        type: 'code',
        attrs: {}
      };
      const text = 'simple code';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('`simple code`');
    });

    it('should not include metadata when attrs is undefined', () => {
      const mark = { type: 'code' };
      const text = 'simple code';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('`simple code`');
    });
  });
});