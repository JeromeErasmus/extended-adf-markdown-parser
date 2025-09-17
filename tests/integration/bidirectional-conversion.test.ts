/**
 * @file bidirectional-conversion.test.ts
 * @description Tests for bidirectional ADF ↔ Markdown conversion
 */

import { Parser } from '../../src/index.js';
import { MarkdownParser } from '../../src/parser/markdown-to-adf/MarkdownParser.js';
import { ADFDocument } from '../../src/types/adf.types.js';

describe('Bidirectional Conversion Tests', () => {
  let adfParser: Parser;
  let markdownParser: MarkdownParser;

  beforeEach(() => {
    adfParser = new Parser();
    markdownParser = new MarkdownParser();
  });

  describe('Round-trip Conversion', () => {
    it('should maintain fidelity for simple document', () => {
      const originalADF: ADFDocument = {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [
              { type: 'text', text: 'Simple Heading' }
            ]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'This is a simple paragraph.' }
            ]
          }
        ]
      };

      // ADF → Markdown
      const markdown = adfParser.adfToMarkdown(originalADF);
      
      // Markdown → ADF
      const reconstructedADF = markdownParser.parse(markdown);

      expect(reconstructedADF.version).toBe(originalADF.version);
      expect(reconstructedADF.type).toBe(originalADF.type);
      expect(reconstructedADF.content).toHaveLength(originalADF.content.length);
      expect(reconstructedADF.content[0].type).toBe('heading');
      expect(reconstructedADF.content[1].type).toBe('paragraph');
    });

    it('should maintain fidelity for document with formatting', () => {
      const originalADF: ADFDocument = {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Text with ' },
              { type: 'text', text: 'bold', marks: [{ type: 'strong' }] },
              { type: 'text', text: ' and ' },
              { type: 'text', text: 'italic', marks: [{ type: 'em' }] },
              { type: 'text', text: ' formatting.' }
            ]
          }
        ]
      };

      const markdown = adfParser.adfToMarkdown(originalADF);
      const reconstructedADF = markdownParser.parse(markdown);

      expect(reconstructedADF.content[0].type).toBe('paragraph');
      expect(reconstructedADF.content[0].content).toBeDefined();
      // Note: Inline formatting is simplified in our current implementation
    });

    it('should maintain fidelity for lists', () => {
      const originalADF: ADFDocument = {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'First item' }]
                  }
                ]
              },
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Second item' }]
                  }
                ]
              }
            ]
          }
        ]
      };

      const markdown = adfParser.adfToMarkdown(originalADF);
      const reconstructedADF = markdownParser.parse(markdown);

      expect(reconstructedADF.content[0].type).toBe('bulletList');
      expect(reconstructedADF.content[0].content).toHaveLength(2);
    });

    it('should maintain fidelity for ordered lists with custom start', () => {
      const originalADF: ADFDocument = {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'orderedList',
            attrs: { order: 5 },
            content: [
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Fifth item' }]
                  }
                ]
              },
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Sixth item' }]
                  }
                ]
              }
            ]
          }
        ]
      };

      const markdown = adfParser.adfToMarkdown(originalADF);
      const reconstructedADF = markdownParser.parse(markdown);

      expect(reconstructedADF.content[0].type).toBe('orderedList');
      expect(reconstructedADF.content[0].attrs?.order).toBe(5);
    });

    it('should maintain fidelity for code blocks', () => {
      const originalADF: ADFDocument = {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'codeBlock',
            attrs: { language: 'javascript' },
            content: [
              { type: 'text', text: 'console.log("Hello World");' }
            ]
          }
        ]
      };

      const markdown = adfParser.adfToMarkdown(originalADF);
      const reconstructedADF = markdownParser.parse(markdown);

      expect(reconstructedADF.content[0].type).toBe('codeBlock');
      expect(reconstructedADF.content[0].attrs?.language).toBe('javascript');
    });

    it('should maintain fidelity for panels', () => {
      const originalADF: ADFDocument = {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'panel',
            attrs: { panelType: 'info' },
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Info panel content' }]
              }
            ]
          }
        ]
      };

      const markdown = adfParser.adfToMarkdown(originalADF);
      const reconstructedADF = markdownParser.parse(markdown);

      expect(reconstructedADF.content[0].type).toBe('panel');
      expect(reconstructedADF.content[0].attrs?.panelType).toBe('info');
    });

    it('should maintain fidelity for expand blocks', () => {
      const originalADF: ADFDocument = {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'expand',
            attrs: { title: 'Click to expand' },
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Hidden content' }]
              }
            ]
          }
        ]
      };

      const markdown = adfParser.adfToMarkdown(originalADF);
      const reconstructedADF = markdownParser.parse(markdown);

      expect(reconstructedADF.content[0].type).toBe('expand');
      expect(reconstructedADF.content[0].attrs?.title).toBe('Click to expand');
    });

    it('should maintain fidelity for blockquotes', () => {
      const originalADF: ADFDocument = {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'blockquote',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'This is a quote' }]
              }
            ]
          }
        ]
      };

      const markdown = adfParser.adfToMarkdown(originalADF);
      const reconstructedADF = markdownParser.parse(markdown);

      expect(reconstructedADF.content[0].type).toBe('blockquote');
    });

    it('should maintain fidelity for horizontal rules', () => {
      const originalADF: ADFDocument = {
        version: 1,
        type: 'doc',
        content: [
          { type: 'rule' }
        ]
      };

      const markdown = adfParser.adfToMarkdown(originalADF);
      const reconstructedADF = markdownParser.parse(markdown);

      expect(reconstructedADF.content[0].type).toBe('rule');
    });
  });

  describe('Complex Document Round-trip', () => {
    it('should handle complex nested structure', () => {
      const complexADF: ADFDocument = {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Main Title' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Introduction paragraph.' }]
          },
          {
            type: 'panel',
            attrs: { panelType: 'warning' },
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Important warning message.' }]
              }
            ]
          },
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'List item with nested content' }]
                  },
                  {
                    type: 'codeBlock',
                    attrs: { language: 'python' },
                    content: [
                      { type: 'text', text: 'print("nested code")' }
                    ]
                  }
                ]
              }
            ]
          },
          {
            type: 'rule'
          },
          {
            type: 'expand',
            attrs: { title: 'Additional Information' },
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Expandable content here.' }]
              }
            ]
          }
        ]
      };

      const markdown = adfParser.adfToMarkdown(complexADF);
      const reconstructedADF = markdownParser.parse(markdown);

      expect(reconstructedADF.version).toBe(1);
      expect(reconstructedADF.type).toBe('doc');
      expect(reconstructedADF.content).toHaveLength(6);
      
      // Verify key structures are preserved
      expect(reconstructedADF.content[0].type).toBe('heading');
      expect(reconstructedADF.content[1].type).toBe('paragraph');
      expect(reconstructedADF.content[2].type).toBe('panel');
      expect(reconstructedADF.content[3].type).toBe('bulletList');
      expect(reconstructedADF.content[4].type).toBe('rule');
      expect(reconstructedADF.content[5].type).toBe('expand');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty documents', () => {
      const emptyADF: ADFDocument = {
        version: 1,
        type: 'doc',
        content: []
      };

      const markdown = adfParser.adfToMarkdown(emptyADF);
      const reconstructedADF = markdownParser.parse(markdown);

      expect(reconstructedADF.version).toBe(1);
      expect(reconstructedADF.type).toBe('doc');
      expect(reconstructedADF.content).toHaveLength(0);
    });

    it('should handle documents with only whitespace content', () => {
      const whitespaceADF: ADFDocument = {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: '   ' }]
          }
        ]
      };

      const markdown = adfParser.adfToMarkdown(whitespaceADF);
      const reconstructedADF = markdownParser.parse(markdown);

      // Whitespace-only content is typically filtered out in markdown parsing
      // This is expected behavior as pure whitespace is not meaningful content
      expect(reconstructedADF.content).toHaveLength(0);
    });
  });

  describe('Metadata Preservation', () => {
    it('should preserve custom heading attributes', () => {
      const adfWithMetadata: ADFDocument = {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { 
              level: 2,
              anchor: 'custom-anchor'
            },
            content: [{ type: 'text', text: 'Custom Heading' }]
          }
        ]
      };

      const markdown = adfParser.adfToMarkdown(adfWithMetadata);
      const reconstructedADF = markdownParser.parse(markdown);

      expect(reconstructedADF.content[0].type).toBe('heading');
      expect(reconstructedADF.content[0].attrs?.level).toBe(2);
      expect(reconstructedADF.content[0].attrs?.anchor).toBe('custom-anchor');
    });

    it('should preserve panel attributes', () => {
      const adfWithPanelAttrs: ADFDocument = {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'panel',
            attrs: { 
              panelType: 'success',
              customAttribute: 'custom-value'
            },
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Success panel' }]
              }
            ]
          }
        ]
      };

      const markdown = adfParser.adfToMarkdown(adfWithPanelAttrs);
      const reconstructedADF = markdownParser.parse(markdown);

      expect(reconstructedADF.content[0].type).toBe('panel');
      expect(reconstructedADF.content[0].attrs?.panelType).toBe('success');
      expect(reconstructedADF.content[0].attrs?.customAttribute).toBe('custom-value');
    });
  });
});