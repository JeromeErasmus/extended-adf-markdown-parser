/**
 * @file Tests for StrongConverter
 */

import { describe, it, expect, jest } from '@jest/globals';
import { StrongConverter } from '../../../src/parser/adf-to-markdown/marks/StrongConverter';
import type { ConversionContext } from '../../../src/parser/types';

const mockContext: ConversionContext = {
  convertChildren: jest.fn(),
  depth: 0,
  options: {}
};

describe('StrongConverter', () => {
  const converter = new StrongConverter();

  describe('markType', () => {
    it('should have correct markType', () => {
      expect(converter.markType).toBe('strong');
    });
  });

  describe('toMarkdown', () => {
    it('should convert strong mark', () => {
      const mark = { type: 'strong' };
      const text = 'bold text';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('**bold text**');
    });

    it('should handle empty text', () => {
      const mark = { type: 'strong' };
      const text = '';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('****');
    });

    it('should include metadata for custom attributes', () => {
      const mark = {
        type: 'strong',
        attrs: {
          customAttr: 'value',
          id: 'strong-1'
        }
      };
      const text = 'bold with attrs';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('**bold with attrs**<!-- adf:strong attrs=\'{"customAttr":"value","id":"strong-1"}\' -->');
    });

    it('should not include metadata for empty attributes', () => {
      const mark = {
        type: 'strong',
        attrs: {}
      };
      const text = 'simple bold';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('**simple bold**');
    });

    it('should not include metadata when attrs is undefined', () => {
      const mark = { type: 'strong' };
      const text = 'simple bold';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('**simple bold**');
    });
  });
});