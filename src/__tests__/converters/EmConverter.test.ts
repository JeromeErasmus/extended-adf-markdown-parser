/**
 * @file Tests for EmConverter
 */

import { describe, it, expect } from '@jest/globals';
import { EmConverter } from '../../parser/adf-to-markdown/marks/EmConverter';
import type { ConversionContext } from '../../parser/types';

const mockContext: ConversionContext = {
  convertChildren: jest.fn(),
  depth: 0,
  options: {}
};

describe('EmConverter', () => {
  const converter = new EmConverter();

  describe('markType', () => {
    it('should have correct markType', () => {
      expect(converter.markType).toBe('em');
    });
  });

  describe('toMarkdown', () => {
    it('should convert em mark', () => {
      const mark = { type: 'em' };
      const text = 'italic text';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('*italic text*');
    });

    it('should handle empty text', () => {
      const mark = { type: 'em' };
      const text = '';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('**');
    });

    it('should include metadata for custom attributes', () => {
      const mark = {
        type: 'em',
        attrs: {
          customAttr: 'value',
          style: 'italic'
        }
      };
      const text = 'italic with attrs';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('*italic with attrs*<!-- adf:em attrs=\'{"customAttr":"value","style":"italic"}\' -->');
    });

    it('should not include metadata for empty attributes', () => {
      const mark = {
        type: 'em',
        attrs: {}
      };
      const text = 'simple italic';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('*simple italic*');
    });

    it('should not include metadata when attrs is undefined', () => {
      const mark = { type: 'em' };
      const text = 'simple italic';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('*simple italic*');
    });
  });
});