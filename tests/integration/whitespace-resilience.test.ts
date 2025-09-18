/**
 * @file Test that our fixture tests are resilient to whitespace variations
 */

import { describe, it, expect } from '@jest/globals';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Parser } from '../../src/index.js';
import { normalizeMarkdownForComparison } from '../../src/utils/test-utils.js';
import type { ADFDocument } from '../../src/index.js';

describe('Whitespace Resilience Tests', () => {
  const parser = new Parser();
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const fixturesDir = join(__dirname, '..', 'fixtures');

  const loadFixture = (name: string): { adf: ADFDocument; expected: string } => {
    const adfPath = join(fixturesDir, 'adf', `${name}.adf`);
    const expectedPath = join(fixturesDir, 'markdown', `${name}.md`);
    
    const adf = JSON.parse(readFileSync(adfPath, 'utf8')) as ADFDocument;
    const expected = readFileSync(expectedPath, 'utf8');
    
    return { adf, expected };
  };

  const addExtraWhitespace = (markdown: string): string => {
    return markdown
      // Add extra line breaks between elements
      .replace(/\n\n/g, '\n\n\n\n')
      // Add extra breaks before headers
      .replace(/\n# /g, '\n\n\n# ')
      // Add extra breaks before lists  
      .replace(/\n- /g, '\n\n- ')
      .replace(/\n\d+\. /g, '\n\n$&')
      // Add trailing spaces
      .replace(/$/gm, '  ')
      // Add leading/trailing whitespace
      .replace(/^/, '\n\n')
      .replace(/$/, '\n\n');
  };

  it('should handle simple document with extra whitespace', () => {
    const { adf, expected } = loadFixture('simple-document');
    const result = parser.adfToMarkdown(adf);
    
    // Create version with extra whitespace
    const extraWhitespaceExpected = addExtraWhitespace(expected);
    
    // Both should normalize to the same result
    expect(normalizeMarkdownForComparison(result)).toBe(normalizeMarkdownForComparison(expected));
    expect(normalizeMarkdownForComparison(result)).toBe(normalizeMarkdownForComparison(extraWhitespaceExpected));
  });

  it('should handle edge-cases fixture with extra whitespace', () => {
    const { adf, expected } = loadFixture('edge-cases');
    const result = parser.adfToMarkdown(adf);
    
    // Create version with extra spacing between list items
    const spacedExpected = expected
      .replace(/\n6\. /g, '\n\n\n6. ')
      .replace(/\n7\. /g, '\n\n\n7. ')
      .replace(/\n  - Nested/g, '\n\n\n\n  - Nested');
    
    // Both should normalize to the same result
    expect(normalizeMarkdownForComparison(result)).toBe(normalizeMarkdownForComparison(expected));
    expect(normalizeMarkdownForComparison(result)).toBe(normalizeMarkdownForComparison(spacedExpected));
  });

  it('should handle various whitespace patterns', () => {
    const testCases = [
      "# Header\n\nParagraph\n\n- List item",
      "# Header\n\n\n\nParagraph\n\n\n\n\n- List item",
      "  \n\n# Header\n\n\n\nParagraph\n\n\n\n\n- List item\n\n  ",
      // Skip the tab case for now - it creates a nested list which is valid markdown
      // The important thing is that our main fixtures work with extra whitespace
    ];

    const normalized = testCases.map(test => normalizeMarkdownForComparison(test));
    
    // All should normalize to the same result
    normalized.forEach((norm, i) => {
      if (i > 0) {
        expect(norm).toBe(normalized[0]);
      }
    });
  });

  it('should preserve intentional structure while normalizing whitespace', () => {
    const markdown = `# Main Header

This is a paragraph.

## Sub Header

- List item 1
- List item 2

Another paragraph.`;

    const withExtraWhitespace = `


# Main Header



This is a paragraph.




## Sub Header



- List item 1


- List item 2



Another paragraph.


`;

    const norm1 = normalizeMarkdownForComparison(markdown);
    const norm2 = normalizeMarkdownForComparison(withExtraWhitespace);
    
    expect(norm1).toBe(norm2);
    
    // Should preserve the basic structure
    expect(norm1).toContain('# Main Header');
    expect(norm1).toContain('## Sub Header');
    expect(norm1).toContain('- List item 1\n- List item 2');
    expect(norm1).toContain('Another paragraph.');
  });

  it('should handle mixed list types correctly', () => {
    const orderedList = "1. First\n2. Second\n3. Third";
    const orderedListSpaced = "1. First\n\n2. Second\n\n\n3. Third";
    
    const bulletList = "- First\n- Second\n- Third";
    const bulletListSpaced = "- First\n\n- Second\n\n\n- Third";

    expect(normalizeMarkdownForComparison(orderedList))
      .toBe(normalizeMarkdownForComparison(orderedListSpaced));
    
    expect(normalizeMarkdownForComparison(bulletList))
      .toBe(normalizeMarkdownForComparison(bulletListSpaced));
  });

  it('should handle nested lists with whitespace variations', () => {
    const nested = "1. Item 1\n  - Sub item\n2. Item 2";
    const nestedSpaced = "1. Item 1\n\n\n  - Sub item\n\n\n2. Item 2";
    
    expect(normalizeMarkdownForComparison(nested))
      .toBe(normalizeMarkdownForComparison(nestedSpaced));
  });

  it('should handle tab indentation as nested lists', () => {
    // This test shows that tabs are correctly interpreted as intentional indentation
    const withTab = "# Header\n\nParagraph\n\n\t- List item";
    const withSpaces = "# Header\n\nParagraph\n\n  - List item";
    
    const tabNorm = normalizeMarkdownForComparison(withTab);
    const spaceNorm = normalizeMarkdownForComparison(withSpaces);
    
    // Both should normalize to the same (nested) structure
    expect(tabNorm).toBe(spaceNorm);
    expect(tabNorm).toContain('  - List item'); // 2-space indentation preserved
  });

  it('should demonstrate resilience by creating temporary fixture with extra whitespace', () => {
    // This test demonstrates that even if a user manually adds extra whitespace
    // to fixture files, our tests would still pass
    
    const { adf, expected } = loadFixture('simple-document');
    const result = parser.adfToMarkdown(adf);
    
    // Simulate what would happen if someone edited the fixture file with extra whitespace
    const modifiedExpected = `
      
# Simple Document



This is a simple document with basic markdown features.




- First item

- Second item with *italic text*

- Third item

      `;
    
    // Test should still pass with normalized comparison
    expect(normalizeMarkdownForComparison(result)).toBe(normalizeMarkdownForComparison(expected));
    expect(normalizeMarkdownForComparison(result)).toBe(normalizeMarkdownForComparison(modifiedExpected));
  });
});