/**
 * @file Tests for DateConverter
 */

import { describe, it, expect, jest } from '@jest/globals';
import { DateConverter } from '../../../src/parser/adf-to-markdown/nodes/DateConverter';
import type { ConversionContext } from '../../../src/parser/types';
import type { ADFNode } from '../../../src/types';

describe('DateConverter', () => {
  const converter = new DateConverter();

  const mockContext: ConversionContext = {
    convertChildren: jest.fn(),
    depth: 0,
    options: {}
  };

  describe('nodeType', () => {
    it('should have correct nodeType', () => {
      expect(converter.nodeType).toBe('date');
    });
  });

  describe('toMarkdown', () => {
    it('should convert date with timestamp', () => {
      const timestamp = '1703462400000'; // 2023-12-25
      const node: ADFNode = {
        type: 'date',
        attrs: {
          timestamp
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe(`[2023-12-25](adf://date/${timestamp})<!-- adf:date attrs='{"timestamp":"${timestamp}"}' -->`);
    });

    it('should handle date without timestamp', () => {
      const node: ADFNode = {
        type: 'date',
        attrs: {}
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('[Date]');
    });

    it('should handle date with undefined attrs', () => {
      const node: ADFNode = {
        type: 'date'
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('[Date]');
    });

    it('should format timestamp correctly', () => {
      const timestamp = '1609459200000'; // 2021-01-01
      const node: ADFNode = {
        type: 'date',
        attrs: {
          timestamp
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe(`[2021-01-01](adf://date/${timestamp})<!-- adf:date attrs='{"timestamp":"${timestamp}"}' -->`);
    });

    it('should handle Unix timestamp in seconds', () => {
      const timestamp = '1609459200'; // 2021-01-01 in seconds - JavaScript Date interprets this as milliseconds, so it shows 1970
      const node: ADFNode = {
        type: 'date',
        attrs: {
          timestamp
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      // JavaScript Date treats this as milliseconds since epoch, so it's actually January 19, 1970
      expect(result).toBe(`[1970-01-19](adf://date/${timestamp})<!-- adf:date attrs='{"timestamp":"${timestamp}"}' -->`);
    });

    it('should include additional attributes in metadata', () => {
      const node: ADFNode = {
        type: 'date',
        attrs: {
          timestamp: '1703462400000',
          format: 'DD/MM/YYYY',
          timezone: 'UTC',
          customField: 'value'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('[2023-12-25](adf://date/1703462400000)<!-- adf:date attrs=\'{"timestamp":"1703462400000","format":"DD/MM/YYYY","timezone":"UTC","customField":"value"}\' -->');
    });

    it('should handle invalid timestamp gracefully', () => {
      const node: ADFNode = {
        type: 'date',
        attrs: {
          timestamp: 'invalid'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('[Invalid Date](adf://date/invalid)<!-- adf:date attrs=\'{"timestamp":"invalid"}\' -->');
    });

    it('should handle empty timestamp', () => {
      const node: ADFNode = {
        type: 'date',
        attrs: {
          timestamp: ''
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('[Date]');
    });

    it('should handle numeric timestamp', () => {
      const timestamp = 1703462400000; // Number instead of string
      const node: ADFNode = {
        type: 'date',
        attrs: {
          timestamp
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe(`[2023-12-25](adf://date/${timestamp})<!-- adf:date attrs='{"timestamp":1703462400000}' -->`);
    });

    it('should handle leap year dates', () => {
      const timestamp = '1582934400000'; // 2020-02-29 (leap year)
      const node: ADFNode = {
        type: 'date',
        attrs: {
          timestamp
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe(`[2020-02-29](adf://date/${timestamp})<!-- adf:date attrs='{"timestamp":"${timestamp}"}' -->`);
    });
  });
});