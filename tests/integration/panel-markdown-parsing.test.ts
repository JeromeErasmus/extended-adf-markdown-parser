/**
 * @file Integration tests for markdown parsing within panels
 */

import { describe, it, expect } from '@jest/globals';
import { Parser } from '../../src';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Panel Markdown Parsing Integration', () => {
  const parser = new Parser({ enableAdfExtensions: true });
  
  const fixturesDir = path.join(__dirname, '..', 'fixtures');
  const markdownFixture = path.join(fixturesDir, 'markdown', 'panel-markdown-parsing.md');
  const adfFixture = path.join(fixturesDir, 'adf', 'panel-markdown-parsing.adf');

  it('should parse markdown syntax within panel content', () => {
    const markdownContent = fs.readFileSync(markdownFixture, 'utf8');
    const expectedAdf = JSON.parse(fs.readFileSync(adfFixture, 'utf8'));
    
    const result = parser.markdownToAdf(markdownContent);
    
    expect(result).toEqual(expectedAdf);
  });

  it('should correctly handle bold text in panels', () => {
    const markdown = '~~~panel type=info\nThis has **bold text** in it.\n~~~';
    const result = parser.markdownToAdf(markdown);
    
    const panelContent = result.content[0].content[0].content;
    
    // Should have 3 text nodes: "This has ", "bold text" (with strong mark), " in it."
    expect(panelContent).toHaveLength(3);
    expect(panelContent[1].text).toBe('bold text');
    expect(panelContent[1].marks).toEqual([{ type: 'strong' }]);
  });

  it('should correctly handle italic text in panels', () => {
    const markdown = '~~~panel type=warning\nThis has *italic text* in it.\n~~~';
    const result = parser.markdownToAdf(markdown);
    
    const panelContent = result.content[0].content[0].content;
    
    expect(panelContent[1].text).toBe('italic text');
    expect(panelContent[1].marks).toEqual([{ type: 'em' }]);
  });

  it('should correctly handle inline code in panels', () => {
    const markdown = '~~~panel type=error\nThis has `code text` in it.\n~~~';
    const result = parser.markdownToAdf(markdown);
    
    const panelContent = result.content[0].content[0].content;
    
    expect(panelContent[1].text).toBe('code text');
    expect(panelContent[1].marks).toEqual([{ type: 'code' }]);
  });

  it('should correctly handle links in panels', () => {
    const markdown = '~~~panel type=success\nVisit [our docs](https://example.com) for more info.\n~~~';
    const result = parser.markdownToAdf(markdown);
    
    const panelContent = result.content[0].content[0].content;
    
    expect(panelContent[1].text).toBe('our docs');
    expect(panelContent[1].marks).toEqual([{ 
      type: 'link', 
      attrs: { href: 'https://example.com' } 
    }]);
  });

  it('should handle mixed formatting in panels', () => {
    const markdown = '~~~panel type=note\n**Bold** and *italic* and `code` together.\n~~~';
    const result = parser.markdownToAdf(markdown);
    
    const panelContent = result.content[0].content[0].content;
    
    // Should have 6 text nodes: "Bold", " and ", "italic", " and ", "code", " together."
    expect(panelContent).toHaveLength(6);
    
    // Check each formatted piece
    expect(panelContent[0].text).toBe('Bold');
    expect(panelContent[0].marks).toEqual([{ type: 'strong' }]);
    
    expect(panelContent[2].text).toBe('italic');
    expect(panelContent[2].marks).toEqual([{ type: 'em' }]);
    
    expect(panelContent[4].text).toBe('code');
    expect(panelContent[4].marks).toEqual([{ type: 'code' }]);
  });

  it('should handle plain text without formatting', () => {
    const markdown = '~~~panel type=info\nJust plain text with no formatting.\n~~~';
    const result = parser.markdownToAdf(markdown);
    
    const panelContent = result.content[0].content[0].content;
    
    expect(panelContent).toHaveLength(1);
    expect(panelContent[0].text).toBe('Just plain text with no formatting.');
    expect(panelContent[0].marks).toBeUndefined();
  });
});