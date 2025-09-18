/**
 * @file Tests for HardBreakConverter
 */

import { describe, it, expect, jest } from '@jest/globals';
import { HardBreakConverter } from '../../../src/parser/adf-to-markdown/nodes/HardBreakConverter';
import type { ConversionContext } from '../../../src/parser/types';
import type { ADFNode } from '../../../src/types';

describe('HardBreakConverter', () => {
  const converter = new HardBreakConverter();

  const mockContext: ConversionContext = {
    convertChildren: jest.fn(),
    depth: 0,
    options: {}
  };

  describe('nodeType', () => {
    it('should have correct nodeType', () => {
      expect(converter.nodeType).toBe('hardBreak');
    });
  });

  describe('toMarkdown', () => {
    it('should convert hard break to double space and newline', () => {
      const node: ADFNode = {
        type: 'hardBreak'
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('  \n');
    });

    it('should handle hard break with attributes', () => {
      const node: ADFNode = {
        type: 'hardBreak',
        attrs: {
          customAttr: 'value'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('  \n');
    });

    it('should handle hard break with undefined attrs', () => {
      const node: ADFNode = {
        type: 'hardBreak',
        attrs: undefined
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('  \n');
    });

    it('should always return consistent output', () => {
      const node1: ADFNode = { type: 'hardBreak' };
      const node2: ADFNode = { type: 'hardBreak', attrs: {} };
      const node3: ADFNode = { type: 'hardBreak', attrs: { id: '123' } };

      expect(converter.toMarkdown(node1, mockContext)).toBe('  \n');
      expect(converter.toMarkdown(node2, mockContext)).toBe('  \n');
      expect(converter.toMarkdown(node3, mockContext)).toBe('  \n');
    });
  });
});