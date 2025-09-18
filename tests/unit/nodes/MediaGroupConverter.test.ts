/**
 * @file Tests for MediaGroupConverter
 */

import { describe, it, expect, jest } from '@jest/globals';
import { MediaGroupConverter } from '../../../src/parser/adf-to-markdown/nodes/MediaGroupConverter';
import type { ConversionContext } from '../../../src/parser/types';
import type { ADFNode } from '../../../src/types';
import { ConverterRegistry } from '../../../src/parser/ConverterRegistry';

describe('MediaGroupConverter', () => {
  const converter = new MediaGroupConverter();

  const mockRegistry = {
    getNodeConverter: jest.fn()
  } as unknown as ConverterRegistry;

  const mockMediaConverter = {
    toMarkdown: jest.fn().mockReturnValue('![Image](adf://media/123)')
  };

  const mockContext: ConversionContext = {
    convertChildren: jest.fn(),
    depth: 0,
    options: {
      registry: mockRegistry
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (mockRegistry.getNodeConverter as jest.Mock).mockReturnValue(mockMediaConverter);
  });

  describe('nodeType', () => {
    it('should have correct nodeType', () => {
      expect(converter.nodeType).toBe('mediaGroup');
    });
  });

  describe('toMarkdown', () => {
    it('should convert media group with single media item', () => {
      const node: ADFNode = {
        type: 'mediaGroup',
        content: [
          {
            type: 'media',
            attrs: {
              id: '123',
              type: 'file'
            }
          }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('![Image](adf://media/123)\n\n');
      expect(mockRegistry.getNodeConverter).toHaveBeenCalledWith('media');
      expect(mockMediaConverter.toMarkdown).toHaveBeenCalledWith(node.content![0], mockContext);
    });

    it('should convert media group with multiple media items', () => {
      const mockMediaConverter2 = {
        toMarkdown: jest.fn().mockReturnValue('![Image2](adf://media/456)')
      };

      // First call returns first converter, second call returns second converter
      (mockRegistry.getNodeConverter as jest.Mock)
        .mockReturnValueOnce(mockMediaConverter)
        .mockReturnValueOnce(mockMediaConverter2);

      const node: ADFNode = {
        type: 'mediaGroup',
        content: [
          {
            type: 'media',
            attrs: { id: '123' }
          },
          {
            type: 'media',
            attrs: { id: '456' }
          }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('![Image](adf://media/123) ![Image2](adf://media/456)\n\n');
      expect(mockRegistry.getNodeConverter).toHaveBeenCalledTimes(2);
    });

    it('should handle media group with no content', () => {
      const node: ADFNode = {
        type: 'mediaGroup',
        content: []
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('\n\n');
    });

    it('should handle media group with undefined content', () => {
      const node: ADFNode = {
        type: 'mediaGroup'
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('\n\n');
    });

    it('should filter out empty media items', () => {
      const mockEmptyConverter = {
        toMarkdown: jest.fn().mockReturnValue('')
      };

      (mockRegistry.getNodeConverter as jest.Mock)
        .mockReturnValueOnce(mockMediaConverter)
        .mockReturnValueOnce(mockEmptyConverter)
        .mockReturnValueOnce(mockMediaConverter);

      const node: ADFNode = {
        type: 'mediaGroup',
        content: [
          { type: 'media', attrs: { id: '123' } },
          { type: 'media', attrs: { id: 'empty' } },
          { type: 'media', attrs: { id: '789' } }
        ]
      };

      mockMediaConverter.toMarkdown
        .mockReturnValueOnce('![Image1](adf://media/123)')
        .mockReturnValueOnce('![Image3](adf://media/789)');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('![Image1](adf://media/123) ![Image3](adf://media/789)\n\n');
    });

    it('should handle registry without getNodeConverter method', () => {
      const contextWithoutRegistry: ConversionContext = {
        convertChildren: jest.fn(),
        depth: 0,
        options: {}
      };

      const node: ADFNode = {
        type: 'mediaGroup',
        content: [
          { type: 'media', attrs: { id: '123' } }
        ]
      };

      const result = converter.toMarkdown(node, contextWithoutRegistry);
      expect(result).toBe('\n\n');
    });

    it('should handle missing converter for child node', () => {
      (mockRegistry.getNodeConverter as jest.Mock).mockReturnValue(null);

      const node: ADFNode = {
        type: 'mediaGroup',
        content: [
          { type: 'media', attrs: { id: '123' } }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('\n\n');
    });

    it('should handle mixed content types', () => {
      const mockMediaSingleConverter = {
        toMarkdown: jest.fn().mockReturnValue('![Single](adf://media/single)')
      };

      (mockRegistry.getNodeConverter as jest.Mock)
        .mockReturnValueOnce(mockMediaConverter)
        .mockReturnValueOnce(mockMediaSingleConverter);

      const node: ADFNode = {
        type: 'mediaGroup',
        content: [
          { type: 'media', attrs: { id: '123' } },
          { type: 'mediaSingle', attrs: { id: 'single' } }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('![Image](adf://media/123) ![Single](adf://media/single)\n\n');
    });

    it('should handle child nodes with complex attributes', () => {
      const complexNode: ADFNode = {
        type: 'mediaGroup',
        content: [
          {
            type: 'media',
            attrs: {
              id: 'complex123',
              type: 'file',
              collection: 'collection1',
              width: 200,
              height: 150
            }
          }
        ]
      };

      mockMediaConverter.toMarkdown.mockReturnValue('![Complex](adf://media/complex123)<!-- metadata -->');

      const result = converter.toMarkdown(complexNode, mockContext);
      expect(result).toBe('![Complex](adf://media/complex123)<!-- metadata -->\n\n');
      expect(mockMediaConverter.toMarkdown).toHaveBeenCalledWith(complexNode.content![0], mockContext);
    });

    it('should preserve spacing for gallery-style layout', () => {
      const mockMedia1 = { toMarkdown: jest.fn().mockReturnValue('![Image1](url1)') };
      const mockMedia2 = { toMarkdown: jest.fn().mockReturnValue('![Image2](url2)') };
      const mockMedia3 = { toMarkdown: jest.fn().mockReturnValue('![Image3](url3)') };

      (mockRegistry.getNodeConverter as jest.Mock)
        .mockReturnValueOnce(mockMedia1)
        .mockReturnValueOnce(mockMedia2)
        .mockReturnValueOnce(mockMedia3);

      const node: ADFNode = {
        type: 'mediaGroup',
        content: [
          { type: 'media', attrs: { id: '1' } },
          { type: 'media', attrs: { id: '2' } },
          { type: 'media', attrs: { id: '3' } }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('![Image1](url1) ![Image2](url2) ![Image3](url3)\n\n');
    });
  });
});