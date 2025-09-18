/**
 * @file Tests for ConverterRegistry
 */

import { describe, it, expect, jest } from '@jest/globals';
import { ConverterRegistry } from '../../../src/parser/ConverterRegistry';
import type { NodeConverter, MarkConverter } from '../../../src/parser/types';

describe('ConverterRegistry', () => {
  let registry: ConverterRegistry;

  beforeEach(() => {
    registry = new ConverterRegistry();
  });

  describe('Node Converters', () => {
    const mockNodeConverter: NodeConverter = {
      nodeType: 'test',
      toMarkdown: jest.fn().mockReturnValue('test output')
    };

    it('should register a node converter', () => {
      registry.registerNode(mockNodeConverter);
      const converter = registry.getNodeConverter('test');
      expect(converter).toBe(mockNodeConverter);
    });

    it('should register multiple node converters', () => {
      const converter1: NodeConverter = { nodeType: 'type1', toMarkdown: jest.fn() };
      const converter2: NodeConverter = { nodeType: 'type2', toMarkdown: jest.fn() };
      
      registry.registerNodes([converter1, converter2]);
      
      expect(registry.getNodeConverter('type1')).toBe(converter1);
      expect(registry.getNodeConverter('type2')).toBe(converter2);
    });

    it('should return fallback converter for unknown node type', () => {
      const converter = registry.getNodeConverter('unknown');
      expect(converter.nodeType).toBe('unknown');
      
      const testNode = { type: 'unknown', someProperty: 'value' };
      const result = converter.toMarkdown(testNode, {} as any);
      
      expect(result).toContain('<!-- adf:unknown type="unknown" -->');
      expect(result).toContain(JSON.stringify(testNode, null, 2));
      expect(result).toContain('<!-- /adf:unknown -->');
    });
  });

  describe('Mark Converters', () => {
    const mockMarkConverter: MarkConverter = {
      markType: 'testMark',
      toMarkdown: jest.fn().mockReturnValue('marked text')
    };

    it('should register a mark converter', () => {
      registry.registerMark(mockMarkConverter);
      const converter = registry.getMarkConverter('testMark');
      expect(converter).toBe(mockMarkConverter);
    });

    it('should register multiple mark converters', () => {
      const converter1: MarkConverter = { markType: 'mark1', toMarkdown: jest.fn() };
      const converter2: MarkConverter = { markType: 'mark2', toMarkdown: jest.fn() };
      
      registry.registerMarks([converter1, converter2]);
      
      expect(registry.getMarkConverter('mark1')).toBe(converter1);
      expect(registry.getMarkConverter('mark2')).toBe(converter2);
    });

    it('should return fallback converter for unknown mark type', () => {
      const converter = registry.getMarkConverter('unknownMark');
      expect(converter.markType).toBe('unknown');
      
      const testMark = { type: 'unknownMark', attrs: { style: 'special' } };
      const result = converter.toMarkdown('test text', testMark, {} as any);
      
      expect(result).toBe('test text<!-- adf:mark type="unknownMark" attrs=\'{"style":"special"}\' -->');
    });

    it('should handle fallback converter with empty attrs', () => {
      const converter = registry.getMarkConverter('unknownMark');
      
      const testMark = { type: 'unknownMark' };
      const result = converter.toMarkdown('test text', testMark, {} as any);
      
      expect(result).toBe('test text<!-- adf:mark type="unknownMark" attrs=\'{}\' -->');
    });
  });

  describe('Registry State', () => {
    it('should maintain separate node and mark converter maps', () => {
      const nodeConverter: NodeConverter = { nodeType: 'paragraph', toMarkdown: jest.fn() };
      const markConverter: MarkConverter = { markType: 'paragraph', toMarkdown: jest.fn() };
      
      registry.registerNode(nodeConverter);
      registry.registerMark(markConverter);
      
      expect(registry.getNodeConverter('paragraph')).toBe(nodeConverter);
      expect(registry.getMarkConverter('paragraph')).toBe(markConverter);
    });

    it('should override existing converters when registered again', () => {
      const converter1: NodeConverter = { nodeType: 'test', toMarkdown: jest.fn() };
      const converter2: NodeConverter = { nodeType: 'test', toMarkdown: jest.fn() };
      
      registry.registerNode(converter1);
      registry.registerNode(converter2);
      
      expect(registry.getNodeConverter('test')).toBe(converter2);
    });
  });
});