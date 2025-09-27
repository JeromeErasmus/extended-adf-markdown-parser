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
      expect(result).toBe('{status:In Progress|color:blue}');
    });

    it('should use default "Status" text when no text provided', () => {
      const node: ADFNode = {
        type: 'status',
        attrs: {
          color: 'green'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('{status:Status|color:green}');
    });

    it('should handle status with no attributes', () => {
      const node: ADFNode = {
        type: 'status',
        attrs: {}
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('{status:Status}');
    });

    it('should handle status with undefined attrs', () => {
      const node: ADFNode = {
        type: 'status'
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('{status:Status}');
    });

    it('should include all official status attributes (text and color)', () => {
      const node: ADFNode = {
        type: 'status',
        attrs: {
          text: 'Done',
          color: 'green',
          localId: 'status-123' // localId is not included in new inline syntax
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('{status:Done|color:green}');
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
      expect(result).toBe('{status:Status|color:red}'); // Uses default "Status" for empty text
    });

    it('should handle text with spaces', () => {
      const node: ADFNode = {
        type: 'status',
        attrs: {
          text: 'Waiting for Approval'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('{status:Waiting for Approval}'); // No color means neutral (simple syntax)
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
      expect(result).toBe('{status:Bug-Fix #123|color:red}');
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
        if (color === 'neutral') {
          expect(result).toBe(`{status:${text}}`);
        } else {
          expect(result).toBe(`{status:${text}|color:${color}}`);
        }
      });
    });

    it('should handle custom attributes (ignores non-standard attributes)', () => {
      const node: ADFNode = {
        type: 'status',
        attrs: {
          text: 'Custom Status',
          customField: 'value', // Not included in inline syntax
          priority: 'high',     // Not included in inline syntax
          department: 'Engineering' // Not included in inline syntax
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('{status:Custom Status}'); // Only text and color supported in new syntax
    });

    it('should handle localId attribute (ignores localId in new syntax)', () => {
      const node: ADFNode = {
        type: 'status',
        attrs: {
          text: 'To Do',
          localId: 'abc-123-def', // Not included in inline syntax
          color: 'neutral'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('{status:To Do}'); // Neutral color uses simple syntax
    });

    it('should handle custom attributes (focuses on text and color only)', () => {
      const node: ADFNode = {
        type: 'status',
        attrs: {
          text: 'Custom Status',
          color: 'blue',
          customAttribute: 'customValue' // Not included in inline syntax
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('{status:Custom Status|color:blue}');
    });
  });
});