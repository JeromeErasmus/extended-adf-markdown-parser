/**
 * @file Tests for StatusConverter
 */

import { describe, it, expect, jest } from '@jest/globals';
import { StatusConverter } from '../../../src/parser/adf-to-markdown/nodes/StatusConverter';
import type { ConversionContext } from '../../../src/parser/types';
import type { ADFNode } from '../../../src/types';

describe('StatusConverter', () => {
  const converter = new StatusConverter();

  const mockContext: ConversionContext = {
    convertChildren: jest.fn(),
    depth: 0,
    options: {}
  };

  describe('nodeType', () => {
    it('should have correct nodeType', () => {
      expect(converter.nodeType).toBe('status');
    });
  });

  describe('toMarkdown', () => {
    it('should convert status with text', () => {
      const node: ADFNode = {
        type: 'status',
        attrs: {
          text: 'In Progress',
          color: 'blue'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('`In Progress`<!-- adf:status attrs=\'{"text":"In Progress","color":"blue"}\' -->');
    });

    it('should use default "Status" text when no text provided', () => {
      const node: ADFNode = {
        type: 'status',
        attrs: {
          color: 'green'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('`Status`<!-- adf:status attrs=\'{"color":"green"}\' -->');
    });

    it('should handle status with no attributes', () => {
      const node: ADFNode = {
        type: 'status',
        attrs: {}
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('`Status`');
    });

    it('should handle status with undefined attrs', () => {
      const node: ADFNode = {
        type: 'status'
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('`Status`');
    });

    it('should include all official status attributes in metadata', () => {
      const node: ADFNode = {
        type: 'status',
        attrs: {
          text: 'Done',
          color: 'green',
          localId: 'status-123'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('`Done`<!-- adf:status attrs=\'{"text":"Done","color":"green","localId":"status-123"}\' -->');
    });

    it('should handle empty text attribute', () => {
      const node: ADFNode = {
        type: 'status',
        attrs: {
          text: '',
          color: 'red'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('`Status`<!-- adf:status attrs=\'{"text":"","color":"red"}\' -->');
    });

    it('should handle text with spaces', () => {
      const node: ADFNode = {
        type: 'status',
        attrs: {
          text: 'Waiting for Approval'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('`Waiting for Approval`<!-- adf:status attrs=\'{"text":"Waiting for Approval"}\' -->');
    });

    it('should handle text with special characters', () => {
      const node: ADFNode = {
        type: 'status',
        attrs: {
          text: 'Bug-Fix #123',
          color: 'red'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('`Bug-Fix #123`<!-- adf:status attrs=\'{"text":"Bug-Fix #123","color":"red"}\' -->');
    });

    it('should handle different color values', () => {
      const colorTests = [
        { color: 'neutral', text: 'Draft' },
        { color: 'purple', text: 'Review' },
        { color: 'red', text: 'Blocked' },
        { color: 'yellow', text: 'Warning' }
      ];

      colorTests.forEach(({ color, text }) => {
        const node: ADFNode = {
          type: 'status',
          attrs: { text, color }
        };

        const result = converter.toMarkdown(node, mockContext);
        expect(result).toBe(`\`${text}\`<!-- adf:status attrs='{"text":"${text}","color":"${color}"}' -->`);
      });
    });

    it('should handle custom attributes', () => {
      const node: ADFNode = {
        type: 'status',
        attrs: {
          text: 'Custom Status',
          customField: 'value',
          priority: 'high',
          department: 'Engineering'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('`Custom Status`<!-- adf:status attrs=\'{"text":"Custom Status","customField":"value","priority":"high","department":"Engineering"}\' -->');
    });

    it('should handle localId attribute', () => {
      const node: ADFNode = {
        type: 'status',
        attrs: {
          text: 'To Do',
          localId: 'abc-123-def',
          color: 'neutral'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('`To Do`<!-- adf:status attrs=\'{"text":"To Do","localId":"abc-123-def","color":"neutral"}\' -->');
    });

    it('should handle custom attributes (for backward compatibility)', () => {
      const node: ADFNode = {
        type: 'status',
        attrs: {
          text: 'Custom Status',
          color: 'blue',
          customAttribute: 'customValue'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('`Custom Status`<!-- adf:status attrs=\'{"text":"Custom Status","color":"blue","customAttribute":"customValue"}\' -->');
    });
  });
});