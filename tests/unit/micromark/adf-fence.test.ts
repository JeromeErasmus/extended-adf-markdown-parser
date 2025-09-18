/**
 * @file adf-fence.test.ts
 * @description Tests for ADF fence micromark extension
 */

import { describe, it, expect } from '@jest/globals';
import { parseAdfAttributes, validateAdfContext } from '../../../src/parser/micromark/adf-fence.js';

describe('ADF Fence Micromark Extension', () => {
  describe('parseAdfAttributes', () => {
    it('should parse simple key=value attributes', () => {
      const result = parseAdfAttributes('type=info layout=wide');
      expect(result).toEqual({
        type: 'info',
        layout: 'wide'
      });
    });

    it('should parse quoted attribute values', () => {
      const result = parseAdfAttributes('title="My Panel" type=warning');
      expect(result).toEqual({
        title: 'My Panel',
        type: 'warning'
      });
    });

    it('should parse numeric attribute values', () => {
      const result = parseAdfAttributes('width=500 height=300.5');
      expect(result).toEqual({
        width: 500,
        height: 300.5
      });
    });

    it('should parse boolean attribute values', () => {
      const result = parseAdfAttributes('enabled=true disabled=false');
      expect(result).toEqual({
        enabled: true,
        disabled: false
      });
    });

    it('should handle single-quoted values', () => {
      const result = parseAdfAttributes("title='Single Quoted' type=info");
      expect(result).toEqual({
        title: 'Single Quoted',
        type: 'info'
      });
    });

    it('should handle empty attribute string', () => {
      const result = parseAdfAttributes('');
      expect(result).toEqual({});
    });

    it('should handle complex mixed attributes', () => {
      const result = parseAdfAttributes('type=info width=500 title="Complex Panel" enabled=true');
      expect(result).toEqual({
        type: 'info',
        width: 500,
        title: 'Complex Panel',
        enabled: true
      });
    });

    it('should handle malformed attributes gracefully', () => {
      const result = parseAdfAttributes('type=info invalid-attr layout=wide');
      expect(result).toEqual({
        type: 'info',
        layout: 'wide'
      });
    });

    it('should handle attributes with spaces in values', () => {
      const result = parseAdfAttributes('title="Panel with spaces" type=note');
      expect(result).toEqual({
        title: 'Panel with spaces',
        type: 'note'
      });
    });

    it('should handle URL values', () => {
      const result = parseAdfAttributes('href="https://example.com" title="External Link"');
      expect(result).toEqual({
        href: 'https://example.com',
        title: 'External Link'
      });
    });
  });

  describe('validateAdfContext', () => {
    describe('panel validation', () => {
      it('should validate panel with valid type', () => {
        expect(validateAdfContext('panel', { type: 'info' })).toBe(true);
        expect(validateAdfContext('panel', { type: 'warning' })).toBe(true);
        expect(validateAdfContext('panel', { type: 'error' })).toBe(true);
        expect(validateAdfContext('panel', { type: 'success' })).toBe(true);
        expect(validateAdfContext('panel', { type: 'note' })).toBe(true);
      });

      it('should validate panel without type attribute', () => {
        expect(validateAdfContext('panel', {})).toBe(true);
      });

      it('should reject panel with invalid type', () => {
        expect(validateAdfContext('panel', { type: 'invalid' })).toBe(false);
      });

      it('should validate panel with additional valid attributes', () => {
        expect(validateAdfContext('panel', { 
          type: 'info',
          title: 'Custom Title',
          enabled: true
        })).toBe(true);
      });
    });

    describe('expand validation', () => {
      it('should validate expand blocks', () => {
        expect(validateAdfContext('expand', {})).toBe(true);
        expect(validateAdfContext('expand', { title: 'Click to expand' })).toBe(true);
      });

      it('should validate nested expand blocks', () => {
        expect(validateAdfContext('nestedExpand', {})).toBe(true);
        expect(validateAdfContext('nestedExpand', { title: 'Nested expand' })).toBe(true);
      });
    });

    describe('mediaSingle validation', () => {
      it('should validate mediaSingle with valid layout', () => {
        expect(validateAdfContext('mediaSingle', { layout: 'center' })).toBe(true);
        expect(validateAdfContext('mediaSingle', { layout: 'align-start' })).toBe(true);
        expect(validateAdfContext('mediaSingle', { layout: 'align-end' })).toBe(true);
        expect(validateAdfContext('mediaSingle', { layout: 'wide' })).toBe(true);
        expect(validateAdfContext('mediaSingle', { layout: 'full-width' })).toBe(true);
      });

      it('should validate mediaSingle without layout', () => {
        expect(validateAdfContext('mediaSingle', {})).toBe(true);
      });

      it('should reject mediaSingle with invalid layout', () => {
        expect(validateAdfContext('mediaSingle', { layout: 'invalid' })).toBe(false);
      });

      it('should validate mediaSingle with width attribute', () => {
        expect(validateAdfContext('mediaSingle', { 
          layout: 'center',
          width: 500 
        })).toBe(true);
      });
    });

    describe('mediaGroup validation', () => {
      it('should validate mediaGroup blocks', () => {
        expect(validateAdfContext('mediaGroup', {})).toBe(true);
        expect(validateAdfContext('mediaGroup', { custom: 'value' })).toBe(true);
      });
    });

    describe('unknown node types', () => {
      it('should reject unknown node types', () => {
        expect(validateAdfContext('unknown', {})).toBe(false);
        expect(validateAdfContext('customNode', { type: 'value' })).toBe(false);
      });
    });
  });
});