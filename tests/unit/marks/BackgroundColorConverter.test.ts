/**
 * @file Tests for BackgroundColorConverter
 */

import { describe, it, expect, jest } from '@jest/globals';
import { BackgroundColorConverter } from '../../../src/parser/adf-to-markdown/marks/BackgroundColorConverter';
import type { ConversionContext } from '../../../src/parser/types';

const mockContext: ConversionContext = {
  convertChildren: jest.fn(),
  depth: 0,
  options: {}
};

describe('BackgroundColorConverter', () => {
  const converter = new BackgroundColorConverter();

  describe('markType', () => {
    it('should have correct markType', () => {
      expect(converter.markType).toBe('backgroundColor');
    });
  });

  describe('toMarkdown', () => {
    it('should convert backgroundColor mark with color', () => {
      const mark = { 
        type: 'backgroundColor',
        attrs: { color: 'yellow' }
      };
      const text = 'highlighted text';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('<mark style="background-color: yellow">highlighted text</mark><!-- adf:backgroundColor attrs=\'{"color":"yellow"}\' -->');
    });

    it('should use default yellow color when no color specified', () => {
      const mark = { 
        type: 'backgroundColor',
        attrs: {}
      };
      const text = 'highlighted text';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('<mark style="background-color: yellow">highlighted text</mark>');
    });

    it('should handle empty text', () => {
      const mark = { 
        type: 'backgroundColor',
        attrs: { color: 'red' }
      };
      const text = '';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('<mark style="background-color: red"></mark><!-- adf:backgroundColor attrs=\'{"color":"red"}\' -->');
    });

    it('should handle custom color values', () => {
      const mark = {
        type: 'backgroundColor',
        attrs: { color: '#FF5733' }
      };
      const text = 'custom colored text';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('<mark style="background-color: #FF5733">custom colored text</mark><!-- adf:backgroundColor attrs=\'{"color":"#FF5733"}\' -->');
    });

    it('should include metadata for additional attributes', () => {
      const mark = {
        type: 'backgroundColor',
        attrs: {
          color: 'blue',
          customAttr: 'value',
          id: 'bg-1'
        }
      };
      const text = 'text with extra attrs';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('<mark style="background-color: blue">text with extra attrs</mark><!-- adf:backgroundColor attrs=\'{"color":"blue","customAttr":"value","id":"bg-1"}\' -->');
    });

    it('should not include metadata when attrs is undefined', () => {
      const mark = { type: 'backgroundColor' };
      const text = 'simple highlight';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('<mark style="background-color: yellow">simple highlight</mark>');
    });

    it('should handle text with special characters', () => {
      const mark = {
        type: 'backgroundColor',
        attrs: { color: 'green' }
      };
      const text = 'text with <>&" characters';

      const result = converter.toMarkdown(text, mark, mockContext);
      expect(result).toBe('<mark style="background-color: green">text with <>&" characters</mark><!-- adf:backgroundColor attrs=\'{"color":"green"}\' -->');
    });
  });
});