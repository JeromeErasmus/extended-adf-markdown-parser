/**
 * @file media-placeholders.test.ts
 * @description Unit tests for media placeholder conversion in ASTBuilder
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { ASTBuilder } from '../../../src/parser/markdown-to-adf/ASTBuilder.js';
import type { Root } from 'mdast';

describe('ASTBuilder Media Placeholders', () => {
  let astBuilder: ASTBuilder;

  beforeEach(() => {
    astBuilder = new ASTBuilder({
      strict: false,
      preserveUnknownNodes: false,
      defaultVersion: 1
    });
  });

  describe('Image to Media Conversion', () => {
    it('should convert ADF media placeholder to media node', () => {
      const mdastTree: Root = {
        type: 'root',
        children: [{
          type: 'paragraph',
          children: [{
            type: 'image',
            url: 'adf:media:test-image-123',
            alt: 'Test Image'
          }]
        }]
      };

      const result = astBuilder.buildADFFromMdast(mdastTree);
      
      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toEqual({
        type: 'mediaSingle',
        attrs: {
          layout: 'center'
        },
        content: [{
          type: 'media',
          attrs: {
            id: 'test-image-123',
            type: 'file',
            alt: 'Test Image',
            collection: ''
          }
        }]
      });
    });

    it('should create mediaSingle wrapper when metadata present', () => {
      const mdastTree: Root = {
        type: 'root',
        children: [{
          type: 'paragraph',
          children: [{
            type: 'image',
            url: 'adf:media:wrapped-image',
            alt: 'Wrapped Image',
            data: {
              adfMetadata: [
                {
                  nodeType: 'media',
                  attrs: { collection: 'assets', width: 800 },
                  raw: '<!-- adf:media -->'
                },
                {
                  nodeType: 'mediaSingle', 
                  attrs: { layout: 'center', width: 60 },
                  raw: '<!-- adf:mediaSingle -->'
                }
              ]
            }
          }]
        }]
      };

      const result = astBuilder.buildADFFromMdast(mdastTree);
      
      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toEqual({
        type: 'mediaSingle',
        attrs: { layout: 'center', width: 60 },
        content: [{
          type: 'media',
          attrs: {
            id: 'wrapped-image',
            type: 'file',
            alt: 'Wrapped Image',
            collection: 'assets',
            width: 800
          }
        }]
      });
    });

    it('should handle media without alt text', () => {
      const mdastTree: Root = {
        type: 'root',
        children: [{
          type: 'paragraph',
          children: [{
            type: 'image',
            url: 'adf:media:no-alt-image',
            alt: ''
          }]
        }]
      };

      const result = astBuilder.buildADFFromMdast(mdastTree);
      
      expect(result.content[0]).toEqual({
        type: 'mediaSingle',
        attrs: {
          layout: 'center'
        },
        content: [{
          type: 'media',
          attrs: {
            id: 'no-alt-image',
            type: 'file',
            alt: '',
            collection: ''
          }
        }]
      });
    });

    it('should ignore regular images (non-ADF placeholders)', () => {
      const mdastTree: Root = {
        type: 'root',
        children: [{
          type: 'paragraph',
          children: [{
            type: 'image',
            url: 'https://example.com/image.jpg',
            alt: 'Regular Image'
          }]
        }]
      };

      const result = astBuilder.buildADFFromMdast(mdastTree);
      
      expect(result.content).toHaveLength(0);
    });

    it('should handle image with no URL', () => {
      const mdastTree: Root = {
        type: 'root',
        children: [{
          type: 'paragraph',
          children: [{
            type: 'image',
            alt: 'Image with no URL'
          }]
        }]
      };

      const result = astBuilder.buildADFFromMdast(mdastTree);
      
      expect(result.content).toHaveLength(0);
    });
  });

  describe('Complex Media Metadata', () => {
    it('should apply multiple media attributes from metadata', () => {
      const mdastTree: Root = {
        type: 'root',
        children: [{
          type: 'paragraph',
          children: [{
            type: 'image',
            url: 'adf:media:complex-media',
            alt: 'Complex Media',
            data: {
              adfMetadata: [{
                nodeType: 'media',
                attrs: {
                  type: 'video',
                  collection: 'media-library',
                  width: 1920,
                  height: 1080,
                  duration: 300,
                  thumbnail: 'thumb-123'
                },
                raw: '<!-- adf:media -->'
              }]
            }
          }]
        }]
      };

      const result = astBuilder.buildADFFromMdast(mdastTree);
      
      expect(result.content[0]).toEqual({
        type: 'mediaSingle',
        attrs: {
          layout: 'center'
        },
        content: [{
          type: 'media',
          attrs: {
            id: 'complex-media',
            type: 'video',
            alt: 'Complex Media',
            collection: 'media-library',
            width: 1920,
            height: 1080,
            duration: 300,
            thumbnail: 'thumb-123'
          }
        }]
      });
    });

    it('should handle mediaSingle with custom attributes', () => {
      const mdastTree: Root = {
        type: 'root',
        children: [{
          type: 'paragraph',
          children: [{
            type: 'image',
            url: 'adf:media:single-media',
            alt: 'Single Media',
            data: {
              adfMetadata: [{
                nodeType: 'mediaSingle',
                attrs: {
                  layout: 'wrap-right',
                  width: 40,
                  customProp: 'custom-value'
                },
                raw: '<!-- adf:mediaSingle -->'
              }]
            }
          }]
        }]
      };

      const result = astBuilder.buildADFFromMdast(mdastTree);
      
      expect(result.content[0]).toEqual({
        type: 'mediaSingle',
        attrs: {
          layout: 'wrap-right',
          width: 40,
          customProp: 'custom-value'
        },
        content: [{
          type: 'media',
          attrs: {
            id: 'single-media',
            type: 'file',
            alt: 'Single Media',
            collection: ''
          }
        }]
      });
    });

    it('should merge media and mediaSingle metadata correctly', () => {
      const mdastTree: Root = {
        type: 'root',
        children: [{
          type: 'paragraph',
          children: [{
            type: 'image',
            url: 'adf:media:merged-media',
            alt: 'Merged Media',
            data: {
              adfMetadata: [
                {
                  nodeType: 'media',
                  attrs: { 
                    type: 'image',
                    collection: 'photos',
                    width: 800,
                    height: 600 
                  },
                  raw: '<!-- adf:media -->'
                },
                {
                  nodeType: 'mediaSingle',
                  attrs: { 
                    layout: 'center',
                    width: 80 
                  },
                  raw: '<!-- adf:mediaSingle -->'
                }
              ]
            }
          }]
        }]
      };

      const result = astBuilder.buildADFFromMdast(mdastTree);
      
      expect(result.content[0]).toEqual({
        type: 'mediaSingle',
        attrs: { layout: 'center', width: 80 },
        content: [{
          type: 'media',
          attrs: {
            id: 'merged-media',
            type: 'image',
            alt: 'Merged Media',
            collection: 'photos',
            width: 800,
            height: 600
          }
        }]
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty media ID', () => {
      const mdastTree: Root = {
        type: 'root',
        children: [{
          type: 'paragraph',
          children: [{
            type: 'image',
            url: 'adf:media:',
            alt: 'Empty ID'
          }]
        }]
      };

      const result = astBuilder.buildADFFromMdast(mdastTree);
      
      expect(result.content).toHaveLength(0);
    });

    it('should handle malformed ADF media URL', () => {
      const mdastTree: Root = {
        type: 'root',
        children: [{
          type: 'paragraph',
          children: [{
            type: 'image',
            url: 'adf:invalid:format',
            alt: 'Malformed'
          }]
        }]
      };

      const result = astBuilder.buildADFFromMdast(mdastTree);
      
      // Should be ignored (no media node created)
      expect(result.content).toHaveLength(0);
    });

    it('should handle image with only mediaSingle metadata', () => {
      const mdastTree: Root = {
        type: 'root',
        children: [{
          type: 'paragraph',
          children: [{
            type: 'image',
            url: 'adf:media:only-single',
            alt: 'Only Single',
            data: {
              adfMetadata: [{
                nodeType: 'mediaSingle',
                attrs: { layout: 'full-width' },
                raw: '<!-- adf:mediaSingle -->'
              }]
            }
          }]
        }]
      };

      const result = astBuilder.buildADFFromMdast(mdastTree);
      
      expect(result.content[0]).toEqual({
        type: 'mediaSingle',
        attrs: { layout: 'full-width' },
        content: [{
          type: 'media',
          attrs: {
            id: 'only-single',
            type: 'file',
            alt: 'Only Single',
            collection: ''
          }
        }]
      });
    });
  });
});