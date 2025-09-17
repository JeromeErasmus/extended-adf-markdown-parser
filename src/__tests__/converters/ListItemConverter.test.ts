/**
 * @file Tests for ListItemConverter
 */

import { describe, it, expect, jest } from '@jest/globals';
import { ListItemConverter } from '../../parser/adf-to-markdown/nodes/ListItemConverter';
import type { ConversionContext } from '../../parser/types';
import type { ListItemNode } from '../../types';

describe('ListItemConverter', () => {
  const converter = new ListItemConverter();

  const mockNodeConverter = {
    nodeType: 'paragraph',
    toMarkdown: jest.fn()
  };

  const mockContext: ConversionContext = {
    convertChildren: jest.fn(),
    depth: 0,
    options: {
      registry: {
        getNodeConverter: jest.fn().mockReturnValue(mockNodeConverter)
      } as any
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('nodeType', () => {
    it('should have correct nodeType', () => {
      expect(converter.nodeType).toBe('listItem');
    });
  });

  describe('toMarkdown', () => {
    it('should convert simple list item', () => {
      const node: ListItemNode = {
        type: 'listItem',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Simple item' }]
          }
        ]
      };

      (mockNodeConverter.toMarkdown as jest.Mock).mockReturnValue('Simple item');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('- Simple item');
      expect(mockNodeConverter.toMarkdown).toHaveBeenCalledWith(node.content![0], mockContext);
    });

    it('should handle multi-line content with proper indentation', () => {
      const node: ListItemNode = {
        type: 'listItem',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'First line\nSecond line\nThird line' }]
          }
        ]
      };

      (mockNodeConverter.toMarkdown as jest.Mock).mockReturnValue('First line\nSecond line\nThird line');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('- First line\n  Second line\n  Third line');
    });

    it('should handle multi-paragraph list items', () => {
      const node: ListItemNode = {
        type: 'listItem',
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

      (mockNodeConverter.toMarkdown as jest.Mock)
        .mockReturnValueOnce('First paragraph')
        .mockReturnValueOnce('Second paragraph');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('- First paragraph\n\n  Second paragraph');
    });

    it('should preserve empty lines', () => {
      const node: ListItemNode = {
        type: 'listItem',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Line 1\n\nLine 3' }]
          }
        ]
      };

      (mockNodeConverter.toMarkdown as jest.Mock).mockReturnValue('Line 1\n\nLine 3');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('- Line 1\n\n  Line 3');
    });

    it('should handle empty list item', () => {
      const node: ListItemNode = {
        type: 'listItem',
        content: []
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('- ');
    });

    it('should handle list item with undefined content', () => {
      const node: ListItemNode = {
        type: 'listItem'
      } as ListItemNode;

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('- ');
    });

    it('should handle empty content from convertChildren', () => {
      const node: ListItemNode = {
        type: 'listItem',
        content: [
          {
            type: 'paragraph',
            content: []
          }
        ]
      };

      (mockNodeConverter.toMarkdown as jest.Mock).mockReturnValue('');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('- ');
    });

    it('should handle content with only empty lines', () => {
      const node: ListItemNode = {
        type: 'listItem',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: '\n\n' }]
          }
        ]
      };

      (mockNodeConverter.toMarkdown as jest.Mock).mockReturnValue('\n\n');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('- ');
    });

    it('should include custom attributes in metadata', () => {
      const node: ListItemNode = {
        type: 'listItem',
        attrs: {
          customAttr: 'value',
          indent: 2
        } as any,
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Item with metadata' }]
          }
        ]
      };

      (mockNodeConverter.toMarkdown as jest.Mock).mockReturnValue('Item with metadata');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('- Item with metadata<!-- adf:listItem attrs=\'{"customAttr":"value","indent":2}\' -->');
    });

    it('should not include metadata when no attributes', () => {
      const node: ListItemNode = {
        type: 'listItem',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Simple item' }]
          }
        ]
      };

      (mockNodeConverter.toMarkdown as jest.Mock).mockReturnValue('Simple item');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('- Simple item');
    });

    it('should handle nested content structures', () => {
      const node: ListItemNode = {
        type: 'listItem',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Paragraph 1' }]
          },
          {
            type: 'codeBlock',
            content: [{ type: 'text', text: 'code content' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Paragraph 2' }]
          }
        ]
      };

      (mockNodeConverter.toMarkdown as jest.Mock)
        .mockReturnValueOnce('Paragraph 1')
        .mockReturnValueOnce('```\ncode content\n```')
        .mockReturnValueOnce('Paragraph 2');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('- Paragraph 1\n\n  ```\n  code content\n  ```\n\n  Paragraph 2');
    });
  });
});