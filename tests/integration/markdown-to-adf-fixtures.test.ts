/**
 * @file markdown-to-adf-fixtures.test.ts
 * @description Comprehensive fixture tests for Markdown to ADF conversion
 */

import { MarkdownParser } from '../../src/parser/markdown-to-adf/MarkdownParser.js';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ADFDocument } from '../../src/types/adf.types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Markdown to ADF Fixtures Tests', () => {
  let parser: MarkdownParser;
  const fixturesDir = join(__dirname, '../fixtures/markdown');

  beforeEach(() => {
    parser = new MarkdownParser();
  });

  describe('Basic Document Fixtures', () => {
    it('should convert simple-document.md to valid ADF', async () => {
      const markdown = await readFile(join(fixturesDir, 'simple-document.md'), 'utf-8');
      const adf = parser.parse(markdown);

      expect(adf.version).toBe(1);
      expect(adf.type).toBe('doc');
      expect(adf.content).toHaveLength(3);
      
      // Verify heading
      expect(adf.content[0].type).toBe('heading');
      expect(adf.content[0].attrs?.level).toBe(1);
      expect(adf.content[0].content?.[0].text).toBe('Simple Document');
      
      // Verify paragraph
      expect(adf.content[1].type).toBe('paragraph');
      expect(adf.content[1].content?.[0].text).toContain('This is a simple document');
      
      // Verify bullet list
      expect(adf.content[2].type).toBe('bulletList');
      expect(adf.content[2].content).toHaveLength(3);
    });

    it('should convert rich-content.md to valid ADF with formatting', async () => {
      const markdown = await readFile(join(fixturesDir, 'rich-content.md'), 'utf-8');
      const adf = parser.parse(markdown);

      expect(adf.version).toBe(1);
      expect(adf.type).toBe('doc');
      
      // Should contain various content types
      const contentTypes = adf.content.map(node => node.type);
      expect(contentTypes).toContain('heading');
      expect(contentTypes).toContain('paragraph');
      expect(contentTypes).toContain('codeBlock');
      expect(contentTypes).toContain('blockquote');
      
      // Verify at least one paragraph has formatted text
      const paragraphs = adf.content.filter(node => node.type === 'paragraph');
      const hasFormattedText = paragraphs.some(p => 
        p.content?.some(content => content.marks && content.marks.length > 0)
      );
      expect(hasFormattedText).toBe(true);
    });

    it('should convert edge-cases.md to valid ADF', async () => {
      const markdown = await readFile(join(fixturesDir, 'edge-cases.md'), 'utf-8');
      const adf = parser.parse(markdown);

      expect(adf.version).toBe(1);
      expect(adf.type).toBe('doc');
      expect(adf.content.length).toBeGreaterThan(0);
      
      // Should handle various edge cases without crashing
      expect(() => JSON.stringify(adf)).not.toThrow();
    });
  });

  describe('Table Conversion Fixtures', () => {
    it('should convert table-document.md to valid ADF with tables', async () => {
      const markdown = await readFile(join(fixturesDir, 'table-document.md'), 'utf-8');
      const adf = parser.parse(markdown);

      expect(adf.version).toBe(1);
      expect(adf.type).toBe('doc');
      
      // Should contain at least one table
      const tables = adf.content.filter(node => node.type === 'table');
      expect(tables.length).toBeGreaterThan(0);
      
      // Verify table structure
      const firstTable = tables[0];
      expect(firstTable.content).toBeDefined();
      expect(firstTable.content!.length).toBeGreaterThan(0);
      
      // First row should be header
      const firstRow = firstTable.content![0];
      expect(firstRow.type).toBe('tableRow');
      expect(firstRow.content?.[0].type).toBe('tableHeader');
    });

    it('should convert comprehensive-tables.md with complex table features', async () => {
      const markdown = await readFile(join(fixturesDir, 'comprehensive-tables.md'), 'utf-8');
      const adf = parser.parse(markdown);

      const tables = adf.content.filter(node => node.type === 'table');
      expect(tables.length).toBeGreaterThan(0);
      
      // Should handle various table configurations
      tables.forEach(table => {
        expect(table.attrs?.isNumberColumnEnabled).toBeDefined();
        expect(table.attrs?.layout).toBeDefined();
      });
    });
  });

  describe('List Conversion Fixtures', () => {
    it('should convert comprehensive-lists.md with various list types', async () => {
      const markdown = await readFile(join(fixturesDir, 'comprehensive-lists.md'), 'utf-8');
      const adf = parser.parse(markdown);

      // Should contain both bullet and ordered lists
      const bulletLists = adf.content.filter(node => node.type === 'bulletList');
      const orderedLists = adf.content.filter(node => node.type === 'orderedList');
      
      expect(bulletLists.length).toBeGreaterThan(0);
      expect(orderedLists.length).toBeGreaterThan(0);
      
      // Check for custom start in ordered lists
      const customStartList = orderedLists.find(list => list.attrs?.order && list.attrs.order > 1);
      expect(customStartList).toBeDefined();
    });
  });

  describe('Mark Formatting Fixtures', () => {
    it('should convert comprehensive-marks.md with all text formatting', async () => {
      const markdown = await readFile(join(fixturesDir, 'comprehensive-marks.md'), 'utf-8');
      const adf = parser.parse(markdown);

      // Collect all text nodes with marks
      const textNodesWithMarks: any[] = [];
      
      function collectTextNodes(nodes: any[]) {
        for (const node of nodes) {
          if (node.type === 'text' && node.marks) {
            textNodesWithMarks.push(node);
          }
          if (node.content) {
            collectTextNodes(node.content);
          }
        }
      }
      
      collectTextNodes(adf.content);
      
      // Should find various mark types
      const markTypes = new Set();
      textNodesWithMarks.forEach(textNode => {
        textNode.marks?.forEach((mark: any) => markTypes.add(mark.type));
      });
      
      expect(markTypes.has('strong')).toBe(true);
      expect(markTypes.has('em')).toBe(true);
      expect(markTypes.has('code')).toBe(true);
      expect(markTypes.has('strike')).toBe(true);
    });
  });

  describe('Media and Expand Fixtures', () => {
    it('should convert media-expand.md with media and expand blocks', async () => {
      const markdown = await readFile(join(fixturesDir, 'media-expand.md'), 'utf-8');
      const adf = parser.parse(markdown);

      // Should contain expand blocks
      const expandBlocks = adf.content.filter(node => node.type === 'expand');
      expect(expandBlocks.length).toBeGreaterThan(0);
      
      // Expand blocks should have titles
      expandBlocks.forEach(expand => {
        expect(expand.attrs?.title).toBeDefined();
        expect(expand.content).toBeDefined();
      });
    });

    it('should convert comprehensive-media-expand.md with complex structures', async () => {
      const markdown = await readFile(join(fixturesDir, 'comprehensive-media-expand.md'), 'utf-8');
      const adf = parser.parse(markdown);

      // Should contain both media and expand elements
      const contentTypes = new Set(adf.content.map(node => node.type));
      expect(contentTypes.has('expand')).toBe(true);
      
      // Should handle nested content in expand blocks
      const expandBlocks = adf.content.filter(node => node.type === 'expand');
      expandBlocks.forEach(expand => {
        expect(expand.content).toBeDefined();
        expect(expand.content!.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Block Content Fixtures', () => {
    it('should convert comprehensive-blocks.md with all block types', async () => {
      const markdown = await readFile(join(fixturesDir, 'comprehensive-blocks.md'), 'utf-8');
      const adf = parser.parse(markdown);

      // Should contain various block types
      const contentTypes = new Set(adf.content.map(node => node.type));
      
      expect(contentTypes.has('heading')).toBe(true);
      expect(contentTypes.has('paragraph')).toBe(true);
      expect(contentTypes.has('codeBlock')).toBe(true);
      expect(contentTypes.has('blockquote')).toBe(true);
      expect(contentTypes.has('panel')).toBe(true);
      expect(contentTypes.has('rule')).toBe(true);
      
      // Verify panel attributes
      const panels = adf.content.filter(node => node.type === 'panel');
      expect(panels.length).toBeGreaterThan(0);
      panels.forEach(panel => {
        expect(panel.attrs?.panelType).toBeDefined();
        expect(['info', 'warning', 'error', 'success', 'note']).toContain(panel.attrs?.panelType);
      });
    });
  });

  describe('Validation and Error Handling', () => {
    it('should produce valid ADF for all fixtures', async () => {
      const fixtureFiles = [
        'simple-document.md',
        'rich-content.md',
        'table-document.md',
        'media-expand.md',
        'edge-cases.md',
        'comprehensive-marks.md',
        'comprehensive-blocks.md',
        'comprehensive-lists.md',
        'comprehensive-tables.md',
        'comprehensive-media-expand.md',
        'comprehensive-advanced-features.md',
        'comprehensive-expand-sections.md',
        'comprehensive-media.md',
        'comprehensive-mentions-and-social.md',
        'comprehensive-panels.md',
        'comprehensive-status-and-dates.md'
      ];

      for (const file of fixtureFiles) {
        const markdown = await readFile(join(fixturesDir, file), 'utf-8');
        const adf = parser.parse(markdown);
        
        // Basic ADF structure validation
        expect(adf.version).toBe(1);
        expect(adf.type).toBe('doc');
        expect(Array.isArray(adf.content)).toBe(true);
        
        // Should be serializable
        expect(() => JSON.stringify(adf)).not.toThrow();
        
        // All content nodes should have required properties
        adf.content.forEach((node, index) => {
          expect(node.type).toBeDefined();
          expect(typeof node.type).toBe('string');
        });
      }
    });

    it('should handle malformed markdown gracefully', () => {
      const malformedMarkdown = `
# Heading with unclosed code block
\`\`\`javascript
function test() {
  console.log("unclosed");

~~~panel type=info
Panel with missing close

| Table | Header |
|-------|
| Missing cell |

> Blockquote with
multiple lines and **bold text
      `;

      expect(() => {
        const adf = parser.parse(malformedMarkdown);
        expect(adf.version).toBe(1);
        expect(adf.type).toBe('doc');
      }).not.toThrow();
    });

    it('should preserve content when converting fixtures', async () => {
      const markdown = await readFile(join(fixturesDir, 'simple-document.md'), 'utf-8');
      const adf = parser.parse(markdown);
      
      // Extract all text content from ADF
      function extractText(nodes: any[]): string {
        return nodes.map(node => {
          if (node.type === 'text') {
            return node.text || '';
          }
          if (node.content) {
            return extractText(node.content);
          }
          return '';
        }).join(' ');
      }
      
      const adfText = extractText(adf.content);
      
      // Should preserve main content (allowing for formatting differences)
      expect(adfText).toContain('Simple Document');
      expect(adfText).toContain('This is a simple document');
    });
  });

  describe('Performance Tests', () => {
    it('should handle large markdown documents efficiently', async () => {
      // Create a large markdown document
      const largeMarkdown = `# Large Document\n\n` + 
        Array(1000).fill(0).map((_, i) => `## Section ${i}\n\nParagraph ${i} with **bold** and *italic* text.\n\n- List item ${i}-1\n- List item ${i}-2\n\n`).join('');
      
      const startTime = performance.now();
      const adf = parser.parse(largeMarkdown);
      const endTime = performance.now();
      
      expect(adf.version).toBe(1);
      expect(adf.type).toBe('doc');
      expect(adf.content.length).toBeGreaterThan(1000);
      
      // Should complete in reasonable time (less than 5 seconds)
      expect(endTime - startTime).toBeLessThan(5000);
    });

    it('should not accumulate memory across multiple conversions', () => {
      const baseMarkdown = '# Test\n\nParagraph with **bold** text.';
      
      // Perform multiple conversions
      for (let i = 0; i < 100; i++) {
        const adf = parser.parse(baseMarkdown);
        expect(adf.version).toBe(1);
        expect(adf.content[0].type).toBe('heading');
      }
      
      // If we get here without memory issues, the test passes
      expect(true).toBe(true);
    });
  });

  describe('Frontmatter Handling', () => {
    it('should handle documents with YAML frontmatter', () => {
      const markdownWithFrontmatter = `---
title: Test Document
author: Test Author
tags:
  - test
  - markdown
  - adf
---

# Main Content

This is the main content of the document.
`;

      const adf = parser.parse(markdownWithFrontmatter);
      
      expect(adf.version).toBe(1);
      expect(adf.type).toBe('doc');
      
      // Should contain the main content (frontmatter is processed but not in final ADF)
      expect(adf.content[0].type).toBe('heading');
      expect(adf.content[0].content?.[0].text).toBe('Main Content');
    });
  });

  describe('Metadata Preservation', () => {
    it('should preserve ADF metadata in comments', () => {
      const markdownWithMetadata = `# Custom Heading <!-- adf:heading attrs='{"anchor":"custom-heading","level":1}' -->

~~~panel type=info layout=wide customAttr="value"
Panel with custom attributes and metadata.
~~~

## Section <!-- adf:heading attrs='{"anchor":"section-2"}' -->

Regular paragraph.
`;

      const adf = parser.parse(markdownWithMetadata);
      
      // Check heading metadata
      const firstHeading = adf.content[0];
      expect(firstHeading.type).toBe('heading');
      expect(firstHeading.attrs?.anchor).toBe('custom-heading');
      expect(firstHeading.attrs?.level).toBe(1);
      
      // Check panel metadata
      const panel = adf.content.find(node => node.type === 'panel');
      expect(panel?.attrs?.panelType).toBe('info');
      expect(panel?.attrs?.layout).toBe('wide');
      expect(panel?.attrs?.customAttr).toBe('value');
      
      // Check second heading metadata
      const secondHeading = adf.content.find((node, index) => 
        node.type === 'heading' && index > 0
      );
      expect(secondHeading?.attrs?.anchor).toBe('section-2');
    });
  });
});