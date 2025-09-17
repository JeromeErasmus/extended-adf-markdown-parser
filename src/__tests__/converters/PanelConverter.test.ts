/**
 * @file Tests for PanelConverter
 */

import { describe, it, expect, jest } from '@jest/globals';
import { PanelConverter } from '../../parser/adf-to-markdown/nodes/PanelConverter';
import type { ConversionContext } from '../../parser/types';
import type { PanelNode } from '../../types';

describe('PanelConverter', () => {
  const converter = new PanelConverter();

  const mockContext: ConversionContext = {
    convertChildren: jest.fn().mockReturnValue('panel content'),
    depth: 0,
    options: {}
  };

  describe('nodeType', () => {
    it('should have correct nodeType', () => {
      expect(converter.nodeType).toBe('panel');
    });
  });

  describe('toMarkdown', () => {
    it('should convert info panel', () => {
      const node: PanelNode = {
        type: 'panel',
        attrs: { panelType: 'info' },
        content: [
          { type: 'paragraph', content: [{ type: 'text', text: 'Info message' }] }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('~~~panel type=info\npanel content\n~~~');
      expect(mockContext.convertChildren).toHaveBeenCalledWith(node.content!);
    });

    it('should convert warning panel', () => {
      const node: PanelNode = {
        type: 'panel',
        attrs: { panelType: 'warning' },
        content: [
          { type: 'paragraph', content: [{ type: 'text', text: 'Warning message' }] }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('~~~panel type=warning\npanel content\n~~~');
    });

    it('should convert error panel', () => {
      const node: PanelNode = {
        type: 'panel',
        attrs: { panelType: 'error' },
        content: [
          { type: 'paragraph', content: [{ type: 'text', text: 'Error message' }] }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('~~~panel type=error\npanel content\n~~~');
    });

    it('should convert success panel', () => {
      const node: PanelNode = {
        type: 'panel',
        attrs: { panelType: 'success' },
        content: [
          { type: 'paragraph', content: [{ type: 'text', text: 'Success message' }] }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('~~~panel type=success\npanel content\n~~~');
    });

    it('should convert note panel', () => {
      const node: PanelNode = {
        type: 'panel',
        attrs: { panelType: 'note' },
        content: [
          { type: 'paragraph', content: [{ type: 'text', text: 'Note message' }] }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('~~~panel type=note\npanel content\n~~~');
    });

    it('should default to info panel when no panelType specified', () => {
      const node: PanelNode = {
        type: 'panel',
        content: [
          { type: 'paragraph', content: [{ type: 'text', text: 'Default panel' }] }
        ]
      } as PanelNode;

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('~~~panel type=info\npanel content\n~~~');
    });

    it('should return empty string for panel with no content', () => {
      const node: PanelNode = {
        type: 'panel',
        attrs: { panelType: 'info' },
        content: []
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('');
    });

    it('should return empty string for panel with undefined content', () => {
      const node: PanelNode = {
        type: 'panel',
        attrs: { panelType: 'info' }
      } as PanelNode;

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('');
    });

    it('should include custom attributes in metadata', () => {
      const mockContextForAttrs: ConversionContext = {
        convertChildren: jest.fn().mockReturnValue('custom panel'),
        depth: 0,
        options: {}
      };

      const node: PanelNode = {
        type: 'panel',
        attrs: {
          panelType: 'info',
          customId: 'panel-1',
          backgroundColor: '#f0f0f0'
        } as any,
        content: [
          { type: 'paragraph', content: [{ type: 'text', text: 'Custom panel' }] }
        ]
      };

      const result = converter.toMarkdown(node, mockContextForAttrs);
      expect(result).toBe('~~~panel type=info attrs=\'{"customId":"panel-1","backgroundColor":"#f0f0f0"}\'\ncustom panel\n~~~');
    });

    it('should not include metadata when only panelType is present', () => {
      const node: PanelNode = {
        type: 'panel',
        attrs: { panelType: 'warning' },
        content: [
          { type: 'paragraph', content: [{ type: 'text', text: 'Simple panel' }] }
        ]
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('~~~panel type=warning\npanel content\n~~~');
    });
  });
});