/**
 * @file Tests for TableRowConverter
 */

import { describe, it, expect, jest } from '@jest/globals';
import { TableRowConverter } from '../../../src/parser/adf-to-markdown/nodes/TableRowConverter';
import type { ConversionContext } from '../../../src/parser/types';
import type { TableRowNode } from '../../../src/types';

describe('TableRowConverter', () => {
  const converter = new TableRowConverter();

  const mockCellConverter = {
    nodeType: 'tableCell',
    toMarkdown: jest.fn()
  };

  const mockHeaderConverter = {
    nodeType: 'tableHeader',
    toMarkdown: jest.fn()
  };

  const mockContext: ConversionContext = {
    convertChildren: jest.fn(),
    depth: 0,
    options: {
      registry: {
        getNodeConverter: jest.fn().mockImplementation((nodeType: string) => {
          if (nodeType === 'tableCell') return mockCellConverter;
          if (nodeType === 'tableHeader') return mockHeaderConverter;
          return null;
        })
      } as any
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('nodeType', () => {
    it('should have correct nodeType', () => {
      expect(converter.nodeType).toBe('tableRow');
    });
  });

  describe('toMarkdown', () => {
    it('should convert row with table cells', () => {
      const node: TableRowNode = {
        type: 'tableRow',
        content: [
          {
            type: 'tableCell',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Cell 1' }] }]
          },
          {
            type: 'tableCell',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Cell 2' }] }]
          }
        ]
      };

      mockCellConverter.toMarkdown
        .mockReturnValueOnce('Cell 1')
        .mockReturnValueOnce('Cell 2');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('| Cell 1 | Cell 2 |');
      expect(mockCellConverter.toMarkdown).toHaveBeenCalledTimes(2);
    });

    it('should convert row with table headers', () => {
      const node: TableRowNode = {
        type: 'tableRow',
        content: [
          {
            type: 'tableHeader',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Header 1' }] }]
          },
          {
            type: 'tableHeader',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Header 2' }] }]
          }
        ]
      };

      mockHeaderConverter.toMarkdown
        .mockReturnValueOnce('Header 1')
        .mockReturnValueOnce('Header 2');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('| Header 1 | Header 2 |');
      expect(mockHeaderConverter.toMarkdown).toHaveBeenCalledTimes(2);
    });

    it('should convert row with mixed headers and cells', () => {
      const node: TableRowNode = {
        type: 'tableRow',
        content: [
          {
            type: 'tableHeader',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Header' }] }]
          },
          {
            type: 'tableCell',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Cell' }] }]
          }
        ]
      };

      mockHeaderConverter.toMarkdown.mockReturnValueOnce('Header');
      mockCellConverter.toMarkdown.mockReturnValueOnce('Cell');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('| Header | Cell |');
    });

    it('should handle empty table row', () => {
      const node: TableRowNode = {
        type: 'tableRow',
        content: []
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('|  |');
    });

    it('should handle table row with undefined content', () => {
      const node: TableRowNode = {
        type: 'tableRow'
      } as TableRowNode;

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('|  |');
    });

    it('should handle single cell row', () => {
      const node: TableRowNode = {
        type: 'tableRow',
        content: [
          {
            type: 'tableCell',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Single cell' }] }]
          }
        ]
      };

      mockCellConverter.toMarkdown.mockReturnValueOnce('Single cell');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('| Single cell |');
    });

    it('should handle cells with missing converters', () => {
      const contextWithoutConverter: ConversionContext = {
        ...mockContext,
        options: {
          registry: {
            getNodeConverter: jest.fn().mockReturnValue(null)
          } as any
        }
      };

      const node: TableRowNode = {
        type: 'tableRow',
        content: [
          {
            type: 'tableCell',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Cell' }] }]
          }
        ]
      };

      const result = converter.toMarkdown(node, contextWithoutConverter);
      expect(result).toBe('|  |');
    });

    it('should include custom attributes in metadata', () => {
      const node: TableRowNode = {
        type: 'tableRow',
        attrs: {
          background: '#f0f0f0',
          height: 50
        } as any,
        content: [
          {
            type: 'tableCell',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Cell with attrs' }] }]
          }
        ]
      };

      mockCellConverter.toMarkdown.mockReturnValueOnce('Cell with attrs');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('| Cell with attrs |<!-- adf:tableRow attrs=\'{"background":"#f0f0f0","height":50}\' -->');
    });

    it('should not include metadata when no attributes', () => {
      const node: TableRowNode = {
        type: 'tableRow',
        content: [
          {
            type: 'tableCell',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Simple cell' }] }]
          }
        ]
      };

      mockCellConverter.toMarkdown.mockReturnValueOnce('Simple cell');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('| Simple cell |');
    });

    it('should handle empty cell content', () => {
      const node: TableRowNode = {
        type: 'tableRow',
        content: [
          {
            type: 'tableCell',
            content: []
          },
          {
            type: 'tableCell',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Non-empty' }] }]
          }
        ]
      };

      mockCellConverter.toMarkdown
        .mockReturnValueOnce('')
        .mockReturnValueOnce('Non-empty');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('|  | Non-empty |');
    });

    it('should pass correct context to cell converters', () => {
      const node: TableRowNode = {
        type: 'tableRow',
        content: [
          {
            type: 'tableCell',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Test cell' }] }]
          }
        ]
      };

      mockCellConverter.toMarkdown.mockReturnValueOnce('Test cell');

      converter.toMarkdown(node, mockContext);

      expect(mockCellConverter.toMarkdown).toHaveBeenCalledWith(
        node.content![0],
        {
          ...mockContext,
          depth: mockContext.depth + 1,
          parent: node
        }
      );
    });

    it('should handle multiple empty cells', () => {
      const node: TableRowNode = {
        type: 'tableRow',
        content: [
          {
            type: 'tableCell',
            content: []
          },
          {
            type: 'tableCell',
            content: []
          },
          {
            type: 'tableCell',
            content: []
          }
        ]
      };

      mockCellConverter.toMarkdown
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('|  |  |  |');
    });
  });
});