/**
 * @file Tests for ExpandConverter and NestedExpandConverter
 */

import { describe, it, expect, jest } from '@jest/globals';
import { ExpandConverter, NestedExpandConverter } from '../../parser/adf-to-markdown/nodes/ExpandConverter';
import type { ConversionContext } from '../../parser/types';
import type { ExpandNode } from '../../types';

describe('ExpandConverter', () => {
  const converter = new ExpandConverter();

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
      expect(converter.nodeType).toBe('expand');
    });
  });

  describe('toMarkdown', () => {
    it('should convert expand with title and content', () => {
      const node: ExpandNode = {
        type: 'expand',
        attrs: {
          title: 'Click to expand'
        },
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Hidden content here' }]
          }
        ]
      };

      (mockNodeConverter.toMarkdown as jest.Mock).mockReturnValue('Hidden content here');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('~~~expand title="Click to expand"\nHidden content here\n~~~');
      expect(mockNodeConverter.toMarkdown).toHaveBeenCalledWith(node.content![0], mockContext);
    });

    it('should convert expand without title', () => {
      const node: ExpandNode = {
        type: 'expand',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Content without title' }]
          }
        ]
      };

      (mockNodeConverter.toMarkdown as jest.Mock).mockReturnValue('Content without title');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('~~~expand title=""\nContent without title\n~~~');
    });

    it('should convert empty expand with title', () => {
      const node: ExpandNode = {
        type: 'expand',
        attrs: {
          title: 'Empty expand'
        },
        content: []
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('~~~expand title="Empty expand"\n\n~~~');
    });

    it('should convert empty expand without title', () => {
      const node: ExpandNode = {
        type: 'expand',
        content: []
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('~~~expand title=""\n\n~~~');
    });

    it('should handle expand with undefined content', () => {
      const node: ExpandNode = {
        type: 'expand',
        attrs: {
          title: 'No content'
        }
      } as ExpandNode;

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('~~~expand title="No content"\n\n~~~');
    });

    it('should include custom attributes in metadata', () => {
      const node: ExpandNode = {
        type: 'expand',
        attrs: {
          title: 'Custom expand',
          defaultOpen: true,
          level: 2
        } as any,
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Content with custom attributes' }]
          }
        ]
      };

      (mockNodeConverter.toMarkdown as jest.Mock).mockReturnValue('Content with custom attributes');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('~~~expand title="Custom expand" attrs=\'{"defaultOpen":true,"level":2}\'\nContent with custom attributes\n~~~');
    });

    it('should handle multi-line content', () => {
      const node: ExpandNode = {
        type: 'expand',
        attrs: {
          title: 'Multi-line expand'
        },
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
      expect(result).toBe('~~~expand title="Multi-line expand"\nFirst paragraph\n\nSecond paragraph\n~~~');
    });

    it('should handle title with quotes', () => {
      const node: ExpandNode = {
        type: 'expand',
        attrs: {
          title: 'Title with "quotes" and more'
        },
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Content' }]
          }
        ]
      };

      (mockNodeConverter.toMarkdown as jest.Mock).mockReturnValue('Content');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('~~~expand title="Title with "quotes" and more"\nContent\n~~~');
    });
  });
});

describe('NestedExpandConverter', () => {
  const converter = new NestedExpandConverter();

  const mockNestedNodeConverter = {
    nodeType: 'paragraph',
    toMarkdown: jest.fn()
  };

  const mockContext: ConversionContext = {
    convertChildren: jest.fn(),
    depth: 1,
    options: {
      registry: {
        getNodeConverter: jest.fn().mockReturnValue(mockNestedNodeConverter)
      } as any
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('nodeType', () => {
    it('should have correct nodeType', () => {
      expect(converter.nodeType).toBe('nestedExpand');
    });
  });

  describe('toMarkdown', () => {
    it('should convert nested expand with title and content', () => {
      const node: ExpandNode = {
        type: 'nestedExpand',
        attrs: {
          title: 'Nested expand'
        },
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Nested content' }]
          }
        ]
      };

      (mockNestedNodeConverter.toMarkdown as jest.Mock).mockReturnValue('Nested content');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('~~~expand title="Nested expand" attrs=\'{"nested":true}\'\nNested content\n~~~');
    });

    it('should convert empty nested expand with title', () => {
      const node: ExpandNode = {
        type: 'nestedExpand',
        attrs: {
          title: 'Empty nested'
        },
        content: []
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('~~~expand title="Empty nested" nested=true\n\n~~~');
    });

    it('should convert nested expand without title', () => {
      const node: ExpandNode = {
        type: 'nestedExpand',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Nested without title' }]
          }
        ]
      };

      (mockNestedNodeConverter.toMarkdown as jest.Mock).mockReturnValue('Nested without title');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('~~~expand title="" attrs=\'{"nested":true}\'\nNested without title\n~~~');
    });

    it('should handle nested expand with undefined content', () => {
      const node: ExpandNode = {
        type: 'nestedExpand',
        attrs: {
          title: 'No content nested'
        }
      } as ExpandNode;

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('~~~expand title="No content nested" nested=true\n\n~~~');
    });

    it('should include custom attributes along with nested indicator', () => {
      const node: ExpandNode = {
        type: 'nestedExpand',
        attrs: {
          title: 'Custom nested expand',
          collapsible: false,
          theme: 'dark'
        } as any,
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Custom nested content' }]
          }
        ]
      };

      (mockNestedNodeConverter.toMarkdown as jest.Mock).mockReturnValue('Custom nested content');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('~~~expand title="Custom nested expand" attrs=\'{"collapsible":false,"theme":"dark","nested":true}\'\nCustom nested content\n~~~');
    });

    it('should handle nested expand with complex content', () => {
      const node: ExpandNode = {
        type: 'nestedExpand',
        attrs: {
          title: 'Complex nested'
        },
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Paragraph 1' }]
          },
          {
            type: 'codeBlock',
            content: [{ type: 'text', text: 'console.log("nested");' }]
          }
        ]
      };

      (mockNestedNodeConverter.toMarkdown as jest.Mock)
        .mockReturnValueOnce('Paragraph 1')
        .mockReturnValueOnce('```\nconsole.log("nested");\n```');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('~~~expand title="Complex nested" attrs=\'{"nested":true}\'\nParagraph 1\n\n```\nconsole.log("nested");\n```\n~~~');
    });
  });
});