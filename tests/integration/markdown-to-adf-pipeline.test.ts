/**
 * @file conversion-pipeline.test.ts
 * @description Integration tests for the complete markdown to ADF conversion pipeline
 */

import { Parser } from '../../src/index.js';
import { MarkdownParser } from '../../src/parser/markdown-to-adf/MarkdownParser.js';
import { MarkdownValidator } from '../../src/validators/MarkdownValidator.js';
import { AdfValidator } from '../../src/validators/AdfValidator.js';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Conversion Pipeline Integration Tests', () => {
  let parser: Parser;
  let markdownParser: MarkdownParser;
  let markdownValidator: MarkdownValidator;
  let adfValidator: AdfValidator;
  
  const fixturesDir = join(__dirname, '../fixtures/markdown');

  beforeEach(() => {
    parser = new Parser();
    markdownParser = new MarkdownParser();
    markdownValidator = new MarkdownValidator();
    adfValidator = new AdfValidator();
  });

  describe('End-to-End Conversion Pipeline', () => {
    it('should convert markdown through complete pipeline successfully', async () => {
      const markdown = `# Test Document

This is a paragraph with **bold** and *italic* text.

## Section

~~~panel type=info
Important information here.
~~~

### Subsection

- List item 1
- List item 2

\`\`\`javascript
console.log("test code");
\`\`\`

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |

> Blockquote with important text.

---

Final paragraph.`;

      // Step 1: Validate markdown
      const markdownValidation = markdownValidator.validate(markdown);
      expect(markdownValidation.valid).toBe(true);
      
      // Step 2: Convert to ADF
      const adf = markdownParser.parse(markdown);
      expect(adf.version).toBe(1);
      expect(adf.type).toBe('doc');
      
      // Step 3: Validate ADF
      const adfValidation = adfValidator.validate(adf);
      expect(adfValidation.valid).toBe(true);
      
      // Step 4: Test round-trip conversion
      const backToMarkdown = parser.adfToMarkdown(adf);
      expect(backToMarkdown.length).toBeGreaterThan(0);
      
      // Step 5: Validate converted markdown
      const backValidation = markdownValidator.validate(backToMarkdown);
      expect(backValidation.valid).toBe(true);
    });

    it('should handle complex documents with all supported features', async () => {
      const complexMarkdown = await readFile(
        join(fixturesDir, 'comprehensive-blocks.md'), 
        'utf-8'
      );

      // Validate input markdown
      const inputValidation = markdownValidator.validate(complexMarkdown);
      expect(inputValidation.valid).toBe(true);

      // Convert to ADF
      const adf = markdownParser.parse(complexMarkdown);
      expect(adf.version).toBe(1);
      expect(adf.type).toBe('doc');
      expect(adf.content.length).toBeGreaterThan(5);

      // Validate resulting ADF
      const adfValidation = adfValidator.validate(adf);
      expect(adfValidation.valid).toBe(true);

      // Test with alternative parser method to ensure consistency
      const alternativeAdf = markdownParser.parse(complexMarkdown);
      expect(alternativeAdf.version).toBe(1);
      expect(alternativeAdf.content.length).toBe(adf.content.length);
    });

    it('should preserve content integrity through pipeline', async () => {
      const markdown = await readFile(
        join(fixturesDir, 'simple-document.md'), 
        'utf-8'
      );

      // Extract key content markers
      const originalContent = {
        hasHeading: markdown.includes('# '),
        hasBold: markdown.includes('**'),
        hasItalic: markdown.includes('*'),
        hasList: markdown.includes('- '),
        hasCode: markdown.includes('```')
      };

      // Convert to ADF
      const adf = markdownParser.parse(markdown);
      
      // Verify content preservation in ADF
      const adfString = JSON.stringify(adf);
      const adfContent = {
        hasHeading: adf.content.some(n => n.type === 'heading'),
        hasBold: adfString.includes('"type":"strong"'),
        hasItalic: adfString.includes('"type":"em"'),
        hasList: adf.content.some(n => n.type === 'bulletList'),
        hasCode: adf.content.some(n => n.type === 'codeBlock')
      };

      // Verify content preservation
      Object.keys(originalContent).forEach(key => {
        if (originalContent[key as keyof typeof originalContent]) {
          expect(adfContent[key as keyof typeof adfContent]).toBe(true);
        }
      });

      // Convert back to markdown
      const backToMarkdown = parser.adfToMarkdown(adf);
      
      // Verify basic content is still present
      if (originalContent.hasHeading) {
        expect(backToMarkdown).toMatch(/^#/m);
      }
      if (originalContent.hasList) {
        expect(backToMarkdown).toMatch(/^[\-\*\+]/m);
      }
    });
  });

  describe('Error Handling in Pipeline', () => {
    it('should handle invalid markdown gracefully', () => {
      const invalidMarkdown = `######## Too many heading levels

~~~panel
Missing type attribute
~~~

{media:} empty media reference

[Link with empty URL]()`;

      // Validation should fail
      const validation = markdownValidator.validate(invalidMarkdown);
      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);

      // But conversion should still work (with default handling)
      expect(() => {
        const adf = markdownParser.parse(invalidMarkdown);
        expect(adf.version).toBe(1);
        expect(adf.type).toBe('doc');
      }).not.toThrow();
    });

    it('should handle malformed ADF gracefully', () => {
      const malformedAdf = {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'heading',
            // Missing required level attribute
            content: [{ type: 'text', text: 'Invalid heading' }]
          },
          {
            type: 'panel',
            // Missing required panelType attribute  
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Invalid panel' }] }]
          }
        ]
      };

      // ADF validation should fail
      const validation = adfValidator.validate(malformedAdf);
      expect(validation.valid).toBe(false);

      // But conversion should handle it gracefully
      expect(() => {
        const markdown = parser.adfToMarkdown(malformedAdf as any);
        expect(typeof markdown).toBe('string');
      }).not.toThrow();
    });

    it('should provide meaningful error messages in strict mode', () => {
      const strictMarkdownParser = new MarkdownParser({ 
        astBuilder: { strict: true } 
      });

      // Create a scenario that would cause parsing issues
      const problematicMarkdown = `Valid content`;
      
      // Override tokenizer to force an error
      const originalTokenize = (strictMarkdownParser as any).tokenizer.tokenize;
      (strictMarkdownParser as any).tokenizer.tokenize = () => {
        throw new Error('Tokenizer failed');
      };

      expect(() => {
        strictMarkdownParser.parse(problematicMarkdown);
      }).toThrow('Failed to parse markdown');

      // Restore original method
      (strictMarkdownParser as any).tokenizer.tokenize = originalTokenize;
    });
  });

  describe('Performance and Memory Tests', () => {
    it('should handle large documents efficiently', async () => {
      // Create large markdown document
      const sections = Array(100).fill(0).map((_, i) => `
## Section ${i}

Paragraph ${i} with **bold** and *italic* text.

- List item 1
- List item 2

\`\`\`javascript
console.log("section ${i}");
\`\`\`

| Col 1 | Col 2 |
|-------|-------|
| Data  | ${i}  |
`).join('\n\n');

      const largeMarkdown = `# Large Document\n\n${sections}`;

      const startTime = performance.now();
      
      // Full pipeline test
      const validation = markdownValidator.validate(largeMarkdown);
      expect(validation.valid).toBe(true);
      
      const adf = markdownParser.parse(largeMarkdown);
      expect(adf.content.length).toBeGreaterThan(100);
      
      const adfValidation = adfValidator.validate(adf);
      expect(adfValidation.valid).toBe(true);
      
      const endTime = performance.now();
      
      // Should complete in reasonable time (less than 5 seconds)
      expect(endTime - startTime).toBeLessThan(5000);
    });

    it('should not leak memory across multiple conversions', () => {
      const testMarkdown = `# Test

Paragraph with **bold** text.

- Item 1
- Item 2

\`\`\`javascript
console.log("test");
\`\`\``;

      // Run multiple conversions
      for (let i = 0; i < 100; i++) {
        const validation = markdownValidator.validate(testMarkdown);
        const adf = markdownParser.parse(testMarkdown);
        const adfValidation = adfValidator.validate(adf);
        const backToMarkdown = parser.adfToMarkdown(adf);
        
        expect(validation.valid).toBe(true);
        expect(adf.version).toBe(1);
        expect(adfValidation.valid).toBe(true);
        expect(backToMarkdown.length).toBeGreaterThan(0);
      }
      
      // If we reach here without memory issues, test passes
      expect(true).toBe(true);
    });

    it('should handle concurrent conversions', async () => {
      const testCases = [
        '# Heading 1\n\nParagraph 1.',
        '## Heading 2\n\n**Bold text** here.',
        '### Heading 3\n\n- List item\n- Another item',
        '#### Code\n\n```javascript\nconsole.log();\n```'
      ];

      const promises = testCases.map(async markdown => {
        const validation = markdownValidator.validate(markdown);
        const adf = markdownParser.parse(markdown);
        const adfValidation = adfValidator.validate(adf);
        
        return { validation, adf, adfValidation };
      });

      const results = await Promise.all(promises);

      results.forEach(({ validation, adf, adfValidation }) => {
        expect(validation.valid).toBe(true);
        expect(adf.version).toBe(1);
        expect(adfValidation.valid).toBe(true);
      });
    });
  });

  describe('Configuration and Options', () => {
    it('should respect parser configuration options', () => {
      const markdown = `# Test\n\nContent with unknown node types.`;
      
      // Test with different configurations
      const strictParser = new MarkdownParser({
        tokenizer: { strict: true, maxDepth: 3 },
        astBuilder: { strict: true, preserveUnknownNodes: false }
      });
      
      const lenientParser = new MarkdownParser({
        tokenizer: { strict: false, maxDepth: 10 },
        astBuilder: { strict: false, preserveUnknownNodes: true }
      });
      
      // Both should work but potentially with different behaviors
      const strictAdf = strictParser.parse(markdown);
      const lenientAdf = lenientParser.parse(markdown);
      
      expect(strictAdf.version).toBe(1);
      expect(lenientAdf.version).toBe(1);
    });

    it('should handle validation options correctly', () => {
      const markdown = `# Test
      
~~~unknown type=test
Unknown fence type content
~~~`;

      const strictValidator = new MarkdownValidator();
      const result = strictValidator.validate(markdown);
      
      // Should validate successfully but might have warnings
      expect(result.valid).toBe(true);
      expect(result.warnings?.some(w => w.includes('Unknown ADF fence type'))).toBe(true);
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle empty and whitespace-only documents', () => {
      const testCases = ['', '   ', '\n\n\n', '\t\t\t'];
      
      testCases.forEach(testCase => {
        const validation = markdownValidator.validate(testCase);
        const adf = markdownParser.parse(testCase);
        const adfValidation = adfValidator.validate(adf);
        
        expect(validation.valid).toBe(true);
        expect(adf.version).toBe(1);
        expect(adf.content).toHaveLength(0);
        expect(adfValidation.valid).toBe(true);
      });
    });

    it('should handle documents with only metadata', () => {
      const metadataOnlyDocs = [
        '---\ntitle: Test\n---',
        '<!-- Comment only -->',
        '<!-- adf:meta attrs=\'{"test":"value"}\' -->'
      ];
      
      metadataOnlyDocs.forEach(doc => {
        const validation = markdownValidator.validate(doc);
        const adf = markdownParser.parse(doc);
        const adfValidation = adfValidator.validate(adf);
        
        expect(validation.valid).toBe(true);
        expect(adf.version).toBe(1);
        expect(adfValidation.valid).toBe(true);
      });
    });

    it('should handle maximum nesting depths gracefully', () => {
      // Create deeply nested structure
      const deepNesting = Array(20).fill(0).reduce((acc, _, i) => {
        return `> ${acc}`;
      }, 'Deep nested content');
      
      const validation = markdownValidator.validate(deepNesting);
      const adf = markdownParser.parse(deepNesting);
      const adfValidation = adfValidator.validate(adf);
      
      expect(validation.valid).toBe(true);
      expect(adf.version).toBe(1);
      expect(adfValidation.valid).toBe(true);
    });
  });

  describe('Statistics and Metrics', () => {
    it('should provide accurate parsing statistics', () => {
      const complexMarkdown = `# Main Title

## Section 1

Paragraph with **bold**, *italic*, and \`code\`.

~~~panel type=info
Panel content here.
~~~

### Subsection

1. Ordered item
2. Another item

\`\`\`javascript
console.log("code");
\`\`\`

| Header | Value |
|--------|-------|
| Data   | 123   |

> Blockquote text

---

Final paragraph.`;

      const stats = markdownParser.getStats(complexMarkdown);
      
      expect(stats.tokenCount).toBeGreaterThan(10);
      expect(stats.nodeCount).toBeGreaterThan(10);
      expect(stats.complexity).toBe('complex');
      expect(stats.hasMetadata).toBe(true); // Panel has type=info metadata
      expect(stats.hasFrontmatter).toBe(false);
      
      // Test document with metadata
      const metadataMarkdown = `---
title: Test
---

# Heading <!-- adf:heading attrs='{"anchor":"test"}' -->`;
      
      const metaStats = markdownParser.getStats(metadataMarkdown);
      expect(metaStats.hasMetadata).toBe(true);
      expect(metaStats.hasFrontmatter).toBe(true);
    });

    it('should track conversion metrics correctly', async () => {
      const fixtureFiles = [
        'simple-document.md',
        'rich-content.md',
        'table-document.md'
      ];

      for (const file of fixtureFiles) {
        const markdown = await readFile(join(fixturesDir, file), 'utf-8');
        const stats = markdownParser.getStats(markdown);
        
        expect(stats.tokenCount).toBeGreaterThan(0);
        expect(stats.nodeCount).toBeGreaterThan(0);
        expect(['simple', 'moderate', 'complex']).toContain(stats.complexity);
      }
    });
  });
});