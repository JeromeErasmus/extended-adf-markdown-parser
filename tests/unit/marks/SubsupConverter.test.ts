/**
 * @file Tests for SubsupConverter
 */

import { describe, it, expect, jest } from '@jest/globals';
import { SubsupConverter } from '../../../src/parser/adf-to-markdown/marks/SubsupConverter';
import type { ConversionContext } from '../../../src/parser/types';

const mockContext: ConversionContext = {
  convertChildren: jest.fn(),
  depth: 0,
  options: {}
};

describe('SubsupConverter', () => {
  const converter = new SubsupConverter();

  describe('markType', () => {
    it('should have correct markType', () => {
      expect(converter.markType).toBe('subsup');
    });
  });

  describe('toMarkdown', () => {
    it('should convert subscript mark', () => {
      const mark = { 
        type: 'subsup',
        attrs: { type: 'sub' }
      };
      const text = '2';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('<sub>2</sub><!-- adf:subsup attrs=\'{"type":"sub"}\' -->');
    });

    it('should convert superscript mark', () => {
      const mark = { 
        type: 'subsup',
        attrs: { type: 'sup' }
      };
      const text = '2';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('<sup>2</sup><!-- adf:subsup attrs=\'{"type":"sup"}\' -->');
    });

    it('should default to superscript when type is unclear', () => {
      const mark = { 
        type: 'subsup',
        attrs: { type: 'unknown' }
      };
      const text = 'x';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('<sup>x</sup><!-- adf:subsup attrs=\'{"type":"unknown"}\' -->');
    });

    it('should default to superscript when no type specified', () => {
      const mark = { 
        type: 'subsup',
        attrs: {}
      };
      const text = 'n';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('<sup>n</sup>');
    });

    it('should handle empty text', () => {
      const mark = { 
        type: 'subsup',
        attrs: { type: 'sub' }
      };
      const text = '';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('<sub></sub><!-- adf:subsup attrs=\'{"type":"sub"}\' -->');
    });

    it('should handle multi-character text', () => {
      const mark = {
        type: 'subsup',
        attrs: { type: 'sup' }
      };
      const text = 'nd';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('<sup>nd</sup><!-- adf:subsup attrs=\'{"type":"sup"}\' -->');
    });

    it('should include metadata for additional attributes', () => {
      const mark = {
        type: 'subsup',
        attrs: {
          type: 'sub',
          customAttr: 'value',
          id: 'subsup-1'
        }
      };
      const text = 'formula';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('<sub>formula</sub><!-- adf:subsup attrs=\'{"type":"sub","customAttr":"value","id":"subsup-1"}\' -->');
    });

    it('should not include metadata when attrs is undefined', () => {
      const mark = { type: 'subsup' };
      const text = 'default';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('<sup>default</sup>');
    });

    it('should handle text with special characters', () => {
      const mark = {
        type: 'subsup',
        attrs: { type: 'sub' }
      };
      const text = 'H<sub>2</sub>O';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('<sub>H<sub>2</sub>O</sub><!-- adf:subsup attrs=\'{"type":"sub"}\' -->');
    });
  });
});