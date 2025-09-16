/**
 * @file Tests for HeadingConverter
 */

import { describe, it, expect } from '@jest/globals';
import { HeadingConverter } from '../../parser/adf-to-markdown/nodes/HeadingConverter';
import type { ConversionContext } from '../../parser/types';
import type { HeadingNode } from '../../types';

describe('HeadingConverter', () => {
  const converter = new HeadingConverter();

  const mockContext: ConversionContext = {
    convertChildren: jest.fn().mockReturnValue('Heading Text'),
    depth: 0,
    options: {}
  };

  describe('nodeType', () => {
    it('should have correct nodeType', () => {
      expect(converter.nodeType).toBe('heading');
    });
  });

  describe('toMarkdown', () => {
    it('should convert heading with level 1', () => {
      const node: HeadingNode = {
        type: 'heading',
        attrs: { level: 1 },
        content: [
          { type: 'text', text: 'Main Title' }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('# Heading Text');
      expect(mockContext.convertChildren).toHaveBeenCalledWith(node.content!);
    });

    it('should convert heading with level 2', () => {
      const node: HeadingNode = {
        type: 'heading',
        attrs: { level: 2 },
        content: [
          { type: 'text', text: 'Subtitle' }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('## Heading Text');
    });

    it('should convert heading with level 6', () => {
      const node: HeadingNode = {
        type: 'heading',
        attrs: { level: 6 },
        content: [
          { type: 'text', text: 'Small Header' }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('###### Heading Text');
    });

    it('should default to level 1 if no level specified', () => {
      const node: HeadingNode = {
        type: 'heading',
        content: [
          { type: 'text', text: 'Default Heading' }
        ]
      } as HeadingNode;

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('# Heading Text');
    });

    it('should clamp level to minimum 1', () => {
      const node: HeadingNode = {
        type: 'heading',
        attrs: { level: 0 as any },
        content: [
          { type: 'text', text: 'Minimum Level' }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('# Heading Text');
    });

    it('should clamp level to maximum 6', () => {
      const node: HeadingNode = {
        type: 'heading',
        attrs: { level: 8 as any },
        content: [
          { type: 'text', text: 'Maximum Level' }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('###### Heading Text');
    });

    it('should return empty string for heading with no content', () => {
      const node: HeadingNode = {
        type: 'heading',
        attrs: { level: 2 },
        content: []
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('');
    });

    it('should return empty string for heading with undefined content', () => {
      const node: HeadingNode = {
        type: 'heading',
        attrs: { level: 2 }
      } as HeadingNode;

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('');
    });

    it('should include metadata for custom attributes beyond level', () => {
      const mockContextForAttrs: ConversionContext = {
        convertChildren: jest.fn().mockReturnValue('Custom Heading'),
        depth: 0,
        options: {}
      };

      const node: HeadingNode = {
        type: 'heading',
        attrs: {
          level: 3,
          id: 'custom-id',
          className: 'special-heading'
        } as any,
        content: [
          { type: 'text', text: 'Custom Heading' }
        ]
      };

      const result = converter.toMarkdown(node, mockContextForAttrs);
      expect(result).toBe('### Custom Heading <!-- adf:heading attrs=\'{"id":"custom-id","className":"special-heading"}\' -->');
    });

    it('should not include metadata when only level attribute exists', () => {
      const node: HeadingNode = {
        type: 'heading',
        attrs: { level: 2 },
        content: [
          { type: 'text', text: 'Simple Heading' }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('## Heading Text');
    });
  });
});