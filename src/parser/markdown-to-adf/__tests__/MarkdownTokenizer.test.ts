/**
 * @file MarkdownTokenizer.test.ts
 * @description Tests for MarkdownTokenizer class
 */

import { MarkdownTokenizer } from '../MarkdownTokenizer.js';
import { Token, TokenType } from '../types.js';

describe('MarkdownTokenizer', () => {
  let tokenizer: MarkdownTokenizer;

  beforeEach(() => {
    tokenizer = new MarkdownTokenizer();
  });

  describe('Basic Tokenization', () => {
    it('should tokenize simple paragraph', () => {
      const markdown = 'This is a simple paragraph.';
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe('paragraph');
      expect(tokens[0].content).toBe('This is a simple paragraph.');
    });

    it('should tokenize multiple paragraphs', () => {
      const markdown = `First paragraph.

Second paragraph.`;
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens).toHaveLength(2);
      expect(tokens[0].type).toBe('paragraph');
      expect(tokens[0].content).toBe('First paragraph.');
      expect(tokens[1].type).toBe('paragraph');
      expect(tokens[1].content).toBe('Second paragraph.');
    });
  });

  describe('Heading Tokenization', () => {
    it('should tokenize headings', () => {
      const markdown = `# Heading 1
## Heading 2
### Heading 3`;
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens).toHaveLength(3);
      expect(tokens[0].type).toBe('heading');
      expect(tokens[0].content).toBe('Heading 1');
      expect(tokens[0].metadata?.attrs?.level).toBe(1);
      
      expect(tokens[1].type).toBe('heading');
      expect(tokens[1].content).toBe('Heading 2');
      expect(tokens[1].metadata?.attrs?.level).toBe(2);
    });

    it('should tokenize heading with metadata', () => {
      const markdown = `# Heading 1 <!-- adf:heading attrs='{"anchor":"custom"}' -->`;
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe('heading');
      expect(tokens[0].content).toBe('Heading 1');
      expect(tokens[0].metadata?.attrs?.level).toBe(1);
      expect(tokens[0].metadata?.attrs?.anchor).toBe('custom');
    });
  });

  describe('List Tokenization', () => {
    it('should tokenize bullet list', () => {
      const markdown = `- Item 1
- Item 2
- Item 3`;
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe('list');
      expect((tokens[0] as any).ordered).toBe(false);
      expect(tokens[0].children).toHaveLength(3);
      expect(tokens[0].children?.[0].type).toBe('listItem');
      expect(tokens[0].children?.[0].content).toBe('Item 1');
    });

    it('should tokenize ordered list', () => {
      const markdown = `1. First item
2. Second item
3. Third item`;
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe('list');
      expect((tokens[0] as any).ordered).toBe(true);
      expect((tokens[0] as any).start).toBe(1);
      expect(tokens[0].children).toHaveLength(3);
    });

    it('should tokenize ordered list with custom start', () => {
      const markdown = `5. Fifth item
6. Sixth item`;
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe('list');
      expect((tokens[0] as any).ordered).toBe(true);
      expect((tokens[0] as any).start).toBe(5);
    });

    it('should tokenize nested lists', () => {
      const markdown = `- Item 1
  - Nested item 1
  - Nested item 2
- Item 2`;
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe('list');
      expect(tokens[0].children).toHaveLength(2);
      
      const firstItem = tokens[0].children?.[0];
      expect(firstItem?.children).toBeDefined();
      expect(firstItem?.children?.some(child => child.type === 'list')).toBe(true);
    });
  });

  describe('Table Tokenization', () => {
    it('should tokenize simple table', () => {
      const markdown = `| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |`;
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe('table');
      expect(tokens[0].children).toHaveLength(3); // Header + 2 data rows
      
      const headerRow = tokens[0].children?.[0];
      expect(headerRow?.type).toBe('tableRow');
      expect(headerRow?.children?.[0].type).toBe('tableHeader');
      expect(headerRow?.children?.[0].content).toBe('Header 1');
    });

    it('should tokenize table with cell metadata', () => {
      const markdown = `| Header 1 | Header 2 <!-- adf:cell colspan="2" --> |
|----------|------------------------------------------|
| Cell 1   | Cell 2                                   |`;
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe('table');
      
      const headerRow = tokens[0].children?.[0];
      const secondCell = headerRow?.children?.[1];
      expect(secondCell?.metadata?.attrs?.colspan).toBe(2);
    });
  });

  describe('Code Block Tokenization', () => {
    it('should tokenize code block', () => {
      const markdown = `\`\`\`javascript
function hello() {
  console.log("Hello World");
}
\`\`\``;
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe('codeBlock');
      expect(tokens[0].content).toContain('function hello()');
      expect(tokens[0].metadata?.attrs?.language).toBe('javascript');
    });

    it('should tokenize code block without language', () => {
      const markdown = `\`\`\`
plain text code
\`\`\``;
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe('codeBlock');
      expect(tokens[0].content).toBe('plain text code');
      expect(tokens[0].metadata).toBeUndefined();
    });
  });

  describe('ADF Fence Block Tokenization', () => {
    it('should tokenize panel fence block', () => {
      const markdown = `~~~panel type=info
This is an info panel.
~~~`;
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe('panel');
      expect((tokens[0] as any).fenceType).toBe('tilde');
      expect((tokens[0] as any).attributes?.type).toBe('info');
      expect(tokens[0].content).toBe('This is an info panel.');
    });

    it('should tokenize expand fence block', () => {
      const markdown = `~~~expand title="Click to expand"
Hidden content here.
~~~`;
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe('expand');
      expect((tokens[0] as any).attributes?.title).toBe('Click to expand');
      expect(tokens[0].content).toBe('Hidden content here.');
    });

    it('should tokenize fence block with nested content', () => {
      const markdown = `~~~panel type=info
This panel contains:

- A list item
- Another item

And a paragraph.
~~~`;
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe('panel');
      expect(tokens[0].children).toBeDefined();
      expect(tokens[0].children?.length).toBeGreaterThan(0);
    });
  });

  describe('Blockquote Tokenization', () => {
    it('should tokenize blockquote', () => {
      const markdown = `> This is a blockquote
> with multiple lines`;
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe('blockquote');
      expect(tokens[0].content).toBe('This is a blockquote\nwith multiple lines');
    });

    it('should tokenize blockquote with nested content', () => {
      const markdown = `> # Heading in blockquote
> 
> Paragraph in blockquote`;
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe('blockquote');
      expect(tokens[0].children).toBeDefined();
      expect(tokens[0].children?.[0].type).toBe('heading');
    });
  });

  describe('Rule Tokenization', () => {
    it('should tokenize horizontal rules', () => {
      const markdown = `---

***

___`;
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens).toHaveLength(3);
      tokens.forEach(token => {
        expect(token.type).toBe('rule');
      });
    });
  });

  describe('Frontmatter Tokenization', () => {
    it('should tokenize YAML frontmatter', () => {
      const markdown = `---
title: Document Title
author: Test Author
---

# Content starts here`;
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens).toHaveLength(2);
      expect(tokens[0].type).toBe('frontmatter');
      expect(tokens[0].content).toContain('title: Document Title');
      expect(tokens[1].type).toBe('heading');
      expect(tokens[1].content).toBe('Content starts here');
    });
  });

  describe('Position Tracking', () => {
    it('should track token positions', () => {
      const markdown = `# Heading
Paragraph`;
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens[0].position.line).toBe(1);
      expect(tokens[1].position.line).toBe(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty input', () => {
      const tokens = tokenizer.tokenize('');
      expect(tokens).toHaveLength(0);
    });

    it('should handle only whitespace', () => {
      const tokens = tokenizer.tokenize('   \n   \n   ');
      expect(tokens).toHaveLength(0);
    });

    it('should preserve whitespace when option is set', () => {
      const tokenizerWithWhitespace = new MarkdownTokenizer({ preserveWhitespace: true });
      const tokens = tokenizerWithWhitespace.tokenize('   \n   \n   ');
      expect(tokens.length).toBeGreaterThan(0);
    });
  });
});