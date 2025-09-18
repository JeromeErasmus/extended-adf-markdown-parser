/**
 * @file Tests for MarkdownValidator with Extended Markdown syntax validation
 */

import { MarkdownValidator } from '../MarkdownValidator.js';

describe('MarkdownValidator', () => {
  let validator: MarkdownValidator;

  beforeEach(() => {
    validator = new MarkdownValidator();
  });

  describe('Basic Structure Validation', () => {
    it('should validate valid markdown string', () => {
      const markdown = '# Hello World\n\nThis is a paragraph.';
      const result = validator.validate(markdown);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject non-string input', () => {
      const result = validator.validate(123 as any);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'INVALID_TYPE',
          message: 'Input must be a string'
        })
      );
    });

    it('should validate empty string', () => {
      const result = validator.validate('');
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Fence Block Validation', () => {
    it('should validate matched ADF fence blocks', () => {
      const markdown = `~~~panel type=info
This is an info panel.
~~~`;
      
      const result = validator.validate(markdown);
      expect(result.valid).toBe(true);
    });

    it('should validate matched code fence blocks', () => {
      const markdown = '```javascript\nconsole.log("hello");\n```';
      
      const result = validator.validate(markdown);
      expect(result.valid).toBe(true);
    });

    it('should detect unmatched opening fence blocks', () => {
      const markdown = `~~~panel type=info
This panel is never closed.`;
      
      const result = validator.validate(markdown);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'UNCLOSED_FENCE_BLOCK',
          message: expect.stringContaining('Unclosed panel fence block')
        })
      );
    });

    it('should detect unmatched closing fence blocks', () => {
      const markdown = `This panel was never opened.
~~~`;
      
      const result = validator.validate(markdown);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'UNMATCHED_FENCE_CLOSE',
          message: expect.stringContaining('Unmatched closing fence block')
        })
      );
    });

    it('should detect unclosed code block fences', () => {
      const markdown = 'Some text\n```\nMore text';
      
      const result = validator.validate(markdown);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'UNCLOSED_FENCE_BLOCK'
        })
      );
    });

    it('should warn about unknown ADF fence types', () => {
      const markdown = `~~~unknown type=test
Content here
~~~`;
      
      const result = validator.validate(markdown);
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain('Unknown ADF fence type "unknown" at line 1');
    });

    it('should validate known ADF fence types', () => {
      const validTypes = ['expand', 'mediaSingle', 'mediaGroup'];
      
      validTypes.forEach(type => {
        const markdown = `~~~${type}
Content
~~~`;
        
        const result = validator.validate(markdown);
        expect(result.valid).toBe(true);
        expect(result.warnings || []).not.toContain(expect.stringContaining(`Unknown ADF fence type "${type}"`));
      });
      
      // Test panel separately with required type attribute
      const panelMarkdown = `~~~panel type=info
Panel content
~~~`;
      const panelResult = validator.validate(panelMarkdown);
      expect(panelResult.valid).toBe(true);
      expect(panelResult.warnings || []).not.toContain(expect.stringContaining('Unknown ADF fence type "panel"'));
    });
  });

  describe('Panel Validation', () => {
    it('should validate panel with valid type', () => {
      const validTypes = ['info', 'warning', 'error', 'success', 'note'];
      
      validTypes.forEach(type => {
        const markdown = `~~~panel type=${type}
Panel content
~~~`;
        
        const result = validator.validate(markdown);
        expect(result.valid).toBe(true);
      });
    });

    it('should reject panel without type attribute', () => {
      const markdown = `~~~panel
Panel without type
~~~`;
      
      const result = validator.validate(markdown);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'MISSING_PANEL_TYPE',
          message: expect.stringContaining('missing required "type" attribute')
        })
      );
    });

    it('should reject panel with invalid type', () => {
      const markdown = `~~~panel type=invalid
Invalid panel type
~~~`;
      
      const result = validator.validate(markdown);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'INVALID_PANEL_TYPE',
          message: expect.stringContaining('Invalid panel type "invalid"')
        })
      );
    });

    it('should validate panel with additional attributes', () => {
      const markdown = `~~~panel type=info layout=wide
Panel with extra attributes
~~~`;
      
      const result = validator.validate(markdown);
      expect(result.valid).toBe(true);
    });
  });

  describe('Heading Validation', () => {
    it('should validate headings levels 1-6', () => {
      for (let level = 1; level <= 6; level++) {
        const markdown = '#'.repeat(level) + ' Heading';
        const result = validator.validate(markdown);
        
        expect(result.valid).toBe(true);
      }
    });

    it('should reject heading level 7+', () => {
      const markdown = '####### Invalid Level 7';
      const result = validator.validate(markdown);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'INVALID_HEADING_LEVEL',
          message: expect.stringContaining('Invalid heading level 7')
        })
      );
    });

    it('should warn about empty headings', () => {
      const markdown = '##   ';
      const result = validator.validate(markdown);
      
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain('Empty heading at line 1');
    });

    it('should validate headings with content', () => {
      const markdown = '## Valid Heading With Content';
      const result = validator.validate(markdown);
      
      expect(result.valid).toBe(true);
    });
  });

  describe('ADF Metadata Validation', () => {
    it('should validate valid ADF metadata comments', () => {
      const markdown = '# Heading <!-- adf:heading attrs=\'{"anchor":"test"}\' -->';
      const result = validator.validate(markdown);
      
      expect(result.valid).toBe(true);
    });

    it('should reject invalid JSON in metadata', () => {
      const markdown = '# Heading <!-- adf:heading attrs=\'{"invalid":}\' -->';
      const result = validator.validate(markdown);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'INVALID_METADATA_JSON',
          message: expect.stringContaining('Invalid JSON in ADF metadata')
        })
      );
    });

    it('should reject non-object metadata attributes', () => {
      const markdown = '# Heading <!-- adf:heading attrs=\'"string"\' -->';
      const result = validator.validate(markdown);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'INVALID_METADATA_ATTRS',
          message: expect.stringContaining('must be an object')
        })
      );
    });

    it('should validate complex metadata attributes', () => {
      const markdown = 'Panel <!-- adf:panel attrs=\'{"panelType":"info","customAttr":"value","number":42}\' -->';
      const result = validator.validate(markdown);
      
      expect(result.valid).toBe(true);
    });
  });

  describe('Frontmatter Validation', () => {
    it('should validate complete frontmatter block', () => {
      const markdown = `---
title: Test Document
author: Test Author
---

# Content`;
      
      const result = validator.validate(markdown);
      expect(result.valid).toBe(true);
    });

    it('should reject unclosed frontmatter', () => {
      const markdown = `---
title: Test Document
author: Test Author

# Content without closing`;
      
      const result = validator.validate(markdown);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'UNCLOSED_FRONTMATTER',
          message: 'Unclosed YAML frontmatter block'
        })
      );
    });

    it('should not treat mid-document --- as frontmatter', () => {
      const markdown = `# Title

Some content

---

More content`;
      
      const result = validator.validate(markdown);
      expect(result.valid).toBe(true);
    });

    it('should handle very long frontmatter gracefully', () => {
      const longFrontmatter = '---\n' + 'line: value\n'.repeat(60);
      const result = validator.validate(longFrontmatter);
      
      // Should detect unclosed frontmatter (stops checking after 50 lines)
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'UNCLOSED_FRONTMATTER'
        })
      );
    });
  });

  describe('List Validation', () => {
    it('should validate ordered lists', () => {
      const markdown = `1. First item
2. Second item
3. Third item`;
      
      const result = validator.validate(markdown);
      expect(result.valid).toBe(true);
    });

    it('should validate bullet lists', () => {
      const markdown = `- First item
* Second item
+ Third item`;
      
      const result = validator.validate(markdown);
      expect(result.valid).toBe(true);
    });

    it('should warn about empty list items', () => {
      const markdown = `1. First item
2.   
3. Third item`;
      
      const result = validator.validate(markdown);
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain('Empty list item at line 2');
    });

    it('should warn about very large list numbers', () => {
      const markdown = '1000. Very large number';
      const result = validator.validate(markdown);
      
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain('Very large list number (1000) at line 1');
    });

    it('should accept reasonable list numbers', () => {
      const markdown = '100. Reasonable number';
      const result = validator.validate(markdown);
      
      expect(result.valid).toBe(true);
      expect(result.warnings || []).not.toContain(expect.stringContaining('Very large list number'));
    });
  });

  describe('Links and Media Validation', () => {
    it('should validate media placeholders', () => {
      const markdown = 'Here is an image: {media:123456}';
      const result = validator.validate(markdown);
      
      expect(result.valid).toBe(true);
    });

    it('should reject empty media IDs', () => {
      const markdown = 'Empty media: {media:}';
      const result = validator.validate(markdown);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'EMPTY_MEDIA_ID',
          message: expect.stringContaining('Empty media ID')
        })
      );
    });

    it('should validate user mentions', () => {
      const markdown = 'Hello {user:abc123}!';
      const result = validator.validate(markdown);
      
      expect(result.valid).toBe(true);
    });

    it('should reject empty user IDs', () => {
      const markdown = 'Hello {user:}!';
      const result = validator.validate(markdown);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'EMPTY_USER_ID',
          message: expect.stringContaining('Empty user ID')
        })
      );
    });

    it('should validate markdown links', () => {
      const markdown = '[Link text](https://example.com)';
      const result = validator.validate(markdown);
      
      expect(result.valid).toBe(true);
    });

    it('should reject links with empty URLs', () => {
      const markdown = '[Link text]()';
      const result = validator.validate(markdown);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'EMPTY_LINK_URL',
          message: expect.stringContaining('Empty URL in link')
        })
      );
    });

    it('should warn about links with empty text', () => {
      const markdown = '[](https://example.com)';
      const result = validator.validate(markdown);
      
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain('Empty link text at line 1');
    });

    it('should validate multiple media/user references', () => {
      const markdown = `Multiple references: 
{media:123} and {user:abc} and {media:456}
More {user:def} references.`;
      
      const result = validator.validate(markdown);
      expect(result.valid).toBe(true);
    });
  });

  describe('Complex Document Validation', () => {
    it('should validate complex Extended Markdown document', () => {
      const complexMarkdown = `---
title: Complex Document
author: Test Author
---

# Main Title <!-- adf:heading attrs='{"anchor":"main"}' -->

This is a **bold** paragraph with [a link](https://example.com).

~~~panel type=info
This is an info panel with {user:user123} mention.
~~~

## Section 2

1. First item
2. Second item with {media:img123}

\`\`\`javascript
console.log("code block");
\`\`\`

~~~expand title="Click to expand"
Hidden content here.
~~~

- Bullet item
- Another bullet

> Blockquote text

---

Final paragraph.`;
      
      const result = validator.validate(complexMarkdown);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect multiple errors in complex document', () => {
      const invalidMarkdown = `~~~panel
Panel without type
~~~

####### Invalid heading level

{media:} empty media

[Empty URL]()

Unclosed panel:
~~~panel type=info
Content`;
      
      const result = validator.validate(invalidMarkdown);
      expect(result.valid).toBe(false);
      
      // Should detect multiple errors
      expect(result.errors.length).toBeGreaterThan(3);
      
      // Check for specific error types
      expect(result.errors).toContainEqual(expect.objectContaining({ code: 'MISSING_PANEL_TYPE' }));
      expect(result.errors).toContainEqual(expect.objectContaining({ code: 'INVALID_HEADING_LEVEL' }));
      expect(result.errors).toContainEqual(expect.objectContaining({ code: 'EMPTY_MEDIA_ID' }));
      expect(result.errors).toContainEqual(expect.objectContaining({ code: 'EMPTY_LINK_URL' }));
      expect(result.errors).toContainEqual(expect.objectContaining({ code: 'UNCLOSED_FENCE_BLOCK' }));
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle very long documents', () => {
      const longContent = 'Line of content\n'.repeat(1000);
      const result = validator.validate(longContent);
      
      expect(result.valid).toBe(true);
    });

    it('should handle documents with many fence blocks', () => {
      let markdown = '';
      for (let i = 0; i < 100; i++) {
        markdown += `~~~panel type=info\nPanel ${i}\n~~~\n\n`;
      }
      
      const result = validator.validate(markdown);
      expect(result.valid).toBe(true);
    });

    it('should handle mixed line endings', () => {
      const markdown = '# Title\r\n\r\nParagraph\n\nAnother line\r\n';
      const result = validator.validate(markdown);
      
      expect(result.valid).toBe(true);
    });
  });
});