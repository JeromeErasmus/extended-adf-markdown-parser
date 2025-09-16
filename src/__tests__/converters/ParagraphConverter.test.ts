/**
 * @file Tests for ParagraphConverter
 */

import { describe, it, expect } from '@jest/globals';
import { ParagraphConverter } from '../../parser/adf-to-markdown/nodes/ParagraphConverter';
import type { ConversionContext } from '../../parser/types';
import type { ParagraphNode } from '../../types';

describe('ParagraphConverter', () => {
  const converter = new ParagraphConverter();

  const mockContext: ConversionContext = {
    convertChildren: jest.fn().mockReturnValue('converted content'),
    depth: 0,
    options: {}
  };

  describe('nodeType', () => {
    it('should have correct nodeType', () => {
      expect(converter.nodeType).toBe('paragraph');
    });
  });

  describe('toMarkdown', () => {
    it('should convert paragraph with content', () => {
      const node: ParagraphNode = {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'Hello World' }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('converted content');
      expect(mockContext.convertChildren).toHaveBeenCalledWith(node.content!);
    });

    it('should return empty string for paragraph with no content', () => {
      const node: ParagraphNode = {
        type: 'paragraph',
        content: []
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('');
    });

    it('should return empty string for paragraph with undefined content', () => {
      const node: ParagraphNode = {
        type: 'paragraph'
      } as ParagraphNode;

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('');
    });

    it('should include metadata for custom attributes', () => {
      const mockContextForAttrs: ConversionContext = {
        convertChildren: jest.fn().mockReturnValue('paragraph text'),
        depth: 0,
        options: {}
      };

      const node: ParagraphNode = {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'paragraph text' }
        ],
        attrs: {
          customAttr: 'value',
          alignment: 'center'
        }
      };

      const result = converter.toMarkdown(node, mockContextForAttrs);
      expect(result).toBe('paragraph text <!-- adf:paragraph attrs=\'{"customAttr":"value","alignment":"center"}\' -->');
    });

    it('should not include metadata for empty attributes', () => {
      const mockContextForAttrs: ConversionContext = {
        convertChildren: jest.fn().mockReturnValue('paragraph text'),
        depth: 0,
        options: {}
      };

      const node: ParagraphNode = {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'paragraph text' }
        ],
        attrs: {}
      };

      const result = converter.toMarkdown(node, mockContextForAttrs);
      expect(result).toBe('paragraph text');
    });
  });
});