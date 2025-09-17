/**
 * @file Tests for BlockquoteConverter
 */

import { describe, it, expect, jest } from '@jest/globals';
import { BlockquoteConverter } from '../../parser/adf-to-markdown/nodes/BlockquoteConverter';
import type { ConversionContext } from '../../parser/types';
import type { BlockquoteNode } from '../../types';

describe('BlockquoteConverter', () => {
  const converter = new BlockquoteConverter();

  const mockParagraphConverter = {
    nodeType: 'paragraph',
    toMarkdown: jest.fn().mockImplementation((node: any) => node.content?.[0]?.text || '')
  };

  const mockContext: ConversionContext = {
    convertChildren: jest.fn(),
    depth: 0,
    options: {
      registry: {
        getNodeConverter: jest.fn().mockReturnValue(mockParagraphConverter)
      } as any
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('nodeType', () => {
    it('should have correct nodeType', () => {
      expect(converter.nodeType).toBe('blockquote');
    });
  });

  describe('toMarkdown', () => {
    it('should convert single paragraph blockquote', () => {
      const node: BlockquoteNode = {
        type: 'blockquote',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'This is a quote' }]
          }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('> This is a quote');
      expect(mockParagraphConverter.toMarkdown).toHaveBeenCalled();
    });

    it('should convert multi-paragraph blockquote', () => {
      mockParagraphConverter.toMarkdown
        .mockReturnValueOnce('First paragraph')
        .mockReturnValueOnce('Second paragraph');

      const node: BlockquoteNode = {
        type: 'blockquote',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'First paragraph' }]
          },
          {
            type: 'paragraph', 
            content: [{ type: 'text', text: 'Second paragraph' }]
          }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('> First paragraph\n> Second paragraph');
    });

    it('should handle empty blockquote', () => {
      const node: BlockquoteNode = {
        type: 'blockquote',
        content: []
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('> ');
    });

    it('should handle blockquote with undefined content', () => {
      const node: BlockquoteNode = {
        type: 'blockquote'
      } as BlockquoteNode;

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('> ');
    });

    it('should handle multi-line content within paragraph', () => {
      mockParagraphConverter.toMarkdown.mockReturnValue('Line 1\nLine 2\nLine 3');

      const node: BlockquoteNode = {
        type: 'blockquote',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Multi-line content' }]
          }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('> Line 1\n> Line 2\n> Line 3');
    });

    it('should handle empty lines in content', () => {
      mockParagraphConverter.toMarkdown.mockReturnValue('Line 1\n\nLine 3');

      const node: BlockquoteNode = {
        type: 'blockquote',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Content with empty line' }]
          }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('> Line 1\n>\n> Line 3');
    });

    it('should include custom attributes in metadata', () => {
      const node: BlockquoteNode = {
        type: 'blockquote',
        attrs: {
          customAttr: 'value',
          source: 'quote-source'
        } as any,
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Quote with metadata' }]
          }
        ]
      };

      mockParagraphConverter.toMarkdown.mockReturnValue('Quote with metadata');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('> Quote with metadata<!-- adf:blockquote attrs=\'{"customAttr":"value","source":"quote-source"}\' -->');
    });

    it('should not include metadata when no attributes', () => {
      const node: BlockquoteNode = {
        type: 'blockquote',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Simple quote' }]
          }
        ]
      };

      mockParagraphConverter.toMarkdown.mockReturnValue('Simple quote');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('> Simple quote');
    });
  });
});