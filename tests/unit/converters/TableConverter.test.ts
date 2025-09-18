/**
 * @file Tests for TableConverter
 */

import { describe, it, expect, jest } from '@jest/globals';
import { TableConverter } from '../../../src/parser/adf-to-markdown/nodes/TableConverter';
import type { ConversionContext } from '../../../src/parser/types';
import type { TableNode } from '../../../src/types';

describe('TableConverter', () => {
  const converter = new TableConverter();

  const mockTableRowConverter = {
    nodeType: 'tableRow',
    toMarkdown: jest.fn()
  };

  const mockContext: ConversionContext = {
    convertChildren: jest.fn(),
    depth: 0,
    options: {
      registry: {
        getNodeConverter: jest.fn().mockReturnValue(mockTableRowConverter)
      } as any
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('nodeType', () => {
    it('should have correct nodeType', () => {
      expect(converter.nodeType).toBe('table');
    });
  });

  describe('toMarkdown', () => {
    it('should convert table with headers', () => {
      const node: TableNode = {
        type: 'table',
        content: [
          {
            type: 'tableRow',
            content: [
              { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Header 1' }] }] },
              { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Header 2' }] }] }
            ]
          },
          {
            type: 'tableRow',
            content: [
              { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Cell 1' }] }] },
              { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Cell 2' }] }] }
            ]
          }
        ]
      };

      mockTableRowConverter.toMarkdown
        .mockReturnValueOnce('| Header 1 | Header 2 |')
        .mockReturnValueOnce('| Cell 1 | Cell 2 |');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1 | Cell 2 |');
      expect(mockTableRowConverter.toMarkdown).toHaveBeenCalledTimes(2);
    });

    it('should convert table without headers', () => {
      const node: TableNode = {
        type: 'table',
        content: [
          {
            type: 'tableRow',
            content: [
              { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Row 1 Col 1' }] }] },
              { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Row 1 Col 2' }] }] }
            ]
          },
          {
            type: 'tableRow',
            content: [
              { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Row 2 Col 1' }] }] },
              { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Row 2 Col 2' }] }] }
            ]
          }
        ]
      };

      mockTableRowConverter.toMarkdown
        .mockReturnValueOnce('| Row 1 Col 1 | Row 1 Col 2 |')
        .mockReturnValueOnce('| Row 2 Col 1 | Row 2 Col 2 |');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('| Row 1 Col 1 | Row 1 Col 2 |\n| Row 2 Col 1 | Row 2 Col 2 |');
    });

    it('should handle empty table', () => {
      const node: TableNode = {
        type: 'table',
        content: []
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('');
    });

    it('should handle table with undefined content', () => {
      const node: TableNode = {
        type: 'table'
      } as TableNode;

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('');
    });

    it('should filter out empty rows', () => {
      const node: TableNode = {
        type: 'table',
        content: [
          {
            type: 'tableRow',
            content: [
              { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Valid row' }] }] }
            ]
          },
          {
            type: 'tableRow',
            content: []
          }
        ]
      };

      mockTableRowConverter.toMarkdown
        .mockReturnValueOnce('| Valid row |')
        .mockReturnValueOnce('');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('| Valid row |');
    });

    it('should handle table with single column', () => {
      const node: TableNode = {
        type: 'table',
        content: [
          {
            type: 'tableRow',
            content: [
              { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Single Header' }] }] }
            ]
          },
          {
            type: 'tableRow',
            content: [
              { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Single Cell' }] }] }
            ]
          }
        ]
      };

      mockTableRowConverter.toMarkdown
        .mockReturnValueOnce('| Single Header |')
        .mockReturnValueOnce('| Single Cell |');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('| Single Header |\n| -------- |\n| Single Cell |');
    });

    it('should handle table with multiple columns', () => {
      const node: TableNode = {
        type: 'table',
        content: [
          {
            type: 'tableRow',
            content: [
              { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Col1' }] }] },
              { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Col2' }] }] },
              { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Col3' }] }] }
            ]
          }
        ]
      };

      mockTableRowConverter.toMarkdown.mockReturnValueOnce('| Col1 | Col2 | Col3 |');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('| Col1 | Col2 | Col3 |\n| -------- | -------- | -------- |');
    });

    it('should include custom attributes in metadata', () => {
      const node: TableNode = {
        type: 'table',
        attrs: {
          isNumberColumnEnabled: true,
          layout: 'full-width'
        } as any,
        content: [
          {
            type: 'tableRow',
            content: [
              { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Data' }] }] }
            ]
          }
        ]
      };

      mockTableRowConverter.toMarkdown.mockReturnValueOnce('| Data |');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('| Data |\n<!-- adf:table attrs=\'{"isNumberColumnEnabled":true,"layout":"full-width"}\' -->');
    });

    it('should not include metadata when no attributes', () => {
      const node: TableNode = {
        type: 'table',
        content: [
          {
            type: 'tableRow',
            content: [
              { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Simple' }] }] }
            ]
          }
        ]
      };

      mockTableRowConverter.toMarkdown.mockReturnValueOnce('| Simple |');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('| Simple |');
    });

    it('should handle missing tableRow converter', () => {
      const contextWithoutConverter: ConversionContext = {
        ...mockContext,
        options: {
          registry: {
            getNodeConverter: jest.fn().mockReturnValue(null)
          } as any
        }
      };

      const node: TableNode = {
        type: 'table',
        content: [
          {
            type: 'tableRow',
            content: [
              { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Test' }] }] }
            ]
          }
        ]
      };

      const result = converter.toMarkdown(node, contextWithoutConverter);
      expect(result).toBe('');
    });

    it('should pass correct context to row converters', () => {
      const node: TableNode = {
        type: 'table',
        content: [
          {
            type: 'tableRow',
            content: [
              { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Test' }] }] }
            ]
          }
        ]
      };

      mockTableRowConverter.toMarkdown.mockReturnValueOnce('| Test |');

      converter.toMarkdown(node, mockContext);

      expect(mockTableRowConverter.toMarkdown).toHaveBeenCalledWith(
        node.content![0],
        {
          ...mockContext,
          depth: mockContext.depth + 1,
          parent: node
        }
      );
    });

    it('should handle mixed header and cell rows correctly', () => {
      const node: TableNode = {
        type: 'table',
        content: [
          {
            type: 'tableRow',
            content: [
              { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Name' }] }] },
              { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Age' }] }] }
            ]
          },
          {
            type: 'tableRow',
            content: [
              { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'John' }] }] },
              { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '25' }] }] }
            ]
          }
        ]
      };

      mockTableRowConverter.toMarkdown
        .mockReturnValueOnce('| Name | Age |')
        .mockReturnValueOnce('| John | 25 |');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('| Name | Age |\n| -------- | -------- |\n| John | 25 |');
    });
  });
});