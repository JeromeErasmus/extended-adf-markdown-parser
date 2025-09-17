/**
 * @file Tests for TableHeaderConverter
 */

import { describe, it, expect, jest } from '@jest/globals';
import { TableHeaderConverter } from '../../parser/adf-to-markdown/nodes/TableHeaderConverter';
import type { ConversionContext } from '../../parser/types';
import type { TableHeaderNode } from '../../types';

describe('TableHeaderConverter', () => {
  const converter = new TableHeaderConverter();

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
      expect(converter.nodeType).toBe('tableHeader');
    });
  });

  describe('toMarkdown', () => {
    it('should convert basic table header', () => {
      const node: TableHeaderNode = {
        type: 'tableHeader',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Header Text' }]
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('Header Text');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('Header Text');
      expect(mockContext.convertChildren).toHaveBeenCalledWith(node.content!);
    });

    it('should handle empty table header', () => {
      const node: TableHeaderNode = {
        type: 'tableHeader',
        content: []
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('');
    });

    it('should handle table header with undefined content', () => {
      const node: TableHeaderNode = {
        type: 'tableHeader'
      } as TableHeaderNode;

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('');
    });

    it('should handle table header with colspan', () => {
      const node: TableHeaderNode = {
        type: 'tableHeader',
        attrs: {
          colspan: 2
        },
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Spanning Header' }]
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('Spanning Header');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('Spanning Header <!-- colspan=2 -->');
    });

    it('should handle table header with colspan and other attributes', () => {
      const node: TableHeaderNode = {
        type: 'tableHeader',
        attrs: {
          colspan: 3,
          rowspan: 2,
          colwidth: [100, 150, 200]
        },
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Complex Header' }]
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('Complex Header');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('Complex Header <!-- colspan=3 --><!-- adf:tableHeader attrs=\'{"rowspan":2,"colwidth":[100,150,200]}\' -->');
    });

    it('should include custom attributes in metadata when no colspan', () => {
      const node: TableHeaderNode = {
        type: 'tableHeader',
        attrs: {
          rowspan: 3,
          colwidth: [120],
          backgroundColor: '#f0f0f0'
        } as any,
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Styled Header' }]
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('Styled Header');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('Styled Header<!-- adf:tableHeader attrs=\'{"rowspan":3,"colwidth":[120],"backgroundColor":"#f0f0f0"}\' -->');
    });

    it('should not include metadata when no attributes', () => {
      const node: TableHeaderNode = {
        type: 'tableHeader',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Simple Header' }]
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('Simple Header');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('Simple Header');
    });

    it('should handle table header with colspan of 1', () => {
      const node: TableHeaderNode = {
        type: 'tableHeader',
        attrs: {
          colspan: 1
        },
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Normal Header' }]
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('Normal Header');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('Normal Header');
    });

    it('should handle multi-line content', () => {
      const node: TableHeaderNode = {
        type: 'tableHeader',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Line 1\nLine 2' }]
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('Line 1\nLine 2');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('Line 1\nLine 2');
    });

    it('should handle empty content from convertChildren', () => {
      const node: TableHeaderNode = {
        type: 'tableHeader',
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
      const node: TableHeaderNode = {
        type: 'tableHeader',
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Bold ', marks: [{ type: 'strong' }] },
              { type: 'text', text: 'Header' }
            ]
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('**Bold** Header');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('**Bold** Header');
    });

    it('should handle only colwidth attribute', () => {
      const node: TableHeaderNode = {
        type: 'tableHeader',
        attrs: {
          colwidth: [150]
        },
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Width Header' }]
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('Width Header');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('Width Header<!-- adf:tableHeader attrs=\'{"colwidth":[150]}\' -->');
    });

    it('should handle only rowspan attribute', () => {
      const node: TableHeaderNode = {
        type: 'tableHeader',
        attrs: {
          rowspan: 2
        },
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Tall Header' }]
          }
        ]
      };

      (mockContext.convertChildren as jest.Mock).mockReturnValue('Tall Header');

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('Tall Header<!-- adf:tableHeader attrs=\'{"rowspan":2}\' -->');
    });
  });
});