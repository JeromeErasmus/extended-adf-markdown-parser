/**
 * @file MarkdownTokenizer.basic.test.ts
 * @description Basic tests for MarkdownTokenizer class
 */

import { MarkdownTokenizer } from '../MarkdownTokenizer.js';

describe('MarkdownTokenizer - Basic Tests', () => {
  let tokenizer: MarkdownTokenizer;

  beforeEach(() => {
    tokenizer = new MarkdownTokenizer();
  });

  describe('Simple Tokenization', () => {
    it('should tokenize simple paragraph', () => {
      const markdown = 'This is a simple paragraph.';
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe('paragraph');
      expect(tokens[0].content).toBe('This is a simple paragraph.');
    });

    it('should handle empty input', () => {
      const tokens = tokenizer.tokenize('');
      expect(tokens).toHaveLength(0);
    });

    it('should tokenize simple heading', () => {
      const markdown = '# Heading 1';
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe('heading');
      expect(tokens[0].content).toBe('Heading 1');
      expect(tokens[0].metadata?.attrs?.level).toBe(1);
    });

    it('should tokenize multiple headings', () => {
      const markdown = `# Heading 1
## Heading 2`;
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens).toHaveLength(2);
      expect(tokens[0].type).toBe('heading');
      expect(tokens[0].metadata?.attrs?.level).toBe(1);
      expect(tokens[1].type).toBe('heading');
      expect(tokens[1].metadata?.attrs?.level).toBe(2);
    });

    it('should tokenize horizontal rule', () => {
      const markdown = '---';
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe('rule');
    });
  });

  describe('Code Blocks', () => {
    it('should tokenize code block with language', () => {
      const markdown = `\`\`\`javascript
console.log("hello");
\`\`\``;
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe('codeBlock');
      expect(tokens[0].content).toBe('console.log("hello");');
      expect(tokens[0].metadata?.attrs?.language).toBe('javascript');
    });
  });

  describe('Position Tracking', () => {
    it('should track basic positions', () => {
      const markdown = `# Heading
Paragraph`;
      const tokens = tokenizer.tokenize(markdown);

      expect(tokens[0].position.line).toBe(1);
      expect(tokens[1].position.line).toBe(2);
    });
  });
});