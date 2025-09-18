/**
 * @file media-placeholders.test.ts
 * @description Integration tests for media placeholder resolution with EnhancedMarkdownParser
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { EnhancedMarkdownParser } from '../../src/parser/markdown-to-adf/EnhancedMarkdownParser.js';
import type { ADFDocument } from '../../src/types/adf.types.js';

describe('Media Placeholders Integration', () => {
  let parser: EnhancedMarkdownParser;

  beforeEach(() => {
    parser = new EnhancedMarkdownParser({
      strict: false,
      adfExtensions: true
    });
  });

  describe('Basic Media Placeholder Resolution', () => {
    it('should convert ADF media placeholder to media node', async () => {
      const markdown = `
![Architecture Diagram](adf:media:architecture-diagram-2024)
`.trim();

      const result = await parser.parse(markdown);
      
      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toEqual({
        type: 'media',
        attrs: {
          id: 'architecture-diagram-2024',
          type: 'file',
          alt: 'Architecture Diagram'
        }
      });
    });

    it('should handle media placeholder with metadata comments', async () => {
      const markdown = `
<!-- adf:media attrs='{"collection":"project-assets","width":800,"height":600}' -->
![Architecture Diagram](adf:media:architecture-diagram-2024)
`.trim();

      const result = await parser.parse(markdown);
      
      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toEqual({
        type: 'media',
        attrs: {
          id: 'architecture-diagram-2024',
          type: 'file',
          alt: 'Architecture Diagram',
          collection: 'project-assets',
          width: 800,
          height: 600
        }
      });
    });

    it('should create mediaSingle wrapper with metadata', async () => {
      const markdown = `
<!-- adf:media collection="project-assets" width="800" height="600" -->
<!-- adf:mediaSingle layout="center" width="80" -->
![Architecture Diagram](adf:media:architecture-diagram-2024)
`.trim();

      const result = await parser.parse(markdown);
      
      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toEqual({
        type: 'mediaSingle',
        attrs: {
          layout: 'center',
          width: 80
        },
        content: [{
          type: 'media',
          attrs: {
            id: 'architecture-diagram-2024',
            type: 'file',
            alt: 'Architecture Diagram',
            collection: 'project-assets',
            width: 800,
            height: 600
          }
        }]
      });
    });
  });

  describe('Media Placeholder Variations', () => {
    it('should handle media without alt text', async () => {
      const markdown = `
![](adf:media:no-alt-image)
`.trim();

      const result = await parser.parse(markdown);
      
      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toEqual({
        type: 'media',
        attrs: {
          id: 'no-alt-image',
          type: 'file'
        }
      });
    });

    it('should handle complex media IDs', async () => {
      const markdown = `
![Complex ID](adf:media:uuid-123e4567-e89b-12d3-a456-426614174000)
`.trim();

      const result = await parser.parse(markdown);
      
      expect(result.content).toHaveLength(1);
      expect(result.content[0].attrs.id).toBe('uuid-123e4567-e89b-12d3-a456-426614174000');
    });

    it('should handle different media types via metadata', async () => {
      const markdown = `
<!-- adf:media attrs='{"type":"video","duration":120,"thumbnail":"thumb-123"}' -->
![Video File](adf:media:video-presentation)
`.trim();

      const result = await parser.parse(markdown);
      
      expect(result.content[0]).toEqual({
        type: 'media',
        attrs: {
          id: 'video-presentation',
          type: 'video',
          alt: 'Video File',
          duration: 120,
          thumbnail: 'thumb-123'
        }
      });
    });
  });

  describe('Media with Spacing and Complex Layouts', () => {
    it('should handle media with various spacing between comments', async () => {
      const markdown = `
<!-- adf:media attrs='{"collection":"assets","width":1200}' -->


<!-- adf:mediaSingle attrs='{"layout":"full-width"}' -->



![Full Width Image](adf:media:banner-image-2024)
`.trim();

      const result = await parser.parse(markdown);
      
      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toEqual({
        type: 'mediaSingle',
        attrs: {
          layout: 'full-width'
        },
        content: [{
          type: 'media',
          attrs: {
            id: 'banner-image-2024',
            type: 'file',
            alt: 'Full Width Image',
            collection: 'assets',
            width: 1200
          }
        }]
      });
    });

    it('should handle media in mixed content', async () => {
      const markdown = `
# Document Title

Here's some introductory text.

<!-- adf:mediaSingle layout="center" width="60" -->
![Diagram](adf:media:flow-diagram)

And here's content after the media.

## Another Section

More content here.
`.trim();

      const result = await parser.parse(markdown);
      
      expect(result.content).toHaveLength(6);
      
      // Heading
      expect(result.content[0].type).toBe('heading');
      
      // Intro paragraph
      expect(result.content[1].type).toBe('paragraph');
      
      // Media
      expect(result.content[2]).toEqual({
        type: 'mediaSingle',
        attrs: {
          layout: 'center',
          width: 60
        },
        content: [{
          type: 'media',
          attrs: {
            id: 'flow-diagram',
            type: 'file',
            alt: 'Diagram'
          }
        }]
      });
      
      // Content after media
      expect(result.content[3].type).toBe('paragraph');
      
      // Another heading
      expect(result.content[4].type).toBe('heading');
      
      // Final paragraph
      expect(result.content[5].type).toBe('paragraph');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should ignore regular images (non-ADF placeholders)', async () => {
      const markdown = `
![Regular Image](https://example.com/image.jpg)

Some text here.
`.trim();

      const result = await parser.parse(markdown);
      
      // Should have only the paragraph with text content
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('paragraph');
    });

    it('should handle malformed media placeholders gracefully', async () => {
      const markdown = `
![Invalid](adf:invalid:not-media)
![No ID](adf:media:)
![Bad Format](adf-media-invalid)
`.trim();

      const result = await parser.parse(markdown);
      
      // Should create a paragraph with the malformed content
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('paragraph');
    });

    it('should handle orphaned metadata comments', async () => {
      const markdown = `
<!-- adf:media attrs='{"width":800}' -->
<!-- adf:mediaSingle attrs='{"layout":"center"}' -->

Some text without media.
`.trim();

      const result = await parser.parse(markdown);
      
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('paragraph');
    });
  });

  describe('Round-Trip Conversion', () => {
    it('should preserve media through round-trip conversion', async () => {
      const originalAdf: ADFDocument = {
        version: 1,
        type: 'doc',
        content: [{
          type: 'mediaSingle',
          attrs: {
            layout: 'center',
            width: 75
          },
          content: [{
            type: 'media',
            attrs: {
              id: 'test-media-123',
              type: 'file',
              collection: 'shared-files',
              width: 800,
              height: 600,
              alt: 'Test Media'
            }
          }]
        }]
      };

      // Convert ADF to markdown
      const markdown = await parser.stringify(originalAdf);
      
      
      // Should contain media placeholder and metadata
      expect(markdown).toContain('![Test Media](adf:media:test-media-123)');
      expect(markdown).toContain('<!-- adf:media');
      expect(markdown).toContain('<!-- adf:mediaSingle');
      
      // Convert back to ADF (consecutive HTML comments should now be properly separated)
      const reconstructed = await parser.parse(markdown);
      
      // Should match original structure
      expect(reconstructed.content[0]).toMatchObject({
        type: 'mediaSingle',
        attrs: {
          layout: 'center',
          width: 75
        },
        content: [{
          type: 'media',
          attrs: {
            id: 'test-media-123',
            type: 'file',
            collection: 'shared-files',
            width: 800,
            height: 600,
            alt: 'Test Media'
          }
        }]
      });
    });
  });

  describe('Synchronous Processing', () => {
    it('should handle media placeholders in sync parsing', () => {
      const markdown = `
<!-- adf:mediaSingle attrs='{"layout":"center"}' -->
![Sync Media](adf:media:sync-test)
`.trim();

      const result = parser.parseSync(markdown);
      
      expect(result.content[0]).toEqual({
        type: 'mediaSingle',
        attrs: { layout: 'center' },
        content: [{
          type: 'media',
          attrs: {
            id: 'sync-test',
            type: 'file',
            alt: 'Sync Media'
          }
        }]
      });
    });
  });
});