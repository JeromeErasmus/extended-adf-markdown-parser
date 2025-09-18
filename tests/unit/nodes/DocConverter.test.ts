/**
 * @file Tests for DocConverter
 */

import { describe, it, expect, jest } from '@jest/globals';
import { DocConverter } from '../../../src/parser/adf-to-markdown/nodes/DocConverter';
import type { ConversionContext } from '../../../src/parser/types';
import type { ADFNode } from '../../../src/types';

describe('DocConverter', () => {
  const converter = new DocConverter();

  const mockContext: ConversionContext = {
    convertChildren: jest.fn().mockReturnValue('converted content'),
    depth: 0,
    options: {}
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('nodeType', () => {
    it('should have correct nodeType', () => {
      expect(converter.nodeType).toBe('doc');
    });
  });

  describe('toMarkdown', () => {
    it('should convert document with content', () => {
      const node: ADFNode = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Hello World' }
            ]
          }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('converted content\n');
      expect(mockContext.convertChildren).toHaveBeenCalledWith(node.content!);
    });

    it('should handle document with no content', () => {
      (mockContext.convertChildren as jest.Mock).mockReturnValue('');

      const node: ADFNode = {
        type: 'doc',
        version: 1,
        content: []
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('\n');
      expect(mockContext.convertChildren).toHaveBeenCalledWith([]);
    });

    it('should handle document with undefined content', () => {
      (mockContext.convertChildren as jest.Mock).mockReturnValue('');

      const node: ADFNode = {
        type: 'doc',
        version: 1
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('\n');
      expect(mockContext.convertChildren).toHaveBeenCalledWith([]);
    });

    it('should handle document with multiple paragraphs', () => {
      (mockContext.convertChildren as jest.Mock).mockReturnValue('First paragraph\n\nSecond paragraph');

      const node: ADFNode = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'First paragraph' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Second paragraph' }]
          }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('First paragraph\n\nSecond paragraph\n');
    });

    it('should handle document with complex nested content', () => {
      (mockContext.convertChildren as jest.Mock).mockReturnValue('# Heading\n\nParagraph with **bold** text\n\n- List item 1\n- List item 2');

      const node: ADFNode = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Heading' }]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Paragraph with ' },
              { type: 'text', text: 'bold', marks: [{ type: 'strong' }] },
              { type: 'text', text: ' text' }
            ]
          },
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'List item 1' }] }]
              },
              {
                type: 'listItem',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'List item 2' }] }]
              }
            ]
          }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('# Heading\n\nParagraph with **bold** text\n\n- List item 1\n- List item 2\n');
    });

    it('should handle document with whitespace content', () => {
      (mockContext.convertChildren as jest.Mock).mockReturnValue('   \n  \n   ');

      const node: ADFNode = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: '   ' }]
          }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('\n');
    });

    it('should handle document with only whitespace after trim', () => {
      (mockContext.convertChildren as jest.Mock).mockReturnValue('   ');

      const node: ADFNode = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: '   ' }]
          }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('\n');
    });

    it('should preserve trailing newlines from converted content', () => {
      (mockContext.convertChildren as jest.Mock).mockReturnValue('Content with trailing newlines\n\n');

      const node: ADFNode = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Content' }]
          }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('Content with trailing newlines\n');
    });

    it('should handle document with panels and code blocks', () => {
      (mockContext.convertChildren as jest.Mock).mockReturnValue('~~~panel type=info\nInfo content\n~~~\n\n```javascript\nconsole.log("hello");\n```');

      const node: ADFNode = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'panel',
            attrs: { panelType: 'info' },
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Info content' }] }]
          },
          {
            type: 'codeBlock',
            attrs: { language: 'javascript' },
            content: [{ type: 'text', text: 'console.log("hello");' }]
          }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('~~~panel type=info\nInfo content\n~~~\n\n```javascript\nconsole.log("hello");\n```\n');
    });

    it('should handle document attributes (if any)', () => {
      // Reset mock to return simple content for this test
      (mockContext.convertChildren as jest.Mock).mockReturnValue('simple content');

      const node: ADFNode = {
        type: 'doc',
        version: 1,
        attrs: {
          customAttr: 'value'
        },
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Content' }]
          }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('simple content\n');
      expect(mockContext.convertChildren).toHaveBeenCalledWith(node.content!);
    });

    it('should handle empty string from convertChildren', () => {
      (mockContext.convertChildren as jest.Mock).mockReturnValue('');

      const node: ADFNode = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: []
          }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('\n');
    });

    it('should handle large document with many blocks', () => {
      const largeContent = Array(100).fill('Block content').join('\n\n');
      (mockContext.convertChildren as jest.Mock).mockReturnValue(largeContent);

      const node: ADFNode = {
        type: 'doc',
        version: 1,
        content: Array(100).fill(null).map(() => ({
          type: 'paragraph',
          content: [{ type: 'text', text: 'Block content' }]
        }))
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe(largeContent + '\n');
    });
  });
});