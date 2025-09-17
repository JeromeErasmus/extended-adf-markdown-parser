/**
 * @file Tests for TableCellConverter
 */

import { describe, it, expect } from '@jest/globals';
import { TableCellConverter } from '../../parser/adf-to-markdown/nodes/TableCellConverter';
import type { ConversionContext } from '../../parser/types';
import type { TableCellNode } from '../../types';

describe('TableCellConverter', () => {
  const converter = new TableCellConverter();

  const mockContext: ConversionContext = {
    convertChildren: jest.fn(),
    depth: 0,
    options: {
      registry: {
        getNodeConverter: jest.fn()
      } as any
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('nodeType', () => {
    it('should have correct nodeType', () => {
      expect(converter.nodeType).toBe('tableCell');
    });
  });

  describe('toMarkdown', () => {
    it('should convert basic table cell', () => {
      const node: TableCellNode = {
        type: 'tableCell',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Cell Data' }]
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('Cell Data');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('Cell Data');
      expect(mockContext.convertChildren).toHaveBeenCalledWith(node.content!);
    });

    it('should handle empty table cell', () => {
      const node: TableCellNode = {
        type: 'tableCell',
        content: []
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('');
    });

    it('should handle table cell with undefined content', () => {
      const node: TableCellNode = {
        type: 'tableCell'
      } as TableCellNode;

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('');
    });

    it('should replace newlines with <br> tags', () => {
      const node: TableCellNode = {
        type: 'tableCell',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Line 1\nLine 2\nLine 3' }]
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('Line 1\nLine 2\nLine 3');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('Line 1<br>Line 2<br>Line 3');
    });

    it('should handle table cell with colspan', () => {
      const node: TableCellNode = {
        type: 'tableCell',
        attrs: {
          colspan: 2
        },
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Spanning Cell' }]
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('Spanning Cell');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('Spanning Cell <!-- colspan=2 -->');
    });

    it('should handle table cell with colspan and other attributes', () => {
      const node: TableCellNode = {
        type: 'tableCell',
        attrs: {
          colspan: 3,
          rowspan: 2,
          colwidth: [100, 150, 200]
        },
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Complex Cell' }]
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('Complex Cell');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('Complex Cell <!-- colspan=3 --><!-- adf:tableCell attrs=\'{"rowspan":2,"colwidth":[100,150,200]}\' -->');
    });

    it('should include custom attributes in metadata when no colspan', () => {
      const node: TableCellNode = {
        type: 'tableCell',
        attrs: {
          rowspan: 3,
          colwidth: [120],
          backgroundColor: '#ffffff'
        } as any,
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Styled Cell' }]
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('Styled Cell');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('Styled Cell<!-- adf:tableCell attrs=\'{"rowspan":3,"colwidth":[120],"backgroundColor":"#ffffff"}\' -->');
    });

    it('should not include metadata when no attributes', () => {
      const node: TableCellNode = {
        type: 'tableCell',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Simple Cell' }]
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('Simple Cell');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('Simple Cell');
    });

    it('should handle table cell with colspan of 1', () => {
      const node: TableCellNode = {
        type: 'tableCell',
        attrs: {
          colspan: 1
        },
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Normal Cell' }]
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('Normal Cell');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('Normal Cell<!-- adf:tableCell attrs=\'{"colspan":1}\' -->');
    });

    it('should handle multi-paragraph content', () => {
      const node: TableCellNode = {
        type: 'tableCell',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Paragraph 1' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Paragraph 2' }]
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('Paragraph 1\n\nParagraph 2');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('Paragraph 1<br><br>Paragraph 2');
    });

    it('should handle empty content from convertChildren', () => {
      const node: TableCellNode = {
        type: 'tableCell',
        attrs: {
          colspan: 2
        },
        content: [
          {
            type: 'paragraph',
            content: []
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe(' <!-- colspan=2 -->');
    });

    it('should handle complex nested content', () => {
      const node: TableCellNode = {
        type: 'tableCell',
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Bold ', marks: [{ type: 'strong' }] },
              { type: 'text', text: 'text' }
            ]
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('**Bold** text');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('**Bold** text');
    });

    it('should handle content with mixed newlines and other elements', () => {
      const node: TableCellNode = {
        type: 'tableCell',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Start\n' }]
          },
          {
            type: 'codeBlock',
            content: [{ type: 'text', text: 'code\nblock' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: '\nEnd' }]
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('Start\n\n```\ncode\nblock\n```\n\nEnd');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('Start<br><br>```<br>code<br>block<br>```<br><br>End');
    });

    it('should handle only colwidth attribute', () => {
      const node: TableCellNode = {
        type: 'tableCell',
        attrs: {
          colwidth: [150]
        },
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Width Cell' }]
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('Width Cell');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('Width Cell<!-- adf:tableCell attrs=\'{"colwidth":[150]}\' -->');
    });

    it('should handle only rowspan attribute', () => {
      const node: TableCellNode = {
        type: 'tableCell',
        attrs: {
          rowspan: 2
        },
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Tall Cell' }]
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('Tall Cell');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('Tall Cell<!-- adf:tableCell attrs=\'{"rowspan":2}\' -->');
    });

    it('should handle content with only newlines', () => {
      const node: TableCellNode = {
        type: 'tableCell',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: '\n\n\n' }]
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('\n\n\n');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('<br><br><br>');
    });

    it('should handle numeric and boolean attribute values', () => {
      const node: TableCellNode = {
        type: 'tableCell',
        attrs: {
          rowspan: 1,
          colwidth: [100],
          isHeader: false,
          priority: 0
        } as any,
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Detailed Cell' }]
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('Detailed Cell');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('Detailed Cell<!-- adf:tableCell attrs=\'{"rowspan":1,"colwidth":[100],"isHeader":false,"priority":0}\' -->');
    });
  });
});