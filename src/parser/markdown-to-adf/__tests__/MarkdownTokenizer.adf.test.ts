/**
 * @file MarkdownTokenizer.adf.test.ts
 * @description ADF-specific tokenization tests
 */

import { MarkdownTokenizer } from '../MarkdownTokenizer.js';

describe('MarkdownTokenizer - ADF Features', () => {
  let tokenizer: MarkdownTokenizer;

  beforeEach(() => {
    tokenizer = new MarkdownTokenizer();
  });

  describe('ADF Fence Blocks', () => {
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

    it('should tokenize expand fence block with title', () => {
      const markdown = `~~~expand title="Click to expand"
Hidden content here.
~~~`;
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe('expand');
      expect((tokens[0] as any).attributes?.title).toBe('Click to expand');
      expect(tokens[0].content).toBe('Hidden content here.');
    });

    it('should parse fence attributes correctly', () => {
      const markdown = `~~~mediaSingle layout=center width=75
![Image content]
~~~`;
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe('mediaSingle');
      expect((tokens[0] as any).attributes?.layout).toBe('center');
      expect((tokens[0] as any).attributes?.width).toBe('75');
    });
  });

  describe('Heading with Metadata', () => {
    it('should parse heading with ADF metadata', () => {
      const markdown = `# Heading 1 <!-- adf:heading attrs='{"anchor":"custom"}' -->`;
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe('heading');
      expect(tokens[0].content).toBe('Heading 1');
      expect(tokens[0].metadata?.attrs?.level).toBe(1);
      expect(tokens[0].metadata?.attrs?.anchor).toBe('custom');
    });

    it('should handle malformed metadata gracefully', () => {
      const markdown = `# Heading 1 <!-- adf:heading attrs='{invalid json}' -->`;
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe('heading');
      expect(tokens[0].content).toBe('Heading 1');
      expect(tokens[0].metadata?.attrs?.level).toBe(1);
      // Should not have custom attributes when JSON is invalid
      expect(tokens[0].metadata?.attrs?.anchor).toBeUndefined();
    });
  });

  describe('YAML Frontmatter', () => {
    it('should parse YAML frontmatter', () => {
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

    it('should not parse single --- as frontmatter', () => {
      const markdown = `---`;
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe('rule');
    });
  });

  describe('Complex Document', () => {
    it('should tokenize document with mixed content', () => {
      const markdown = `# Main Heading

This is a paragraph.

~~~panel type=warning
This is a warning panel.
~~~

## Sub Heading

- List item 1
- List item 2`;

      const tokens = tokenizer.tokenize(markdown);

      expect(tokens).toHaveLength(5);
      expect(tokens[0].type).toBe('heading');
      expect(tokens[1].type).toBe('paragraph');
      expect(tokens[2].type).toBe('panel');
      expect(tokens[3].type).toBe('heading');
      expect(tokens[4].type).toBe('list');
    });
  });

  describe('Depth Limiting', () => {
    it('should prevent infinite recursion with depth limiting', () => {
      const tokenizerWithLowDepth = new MarkdownTokenizer({ maxDepth: 2 });
      
      const markdown = `~~~panel type=info
Content with nested structure.
~~~`;

      const tokens = tokenizerWithLowDepth.tokenize(markdown);

      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe('panel');
      // Children should exist but be limited by depth
      expect(tokens[0].children).toBeDefined();
    });
  });
});