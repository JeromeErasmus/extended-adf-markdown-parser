/**
 * @file Tests for TextColorConverter
 */

import { describe, it, expect, jest } from '@jest/globals';
import { TextColorConverter } from '../../../src/parser/adf-to-markdown/marks/TextColorConverter';
import type { ConversionContext } from '../../../src/parser/types';
import type { TextColorMark } from '../../../src/types';

describe('TextColorConverter', () => {
  const converter = new TextColorConverter();

  const mockContext: ConversionContext = {
    convertChildren: jest.fn(),
    depth: 0,
    options: {
      registry: {
        getNodeConverter: jest.fn()
      } as any
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('markType', () => {
    it('should have correct markType', () => {
      expect(converter.markType).toBe('textColor');
    });
  });

  describe('toMarkdown', () => {
    it('should convert basic text color', () => {
      const mark: TextColorMark = {
        type: 'textColor',
        attrs: {
          color: '#ff5630'
        }
      };

      const result = converter.toMarkdown('colored text', mark, mockContext);
      expect(result).toBe('<span style="color: #ff5630">colored text</span>');
    });

    it('should handle hex colors', () => {
      const mark: TextColorMark = {
        type: 'textColor',
        attrs: {
          color: '#0052cc'
        }
      };

      const result = converter.toMarkdown('blue text', mark, mockContext);
      expect(result).toBe('<span style="color: #0052cc">blue text</span>');
    });

    it('should handle RGB colors', () => {
      const mark: TextColorMark = {
        type: 'textColor',
        attrs: {
          color: 'rgb(255, 0, 0)'
        }
      };

      const result = converter.toMarkdown('red text', mark, mockContext);
      expect(result).toBe('<span style="color: rgb(255, 0, 0)">red text</span>');
    });

    it('should handle named colors', () => {
      const mark: TextColorMark = {
        type: 'textColor',
        attrs: {
          color: 'green'
        }
      };

      const result = converter.toMarkdown('green text', mark, mockContext);
      expect(result).toBe('<span style="color: green">green text</span>');
    });

    it('should return plain text when no color specified', () => {
      const mark: TextColorMark = {
        type: 'textColor'
      } as TextColorMark;

      const result = converter.toMarkdown('plain text', mark, mockContext);
      expect(result).toBe('plain text');
    });

    it('should return plain text when color is undefined', () => {
      const mark: TextColorMark = {
        type: 'textColor',
        attrs: {} as any
      };

      const result = converter.toMarkdown('plain text', mark, mockContext);
      expect(result).toBe('plain text');
    });

    it('should handle empty text', () => {
      const mark: TextColorMark = {
        type: 'textColor',
        attrs: {
          color: '#000000'
        }
      };

      const result = converter.toMarkdown('', mark, mockContext);
      expect(result).toBe('<span style="color: #000000"></span>');
    });

    it('should include custom attributes in metadata', () => {
      const mark: TextColorMark = {
        type: 'textColor',
        attrs: {
          color: '#ff5630',
          background: '#f4f5f7',
          opacity: 0.8
        } as any
      };

      const result = converter.toMarkdown('styled text', mark, mockContext);
      expect(result).toBe('<span style="color: #ff5630">styled text</span><!-- adf:textColor attrs=\'{"background":"#f4f5f7","opacity":0.8}\' -->');
    });

    it('should not include metadata when only color attribute present', () => {
      const mark: TextColorMark = {
        type: 'textColor',
        attrs: {
          color: '#36b37e'
        }
      };

      const result = converter.toMarkdown('simple colored text', mark, mockContext);
      expect(result).toBe('<span style="color: #36b37e">simple colored text</span>');
    });

    it('should handle multi-word text', () => {
      const mark: TextColorMark = {
        type: 'textColor',
        attrs: {
          color: '#ff8b00'
        }
      };

      const result = converter.toMarkdown('multiple words in orange', mark, mockContext);
      expect(result).toBe('<span style="color: #ff8b00">multiple words in orange</span>');
    });

    it('should handle text with HTML characters', () => {
      const mark: TextColorMark = {
        type: 'textColor',
        attrs: {
          color: '#de350b'
        }
      };

      const result = converter.toMarkdown('text with <div> & "quotes"', mark, mockContext);
      expect(result).toBe('<span style="color: #de350b">text with <div> & "quotes"</span>');
    });

    it('should handle text with newlines', () => {
      const mark: TextColorMark = {
        type: 'textColor',
        attrs: {
          color: '#6554c0'
        }
      };

      const result = converter.toMarkdown('line 1\nline 2', mark, mockContext);
      expect(result).toBe('<span style="color: #6554c0">line 1\nline 2</span>');
    });

    it('should handle RGBA colors', () => {
      const mark: TextColorMark = {
        type: 'textColor',
        attrs: {
          color: 'rgba(255, 86, 48, 0.5)'
        }
      };

      const result = converter.toMarkdown('semi-transparent text', mark, mockContext);
      expect(result).toBe('<span style="color: rgba(255, 86, 48, 0.5)">semi-transparent text</span>');
    });

    it('should handle HSL colors', () => {
      const mark: TextColorMark = {
        type: 'textColor',
        attrs: {
          color: 'hsl(216, 100%, 40%)'
        }
      };

      const result = converter.toMarkdown('HSL colored text', mark, mockContext);
      expect(result).toBe('<span style="color: hsl(216, 100%, 40%)">HSL colored text</span>');
    });

    it('should handle numeric and boolean custom attributes', () => {
      const mark: TextColorMark = {
        type: 'textColor',
        attrs: {
          color: '#42526e',
          weight: 700,
          italic: true,
          underline: false
        } as any
      };

      const result = converter.toMarkdown('complex styled text', mark, mockContext);
      expect(result).toBe('<span style="color: #42526e">complex styled text</span><!-- adf:textColor attrs=\'{"weight":700,"italic":true,"underline":false}\' -->');
    });

    it('should handle single character text', () => {
      const mark: TextColorMark = {
        type: 'textColor',
        attrs: {
          color: '#ff0000'
        }
      };

      const result = converter.toMarkdown('x', mark, mockContext);
      expect(result).toBe('<span style="color: #ff0000">x</span>');
    });

    it('should handle text with markdown characters', () => {
      const mark: TextColorMark = {
        type: 'textColor',
        attrs: {
          color: '#00b8d9'
        }
      };

      const result = converter.toMarkdown('text with **bold** and *italic*', mark, mockContext);
      expect(result).toBe('<span style="color: #00b8d9">text with **bold** and *italic*</span>');
    });

    it('should handle text with spaces only', () => {
      const mark: TextColorMark = {
        type: 'textColor',
        attrs: {
          color: '#97a0af'
        }
      };

      const result = converter.toMarkdown('   ', mark, mockContext);
      expect(result).toBe('<span style="color: #97a0af">   </span>');
    });

    it('should handle complex custom attributes structure', () => {
      const mark: TextColorMark = {
        type: 'textColor',
        attrs: {
          color: '#253858',
          theme: 'dark',
          animations: {
            fade: true,
            duration: 300
          },
          accessibility: {
            highContrast: false
          }
        } as any
      };

      const result = converter.toMarkdown('theme styled text', mark, mockContext);
      expect(result).toBe('<span style="color: #253858">theme styled text</span><!-- adf:textColor attrs=\'{"theme":"dark","animations":{"fade":true,"duration":300},"accessibility":{"highContrast":false}}\' -->');
    });
  });
});