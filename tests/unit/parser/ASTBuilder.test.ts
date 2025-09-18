/**
 * @file ASTBuilder.test.ts
 * @description Tests for ASTBuilder class
 */

import { ASTBuilder } from '../../../src/parser/markdown-to-adf/ASTBuilder.js';
import { MarkdownTokenizer } from '../../../src/parser/markdown-to-adf/MarkdownTokenizer.js';
import { ADFDocument } from '../../../src/types/adf.types.js';

describe('ASTBuilder', () => {
  let builder: ASTBuilder;
  let tokenizer: MarkdownTokenizer;

  beforeEach(() => {
    builder = new ASTBuilder();
    tokenizer = new MarkdownTokenizer();
  });

  describe('Basic Document Structure', () => {
    it('should build basic ADF document', () => {
      const markdown = 'Simple paragraph.';
      const tokens = tokenizer.tokenize(markdown);
      const adf = builder.buildADF(tokens);

      expect(adf.version).toBe(1);
      expect(adf.type).toBe('doc');
      expect(adf.content).toHaveLength(1);
      expect(adf.content[0].type).toBe('paragraph');
    });

    it('should handle empty document', () => {
      const tokens = tokenizer.tokenize('');
      const adf = builder.buildADF(tokens);

      expect(adf.version).toBe(1);
      expect(adf.type).toBe('doc');
      expect(adf.content).toHaveLength(0);
    });

    it('should preserve frontmatter metadata', () => {
      const markdown = `---
title: Test Document
version: 2
---

# Heading`;
      const tokens = tokenizer.tokenize(markdown);
      const frontmatterToken = tokens.find(t => t.type === 'frontmatter');
      const adf = builder.buildADF(tokens, frontmatterToken?.content);

      expect(adf.version).toBe(1); // Version is controlled by ADF spec
      expect(adf.content).toHaveLength(1);
      expect(adf.content[0].type).toBe('heading');
    });
  });

  describe('Heading Conversion', () => {
    it('should convert basic headings', () => {
      const markdown = '# Heading 1\n## Heading 2';
      const tokens = tokenizer.tokenize(markdown);
      const adf = builder.buildADF(tokens);

      expect(adf.content).toHaveLength(2);
      expect(adf.content[0].type).toBe('heading');
      expect(adf.content[0].attrs?.level).toBe(1);
      expect(adf.content[0].content?.[0].type).toBe('text');
      expect(adf.content[0].content?.[0].text).toBe('Heading 1');
      
      expect(adf.content[1].type).toBe('heading');
      expect(adf.content[1].attrs?.level).toBe(2);
    });

    it('should convert heading with custom attributes', () => {
      const markdown = '# Heading 1 <!-- adf:heading attrs=\'{"anchor":"custom"}\' -->';
      const tokens = tokenizer.tokenize(markdown);
      const adf = builder.buildADF(tokens);

      expect(adf.content[0].type).toBe('heading');
      expect(adf.content[0].attrs?.level).toBe(1);
      expect(adf.content[0].attrs?.anchor).toBe('custom');
    });
  });

  describe('Code Block Conversion', () => {
    it('should convert code block with language', () => {
      const markdown = '```javascript\nconsole.log("hello");\n```';
      const tokens = tokenizer.tokenize(markdown);
      const adf = builder.buildADF(tokens);

      expect(adf.content[0].type).toBe('codeBlock');
      expect(adf.content[0].attrs?.language).toBe('javascript');
      expect(adf.content[0].content?.[0].type).toBe('text');
      expect(adf.content[0].content?.[0].text).toBe('console.log("hello");');
    });

    it('should convert code block without language', () => {
      const markdown = '```\nplain code\n```';
      const tokens = tokenizer.tokenize(markdown);
      const adf = builder.buildADF(tokens);

      expect(adf.content[0].type).toBe('codeBlock');
      expect(adf.content[0].attrs).toBeUndefined();
      expect(adf.content[0].content?.[0].text).toBe('plain code');
    });
  });

  describe('List Conversion', () => {
    it('should convert bullet list', () => {
      const markdown = '- Item 1\n- Item 2';
      const tokens = tokenizer.tokenize(markdown);
      const adf = builder.buildADF(tokens);

      expect(adf.content[0].type).toBe('bulletList');
      expect(adf.content[0].content).toHaveLength(2);
      expect(adf.content[0].content?.[0].type).toBe('listItem');
      expect(adf.content[0].content?.[1].type).toBe('listItem');
    });

    it('should convert ordered list', () => {
      const markdown = '1. First\n2. Second';
      const tokens = tokenizer.tokenize(markdown);
      const adf = builder.buildADF(tokens);

      expect(adf.content[0].type).toBe('orderedList');
      expect(adf.content[0].attrs).toBeUndefined(); // No custom start
      expect(adf.content[0].content).toHaveLength(2);
    });

    it('should convert ordered list with custom start', () => {
      const markdown = '5. Fifth\n6. Sixth';
      const tokens = tokenizer.tokenize(markdown);
      const adf = builder.buildADF(tokens);

      expect(adf.content[0].type).toBe('orderedList');
      expect(adf.content[0].attrs?.order).toBe(5);
    });
  });

  describe('Table Conversion', () => {
    it('should convert simple table', () => {
      const markdown = `| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |`;
      const tokens = tokenizer.tokenize(markdown);
      const adf = builder.buildADF(tokens);

      expect(adf.content[0].type).toBe('table');
      expect(adf.content[0].attrs?.isNumberColumnEnabled).toBe(false);
      expect(adf.content[0].attrs?.layout).toBe('default');
      expect(adf.content[0].content).toHaveLength(2); // Header row + data row
      
      // Check header row
      const headerRow = adf.content[0].content?.[0];
      expect(headerRow?.type).toBe('tableRow');
      expect(headerRow?.content?.[0].type).toBe('tableHeader');
      
      // Check data row
      const dataRow = adf.content[0].content?.[1];
      expect(dataRow?.type).toBe('tableRow');
      expect(dataRow?.content?.[0].type).toBe('tableCell');
    });

    it('should convert table with cell attributes', () => {
      const markdown = `| Header 1 | Header 2 <!-- adf:cell colspan="2" --> |
|----------|------------------------------------------|
| Cell 1   | Cell 2                                   |`;
      const tokens = tokenizer.tokenize(markdown);
      const adf = builder.buildADF(tokens);

      const headerRow = adf.content[0].content?.[0];
      const secondHeaderCell = headerRow?.content?.[1];
      expect(secondHeaderCell?.attrs?.colspan).toBe(2);
    });
  });

  describe('Panel Conversion', () => {
    it('should convert panel with type', () => {
      const markdown = `~~~panel type=info
This is an info panel.
~~~`;
      const tokens = tokenizer.tokenize(markdown);
      const adf = builder.buildADF(tokens);

      expect(adf.content[0].type).toBe('panel');
      expect(adf.content[0].attrs?.panelType).toBe('info');
      expect(adf.content[0].content?.[0].type).toBe('paragraph');
    });

    it('should convert panel with multiple attributes', () => {
      const markdown = `~~~panel type=warning layout=wide
Warning content.
~~~`;
      const tokens = tokenizer.tokenize(markdown);
      const adf = builder.buildADF(tokens);

      expect(adf.content[0].type).toBe('panel');
      expect(adf.content[0].attrs?.panelType).toBe('warning');
      expect(adf.content[0].attrs?.layout).toBe('wide');
    });
  });

  describe('Expand Conversion', () => {
    it('should convert expand with title', () => {
      const markdown = `~~~expand title="Click to expand"
Hidden content here.
~~~`;
      const tokens = tokenizer.tokenize(markdown);
      const adf = builder.buildADF(tokens);

      expect(adf.content[0].type).toBe('expand');
      expect(adf.content[0].attrs?.title).toBe('Click to expand');
      expect(adf.content[0].content?.[0].type).toBe('paragraph');
    });
  });

  describe('Media Conversion', () => {
    it('should convert mediaSingle', () => {
      const markdown = `~~~mediaSingle layout=center
![Image](media:123)
~~~`;
      const tokens = tokenizer.tokenize(markdown);
      const adf = builder.buildADF(tokens);

      expect(adf.content[0].type).toBe('mediaSingle');
      expect(adf.content[0].attrs?.layout).toBe('center');
      // Media extraction would be tested separately as it's complex
    });
  });

  describe('Blockquote Conversion', () => {
    it('should convert blockquote', () => {
      const markdown = '> This is a quote\n> with multiple lines';
      const tokens = tokenizer.tokenize(markdown);
      const adf = builder.buildADF(tokens);

      expect(adf.content[0].type).toBe('blockquote');
      expect(adf.content[0].content?.[0].type).toBe('paragraph');
    });
  });

  describe('Rule Conversion', () => {
    it('should convert horizontal rule', () => {
      const markdown = '---';
      const tokens = tokenizer.tokenize(markdown);
      const adf = builder.buildADF(tokens);

      expect(adf.content[0].type).toBe('rule');
      expect(adf.content[0].attrs).toBeUndefined();
    });
  });

  describe('Complex Documents', () => {
    it('should convert complex document with mixed content', () => {
      const markdown = `# Main Heading

This is a paragraph.

~~~panel type=info
Info panel content.
~~~

## Sub Heading

- List item 1
- List item 2

---`;

      const tokens = tokenizer.tokenize(markdown);
      const adf = builder.buildADF(tokens);

      expect(adf.content).toHaveLength(6);
      expect(adf.content[0].type).toBe('heading');
      expect(adf.content[1].type).toBe('paragraph');
      expect(adf.content[2].type).toBe('panel');
      expect(adf.content[3].type).toBe('heading');
      expect(adf.content[4].type).toBe('bulletList');
      expect(adf.content[5].type).toBe('rule');
    });
  });

  describe('Error Handling', () => {
    it('should handle unknown node types gracefully', () => {
      const builder = new ASTBuilder({ preserveUnknownNodes: true });
      const tokens = [
        {
          type: 'unknownType' as any,
          content: 'Unknown content',
          position: { line: 1, column: 1, offset: 0 },
          raw: 'raw content'
        }
      ];
      const adf = builder.buildADF(tokens);

      expect(adf.content[0].type).toBe('paragraph');
      expect(adf.content[0].content?.[0].text).toContain('Unknown node type');
    });

    it('should skip unknown nodes when preserveUnknownNodes is false', () => {
      const builder = new ASTBuilder({ preserveUnknownNodes: false });
      const tokens = [
        {
          type: 'unknownType' as any,
          content: 'Unknown content',
          position: { line: 1, column: 1, offset: 0 },
          raw: 'raw content'
        }
      ];
      const adf = builder.buildADF(tokens);

      expect(adf.content).toHaveLength(0);
    });
  });
});