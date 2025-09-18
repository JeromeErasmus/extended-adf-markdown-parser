/**
 * @file metadata-comments-spacing.test.ts
 * @description Integration tests for metadata comment processing with various spacing and line break scenarios
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { EnhancedMarkdownParser } from '../../src/parser/markdown-to-adf/EnhancedMarkdownParser.js';
import type { ADFDocument } from '../../src/types/adf.types.js';

describe('Metadata Comments with Spacing Variations', () => {
  let parser: EnhancedMarkdownParser;

  beforeEach(() => {
    parser = new EnhancedMarkdownParser({
      strict: false,
      adfExtensions: true
    });
  });

  describe('Single Line Breaks', () => {
    it('should handle comment directly before content', async () => {
      const markdown = `
<!-- adf:paragraph attrs='{"textAlign":"center"}' -->
This is centered text.
`.trim();

      const result = await parser.parse(markdown);
      
      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toEqual({
        type: 'paragraph',
        attrs: { textAlign: 'center' },
        content: [
          { type: 'text', text: 'This is centered text.' }
        ]
      });
    });

    it('should handle comment with single line break before content', async () => {
      const markdown = `
<!-- adf:paragraph attrs='{"textAlign":"center"}' -->

This is centered text.
`.trim();

      const result = await parser.parse(markdown);
      
      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toEqual({
        type: 'paragraph',
        attrs: { textAlign: 'center' },
        content: [
          { type: 'text', text: 'This is centered text.' }
        ]
      });
    });
  });

  describe('Multiple Line Breaks', () => {
    it('should handle comment with multiple line breaks before content', async () => {
      const markdown = `
<!-- adf:paragraph attrs='{"textAlign":"center"}' -->



This is centered text.
`.trim();

      const result = await parser.parse(markdown);
      
      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toEqual({
        type: 'paragraph',
        attrs: { textAlign: 'center' },
        content: [
          { type: 'text', text: 'This is centered text.' }
        ]
      });
    });

    it('should handle multiple comments with varying spacing', async () => {
      const markdown = `
<!-- adf:heading attrs='{"id":"section-1"}' -->


# Section 1




<!-- adf:paragraph attrs='{"textAlign":"justify","lineHeight":"1.5"}' -->

This is a justified paragraph with custom line height.



<!-- adf:panel attrs='{"backgroundColor":"#f0f8ff"}' -->


~~~panel type=info
Panel with custom background.
~~~
`.trim();

      const result = await parser.parse(markdown);
      
      expect(result.content).toHaveLength(3);
      
      // Heading with metadata
      expect(result.content[0]).toEqual({
        type: 'heading',
        attrs: { level: 1, id: 'section-1' },
        content: [
          { type: 'text', text: 'Section 1' }
        ]
      });
      
      // Paragraph with metadata
      expect(result.content[1]).toEqual({
        type: 'paragraph',
        attrs: { textAlign: 'justify', lineHeight: '1.5' },
        content: [
          { type: 'text', text: 'This is a justified paragraph with custom line height.' }
        ]
      });
      
      // Panel with metadata
      expect(result.content[2]).toEqual({
        type: 'panel',
        attrs: { panelType: 'info', backgroundColor: '#f0f8ff' },
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Panel with custom background.' }
            ]
          }
        ]
      });
    });
  });

  describe('Mixed Content with Varying Spacing', () => {
    it('should handle complex document with inconsistent spacing', async () => {
      const markdown = `
# Main Title

Some introductory content.

<!-- adf:heading attrs='{"textAlign":"center","color":"#0052cc"}' -->
## Centered Blue Heading

<!-- adf:paragraph attrs='{"textAlign":"center"}' -->


Centered paragraph after heading.


Regular paragraph without metadata.



<!-- adf:paragraph attrs='{"backgroundColor":"#fff3cd","padding":"16px"}' -->




Paragraph with background and padding after multiple line breaks.


<!-- adf:panel attrs='{"borderColor":"#28a745"}' -->

~~~panel type=success
Success panel with custom border.
~~~

Final paragraph.
`.trim();

      const result = await parser.parse(markdown);
      
      expect(result.content).toHaveLength(8);
      
      // Main title (no metadata)
      expect(result.content[0].type).toBe('heading');
      expect(result.content[0].attrs).toEqual({ level: 1 });
      
      // Intro paragraph (no metadata)
      expect(result.content[1].type).toBe('paragraph');
      expect(result.content[1].attrs).toBeUndefined();
      
      // Centered blue heading
      expect(result.content[2]).toEqual({
        type: 'heading',
        attrs: { level: 2, textAlign: 'center', color: '#0052cc' },
        content: [
          { type: 'text', text: 'Centered Blue Heading' }
        ]
      });
      
      // Centered paragraph
      expect(result.content[3]).toEqual({
        type: 'paragraph',
        attrs: { textAlign: 'center' },
        content: [
          { type: 'text', text: 'Centered paragraph after heading.' }
        ]
      });
      
      // Regular paragraph without metadata
      expect(result.content[4].type).toBe('paragraph');
      expect(result.content[4].attrs).toBeUndefined();
      
      // Paragraph with background and padding
      expect(result.content[5]).toEqual({
        type: 'paragraph',
        attrs: { backgroundColor: '#fff3cd', padding: '16px' },
        content: [
          { type: 'text', text: 'Paragraph with background and padding after multiple line breaks.' }
        ]
      });
      
      // Success panel with custom border
      expect(result.content[6]).toEqual({
        type: 'panel',
        attrs: { panelType: 'success', borderColor: '#28a745' },
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Success panel with custom border.' }
            ]
          }
        ]
      });
      
      // Final paragraph
      expect(result.content[7].type).toBe('paragraph');
      expect(result.content[7].attrs).toBeUndefined();
    });
  });

  describe('Edge Cases with Spacing', () => {
    it('should handle comment at very end of document', async () => {
      const markdown = `
This is the last paragraph.
<!-- adf:paragraph attrs='{"textAlign":"right"}' -->
`.trim();

      const result = await parser.parse(markdown);
      
      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toEqual({
        type: 'paragraph',
        attrs: { textAlign: 'right' },
        content: [
          { type: 'text', text: 'This is the last paragraph.' }
        ]
      });
    });

    it('should handle multiple consecutive comments with spacing', async () => {
      const markdown = `
<!-- adf:paragraph attrs='{"textAlign":"center"}' -->

<!-- adf:paragraph attrs='{"backgroundColor":"#f0f0f0"}' -->



<!-- adf:paragraph attrs='{"fontWeight":"bold"}' -->
Final paragraph with all three attributes applied.
`.trim();

      const result = await parser.parse(markdown);
      
      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toEqual({
        type: 'paragraph',
        attrs: { 
          textAlign: 'center',
          backgroundColor: '#f0f0f0',
          fontWeight: 'bold'
        },
        content: [
          { type: 'text', text: 'Final paragraph with all three attributes applied.' }
        ]
      });
    });

    it('should handle comments interspersed with whitespace-only lines', async () => {
      const markdown = `
<!-- adf:heading attrs='{"id":"test"}' -->
   
    
	
# Heading with ID

   
<!-- adf:paragraph attrs='{"textAlign":"center"}' -->
      

Centered paragraph.
`.trim();

      const result = await parser.parse(markdown);
      
      expect(result.content).toHaveLength(2);
      
      expect(result.content[0]).toEqual({
        type: 'heading',
        attrs: { level: 1, id: 'test' },
        content: [
          { type: 'text', text: 'Heading with ID' }
        ]
      });
      
      expect(result.content[1]).toEqual({
        type: 'paragraph',
        attrs: { textAlign: 'center' },
        content: [
          { type: 'text', text: 'Centered paragraph.' }
        ]
      });
    });
  });

  describe('Synchronous Processing with Spacing', () => {
    it('should handle spacing variations in sync mode', () => {
      const markdown = `
<!-- adf:paragraph attrs='{"textAlign":"center"}' -->



Centered paragraph with multiple line breaks.
`.trim();

      const result = parser.parseSync(markdown);
      
      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toEqual({
        type: 'paragraph',
        attrs: { textAlign: 'center' },
        content: [
          { type: 'text', text: 'Centered paragraph with multiple line breaks.' }
        ]
      });
    });
  });

  describe('Round-Trip with Spacing', () => {
    it('should preserve metadata through round-trip with various spacing', async () => {
      const originalAdf: ADFDocument = {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { 
              level: 1,
              id: 'custom-heading',
              textAlign: 'center'
            },
            content: [
              { type: 'text', text: 'Custom Heading' }
            ]
          },
          {
            type: 'paragraph',
            attrs: { 
              textAlign: 'justify',
              backgroundColor: '#f8f9fa',
              padding: '12px'
            },
            content: [
              { type: 'text', text: 'Styled paragraph with multiple attributes' }
            ]
          }
        ]
      };

      // Convert to markdown (will have metadata comments)
      const markdown = await parser.stringify(originalAdf);
      
      // Should contain metadata comments
      expect(markdown).toContain('<!-- adf:heading');
      expect(markdown).toContain('<!-- adf:paragraph');
      
      // Convert back to ADF
      const reconstructed = await parser.parse(markdown);

      // Should preserve all custom attributes
      expect(reconstructed.content[0].attrs).toEqual({
        level: 1,
        id: 'custom-heading',
        textAlign: 'center'
      });
      
      expect(reconstructed.content[1].attrs).toEqual({
        textAlign: 'justify',
        backgroundColor: '#f8f9fa',
        padding: '12px'
      });
    });
  });
});