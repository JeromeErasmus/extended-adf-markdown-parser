/**
 * @file Tests for TextConverter
 */

import { describe, it, expect, jest } from '@jest/globals';
import { TextConverter } from '../../../src/parser/adf-to-markdown/nodes/TextConverter';
import type { ConversionContext } from '../../../src/parser/types';
import type { TextNode } from '../../../src/types';

const mockContext: ConversionContext = {
  convertChildren: jest.fn(),
  depth: 0,
  options: {}
};

describe('TextConverter', () => {
  const converter = new TextConverter();

  describe('nodeType', () => {
    it('should have correct nodeType', () => {
      expect(converter.nodeType).toBe('text');
    });
  });

  describe('toMarkdown', () => {
    it('should convert plain text', () => {
      const node: TextNode = {
        type: 'text',
        text: 'Hello World'
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('Hello World');
    });

    it('should handle empty text', () => {
      const node: TextNode = {
        type: 'text',
        text: ''
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('');
    });

    it('should handle missing text property', () => {
      const node: TextNode = {
        type: 'text'
      } as TextNode;

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('');
    });

    it('should handle text without marks', () => {
      const node: TextNode = {
        type: 'text',
        text: 'Plain text',
        marks: []
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('Plain text');
    });

    it('should apply marks using context registry', () => {
      const mockMarkConverter = {
        markType: 'strong',
        toMarkdown: jest.fn().mockReturnValue('**bold text**')
      };

      const contextWithRegistry: ConversionContext = {
        ...mockContext,
        options: {
          registry: {
            getMarkConverter: jest.fn().mockReturnValue(mockMarkConverter)
          } as any
        }
      };

      const node: TextNode = {
        type: 'text',
        text: 'bold text',
        marks: [{ type: 'strong' }]
      };

      const result = converter.toMarkdown(node, contextWithRegistry);
      expect(result).toBe('**bold text**');
      expect(mockMarkConverter.toMarkdown).toHaveBeenCalledWith(
        'bold text',
        { type: 'strong' },
        contextWithRegistry
      );
    });

    it('should apply multiple marks in order', () => {
      const mockStrongConverter = {
        markType: 'strong',
        toMarkdown: jest.fn().mockImplementation((text) => `**${text}**`)
      };

      const mockEmConverter = {
        markType: 'em',
        toMarkdown: jest.fn().mockImplementation((text) => `*${text}*`)
      };

      const contextWithRegistry: ConversionContext = {
        ...mockContext,
        options: {
          registry: {
            getMarkConverter: jest.fn().mockImplementation((type) => {
              if (type === 'strong') return mockStrongConverter;
              if (type === 'em') return mockEmConverter;
              return null;
            })
          } as any
        }
      };

      const node: TextNode = {
        type: 'text',
        text: 'bold italic',
        marks: [{ type: 'strong' }, { type: 'em' }]
      };

      const result = converter.toMarkdown(node, contextWithRegistry);
      expect(result).toBe('***bold italic***');
    });

    it('should handle missing mark converter gracefully', () => {
      const contextWithRegistry: ConversionContext = {
        ...mockContext,
        options: {
          registry: {
            getMarkConverter: jest.fn().mockReturnValue(null)
          } as any
        }
      };

      const node: TextNode = {
        type: 'text',
        text: 'text with unknown mark',
        marks: [{ type: 'unknown' }]
      };

      const result = converter.toMarkdown(node, contextWithRegistry);
      expect(result).toBe('text with unknown mark');
    });
  });
});