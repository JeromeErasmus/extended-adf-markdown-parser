/**
 * @file enhanced-parser-integration.test.ts
 * @description Integration tests for the enhanced parser with round-trip conversion
 */

import { describe, it, expect } from '@jest/globals';
import { EnhancedMarkdownParser } from '../../src/parser/markdown-to-adf/EnhancedMarkdownParser.js';
import { Parser } from '../../src/index.js';
import { ADFDocument } from '../../src/types/adf.types.js';

describe('Enhanced Parser Integration Tests', () => {
  let enhancedParser: EnhancedMarkdownParser;
  let standardParser: Parser;

  beforeEach(() => {
    enhancedParser = new EnhancedMarkdownParser();
    standardParser = new Parser();
  });

  describe('round-trip conversion', () => {
    it('should maintain fidelity for basic markdown', async () => {
      const originalMarkdown = `
# Document Title

This is a paragraph with **bold** and *italic* text.

## Code Example

\`\`\`javascript
function test() {
  return true;
}
\`\`\`

- List item 1
- List item 2

> This is a blockquote
      `.trim();

      // Parse with enhanced parser
      const adf = enhancedParser.parseSync(originalMarkdown);
      
      // Convert back to markdown using standard parser
      const convertedMarkdown = standardParser.adfToMarkdown(adf);
      
      // Parse again with enhanced parser
      const roundTripAdf = enhancedParser.parseSync(convertedMarkdown);

      // Compare structure (normalize for comparison)
      expect(normalizeAdf(roundTripAdf)).toEqual(normalizeAdf(adf));
    });

    it('should parse ADF fence blocks correctly', async () => {
      const originalMarkdown = `
# Document with ADF Extensions

~~~panel type=info
This is an info panel with important information.
~~~

Some regular content here.

~~~expand title="Click to see more"
Hidden content that can be expanded.
~~~

~~~mediaSingle layout=center width=500
![Sample Image](media123.jpg)
~~~
      `.trim();

      const adf = enhancedParser.parseSync(originalMarkdown);
      
      // Verify ADF structure contains proper ADF nodes
      expect(adf.content.some(node => node.type === 'panel')).toBe(true);
      expect(adf.content.some(node => node.type === 'expand')).toBe(true);
      expect(adf.content.some(node => node.type === 'mediaSingle')).toBe(true);
      
      // Find ADF nodes and verify their structure
      const panelNode = adf.content.find(node => node.type === 'panel');
      const expandNode = adf.content.find(node => node.type === 'expand');
      const mediaSingleNode = adf.content.find(node => node.type === 'mediaSingle');
      
      expect(panelNode?.attrs).toEqual({ panelType: 'info' });
      expect(expandNode?.attrs).toEqual({ title: 'Click to see more' });
      expect(mediaSingleNode?.attrs).toEqual({ layout: 'center', width: 500 });
    });

    it('should handle complex nested structures correctly', async () => {
      const originalMarkdown = `
# Complex Document

This document contains various nested elements.

~~~panel type=warning
This panel contains **formatted text** and a list:

- Item 1
- Item 2 with *emphasis*

And a [link](https://example.com).
~~~

## Another Section

~~~expand title="Detailed Information"
This expand block contains:

1. Ordered list item
2. Another item with \`inline code\`

### Nested Heading

Even more content here.
~~~
      `.trim();

      const adf = enhancedParser.parseSync(originalMarkdown);
      
      // Verify structure contains proper ADF nodes
      expect(adf.content.some(node => node.type === 'panel')).toBe(true);
      expect(adf.content.some(node => node.type === 'expand')).toBe(true);
      
      // Find ADF nodes
      const panelNode = adf.content.find(node => node.type === 'panel');
      const expandNode = adf.content.find(node => node.type === 'expand');
      
      expect(panelNode?.attrs).toEqual({ panelType: 'warning' });
      expect(expandNode?.attrs).toEqual({ title: 'Detailed Information' });
      
      // Verify content is parsed correctly
      expect(panelNode?.content).toBeDefined();
      expect(expandNode?.content).toBeDefined();
    });
  });

  describe('enhanced vs standard parser comparison', () => {
    it('should handle standard markdown equivalently', () => {
      const standardMarkdown = `
# Standard Markdown

This document uses only standard markdown features:

- Lists
- **Bold text**
- *Italic text*
- \`inline code\`

\`\`\`javascript
// Code blocks
console.log('test');
\`\`\`

> Blockquotes
      `.trim();

      const enhancedResult = enhancedParser.parseSync(standardMarkdown);

      // Enhanced parser should parse standard markdown correctly
      expect(enhancedResult.type).toBe('doc');
      expect(enhancedResult.version).toBe(1);
      expect(enhancedResult.content.length).toBeGreaterThan(0);
      
      // Should contain standard markdown elements
      const nodeTypes = enhancedResult.content.map(node => node.type);
      expect(nodeTypes).toContain('heading');
      expect(nodeTypes).toContain('paragraph');
      expect(nodeTypes).toContain('bulletList');
      expect(nodeTypes).toContain('codeBlock');
      expect(nodeTypes).toContain('blockquote');
    });

    it('should parse ADF extensions correctly with enhanced parser', () => {
      const adfMarkdown = `
# Enhanced Features

~~~panel type=info
This panel syntax is now enhanced and parsed correctly.
~~~

Regular content.

~~~expand title="Expandable Section"
This is also enhanced syntax.
~~~
      `.trim();

      const enhancedResult = enhancedParser.parseSync(adfMarkdown);

      // Enhanced parser should parse ADF blocks as proper ADF nodes
      expect(enhancedResult.type).toBe('doc');
      expect(enhancedResult.content.length).toBeGreaterThan(0);
      
      const enhancedHasPanels = enhancedResult.content.some(node => node.type === 'panel');
      const enhancedHasExpands = enhancedResult.content.some(node => node.type === 'expand');
      
      expect(enhancedHasPanels).toBe(true);
      expect(enhancedHasExpands).toBe(true);
      
      // Verify panel attributes are parsed correctly
      const panelNode = enhancedResult.content.find(node => node.type === 'panel');
      const expandNode = enhancedResult.content.find(node => node.type === 'expand');
      
      expect(panelNode?.attrs).toEqual({ panelType: 'info' });
      expect(expandNode?.attrs).toEqual({ title: 'Expandable Section' });
    });
  });

  describe('performance comparison', () => {
    it('should have reasonable performance for large documents', async () => {
      // Generate a large document with mixed content
      const sections = Array.from({ length: 50 }, (_, i) => `
## Section ${i + 1}

This is section ${i + 1} with some content.

~~~panel type=${i % 2 === 0 ? 'info' : 'warning'}
Panel content for section ${i + 1}.
~~~
      `).join('\n\n');

      const largeDocument = `# Large Document\n\n${sections}`;
      
      const startTime = Date.now();
      const result = enhancedParser.parseSync(largeDocument);
      const endTime = Date.now();
      
      const processingTime = endTime - startTime;
      
      // Should complete within reasonable time (adjust threshold as needed)
      expect(processingTime).toBeLessThan(2000); // 2 seconds
      
      // Should produce valid ADF
      expect(result.type).toBe('doc');
      expect(result.content.length).toBeGreaterThan(100); // Many nodes from sections
      
      // Should contain both headings and ADF nodes (panels are now parsed correctly)
      expect(result.content.some(node => node.type === 'heading')).toBe(true);
      expect(result.content.some(node => node.type === 'panel')).toBe(true);
    });

    it('should provide performance statistics', async () => {
      const markdown = `
# Performance Test Document

~~~panel type=info
Test panel content.
~~~

Some regular content with **formatting**.

~~~expand title="Details"
Expanded content here.
~~~
      `.trim();

      const stats = await enhancedParser.getStats(markdown);
      
      expect(stats.processingTime).toBeGreaterThanOrEqual(0);
      expect(stats.nodeCount).toBeGreaterThan(0);
      expect(stats.adfBlockCount).toBe(2);
      expect(stats.hasAdfExtensions).toBe(true);
      expect(stats.complexity).toMatch(/^(simple|moderate|complex)$/);
    });
  });

  describe('error recovery', () => {
    it('should handle mixed valid and invalid ADF syntax', () => {
      const mixedMarkdown = `
# Document with Mixed Syntax

~~~panel type=info
Valid panel content.
~~~

Regular content.

~~~unknown-node type=invalid
This should be handled gracefully.
~~~

More regular content.

~~~expand title="Valid expand"
This should work fine.
~~~
      `.trim();

      const result = enhancedParser.parseSync(mixedMarkdown);
      
      // Should not throw and should produce valid ADF
      expect(result.type).toBe('doc');
      expect(result.content.length).toBeGreaterThan(0);
      
      // Valid ADF nodes should be parsed correctly
      expect(result.content.some(node => node.type === 'panel')).toBe(true);
      expect(result.content.some(node => node.type === 'expand')).toBe(true);
    });

    it('should validate and report issues', async () => {
      const problematicMarkdown = `
~~~panel type=invalid-type
This panel has an invalid type.
~~~

~~~mediaSingle layout=invalid-layout
This media has invalid layout.
~~~
      `.trim();

      const validation = await enhancedParser.validate(problematicMarkdown);
      
      expect(validation).toHaveProperty('valid');
      expect(validation).toHaveProperty('errors');
      expect(validation).toHaveProperty('warnings');
      
      // Should complete validation without throwing
      expect(Array.isArray(validation.errors)).toBe(true);
      expect(Array.isArray(validation.warnings)).toBe(true);
    });
  });

  describe('frontmatter integration', () => {
    it('should handle YAML frontmatter with ADF content', () => {
      const markdownWithFrontmatter = `
---
title: Test Document
author: Enhanced Parser
adf:
  version: 1
  custom: value
---

# Document Title

~~~panel type=info
Panel content with frontmatter document.
~~~
      `.trim();

      const result = enhancedParser.parseSync(markdownWithFrontmatter);
      
      expect(result.type).toBe('doc');
      expect(result.version).toBe(1);
      
      // Content should not include frontmatter
      expect(result.content[0].type).toBe('heading');
      expect(result.content.some(node => node.type === 'panel')).toBe(true);
    });
  });
});

/**
 * Normalize ADF for comparison by removing position information and sorting
 */
function normalizeAdf(adf: ADFDocument): ADFDocument {
  return JSON.parse(JSON.stringify(adf, (key, value) => {
    // Remove position and other metadata that might differ
    if (['position', 'raw'].includes(key)) {
      return undefined;
    }
    return value;
  }));
}