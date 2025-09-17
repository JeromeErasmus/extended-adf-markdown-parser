/**
 * @file Tests for StrikeConverter
 */

import { describe, it, expect, jest } from '@jest/globals';
import { StrikeConverter } from '../../parser/adf-to-markdown/marks/StrikeConverter';
import type { ConversionContext } from '../../parser/types';
import type { StrikeMark } from '../../types';

describe('StrikeConverter', () => {
  const converter = new StrikeConverter();

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
      expect(converter.markType).toBe('strike');
    });
  });

  describe('toMarkdown', () => {
    it('should convert basic strike text', () => {
      const mark: StrikeMark = {
        type: 'strike'
      };

      const result = converter.toMarkdown('strikethrough text', mark, mockContext);
      expect(result).toBe('~~strikethrough text~~');
    });

    it('should handle empty text', () => {
      const mark: StrikeMark = {
        type: 'strike'
      };

      const result = converter.toMarkdown('', mark, mockContext);
      expect(result).toBe('~~~~');
    });

    it('should handle text with special characters', () => {
      const mark: StrikeMark = {
        type: 'strike'
      };

      const result = converter.toMarkdown('text with ~~ characters', mark, mockContext);
      expect(result).toBe('~~text with ~~ characters~~');
    });

    it('should handle multi-word text', () => {
      const mark: StrikeMark = {
        type: 'strike'
      };

      const result = converter.toMarkdown('multiple words strikethrough', mark, mockContext);
      expect(result).toBe('~~multiple words strikethrough~~');
    });

    it('should include custom attributes in metadata', () => {
      const mark: StrikeMark = {
        type: 'strike',
        attrs: {
          color: 'red',
          reason: 'outdated'
        } as any
      };

      const result = converter.toMarkdown('outdated text', mark, mockContext);
      expect(result).toBe('~~outdated text~~<!-- adf:strike attrs=\'{"color":"red","reason":"outdated"}\' -->');
    });

    it('should not include metadata when no attributes', () => {
      const mark: StrikeMark = {
        type: 'strike'
      };

      const result = converter.toMarkdown('simple strike', mark, mockContext);
      expect(result).toBe('~~simple strike~~');
    });

    it('should handle mark with empty attributes object', () => {
      const mark: StrikeMark = {
        type: 'strike',
        attrs: {}
      };

      const result = converter.toMarkdown('no custom attrs', mark, mockContext);
      expect(result).toBe('~~no custom attrs~~');
    });

    it('should handle text with newlines', () => {
      const mark: StrikeMark = {
        type: 'strike'
      };

      const result = converter.toMarkdown('line 1\nline 2', mark, mockContext);
      expect(result).toBe('~~line 1\nline 2~~');
    });

    it('should handle numeric attribute values', () => {
      const mark: StrikeMark = {
        type: 'strike',
        attrs: {
          priority: 1,
          timestamp: 1640995200
        } as any
      };

      const result = converter.toMarkdown('deprecated feature', mark, mockContext);
      expect(result).toBe('~~deprecated feature~~<!-- adf:strike attrs=\'{"priority":1,"timestamp":1640995200}\' -->');
    });

    it('should handle boolean attribute values', () => {
      const mark: StrikeMark = {
        type: 'strike',
        attrs: {
          isDeleted: true,
          isReverted: false
        } as any
      };

      const result = converter.toMarkdown('deleted content', mark, mockContext);
      expect(result).toBe('~~deleted content~~<!-- adf:strike attrs=\'{"isDeleted":true,"isReverted":false}\' -->');
    });

    it('should handle text with markdown characters', () => {
      const mark: StrikeMark = {
        type: 'strike'
      };

      const result = converter.toMarkdown('text with **bold** and *italic*', mark, mockContext);
      expect(result).toBe('~~text with **bold** and *italic*~~');
    });

    it('should handle single character text', () => {
      const mark: StrikeMark = {
        type: 'strike'
      };

      const result = converter.toMarkdown('x', mark, mockContext);
      expect(result).toBe('~~x~~');
    });

    it('should handle text with spaces only', () => {
      const mark: StrikeMark = {
        type: 'strike'
      };

      const result = converter.toMarkdown('   ', mark, mockContext);
      expect(result).toBe('~~   ~~');
    });
  });
});