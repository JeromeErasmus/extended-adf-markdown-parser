/**
 * @file Tests for MediaConverter
 */

import { describe, it, expect, jest } from '@jest/globals';
import { MediaConverter } from '../../parser/adf-to-markdown/nodes/MediaConverter';
import type { ConversionContext } from '../../parser/types';
import type { MediaNode } from '../../types';

describe('MediaConverter', () => {
  const converter = new MediaConverter();

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
      expect(converter.nodeType).toBe('media');
    });
  });

  describe('toMarkdown', () => {
    it('should convert basic media node with id', () => {
      const node: MediaNode = {
        type: 'media',
        attrs: {
          id: 'abc-123-def',
          type: 'file'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('![Media](adf:media:abc-123-def)\n<!-- adf:media id="abc-123-def" type="file" -->');
    });

    it('should convert media node with all standard attributes', () => {
      const node: MediaNode = {
        type: 'media',
        attrs: {
          id: 'image-456-ghi',
          type: 'file',
          collection: 'contentId-789',
          width: 400,
          height: 300
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('![Media](adf:media:image-456-ghi)\n<!-- adf:media id="image-456-ghi" type="file" collection="contentId-789" width="400" height="300" -->');
    });

    it('should handle media node without id', () => {
      const node: MediaNode = {
        type: 'media',
        attrs: {
          type: 'file'
        } as any
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('![Media](adf:media:unknown)');
    });

    it('should handle media node with undefined attrs', () => {
      const node: MediaNode = {
        type: 'media'
      } as MediaNode;

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('![Media](adf:media:unknown)');
    });

    it('should include custom attributes in metadata', () => {
      const node: MediaNode = {
        type: 'media',
        attrs: {
          id: 'video-789-xyz',
          type: 'video',
          collection: 'uploads',
          width: 800,
          height: 600,
          duration: 120,
          thumbnail: 'thumb-id',
          customProp: 'custom-value'
        } as any
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('![Media](adf:media:video-789-xyz)\n<!-- adf:media id="video-789-xyz" type="video" collection="uploads" width="800" height="600" duration="120" thumbnail="thumb-id" customProp="custom-value" -->');
    });

    it('should handle media node with only id', () => {
      const node: MediaNode = {
        type: 'media',
        attrs: {
          id: 'simple-media'
        } as any
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('![Media](adf:media:simple-media)\n<!-- adf:media id="simple-media" type="undefined" -->');
    });

    it('should handle media node with width but no height', () => {
      const node: MediaNode = {
        type: 'media',
        attrs: {
          id: 'wide-image',
          type: 'file',
          width: 500
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('![Media](adf:media:wide-image)\n<!-- adf:media id="wide-image" type="file" width="500" -->');
    });

    it('should handle media node with height but no width', () => {
      const node: MediaNode = {
        type: 'media',
        attrs: {
          id: 'tall-image',
          type: 'file',
          height: 600
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('![Media](adf:media:tall-image)\n<!-- adf:media id="tall-image" type="file" height="600" -->');
    });

    it('should handle media node with collection but no dimensions', () => {
      const node: MediaNode = {
        type: 'media',
        attrs: {
          id: 'doc-123',
          type: 'file',
          collection: 'shared-files'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('![Media](adf:media:doc-123)\n<!-- adf:media id="doc-123" type="file" collection="shared-files" -->');
    });

    it('should handle numeric values in custom attributes', () => {
      const node: MediaNode = {
        type: 'media',
        attrs: {
          id: 'audio-file',
          type: 'audio',
          duration: 180,
          bitrate: 320,
          sampleRate: 44100
        } as any
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('![Media](adf:media:audio-file)\n<!-- adf:media id="audio-file" type="audio" duration="180" bitrate="320" sampleRate="44100" -->');
    });

    it('should handle boolean values in custom attributes', () => {
      const node: MediaNode = {
        type: 'media',
        attrs: {
          id: 'protected-image',
          type: 'file',
          isProtected: true,
          isPublic: false
        } as any
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('![Media](adf:media:protected-image)\n<!-- adf:media id="protected-image" type="file" isProtected="true" isPublic="false" -->');
    });
  });
});