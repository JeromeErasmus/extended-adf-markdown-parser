/**
 * @file Integration tests for Phase 4 converters
 */

import { describe, it, expect } from '@jest/globals';
import { ConverterRegistry } from '../../../src/parser/ConverterRegistry';
import { PanelConverter } from '../../../src/parser/adf-to-markdown/nodes/PanelConverter';
import { CodeBlockConverter } from '../../../src/parser/adf-to-markdown/nodes/CodeBlockConverter';
import { BulletListConverter } from '../../../src/parser/adf-to-markdown/nodes/BulletListConverter';
import { ListItemConverter } from '../../../src/parser/adf-to-markdown/nodes/ListItemConverter';
import { MediaConverter } from '../../../src/parser/adf-to-markdown/nodes/MediaConverter';
import { LinkConverter } from '../../../src/parser/adf-to-markdown/marks/LinkConverter';
import { TextConverter } from '../../../src/parser/adf-to-markdown/nodes/TextConverter';
import { ParagraphConverter } from '../../../src/parser/adf-to-markdown/nodes/ParagraphConverter';
import { StrongConverter } from '../../../src/parser/adf-to-markdown/marks/StrongConverter';
import type { ConversionContext } from '../../../src/parser/types';
import type { ADFNode } from '../../../src/types';

describe('Phase 4 Converters Integration', () => {
  let registry: ConverterRegistry;
  let context: ConversionContext;

  beforeEach(() => {
    registry = new ConverterRegistry();
    
    // Register all converters
    registry.registerNodes([
      new PanelConverter(),
      new CodeBlockConverter(),
      new BulletListConverter(),
      new ListItemConverter(),
      new MediaConverter(),
      new TextConverter(),
      new ParagraphConverter()
    ]);
    
    registry.registerMarks([
      new LinkConverter(),
      new StrongConverter()
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

  describe('Panel with Rich Content', () => {
    it('should convert panel with paragraph containing marks', () => {
      const panelNode = {
        type: 'panel',
        attrs: { panelType: 'info' },
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'This is an info panel with ' },
              { type: 'text', text: 'bold text', marks: [{ type: 'strong' }] },
              { type: 'text', text: '.' }
            ]
          }
        ]
      };

      const result = context.convertChildren([panelNode]);
      expect(result).toBe('~~~panel type=info\nThis is an info panel with **bold text**.\n~~~');
    });
  });

  describe('Code Block Conversion', () => {
    it('should convert code block with language', () => {
      const codeBlockNode = {
        type: 'codeBlock',
        attrs: { language: 'javascript' },
        content: [
          { type: 'text', text: 'function hello() {\n  console.log("Hello!");\n}' }
        ]
      };

      const result = context.convertChildren([codeBlockNode]);
      expect(result).toBe('```javascript\nfunction hello() {\n  console.log("Hello!");\n}\n```');
    });
  });

  describe('List with Rich Content', () => {
    it('should convert bullet list with formatted text', () => {
      const bulletListNode = {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  { type: 'text', text: 'First item with ' },
                  { type: 'text', text: 'link', marks: [{ type: 'link', attrs: { href: '/docs' } }] }
                ]
              }
            ]
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  { type: 'text', text: 'Second item with ' },
                  { type: 'text', text: 'emphasis', marks: [{ type: 'strong' }] }
                ]
              }
            ]
          }
        ]
      };

      const result = context.convertChildren([bulletListNode]);
      expect(result).toBe('- First item with [link](/docs)\n- Second item with **emphasis**');
    });
  });

  describe('Media Conversion', () => {
    it('should convert media with metadata', () => {
      const mediaNode = {
        type: 'media',
        attrs: {
          id: 'image-123',
          type: 'file',
          collection: 'content-456',
          width: 400
        }
      };

      const result = context.convertChildren([mediaNode]);
      expect(result).toContain('![Media](adf:media:image-123)');
      expect(result).toContain('<!-- adf:media');
      expect(result).toContain('id="image-123"');
      expect(result).toContain('width="400"');
    });
  });

  describe('Converter Registry Integration', () => {
    it('should properly resolve and execute converters', () => {
      // Test that registry can find all our new converters
      expect(registry.getNodeConverter('panel')).toBeInstanceOf(PanelConverter);
      expect(registry.getNodeConverter('codeBlock')).toBeInstanceOf(CodeBlockConverter);
      expect(registry.getNodeConverter('bulletList')).toBeInstanceOf(BulletListConverter);
      expect(registry.getNodeConverter('listItem')).toBeInstanceOf(ListItemConverter);
      expect(registry.getNodeConverter('media')).toBeInstanceOf(MediaConverter);
      
      expect(registry.getMarkConverter('link')).toBeInstanceOf(LinkConverter);
    });

    it('should provide fallback for unknown node types', () => {
      const unknownNode = {
        type: 'unknownCustomNode',
        attrs: { customAttr: 'value' },
        content: []
      };

      const result = context.convertChildren([unknownNode]);
      expect(result).toContain('<!-- adf:unknown type="unknownCustomNode" -->');
      expect(result).toContain('"customAttr": "value"');
    });
  });
});