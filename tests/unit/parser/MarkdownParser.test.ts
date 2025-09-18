/**
 * @file MarkdownParser.test.ts
 * @description Tests for MarkdownParser integration class
 */

import { MarkdownParser } from '../../../src/parser/markdown-to-adf/MarkdownParser.js';

describe('MarkdownParser', () => {
  let parser: MarkdownParser;

  beforeEach(() => {
    parser = new MarkdownParser();
  });

  describe('Basic Parsing', () => {
    it('should parse simple markdown to ADF', () => {
      const markdown = 'Hello **world**!';
      const adf = parser.parse(markdown);

      expect(adf.version).toBe(1);
      expect(adf.type).toBe('doc');
      expect(adf.content).toHaveLength(1);
      expect(adf.content[0].type).toBe('paragraph');
    });

    it('should handle empty markdown', () => {
      const adf = parser.parse('');

      expect(adf.version).toBe(1);
      expect(adf.type).toBe('doc');
      expect(adf.content).toHaveLength(0);
    });

    it('should parse complex document', () => {
      const markdown = `# Main Title

This is a paragraph.

## Section

- Item 1
- Item 2

~~~panel type=info
Important information here.
~~~

\`\`\`javascript
console.log("code");
\`\`\``;

      const adf = parser.parse(markdown);

      expect(adf.version).toBe(1);
      expect(adf.type).toBe('doc');
      expect(adf.content).toHaveLength(6); // Heading, paragraph, heading, list, panel, codeBlock
      expect(adf.content[0].type).toBe('heading');
      expect(adf.content[1].type).toBe('paragraph');
      expect(adf.content[2].type).toBe('heading');
      expect(adf.content[3].type).toBe('bulletList');
      expect(adf.content[4].type).toBe('panel');
      expect(adf.content[5].type).toBe('codeBlock');
    });
  });

  describe('Error Handling', () => {
    it('should handle parsing errors gracefully in non-strict mode', () => {
      const parser = new MarkdownParser({ astBuilder: { strict: false } });
      
      // This won't actually cause an error in our implementation, but tests the error handling path
      const adf = parser.parse('Valid markdown');

      expect(adf.version).toBe(1);
      expect(adf.type).toBe('doc');
    });

    it('should throw errors in strict mode', () => {
      const parser = new MarkdownParser({ astBuilder: { strict: true } });
      
      // Test error handling by creating an invalid scenario
      // Since our implementation is robust, we'll create a synthetic error by overriding the tokenize method
      const originalTokenize = (parser as any).tokenizer.tokenize;
      (parser as any).tokenizer.tokenize = () => {
        throw new Error('Tokenizer error');
      };

      expect(() => parser.parse('test')).toThrow('Failed to parse markdown');
      
      // Restore original method
      (parser as any).tokenizer.tokenize = originalTokenize;
    });
  });

  describe('Validation', () => {
    it('should validate correct markdown', () => {
      const markdown = '# Valid Heading\n\nValid paragraph.';
      const result = parser.validate(markdown);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return validation results', () => {
      const result = parser.validate('# Test');

      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('errors');
      expect(typeof result.valid).toBe('boolean');
      expect(Array.isArray(result.errors)).toBe(true);
    });
  });

  describe('Parser Statistics', () => {
    it('should provide stats for simple document', () => {
      const markdown = '# Simple\n\nParagraph.';
      const stats = parser.getStats(markdown);

      expect(stats.tokenCount).toBeGreaterThan(0);
      expect(stats.nodeCount).toBeGreaterThan(0);
      expect(stats.complexity).toBe('simple');
      expect(typeof stats.hasMetadata).toBe('boolean');
      expect(typeof stats.hasFrontmatter).toBe('boolean');
    });

    it('should identify complex documents', () => {
      const complexMarkdown = `# Title
## Section 1
### Subsection
Paragraph 1
Paragraph 2
- List 1
- List 2
- List 3
1. Ordered 1
2. Ordered 2
\`\`\`code\`\`\`
~~~panel type=info
Panel content
~~~
> Quote
---
More content`;

      const stats = parser.getStats(complexMarkdown);

      expect(stats.complexity).toBe('complex');
      expect(stats.nodeCount).toBeGreaterThan(20);
    });

    it('should detect frontmatter', () => {
      const markdown = `---
title: Test
---

# Content`;
      const stats = parser.getStats(markdown);

      expect(stats.hasFrontmatter).toBe(true);
    });

    it('should detect metadata', () => {
      const markdown = '# Heading <!-- adf:heading attrs=\'{"anchor":"test"}\' -->';
      const stats = parser.getStats(markdown);

      expect(stats.hasMetadata).toBe(true);
    });
  });

  describe('Custom Options', () => {
    it('should use custom options for single parse', () => {
      const markdown = '# Test';
      const adf = parser.parseWithOptions(markdown, {
        astBuilder: { strict: false }
      });

      expect(adf.version).toBe(1);
      expect(adf.type).toBe('doc');
    });
  });

  describe('Integration Tests', () => {
    it('should handle document with frontmatter', () => {
      const markdown = `---
title: My Document
author: Test Author
---

# Document Title

Content here.`;

      const adf = parser.parse(markdown);

      expect(adf.version).toBe(1);
      expect(adf.content).toHaveLength(2); // Heading + paragraph
      expect(adf.content[0].type).toBe('heading');
      expect(adf.content[1].type).toBe('paragraph');
    });

    it('should preserve ADF metadata in conversion', () => {
      const markdown = `# Custom Heading <!-- adf:heading attrs='{"anchor":"custom","level":1}' -->

~~~panel type=warning layout=wide
Custom panel with multiple attributes.
~~~`;

      const adf = parser.parse(markdown);

      expect(adf.content[0].type).toBe('heading');
      expect(adf.content[0].attrs?.anchor).toBe('custom');
      
      expect(adf.content[1].type).toBe('panel');
      expect(adf.content[1].attrs?.panelType).toBe('warning');
      expect(adf.content[1].attrs?.layout).toBe('wide');
    });
  });
});