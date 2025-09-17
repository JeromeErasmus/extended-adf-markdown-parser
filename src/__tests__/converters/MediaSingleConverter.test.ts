/**
 * @file Tests for MediaSingleConverter
 */

import { describe, it, expect, jest } from '@jest/globals';
import { MediaSingleConverter } from '../../parser/adf-to-markdown/nodes/MediaSingleConverter';
import type { ConversionContext } from '../../parser/types';
import type { MediaSingleNode } from '../../types';

describe('MediaSingleConverter', () => {
  const converter = new MediaSingleConverter();

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

  describe('nodeType', () => {
    it('should have correct nodeType', () => {
      expect(converter.nodeType).toBe('mediaSingle');
    });
  });

  describe('toMarkdown', () => {
    it('should convert media single with layout and width attributes', () => {
      const node: MediaSingleNode = {
        type: 'mediaSingle',
        attrs: {
          layout: 'center',
          width: 80
        },
        content: [
          {
            type: 'media',
            attrs: {
              id: 'abc-123-def',
              type: 'file'
            }
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('![Media](adf:media:abc-123-def)\n<!-- adf:media id="abc-123-def" type="file" -->');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('![Media](adf:media:abc-123-def)\n<!-- adf:media id="abc-123-def" type="file" -->\n<!-- adf:mediaSingle layout="center" width="80" -->');
      expect(mockContext.convertChildren).toHaveBeenCalledWith(node.content!);
    });

    it('should convert media single without attributes', () => {
      const node: MediaSingleNode = {
        type: 'mediaSingle',
        content: [
          {
            type: 'media',
            attrs: {
              id: 'simple-image',
              type: 'file'
            }
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('![Media](adf:media:simple-image)\n<!-- adf:media id="simple-image" type="file" -->');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('![Media](adf:media:simple-image)\n<!-- adf:media id="simple-image" type="file" -->');
    });

    it('should handle media single with only layout attribute', () => {
      const node: MediaSingleNode = {
        type: 'mediaSingle',
        attrs: {
          layout: 'align-start'
        },
        content: [
          {
            type: 'media',
            attrs: {
              id: 'left-aligned',
              type: 'file'
            }
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('![Media](adf:media:left-aligned)\n<!-- adf:media id="left-aligned" type="file" -->');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('![Media](adf:media:left-aligned)\n<!-- adf:media id="left-aligned" type="file" -->\n<!-- adf:mediaSingle layout="align-start" -->');
    });

    it('should handle media single with only width attribute', () => {
      const node: MediaSingleNode = {
        type: 'mediaSingle',
        attrs: {
          width: 50
        },
        content: [
          {
            type: 'media',
            attrs: {
              id: 'half-width',
              type: 'file'
            }
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('![Media](adf:media:half-width)\n<!-- adf:media id="half-width" type="file" -->');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('![Media](adf:media:half-width)\n<!-- adf:media id="half-width" type="file" -->\n<!-- adf:mediaSingle width="50" -->');
    });

    it('should handle media single with empty content from convertChildren', () => {
      const node: MediaSingleNode = {
        type: 'mediaSingle',
        attrs: {
          layout: 'center'
        },
        content: [
          {
            type: 'media',
            attrs: {
              id: 'empty-content',
              type: 'file'
            }
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('\n<!-- adf:mediaSingle layout="center" -->');
    });

    it('should handle media single with undefined content', () => {
      const node: MediaSingleNode = {
        type: 'mediaSingle',
        attrs: {
          layout: 'center'
        }
      } as MediaSingleNode;

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('');
    });

    it('should handle media single with empty attributes object', () => {
      const node: MediaSingleNode = {
        type: 'mediaSingle',
        attrs: {},
        content: [
          {
            type: 'media',
            attrs: {
              id: 'no-attrs',
              type: 'file'
            }
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('![Media](adf:media:no-attrs)\n<!-- adf:media id="no-attrs" type="file" -->');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('![Media](adf:media:no-attrs)\n<!-- adf:media id="no-attrs" type="file" -->');
    });

    it('should handle media single with custom attributes', () => {
      const node: MediaSingleNode = {
        type: 'mediaSingle',
        attrs: {
          layout: 'wrap-right',
          width: 75,
          customProp: 'custom-value',
          border: true
        } as any,
        content: [
          {
            type: 'media',
            attrs: {
              id: 'custom-media',
              type: 'file'
            }
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('![Media](adf:media:custom-media)\n<!-- adf:media id="custom-media" type="file" -->');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('![Media](adf:media:custom-media)\n<!-- adf:media id="custom-media" type="file" -->\n<!-- adf:mediaSingle layout="wrap-right" width="75" customProp="custom-value" border="true" -->');
    });

    it('should handle single media node in container', () => {
      const node: MediaSingleNode = {
        type: 'mediaSingle',
        attrs: {
          layout: 'center'
        },
        content: [
          {
            type: 'media',
            attrs: {
              id: 'first-media',
              type: 'file'
            }
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('![Media](adf:media:first-media)\n<!-- adf:media id="first-media" type="file" -->');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('![Media](adf:media:first-media)\n<!-- adf:media id="first-media" type="file" -->\n<!-- adf:mediaSingle layout="center" -->');
    });


    it('should handle numeric and boolean attribute values', () => {
      const node: MediaSingleNode = {
        type: 'mediaSingle',
        attrs: {
          layout: 'full-width',
          width: 100,
          responsive: true,
          priority: 0
        } as any,
        content: [
          {
            type: 'media',
            attrs: {
              id: 'full-width-media',
              type: 'file'
            }
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('![Media](adf:media:full-width-media)\n<!-- adf:media id="full-width-media" type="file" -->');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('![Media](adf:media:full-width-media)\n<!-- adf:media id="full-width-media" type="file" -->\n<!-- adf:mediaSingle layout="full-width" width="100" responsive="true" priority="0" -->');
    });
  });
});