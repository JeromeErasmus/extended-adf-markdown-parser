/**
 * @file Tests for InlineCardConverter
 */

import { describe, it, expect, jest } from '@jest/globals';
import { InlineCardConverter } from '../../../src/parser/adf-to-markdown/nodes/InlineCardConverter';
import type { ConversionContext } from '../../../src/parser/types';
import type { ADFNode } from '../../../src/types';

describe('InlineCardConverter', () => {
  const converter = new InlineCardConverter();

  const mockContext: ConversionContext = {
    convertChildren: jest.fn(),
    depth: 0,
    options: {}
  };

  describe('nodeType', () => {
    it('should have correct nodeType', () => {
      expect(converter.nodeType).toBe('inlineCard');
    });
  });

  describe('toMarkdown', () => {
    it('should convert inline card with URL and title from data', () => {
      const node: ADFNode = {
        type: 'inlineCard',
        attrs: {
          url: 'https://example.com',
          data: {
            title: 'Example Website'
          }
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('[Example Website](adf://card/https%3A%2F%2Fexample.com)<!-- adf:inlineCard attrs=\'{"url":"https://example.com","data":{"title":"Example Website"}}\' -->');
    });

    it('should use name from data when title not available', () => {
      const node: ADFNode = {
        type: 'inlineCard',
        attrs: {
          url: 'https://example.com/page',
          data: {
            name: 'Example Page'
          }
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('[Example Page](adf://card/https%3A%2F%2Fexample.com%2Fpage)<!-- adf:inlineCard attrs=\'{"url":"https://example.com/page","data":{"name":"Example Page"}}\' -->');
    });

    it('should use default "Card" text when no data available', () => {
      const node: ADFNode = {
        type: 'inlineCard',
        attrs: {
          url: 'https://example.com'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('[Card](adf://card/https%3A%2F%2Fexample.com)<!-- adf:inlineCard attrs=\'{"url":"https://example.com"}\' -->');
    });

    it('should handle card without URL', () => {
      const node: ADFNode = {
        type: 'inlineCard',
        attrs: {
          data: {
            title: 'Some Title'
          }
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('[Card]');
    });

    it('should handle card with no attributes', () => {
      const node: ADFNode = {
        type: 'inlineCard',
        attrs: {}
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('[Card]');
    });

    it('should handle card with undefined attrs', () => {
      const node: ADFNode = {
        type: 'inlineCard'
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('[Card]');
    });

    it('should handle empty URL', () => {
      const node: ADFNode = {
        type: 'inlineCard',
        attrs: {
          url: ''
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('[Card]');
    });

    it('should properly encode complex URLs', () => {
      const complexUrl = 'https://example.com/path?param=value&other=test#anchor';
      const node: ADFNode = {
        type: 'inlineCard',
        attrs: {
          url: complexUrl,
          data: {
            title: 'Complex URL'
          }
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('[Complex URL](adf://card/https%3A%2F%2Fexample.com%2Fpath%3Fparam%3Dvalue%26other%3Dtest%23anchor)<!-- adf:inlineCard attrs=\'{"url":"https://example.com/path?param=value&other=test#anchor","data":{"title":"Complex URL"}}\' -->');
    });

    it('should handle data with additional properties', () => {
      const node: ADFNode = {
        type: 'inlineCard',
        attrs: {
          url: 'https://jira.atlassian.com/browse/ISSUE-123',
          data: {
            title: 'ISSUE-123: Bug fix',
            description: 'Fix critical bug in parser',
            status: 'Done',
            assignee: 'john.doe'
          }
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('[ISSUE-123: Bug fix](adf://card/https%3A%2F%2Fjira.atlassian.com%2Fbrowse%2FISSUE-123)<!-- adf:inlineCard attrs=\'{"url":"https://jira.atlassian.com/browse/ISSUE-123","data":{"title":"ISSUE-123: Bug fix","description":"Fix critical bug in parser","status":"Done","assignee":"john.doe"}}\' -->');
    });

    it('should handle empty data object', () => {
      const node: ADFNode = {
        type: 'inlineCard',
        attrs: {
          url: 'https://example.com',
          data: {}
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('[Card](adf://card/https%3A%2F%2Fexample.com)<!-- adf:inlineCard attrs=\'{"url":"https://example.com","data":{}}\' -->');
    });

    it('should handle additional attributes', () => {
      const node: ADFNode = {
        type: 'inlineCard',
        attrs: {
          url: 'https://example.com',
          data: {
            title: 'Example'
          },
          customField: 'value',
          provider: 'web-link'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('[Example](adf://card/https%3A%2F%2Fexample.com)<!-- adf:inlineCard attrs=\'{"url":"https://example.com","data":{"title":"Example"},"customField":"value","provider":"web-link"}\' -->');
    });

    it('should handle special characters in title', () => {
      const node: ADFNode = {
        type: 'inlineCard',
        attrs: {
          url: 'https://example.com',
          data: {
            title: 'Title with "quotes" & symbols'
          }
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('[Title with "quotes" & symbols](adf://card/https%3A%2F%2Fexample.com)<!-- adf:inlineCard attrs=\'{"url":"https://example.com","data":{"title":"Title with \\"quotes\\" & symbols"}}\' -->');
    });

    it('should not include metadata when no attributes', () => {
      const node: ADFNode = {
        type: 'inlineCard',
        attrs: undefined
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('[Card]');
      expect(result).not.toContain('<!-- adf:inlineCard');
    });
  });
});