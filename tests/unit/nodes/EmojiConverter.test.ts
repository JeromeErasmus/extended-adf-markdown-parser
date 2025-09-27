/**
 * @file Tests for EmojiConverter
 */

import { describe, it, expect, jest } from '@jest/globals';
import { EmojiConverter } from '../../../src/parser/adf-to-markdown/nodes/EmojiConverter';
import type { ConversionContext } from '../../../src/parser/types';
import type { ADFNode } from '../../../src/types';

describe('EmojiConverter', () => {
  const converter = new EmojiConverter();

  const mockContext: ConversionContext = {
    convertChildren: jest.fn(),
    depth: 0,
    options: {}
  };

  describe('nodeType', () => {
    it('should have correct nodeType', () => {
      expect(converter.nodeType).toBe('emoji');
    });
  });

  describe('toMarkdown', () => {
    it('should convert emoji with text', () => {
      const node: ADFNode = {
        type: 'emoji',
        attrs: {
          shortName: ':grinning:',
          text: '😀'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('😀<!-- adf:emoji attrs=\'{"shortName":":grinning:","text":"😀"}\' -->');
    });

    it('should convert emoji with shortName only', () => {
      const node: ADFNode = {
        type: 'emoji',
        attrs: {
          shortName: 'smile'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe(':smile:<!-- adf:emoji attrs=\'{"shortName":"smile"}\' -->');
    });

    it('should prefer text over shortName when both exist', () => {
      const node: ADFNode = {
        type: 'emoji',
        attrs: {
          shortName: ':smile:',
          text: '😊'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('😊<!-- adf:emoji attrs=\'{"shortName":":smile:","text":"😊"}\' -->');
    });

    it('should handle emoji with no attributes', () => {
      const node: ADFNode = {
        type: 'emoji',
        attrs: {}
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe(':emoji:');
    });

    it('should handle emoji with undefined attrs', () => {
      const node: ADFNode = {
        type: 'emoji'
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe(':emoji:');
    });

    it('should handle emoji with id but no shortName or text', () => {
      const node: ADFNode = {
        type: 'emoji',
        attrs: {
          id: '1f44d'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe(':emoji:');
    });

    it('should handle empty shortName', () => {
      const node: ADFNode = {
        type: 'emoji',
        attrs: {
          shortName: ''
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe(':emoji:');
    });

    it('should handle empty text', () => {
      const node: ADFNode = {
        type: 'emoji',
        attrs: {
          text: ''
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe(':emoji:');
    });

    it('should handle shortName with special characters', () => {
      const node: ADFNode = {
        type: 'emoji',
        attrs: {
          shortName: ':thumbs_up:',
          text: '👍'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('👍<!-- adf:emoji attrs=\'{"shortName":":thumbs_up:","text":"👍"}\' -->');
    });

    it('should include additional attributes in metadata', () => {
      const node: ADFNode = {
        type: 'emoji',
        attrs: {
          shortName: ':heart:',
          text: '❤️',
          skinTone: 'default',
          customField: 'value'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('❤️<!-- adf:emoji attrs=\'{"shortName":":heart:","text":"❤️","skinTone":"default","customField":"value"}\' -->');
    });

    it('should handle Unicode emoji characters', () => {
      const node: ADFNode = {
        type: 'emoji',
        attrs: {
          shortName: ':tada:',
          text: '🎉'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('🎉<!-- adf:emoji attrs=\'{"shortName":":tada:","text":"🎉"}\' -->');
    });

    it('should handle skin tone variations', () => {
      const node: ADFNode = {
        type: 'emoji',
        attrs: {
          shortName: ':wave::skin-tone-4:',
          text: '👋🏽',
          skinTone: '3'
        }
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe('👋🏽<!-- adf:emoji attrs=\'{"shortName":":wave::skin-tone-4:","text":"👋🏽","skinTone":"3"}\' -->');
    });

    it('should not include metadata when no attributes', () => {
      const node: ADFNode = {
        type: 'emoji',
        attrs: undefined
      };

      const result = converter.toMarkdown(node, mockContext);
      expect(result).toBe(':emoji:');
      expect(result).not.toContain('<!-- adf:emoji');
    });
  });
});