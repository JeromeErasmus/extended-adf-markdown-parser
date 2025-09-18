/**
 * @file Tests for UnderlineConverter
 */

import { describe, it, expect, jest } from '@jest/globals';
import { UnderlineConverter } from '../../../src/parser/adf-to-markdown/marks/UnderlineConverter';
import type { ConversionContext } from '../../../src/parser/types';
import type { UnderlineMark } from '../../../src/types';

describe('UnderlineConverter', () => {
  const converter = new UnderlineConverter();

  const mockContext: ConversionContext = {
    convertChildren: jest.fn(),
    depth: 0,
    options: {
      registry: {
        getNodeConverter: jest.fn()
      } as any
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('markType', () => {
    it('should have correct markType', () => {
      expect(converter.markType).toBe('underline');
    });
  });

  describe('toMarkdown', () => {
    it('should convert basic underline text', () => {
      const mark: UnderlineMark = {
        type: 'underline'
      };

      const result = converter.toMarkdown('underlined text', mark, mockContext);
      expect(result).toBe('<u>underlined text</u>');
    });

    it('should handle empty text', () => {
      const mark: UnderlineMark = {
        type: 'underline'
      };

      const result = converter.toMarkdown('', mark, mockContext);
      expect(result).toBe('<u></u>');
    });

    it('should handle text with HTML characters', () => {
      const mark: UnderlineMark = {
        type: 'underline'
      };

      const result = converter.toMarkdown('text with <div> & "quotes"', mark, mockContext);
      expect(result).toBe('<u>text with <div> & "quotes"</u>');
    });

    it('should handle multi-word text', () => {
      const mark: UnderlineMark = {
        type: 'underline'
      };

      const result = converter.toMarkdown('multiple words underlined', mark, mockContext);
      expect(result).toBe('<u>multiple words underlined</u>');
    });

    it('should include custom attributes in metadata', () => {
      const mark: UnderlineMark = {
        type: 'underline',
        attrs: {
          style: 'dotted',
          color: 'blue'
        } as any
      };

      const result = converter.toMarkdown('styled underline', mark, mockContext);
      expect(result).toBe('<u>styled underline</u><!-- adf:underline attrs=\'{"style":"dotted","color":"blue"}\' -->');
    });

    it('should not include metadata when no attributes', () => {
      const mark: UnderlineMark = {
        type: 'underline'
      };

      const result = converter.toMarkdown('simple underline', mark, mockContext);
      expect(result).toBe('<u>simple underline</u>');
    });

    it('should handle mark with empty attributes object', () => {
      const mark: UnderlineMark = {
        type: 'underline',
        attrs: {}
      };

      const result = converter.toMarkdown('no custom attrs', mark, mockContext);
      expect(result).toBe('<u>no custom attrs</u>');
    });

    it('should handle text with newlines', () => {
      const mark: UnderlineMark = {
        type: 'underline'
      };

      const result = converter.toMarkdown('line 1\nline 2', mark, mockContext);
      expect(result).toBe('<u>line 1\nline 2</u>');
    });

    it('should handle numeric attribute values', () => {
      const mark: UnderlineMark = {
        type: 'underline',
        attrs: {
          thickness: 2,
          opacity: 0.8
        } as any
      };

      const result = converter.toMarkdown('thick underline', mark, mockContext);
      expect(result).toBe('<u>thick underline</u><!-- adf:underline attrs=\'{"thickness":2,"opacity":0.8}\' -->');
    });

    it('should handle boolean attribute values', () => {
      const mark: UnderlineMark = {
        type: 'underline',
        attrs: {
          animated: true,
          dashed: false
        } as any
      };

      const result = converter.toMarkdown('animated underline', mark, mockContext);
      expect(result).toBe('<u>animated underline</u><!-- adf:underline attrs=\'{"animated":true,"dashed":false}\' -->');
    });

    it('should handle text with markdown characters', () => {
      const mark: UnderlineMark = {
        type: 'underline'
      };

      const result = converter.toMarkdown('text with **bold** and *italic*', mark, mockContext);
      expect(result).toBe('<u>text with **bold** and *italic*</u>');
    });

    it('should handle single character text', () => {
      const mark: UnderlineMark = {
        type: 'underline'
      };

      const result = converter.toMarkdown('u', mark, mockContext);
      expect(result).toBe('<u>u</u>');
    });

    it('should handle text with spaces only', () => {
      const mark: UnderlineMark = {
        type: 'underline'
      };

      const result = converter.toMarkdown('   ', mark, mockContext);
      expect(result).toBe('<u>   </u>');
    });

    it('should handle text with existing HTML tags', () => {
      const mark: UnderlineMark = {
        type: 'underline'
      };

      const result = converter.toMarkdown('already <em>emphasized</em>', mark, mockContext);
      expect(result).toBe('<u>already <em>emphasized</em></u>');
    });

    it('should handle complex custom attributes', () => {
      const mark: UnderlineMark = {
        type: 'underline',
        attrs: {
          style: 'wavy',
          color: '#ff0000',
          pattern: 'dots',
          metadata: {
            reason: 'emphasis',
            importance: 'high'
          }
        } as any
      };

      const result = converter.toMarkdown('complex underline', mark, mockContext);
      expect(result).toBe('<u>complex underline</u><!-- adf:underline attrs=\'{"style":"wavy","color":"#ff0000","pattern":"dots","metadata":{"reason":"emphasis","importance":"high"}}\' -->');
    });

    it('should handle text with special unicode characters', () => {
      const mark: UnderlineMark = {
        type: 'underline'
      };

      const result = converter.toMarkdown('текст with émojis 😊', mark, mockContext);
      expect(result).toBe('<u>текст with émojis 😊</u>');
    });
  });
});