/**
 * @file Tests for markdownContainsADF method
 * @description Tests the ADF detection functionality in Parser class
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import Parser from '../../../src/index';

describe('markdownContainsADF', () => {
  let parser: Parser;

  beforeEach(() => {
    parser = new Parser();
  });

  describe('Basic validation', () => {
    it('should return false for empty string', () => {
      expect(parser.markdownContainsADF('')).toBe(false);
    });

    it('should return false for whitespace-only string', () => {
      expect(parser.markdownContainsADF('   \n  \t  ')).toBe(false);
    });

    it('should return false for null/undefined', () => {
      expect(parser.markdownContainsADF(null as any)).toBe(false);
      expect(parser.markdownContainsADF(undefined as any)).toBe(false);
    });

    it('should return false for non-string input', () => {
      expect(parser.markdownContainsADF(123 as any)).toBe(false);
      expect(parser.markdownContainsADF([] as any)).toBe(false);
      expect(parser.markdownContainsADF({} as any)).toBe(false);
    });
  });

  describe('Regular markdown detection', () => {
    it('should return false for standard markdown', () => {
      const regularMarkdown = `
# Regular Heading

This is normal markdown with **bold** and *italic* text.

- List item 1
- List item 2

\`\`\`javascript
console.log("Regular code block");
\`\`\`

| Table | Header |
|-------|--------|
| Cell  | Data   |
      `;
      expect(parser.markdownContainsADF(regularMarkdown)).toBe(false);
    });

    it('should return false for markdown with regular links', () => {
      const markdown = '[Link text](https://example.com)';
      expect(parser.markdownContainsADF(markdown)).toBe(false);
    });

    it('should return false for regular images', () => {
      const markdown = '![Alt text](https://example.com/image.jpg)';
      expect(parser.markdownContainsADF(markdown)).toBe(false);
    });
  });

  describe('Panel detection', () => {
    it('should detect info panels', () => {
      const markdown = `
~~~panel type=info title="Information"
This is an info panel
~~~
      `;
      expect(parser.markdownContainsADF(markdown)).toBe(true);
    });

    it('should detect warning panels', () => {
      const markdown = '~~~panel type=warning title="Warning"\nWarning content\n~~~';
      expect(parser.markdownContainsADF(markdown)).toBe(true);
    });

    it('should detect success panels', () => {
      const markdown = '~~~panel type=success title="Success"\nSuccess message\n~~~';
      expect(parser.markdownContainsADF(markdown)).toBe(true);
    });

    it('should detect error panels', () => {
      const markdown = '~~~panel type=error title="Error"\nError message\n~~~';
      expect(parser.markdownContainsADF(markdown)).toBe(true);
    });

    it('should detect note panels', () => {
      const markdown = '~~~panel type=note title="Note"\nNote content\n~~~';
      expect(parser.markdownContainsADF(markdown)).toBe(true);
    });

    it('should detect legacy panel syntax', () => {
      expect(parser.markdownContainsADF('~~~info Legacy info panel')).toBe(true);
      expect(parser.markdownContainsADF('~~~warning Legacy warning')).toBe(true);
      expect(parser.markdownContainsADF('~~~success Legacy success')).toBe(true);
      expect(parser.markdownContainsADF('~~~error Legacy error')).toBe(true);
      expect(parser.markdownContainsADF('~~~note Legacy note')).toBe(true);
    });

    it('should not detect regular fenced code blocks', () => {
      const markdown = `
\`\`\`javascript
console.log("Not ADF");
\`\`\`
      `;
      expect(parser.markdownContainsADF(markdown)).toBe(false);
    });
  });

  describe('Expand section detection', () => {
    it('should detect expand sections', () => {
      const markdown = `
~~~expand title="Click to expand"
Hidden content here
~~~
      `;
      expect(parser.markdownContainsADF(markdown)).toBe(true);
    });

    it('should detect expand with expanded attribute', () => {
      const markdown = '~~~expand title="Details" expanded=true\nContent\n~~~';
      expect(parser.markdownContainsADF(markdown)).toBe(true);
    });

    it('should detect expand sections in mixed content', () => {
      const markdown = `
# Regular Heading

Some normal text.

~~~expand title="Additional Information"
This is expandable content with **formatting**.
~~~

More regular content.
      `;
      expect(parser.markdownContainsADF(markdown)).toBe(true);
    });
  });

  describe('Media detection', () => {
    it('should detect media single blocks', () => {
      const markdown = `
~~~mediaSingle layout=center width=80
![Description](media:media-id-here)
~~~
      `;
      expect(parser.markdownContainsADF(markdown)).toBe(true);
    });

    it('should detect media group blocks', () => {
      const markdown = `
~~~mediaGroup
![Image 1](media:id-1)
![Image 2](media:id-2)
~~~
      `;
      expect(parser.markdownContainsADF(markdown)).toBe(true);
    });

    it('should detect media references in images', () => {
      const markdown = '![Alt text](media:12345-media-id)';
      expect(parser.markdownContainsADF(markdown)).toBe(true);
    });

    it('should detect media placeholders', () => {
      const markdown = 'Some text {media:media-id-123} more text';
      expect(parser.markdownContainsADF(markdown)).toBe(true);
    });

    it('should detect user mentions', () => {
      const markdown = 'Hello {user:username} how are you?';
      expect(parser.markdownContainsADF(markdown)).toBe(true);
    });

    it('should detect user mentions with IDs', () => {
      const markdown = 'Assigned to {user:12345-user-id}';
      expect(parser.markdownContainsADF(markdown)).toBe(true);
    });
  });

  describe('ADF metadata comment detection', () => {
    it('should detect simple ADF metadata comments', () => {
      const markdown = '<!-- adf:paragraph -->\nSome content\n<!-- /adf:paragraph -->';
      expect(parser.markdownContainsADF(markdown)).toBe(true);
    });

    it('should detect ADF metadata with attributes', () => {
      const markdown = '<!-- adf:paragraph textAlign="center" -->\nCentered text';
      expect(parser.markdownContainsADF(markdown)).toBe(true);
    });

    it('should detect ADF closing tags', () => {
      const markdown = 'Content\n<!-- /adf:heading -->';
      expect(parser.markdownContainsADF(markdown)).toBe(true);
    });

    it('should not detect regular HTML comments', () => {
      const markdown = '<!-- This is a regular comment -->';
      expect(parser.markdownContainsADF(markdown)).toBe(false);
    });
  });

  describe('Complex scenarios', () => {
    it('should detect ADF in complex documents', () => {
      const complexMarkdown = `
# Getting Started

This is a regular introduction.

~~~panel type=info title="Important Information"
Please read this carefully.
~~~

## Installation

Regular installation steps:

1. First step
2. Second step

~~~expand title="Advanced Configuration"
This section contains advanced settings that are optional.

\`\`\`yaml
config:
  advanced: true
\`\`\`
~~~

## User Mentions

Thanks to {user:john.doe} for the contribution.

## Media Example

Here's an image: ![Screenshot](media:screenshot-123)
      `;
      expect(parser.markdownContainsADF(complexMarkdown)).toBe(true);
    });

    it('should handle multiple ADF elements', () => {
      const markdown = `
~~~panel type=warning title="Warning"
Be careful!
~~~

{user:admin} assigned this to {user:developer}.

~~~expand title="More Details"
Additional information here.
~~~
      `;
      expect(parser.markdownContainsADF(markdown)).toBe(true);
    });

    it('should return false when no ADF syntax is present', () => {
      const regularMarkdown = `
# Regular Document

This document uses only standard markdown features:

- Lists
- **Bold text**
- *Italic text*
- [Links](https://example.com)
- ![Images](https://example.com/image.jpg)

\`\`\`javascript
// Regular code blocks
console.log("No ADF here");
\`\`\`

| Tables | Work |
|--------|------|
| Too    | !    |
      `;
      expect(parser.markdownContainsADF(regularMarkdown)).toBe(false);
    });

    it('should be case sensitive for ADF syntax', () => {
      // ADF syntax should be case sensitive
      expect(parser.markdownContainsADF('~~~PANEL type=info')).toBe(false);
      expect(parser.markdownContainsADF('~~~Panel type=info')).toBe(false);
      expect(parser.markdownContainsADF('~~~panel type=info')).toBe(true);
    });

    it('should handle ADF syntax at different positions', () => {
      expect(parser.markdownContainsADF('~~~panel type=info\ncontent\n~~~')).toBe(true);
      expect(parser.markdownContainsADF('Start ~~~panel type=info\ncontent\n~~~')).toBe(true);
      expect(parser.markdownContainsADF('~~~panel type=info\ncontent\n~~~ End')).toBe(true);
    });
  });

  describe('Performance and edge cases', () => {
    it('should handle very large documents', () => {
      const largeContent = 'Regular markdown content. '.repeat(10000);
      const largeMarkdown = `${largeContent}\n~~~panel type=info title="Found it"\nADF content\n~~~`;
      
      expect(parser.markdownContainsADF(largeMarkdown)).toBe(true);
    });

    it('should handle documents with many false positives', () => {
      const falsePositiveMarkdown = `
This document mentions ~~~panel but not in the right context.
Also mentions {user but without closing brace.
And ![image](regular-url) without media: prefix.
      `;
      expect(parser.markdownContainsADF(falsePositiveMarkdown)).toBe(false);
    });

    it('should be efficient with multiple pattern checks', () => {
      const startTime = Date.now();
      const markdown = '~~~panel type=info title="Test"\nContent\n~~~';
      
      // Run multiple times to test performance
      for (let i = 0; i < 1000; i++) {
        parser.markdownContainsADF(markdown);
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete 1000 iterations quickly (less than 1 second)
      expect(duration).toBeLessThan(1000);
    });
  });
});