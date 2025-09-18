/**
 * @file Integration tests for Phase 5 converters (Complete ADF Coverage)
 */

import { describe, it, expect } from '@jest/globals';
import { ConverterRegistry } from '../../../src/parser/ConverterRegistry';
import { TableConverter } from '../../../src/parser/adf-to-markdown/nodes/TableConverter';
import { TableRowConverter } from '../../../src/parser/adf-to-markdown/nodes/TableRowConverter';
import { TableHeaderConverter } from '../../../src/parser/adf-to-markdown/nodes/TableHeaderConverter';
import { TableCellConverter } from '../../../src/parser/adf-to-markdown/nodes/TableCellConverter';
import { ExpandConverter, NestedExpandConverter } from '../../../src/parser/adf-to-markdown/nodes/ExpandConverter';
import { BlockquoteConverter } from '../../../src/parser/adf-to-markdown/nodes/BlockquoteConverter';
import { StrikeConverter } from '../../../src/parser/adf-to-markdown/marks/StrikeConverter';
import { UnderlineConverter } from '../../../src/parser/adf-to-markdown/marks/UnderlineConverter';
import { TextColorConverter } from '../../../src/parser/adf-to-markdown/marks/TextColorConverter';
import { TextConverter } from '../../../src/parser/adf-to-markdown/nodes/TextConverter';
import { ParagraphConverter } from '../../../src/parser/adf-to-markdown/nodes/ParagraphConverter';
import type { ConversionContext } from '../../../src/parser/types';
import type { ADFNode } from '../../../src/types';

describe('Phase 5 Converters Integration', () => {
  let registry: ConverterRegistry;
  let context: ConversionContext;

  beforeEach(() => {
    registry = new ConverterRegistry();
    
    // Register all converters
    registry.registerNodes([
      new TableConverter(),
      new TableRowConverter(),
      new TableHeaderConverter(),
      new TableCellConverter(),
      new ExpandConverter(),
      new NestedExpandConverter(),
      new BlockquoteConverter(),
      new TextConverter(),
      new ParagraphConverter()
    ]);
    
    registry.registerMarks([
      new StrikeConverter(),
      new UnderlineConverter(),
      new TextColorConverter()
    ]);
    
    context = {
      convertChildren: (nodes: ADFNode[]) => {
        return nodes.map(node => {
          const converter = registry.getNodeConverter(node.type);
          return converter.toMarkdown(node, context);
        }).join('');
      },
      depth: 0,
      options: { registry }
    };
  });

  describe('Table Conversion', () => {
    it('should convert simple table with headers', () => {
      const tableNode = {
        type: 'table',
        content: [
          {
            type: 'tableRow',
            content: [
              {
                type: 'tableHeader',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Name' }]
                  }
                ]
              },
              {
                type: 'tableHeader',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Age' }]
                  }
                ]
              }
            ]
          },
          {
            type: 'tableRow',
            content: [
              {
                type: 'tableCell',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'John' }]
                  }
                ]
              },
              {
                type: 'tableCell',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: '25' }]
                  }
                ]
              }
            ]
          }
        ]
      };

      const result = context.convertChildren([tableNode]);
      expect(result).toContain('| Name | Age |');
      expect(result).toContain('| -------- | -------- |');
      expect(result).toContain('| John | 25 |');
    });
  });

  describe('Expand Conversion', () => {
    it('should convert expand with title and content', () => {
      const expandNode = {
        type: 'expand',
        attrs: { title: 'Click to expand' },
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Hidden content here' }]
          }
        ]
      };

      const result = context.convertChildren([expandNode]);
      expect(result).toBe('~~~expand title="Click to expand"\nHidden content here\n~~~');
    });

    it('should convert nested expand', () => {
      const nestedExpandNode = {
        type: 'nestedExpand',
        attrs: { title: 'Nested section' },
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Nested content' }]
          }
        ]
      };

      const result = context.convertChildren([nestedExpandNode]);
      expect(result).toContain('~~~expand title="Nested section"');
      expect(result).toContain('nested":true');
      expect(result).toContain('Nested content');
    });
  });

  describe('Blockquote Conversion', () => {
    it('should convert blockquote with single paragraph', () => {
      const blockquoteNode = {
        type: 'blockquote',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'This is a quote' }]
          }
        ]
      };

      const result = context.convertChildren([blockquoteNode]);
      expect(result).toBe('> This is a quote');
    });

    it('should convert blockquote with multiple paragraphs', () => {
      const blockquoteNode = {
        type: 'blockquote',
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

      const result = context.convertChildren([blockquoteNode]);
      expect(result).toContain('> First paragraph');
      expect(result).toContain('> Second paragraph');
    });
  });

  describe('Additional Mark Conversion', () => {
    it('should convert strike mark', () => {
      const textNode = {
        type: 'text',
        text: 'strikethrough text',
        marks: [{ type: 'strike' }]
      };

      const result = context.convertChildren([textNode]);
      expect(result).toBe('~~strikethrough text~~');
    });

    it('should convert underline mark', () => {
      const textNode = {
        type: 'text',
        text: 'underlined text',
        marks: [{ type: 'underline' }]
      };

      const result = context.convertChildren([textNode]);
      expect(result).toBe('<u>underlined text</u>');
    });

    it('should convert text color mark', () => {
      const textNode = {
        type: 'text',
        text: 'red text',
        marks: [{ type: 'textColor', attrs: { color: '#ff0000' } }]
      };

      const result = context.convertChildren([textNode]);
      expect(result).toBe('<span style="color: #ff0000">red text</span>');
    });
  });

  describe('Converter Registry Coverage', () => {
    it('should have all new converters registered', () => {
      // Verify new node converters
      expect(registry.getNodeConverter('table')).toBeInstanceOf(TableConverter);
      expect(registry.getNodeConverter('tableRow')).toBeInstanceOf(TableRowConverter);
      expect(registry.getNodeConverter('tableHeader')).toBeInstanceOf(TableHeaderConverter);
      expect(registry.getNodeConverter('tableCell')).toBeInstanceOf(TableCellConverter);
      expect(registry.getNodeConverter('expand')).toBeInstanceOf(ExpandConverter);
      expect(registry.getNodeConverter('nestedExpand')).toBeInstanceOf(NestedExpandConverter);
      expect(registry.getNodeConverter('blockquote')).toBeInstanceOf(BlockquoteConverter);
      
      // Verify new mark converters
      expect(registry.getMarkConverter('strike')).toBeInstanceOf(StrikeConverter);
      expect(registry.getMarkConverter('underline')).toBeInstanceOf(UnderlineConverter);
      expect(registry.getMarkConverter('textColor')).toBeInstanceOf(TextColorConverter);
    });
  });
});