/**
 * @file metadata-comments.test.ts
 * @description Unit tests for metadata comment parsing utilities
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import type { Root, Parent, Node } from 'mdast';
import {
  isAdfMetadataComment,
  parseAdfMetadataComment,
  findMetadataTarget,
  processMetadataComments,
  getNodeMetadata,
  applyMetadataToAdfNode,
  generateMetadataComment,
  validateMetadataComment,
  type AdfMetadata
} from '../../../src/utils/metadata-comments.js';

describe('Metadata Comments', () => {
  describe('isAdfMetadataComment', () => {
    it('should detect simple ADF metadata comments', () => {
      expect(isAdfMetadataComment('<!-- adf:paragraph -->')).toBe(true);
      expect(isAdfMetadataComment('<!-- adf:heading -->')).toBe(true);
      expect(isAdfMetadataComment('<!-- adf:panel -->')).toBe(true);
    });

    it('should detect ADF metadata comments with attributes', () => {
      expect(isAdfMetadataComment('<!-- adf:paragraph attrs=\'{"textAlign":"center"}\' -->')).toBe(true);
      expect(isAdfMetadataComment('<!-- adf:heading attrs=\'{"level":2}\' -->')).toBe(true);
      expect(isAdfMetadataComment('<!-- adf:panel attrs=\'{"panelType":"warning"}\' -->')).toBe(true);
    });

    it('should detect closing ADF metadata comments', () => {
      expect(isAdfMetadataComment('<!-- /adf:paragraph -->')).toBe(true);
      expect(isAdfMetadataComment('<!-- /adf:heading -->')).toBe(true);
      expect(isAdfMetadataComment('<!-- /adf:panel -->')).toBe(true);
    });

    it('should reject non-ADF comments', () => {
      expect(isAdfMetadataComment('<!-- This is just a comment -->')).toBe(false);
      expect(isAdfMetadataComment('<!-- HTML comment -->')).toBe(false);
      expect(isAdfMetadataComment('<!-- not-adf:paragraph -->')).toBe(false);
    });

    it('should reject malformed comments', () => {
      expect(isAdfMetadataComment('<!-- adf: -->')).toBe(false);
      expect(isAdfMetadataComment('<!-- adf:123invalid -->')).toBe(false);
      expect(isAdfMetadataComment('adf:paragraph')).toBe(false);
    });
  });

  describe('parseAdfMetadataComment', () => {
    it('should parse simple metadata comments', () => {
      const result = parseAdfMetadataComment('<!-- adf:paragraph -->');
      expect(result).toEqual({
        nodeType: 'paragraph',
        raw: '<!-- adf:paragraph -->'
      });
    });

    it('should parse metadata comments with attributes', () => {
      const result = parseAdfMetadataComment('<!-- adf:paragraph attrs=\'{"textAlign":"center"}\' -->');
      expect(result).toEqual({
        nodeType: 'paragraph',
        attrs: { textAlign: 'center' },
        raw: '<!-- adf:paragraph attrs=\'{"textAlign":"center"}\' -->'
      });
    });

    it('should parse complex attributes', () => {
      const result = parseAdfMetadataComment('<!-- adf:panel attrs=\'{"panelType":"warning","backgroundColor":"#fff3cd"}\' -->');
      expect(result).toEqual({
        nodeType: 'panel',
        attrs: { panelType: 'warning', backgroundColor: '#fff3cd' },
        raw: '<!-- adf:panel attrs=\'{"panelType":"warning","backgroundColor":"#fff3cd"}\' -->'
      });
    });

    it('should handle invalid JSON gracefully', () => {
      const result = parseAdfMetadataComment('<!-- adf:paragraph attrs=\'{invalid-json}\' -->');
      expect(result).toEqual({
        nodeType: 'paragraph',
        raw: '<!-- adf:paragraph attrs=\'{invalid-json}\' -->'
      });
    });

    it('should parse closing comments', () => {
      const result = parseAdfMetadataComment('<!-- /adf:paragraph -->');
      expect(result).toEqual({
        nodeType: 'paragraph',
        attrs: { closing: true },
        raw: '<!-- /adf:paragraph -->'
      });
    });

    it('should return null for non-ADF comments', () => {
      expect(parseAdfMetadataComment('<!-- regular comment -->')).toBeNull();
      expect(parseAdfMetadataComment('<!-- not-adf:paragraph -->')).toBeNull();
    });
  });

  describe('findMetadataTarget', () => {
    it('should find next sibling as target (primary strategy)', () => {
      const parent: Parent = {
        type: 'root',
        children: [
          { type: 'html', value: '<!-- adf:paragraph -->' },
          { type: 'paragraph', children: [] }
        ]
      };

      const target = findMetadataTarget(parent, 0);
      expect(target).toBe(parent.children[1]);
    });

    it('should find previous sibling as target when no next sibling', () => {
      const parent: Parent = {
        type: 'root',
        children: [
          { type: 'paragraph', children: [] },
          { type: 'html', value: '<!-- adf:paragraph -->' }
        ]
      };

      const target = findMetadataTarget(parent, 1);
      expect(target).toBe(parent.children[0]);
    });

    it('should find parent as target when no siblings available', () => {
      const parent: Parent = {
        type: 'blockquote',
        children: [
          { type: 'html', value: '<!-- adf:blockquote -->' }
        ]
      };

      const target = findMetadataTarget(parent, 0);
      expect(target).toBe(parent);
    });

    it('should skip over multiple metadata comments to find target', () => {
      const parent: Parent = {
        type: 'root',
        children: [
          { type: 'html', value: '<!-- adf:paragraph attrs=\'{"textAlign":"center"}\' -->' },
          { type: 'html', value: '<!-- adf:paragraph attrs=\'{"backgroundColor":"#f0f0f0"}\' -->' },
          { type: 'paragraph', children: [] }
        ]
      };

      const target1 = findMetadataTarget(parent, 0);
      expect(target1).toBe(parent.children[2]); // Should skip the second comment

      const target2 = findMetadataTarget(parent, 1);
      expect(target2).toBe(parent.children[2]); // Should also target the paragraph
    });

    it('should return null when no suitable target found', () => {
      const parent: Parent = {
        type: 'root',
        children: [
          { type: 'html', value: '<!-- adf:paragraph -->' },
          { type: 'html', value: '<!-- not-adf:comment -->' } // Non-ADF comment should be ignored
        ]
      };

      const target = findMetadataTarget(parent, 0);
      expect(target).toBe(parent.children[1]); // Should find the non-ADF comment as target
    });
  });

  describe('processMetadataComments', () => {
    it('should associate metadata with target nodes and remove comments', () => {
      const tree: Root = {
        type: 'root',
        children: [
          { 
            type: 'html', 
            value: '<!-- adf:heading attrs=\'{"id":"custom-id"}\' -->' 
          },
          { 
            type: 'heading', 
            depth: 1, 
            children: [{ type: 'text', value: 'Title' }] 
          },
          { 
            type: 'paragraph',
            children: [{ type: 'text', value: 'Content' }]
          }
        ]
      };

      const processed = processMetadataComments(tree);

      // Comment should be removed
      expect(processed.children).toHaveLength(2);
      expect(processed.children[0].type).toBe('heading');
      expect(processed.children[1].type).toBe('paragraph');

      // Metadata should be attached to heading
      const heading = processed.children[0];
      expect(heading.data?.adfMetadata).toEqual([{
        nodeType: 'heading',
        attrs: { id: 'custom-id' },
        raw: '<!-- adf:heading attrs=\'{"id":"custom-id"}\' -->'
      }]);
    });

    it('should handle multiple metadata comments for the same node', () => {
      const tree: Root = {
        type: 'root',
        children: [
          { 
            type: 'html', 
            value: '<!-- adf:paragraph attrs=\'{"textAlign":"center"}\' -->' 
          },
          { 
            type: 'html', 
            value: '<!-- adf:paragraph attrs=\'{"backgroundColor":"#f0f0f0"}\' -->' 
          },
          { 
            type: 'paragraph',
            children: [{ type: 'text', value: 'Content' }]
          }
        ]
      };

      const processed = processMetadataComments(tree);

      expect(processed.children).toHaveLength(1);
      const paragraph = processed.children[0];
      expect(paragraph.data?.adfMetadata).toHaveLength(2);
      expect(paragraph.data?.adfMetadata[0].attrs).toEqual({ textAlign: 'center' });
      expect(paragraph.data?.adfMetadata[1].attrs).toEqual({ backgroundColor: '#f0f0f0' });
    });
  });

  describe('getNodeMetadata', () => {
    it('should return metadata from node data', () => {
      const node: Node = {
        type: 'paragraph',
        data: {
          adfMetadata: [
            {
              nodeType: 'paragraph',
              attrs: { textAlign: 'center' },
              raw: '<!-- adf:paragraph attrs=\'{"textAlign":"center"}\' -->'
            }
          ]
        }
      };

      const metadata = getNodeMetadata(node);
      expect(metadata).toHaveLength(1);
      expect(metadata[0].attrs).toEqual({ textAlign: 'center' });
    });

    it('should return empty array when no metadata', () => {
      const node: Node = { type: 'paragraph' };
      expect(getNodeMetadata(node)).toEqual([]);

      const nodeWithEmptyData: Node = { type: 'paragraph', data: {} };
      expect(getNodeMetadata(nodeWithEmptyData)).toEqual([]);
    });

    it('should handle single metadata object (not array)', () => {
      const node: Node = {
        type: 'paragraph',
        data: {
          adfMetadata: {
            nodeType: 'paragraph',
            attrs: { textAlign: 'center' },
            raw: '<!-- adf:paragraph -->'
          }
        }
      };

      const metadata = getNodeMetadata(node);
      expect(metadata).toHaveLength(1);
      expect(metadata[0].attrs).toEqual({ textAlign: 'center' });
    });
  });

  describe('applyMetadataToAdfNode', () => {
    it('should apply metadata attributes to ADF node', () => {
      const adfNode = { type: 'paragraph', content: [] };
      const metadata: AdfMetadata[] = [
        {
          nodeType: 'paragraph',
          attrs: { textAlign: 'center' },
          raw: '<!-- adf:paragraph -->'
        }
      ];

      const result = applyMetadataToAdfNode(adfNode, metadata);
      expect(result).toEqual({
        type: 'paragraph',
        content: [],
        attrs: { textAlign: 'center' }
      });
    });

    it('should merge multiple metadata attributes', () => {
      const adfNode = { type: 'paragraph', attrs: { id: 'existing' }, content: [] };
      const metadata: AdfMetadata[] = [
        {
          nodeType: 'paragraph',
          attrs: { textAlign: 'center' },
          raw: '<!-- comment1 -->'
        },
        {
          nodeType: 'paragraph',
          attrs: { backgroundColor: '#f0f0f0' },
          raw: '<!-- comment2 -->'
        }
      ];

      const result = applyMetadataToAdfNode(adfNode, metadata);
      expect(result.attrs).toEqual({
        id: 'existing',
        textAlign: 'center',
        backgroundColor: '#f0f0f0'
      });
    });

    it('should return unchanged node when no metadata', () => {
      const adfNode = { type: 'paragraph', content: [] };
      const result = applyMetadataToAdfNode(adfNode, []);
      expect(result).toBe(adfNode);
    });
  });

  describe('generateMetadataComment', () => {
    it('should generate simple comment for node without custom attributes', () => {
      const result = generateMetadataComment('paragraph', {});
      expect(result).toBe('');
    });

    it('should generate comment with custom attributes', () => {
      const result = generateMetadataComment('paragraph', { textAlign: 'center', id: 'custom' });
      expect(result).toBe('<!-- adf:paragraph textAlign="center" id="custom" -->');
    });

    it('should filter out standard attributes', () => {
      const result = generateMetadataComment('heading', { level: 2, id: 'custom' });
      expect(result).toBe('<!-- adf:heading id="custom" -->');
    });

    it('should return empty string when only standard attributes', () => {
      const result = generateMetadataComment('heading', { level: 2 });
      expect(result).toBe('');
    });
  });

  describe('validateMetadataComment', () => {
    it('should validate correct metadata comments', () => {
      const result = validateMetadataComment('<!-- adf:paragraph -->');
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should validate comments with attributes', () => {
      const result = validateMetadataComment('<!-- adf:paragraph attrs=\'{"textAlign":"center"}\' -->');
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should reject non-ADF comments', () => {
      const result = validateMetadataComment('<!-- regular comment -->');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Comment does not match ADF metadata pattern');
    });

    it('should detect invalid node types', () => {
      const result1 = validateMetadataComment('<!-- adf:123invalid -->');
      expect(result1.valid).toBe(false);
      expect(result1.errors).toContain('Comment does not match ADF metadata pattern');
      
      const result2 = validateMetadataComment('<!-- adf:invalid-node-type -->');
      expect(result2.valid).toBe(false);
      expect(result2.errors).toContain('Comment does not match ADF metadata pattern');
    });
  });
});