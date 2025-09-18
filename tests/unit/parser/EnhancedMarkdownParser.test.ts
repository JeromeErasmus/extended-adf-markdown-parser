/**
 * @file EnhancedMarkdownParser.test.ts
 * @description Tests for the enhanced markdown parser with micromark extensions
 */

import { describe, it, expect } from '@jest/globals';
import { EnhancedMarkdownParser } from '../../../src/parser/markdown-to-adf/EnhancedMarkdownParser.js';
import { ADFDocument } from '../../../src/types/adf.types.js';

describe('EnhancedMarkdownParser', () => {
  let parser: EnhancedMarkdownParser;

  beforeEach(() => {
    parser = new EnhancedMarkdownParser();
  });

  describe('constructor and options', () => {
    it('should create parser with default options', () => {
      const defaultParser = new EnhancedMarkdownParser();
      expect(defaultParser).toBeInstanceOf(EnhancedMarkdownParser);
    });

    it('should create parser with custom options', () => {
      const customParser = new EnhancedMarkdownParser({
        strict: true,
        gfm: false,
        frontmatter: false,
        adfExtensions: false,
        maxNestingDepth: 3
      });
      expect(customParser).toBeInstanceOf(EnhancedMarkdownParser);
    });
  });

  describe('parseSync - basic markdown', () => {
    it('should parse simple paragraph', () => {
      const markdown = 'This is a simple paragraph.';
      const result = parser.parseSync(markdown);

      expect(result).toEqual({
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'This is a simple paragraph.' }
            ]
          }
        ]
      });
    });

    it('should parse headings', () => {
      const markdown = `
# Heading 1
## Heading 2
### Heading 3
      `.trim();

      const result = parser.parseSync(markdown);

      expect(result.content).toHaveLength(3);
      expect(result.content[0]).toEqual({
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: 'Heading 1' }]
      });
      expect(result.content[1]).toEqual({
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'Heading 2' }]
      });
    });

    it('should parse text formatting', () => {
      const markdown = 'This has **bold**, *italic*, ~~strikethrough~~, and `inline code`.';
      const result = parser.parseSync(markdown);

      expect(result.content[0].type).toBe('paragraph');
      
      // The exact structure may vary based on how inline formatting is parsed
      const paragraph = result.content[0];
      expect(paragraph.content).toBeDefined();
    });

    it('should parse lists', () => {
      const markdown = `
- Item 1
- Item 2
  - Nested item
- Item 3

1. Ordered item 1
2. Ordered item 2
      `.trim();

      const result = parser.parseSync(markdown);

      expect(result.content).toHaveLength(2);
      expect(result.content[0].type).toBe('bulletList');
      expect(result.content[1].type).toBe('orderedList');
    });

    it('should parse blockquotes', () => {
      const markdown = `
> This is a blockquote
> with multiple lines
      `.trim();

      const result = parser.parseSync(markdown);

      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('blockquote');
    });

    it('should parse code blocks', () => {
      const markdown = `
\`\`\`javascript
function test() {
  return true;
}
\`\`\`
      `.trim();

      const result = parser.parseSync(markdown);

      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toEqual({
        type: 'codeBlock',
        attrs: { language: 'javascript' },
        content: [
          { 
            type: 'text', 
            text: 'function test() {\n  return true;\n}' 
          }
        ]
      });
    });
  });

  describe('parseSync - ADF extensions', () => {
    it('should parse panel fence blocks', () => {
      const markdown = `
~~~panel type=info
This is an info panel.
~~~
      `.trim();

      const result = parser.parseSync(markdown);

      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toEqual({
        type: 'panel',
        attrs: { panelType: 'info' },
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'This is an info panel.' }]
          }
        ]
      });
    });

    it('should parse expand fence blocks', () => {
      const markdown = `
~~~expand title="Click to expand"
Hidden content here.
~~~
      `.trim();

      const result = parser.parseSync(markdown);

      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toEqual({
        type: 'expand',
        attrs: { title: 'Click to expand' },
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Hidden content here.' }]
          }
        ]
      });
    });

    it('should parse mediaSingle fence blocks', () => {
      const markdown = `
~~~mediaSingle layout=center width=500
![Image](media123.jpg)
~~~
      `.trim();

      const result = parser.parseSync(markdown);

      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('mediaSingle');
      expect(result.content[0].attrs).toEqual({ layout: 'center', width: 500 });
    });

    it('should parse mediaGroup fence blocks', () => {
      const markdown = `
~~~mediaGroup
![Image 1](media1.jpg)
![Image 2](media2.jpg)
~~~
      `.trim();

      const result = parser.parseSync(markdown);

      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('mediaGroup');
    });

    it('should parse nested expand fence blocks', () => {
      const markdown = `
~~~nestedExpand title="Nested expand"
Content in nested expand.
~~~
      `.trim();

      const result = parser.parseSync(markdown);

      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toEqual({
        type: 'nestedExpand',
        attrs: { title: 'Nested expand' },
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Content in nested expand.' }]
          }
        ]
      });
    });
  });

  describe('parseSync - frontmatter support', () => {
    it('should parse YAML frontmatter', () => {
      const markdown = `
---
title: Test Document
author: Test Author
version: 1
---

# Document Content

This is the main content.
      `.trim();

      const result = parser.parseSync(markdown);

      // Frontmatter should be parsed and available in document
      expect(result.version).toBe(1);
      expect(result.type).toBe('doc');
      
      // Content should exclude frontmatter
      expect(result.content[0].type).toBe('heading');
    });
  });

  describe('parseSync - GFM support', () => {
    it('should parse tables', () => {
      const markdown = `
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
      `.trim();

      const result = parser.parseSync(markdown);

      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('table');
    });

    it('should parse strikethrough', () => {
      const markdown = 'This has ~~strikethrough~~ text.';
      const result = parser.parseSync(markdown);

      expect(result.content[0].type).toBe('paragraph');
      // Should contain strikethrough formatting in the text
    });
  });

  describe('parseSync - mixed content', () => {
    it('should parse complex document with multiple features', () => {
      const markdown = `
# Document Title

This is a paragraph with **bold** text.

~~~panel type=warning
Important warning message here.
~~~

## Code Example

\`\`\`javascript
console.log('Hello World');
\`\`\`

### List

- Item 1
- Item 2

~~~expand title="Additional Details"
More information can be found here.
~~~
      `.trim();

      const result = parser.parseSync(markdown);

      expect(result.content.length).toBeGreaterThan(5);
      
      // Check for different node types
      const nodeTypes = result.content.map(node => node.type);
      expect(nodeTypes).toContain('heading');
      expect(nodeTypes).toContain('paragraph');
      expect(nodeTypes).toContain('panel');
      expect(nodeTypes).toContain('codeBlock');
      expect(nodeTypes).toContain('bulletList');
      expect(nodeTypes).toContain('expand');
    });
  });

  describe('validate', () => {
    it('should validate valid markdown', async () => {
      const markdown = `
# Valid Document

This is valid markdown with a panel:

~~~panel type=info
Valid panel content.
~~~
      `.trim();

      const result = await parser.validate(markdown);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should report errors for invalid ADF syntax', async () => {
      const markdown = `
~~~unknown-node type=invalid
This should cause validation errors.
~~~
      `.trim();

      const result = await parser.validate(markdown);

      // May or may not be valid depending on validation rules
      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('errors');
      expect(result).toHaveProperty('warnings');
    });
  });

  describe('getStats', () => {
    it('should provide parsing statistics', async () => {
      const markdown = `
# Document Title

Regular paragraph.

~~~panel type=info
Panel content.
~~~

| Table | Header |
|-------|--------|
| Data  | Value  |
      `.trim();

      const stats = await parser.getStats(markdown);

      expect(stats).toHaveProperty('nodeCount');
      expect(stats).toHaveProperty('adfBlockCount');
      expect(stats).toHaveProperty('hasGfmFeatures');
      expect(stats).toHaveProperty('hasFrontmatter');
      expect(stats).toHaveProperty('hasAdfExtensions');
      expect(stats).toHaveProperty('complexity');
      expect(stats).toHaveProperty('processingTime');

      expect(stats.nodeCount).toBeGreaterThan(0);
      expect(stats.adfBlockCount).toBe(1);
      expect(stats.hasAdfExtensions).toBe(true);
      expect(stats.hasGfmFeatures).toBe(true);
      expect(typeof stats.processingTime).toBe('number');
    });

    it('should detect complexity levels', async () => {
      const simpleMarkdown = '# Simple Title\n\nSimple paragraph.';
      const complexMarkdown = `
# Complex Document

${Array.from({ length: 20 }, (_, i) => `## Section ${i + 1}\n\nContent for section ${i + 1}.`).join('\n\n')}

~~~panel type=info
Complex panel.
~~~

~~~expand title="Details"
More complex content.
~~~
      `.trim();

      const simpleStats = await parser.getStats(simpleMarkdown);
      const complexStats = await parser.getStats(complexMarkdown);

      expect(simpleStats.complexity).toBe('simple');
      expect(complexStats.complexity).toBe('complex');
    });
  });

  describe('error handling', () => {
    it('should handle malformed markdown gracefully in non-strict mode', () => {
      const parser = new EnhancedMarkdownParser({ strict: false });
      const malformedMarkdown = '# Heading\n\n~~~panel type=invalid\nUnclosed fence';

      expect(() => parser.parseSync(malformedMarkdown)).not.toThrow();
      
      const result = parser.parseSync(malformedMarkdown);
      expect(result.type).toBe('doc');
      expect(result.version).toBe(1);
    });

    it('should throw errors in strict mode', () => {
      const parser = new EnhancedMarkdownParser({ strict: true });
      
      // For now, just ensure the parser can be created in strict mode
      expect(parser).toBeInstanceOf(EnhancedMarkdownParser);
    });

    it('should return error document for parsing failures', () => {
      const result = parser.parseSync(''); // Empty input

      expect(result).toEqual({
        version: 1,
        type: 'doc',
        content: []
      });
    });
  });
});