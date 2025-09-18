/**
 * @file Tests for MentionConverter
 */

import { describe, it, expect, jest } from '@jest/globals';
import { MentionConverter } from '../../../src/parser/adf-to-markdown/nodes/MentionConverter';
import type { ConversionContext } from '../../../src/parser/types';
import type { ADFNode } from '../../../src/types';

describe('MentionConverter', () => {
  const converter = new MentionConverter();

  const mockContext: ConversionContext = {
    convertChildren: jest.fn(),
    depth: 0,
    options: {}
  };

  describe('nodeType', () => {
    it('should have correct nodeType', () => {
      expect(converter.nodeType).toBe('mention');
    });
  });

  describe('toMarkdown', () => {
    it('should convert mention with id and text', () => {
      const node: ADFNode = {
        type: 'mention',
        attrs: {
          id: 'user123',
          text: 'John Doe'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('[John Doe](adf://mention/user123)<!-- adf:mention attrs=\'{"id":"user123","text":"John Doe"}\' -->');
    });

    it('should convert mention with only id', () => {
      const node: ADFNode = {
        type: 'mention',
        attrs: {
          id: 'user456'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('[@user456](adf://mention/user456)<!-- adf:mention attrs=\'{"id":"user456"}\' -->');
    });

    it('should handle mention without id', () => {
      const node: ADFNode = {
        type: 'mention',
        attrs: {
          text: 'Unknown User'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('[Unknown User](adf://mention/unknown)<!-- adf:mention attrs=\'{"text":"Unknown User"}\' -->');
    });

    it('should handle mention with no attributes', () => {
      const node: ADFNode = {
        type: 'mention',
        attrs: {}
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('[@unknown](adf://mention/unknown)');
    });

    it('should handle mention with undefined attrs', () => {
      const node: ADFNode = {
        type: 'mention'
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('[@unknown](adf://mention/unknown)');
    });

    it('should include userType and accessLevel in metadata', () => {
      const node: ADFNode = {
        type: 'mention',
        attrs: {
          id: 'user789',
          text: 'Jane Smith',
          userType: 'DEFAULT',
          accessLevel: 'CONTAINER'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('[Jane Smith](adf://mention/user789)<!-- adf:mention attrs=\'{"id":"user789","text":"Jane Smith","userType":"DEFAULT","accessLevel":"CONTAINER"}\' -->');
    });

    it('should handle special characters in text', () => {
      const node: ADFNode = {
        type: 'mention',
        attrs: {
          id: 'user999',
          text: 'User with "quotes" & symbols'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('[User with "quotes" & symbols](adf://mention/user999)<!-- adf:mention attrs=\'{"id":"user999","text":"User with \\"quotes\\" & symbols"}\' -->');
    });

    it('should handle empty text attribute', () => {
      const node: ADFNode = {
        type: 'mention',
        attrs: {
          id: 'user101',
          text: ''
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('[@user101](adf://mention/user101)<!-- adf:mention attrs=\'{"id":"user101","text":""}\' -->');
    });

    it('should handle additional custom attributes', () => {
      const node: ADFNode = {
        type: 'mention',
        attrs: {
          id: 'user202',
          text: 'Custom User',
          customField: 'value',
          department: 'Engineering'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('[Custom User](adf://mention/user202)<!-- adf:mention attrs=\'{"id":"user202","text":"Custom User","customField":"value","department":"Engineering"}\' -->');
    });
  });
});