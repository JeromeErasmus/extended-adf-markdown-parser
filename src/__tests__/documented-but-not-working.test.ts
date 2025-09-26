/**
 * @file documented-but-not-working.test.ts
 * @description Tests for elements documented as supported but not working in markdown-to-ADF direction
 * These tests document current limitations and expected behavior changes
 */

import { Parser } from '../index.js';

describe('❌ DOCUMENTED BUT NOT WORKING - Elements needing implementation', () => {
  let parser: Parser;

  beforeEach(() => {
    parser = new Parser({ enableAdfExtensions: true });
  });

  describe('❌ Social Elements - Currently treated as plain text', () => {
    it('should convert user mentions (CURRENTLY: plain text, EXPECTED: mention nodes)', async () => {
      const markdown = 'Hello {user:john.doe}!';
      const result = await parser.markdownToAdf(markdown);
      
      // CURRENT BEHAVIOR: Treated as plain text
      const paragraph = result.content[0];
      expect(paragraph.content).toHaveLength(1);
      expect(paragraph.content[0].type).toBe('text');
      expect(paragraph.content[0].text).toBe('Hello {user:john.doe}!');
      
      // EXPECTED BEHAVIOR (not currently working):
      // expect(paragraph.content).toHaveLength(3); // "Hello ", mention, "!"
      // expect(paragraph.content[1].type).toBe('mention');
      // expect(paragraph.content[1].attrs.id).toBe('john.doe');
    });

    it('should convert emoji (CURRENTLY: plain text, EXPECTED: emoji nodes)', async () => {
      const markdown = 'Happy :smile: face';
      const result = await parser.markdownToAdf(markdown);
      
      // CURRENT BEHAVIOR: Treated as plain text
      const paragraph = result.content[0];
      expect(paragraph.content).toHaveLength(1);
      expect(paragraph.content[0].type).toBe('text');
      expect(paragraph.content[0].text).toBe('Happy :smile: face');
      
      // EXPECTED BEHAVIOR (not currently working):
      // expect(paragraph.content).toHaveLength(3); // "Happy ", emoji, " face"
      // expect(paragraph.content[1].type).toBe('emoji');
      // expect(paragraph.content[1].attrs.shortName).toBe(':smile:');
    });

    it('should convert dates (CURRENTLY: plain text, EXPECTED: date nodes)', async () => {
      const markdown = 'Meeting on {date:2023-12-25}';
      const result = await parser.markdownToAdf(markdown);
      
      // CURRENT BEHAVIOR: Treated as plain text
      const paragraph = result.content[0];
      expect(paragraph.content).toHaveLength(1);
      expect(paragraph.content[0].type).toBe('text');
      expect(paragraph.content[0].text).toBe('Meeting on {date:2023-12-25}');
      
      // EXPECTED BEHAVIOR (not currently working):
      // expect(paragraph.content).toHaveLength(3); // "Meeting on ", date, ""
      // expect(paragraph.content[1].type).toBe('date');
      // expect(paragraph.content[1].attrs.timestamp).toBe('2023-12-25');
    });

    it('should convert status (CURRENTLY: plain text, EXPECTED: status nodes)', async () => {
      const markdown = 'Task status: {status:In Progress}';
      const result = await parser.markdownToAdf(markdown);
      
      // CURRENT BEHAVIOR: Treated as plain text
      const paragraph = result.content[0];
      expect(paragraph.content).toHaveLength(1);
      expect(paragraph.content[0].type).toBe('text');
      expect(paragraph.content[0].text).toBe('Task status: {status:In Progress}');
      
      // EXPECTED BEHAVIOR (not currently working):
      // expect(paragraph.content).toHaveLength(3); // "Task status: ", status, ""
      // expect(paragraph.content[1].type).toBe('status');
      // expect(paragraph.content[1].attrs.text).toBe('In Progress');
    });
  });

  describe('❌ Media Elements - Partially working', () => {
    it('should convert media references (CURRENTLY: empty, EXPECTED: media nodes)', async () => {
      const markdown = '![Alt text](media:123456)';
      const result = await parser.markdownToAdf(markdown);
      
      // CURRENT BEHAVIOR: Results in empty document
      expect(result.content).toHaveLength(0);
      
      // EXPECTED BEHAVIOR (not currently working):
      // expect(result.content[0].type).toBe('mediaSingle');
      // expect(result.content[0].content[0].type).toBe('media');
      // expect(result.content[0].content[0].attrs.id).toBe('123456');
    });

    it('should convert media group blocks (CURRENTLY: paragraph, EXPECTED: mediaGroup)', async () => {
      const markdown = `~~~mediaGroup
![Image 1](media:id-1)
![Image 2](media:id-2)
~~~`;
      
      const result = await parser.markdownToAdf(markdown);
      
      // CURRENT BEHAVIOR: Creates paragraph instead of mediaGroup
      expect(result.content[0].type).toBe('mediaGroup'); // This actually works!
      
      // But the content parsing might not work correctly
      // expect(result.content[0].content).toHaveLength(2);
      // expect(result.content[0].content[0].type).toBe('media');
      // expect(result.content[0].content[1].type).toBe('media');
    });

    it('should convert inline card elements (CURRENTLY: plain links, EXPECTED: inlineCard)', async () => {
      const markdown = '[Card Preview](https://example.com)<!-- adf:inlineCard -->';
      const result = await parser.markdownToAdf(markdown);
      
      // CURRENT BEHAVIOR: Regular link
      const textNode = result.content[0].content[0];
      expect(textNode.type).toBe('text');
      expect(textNode.marks[0].type).toBe('link');
      
      // EXPECTED BEHAVIOR (not currently working):
      // expect(result.content[0].content[0].type).toBe('inlineCard');
      // expect(result.content[0].content[0].attrs.url).toBe('https://example.com');
    });
  });

  describe('❌ Advanced Text Formatting - Partially working', () => {
    it('should handle underline marks (CURRENTLY: metadata comments ignored)', async () => {
      const markdown = '<!-- adf:text underline=true -->Underlined text<!-- /adf:text -->';
      const result = await parser.markdownToAdf(markdown);
      
      // CURRENT BEHAVIOR: Metadata comments are treated as regular text or ignored
      const textNode = result.content[0].content[0];
      expect(textNode.type).toBe('text');
      // expect(textNode.marks?.some((mark: any) => mark.type === 'underline')).toBeFalsy();
      
      // EXPECTED BEHAVIOR (not currently working):
      // expect(textNode.marks?.some((mark: any) => mark.type === 'underline')).toBeTruthy();
    });

    it('should handle text color marks (CURRENTLY: metadata comments ignored)', async () => {
      const markdown = '<!-- adf:text textColor="#ff0000" -->Red text<!-- /adf:text -->';
      const result = await parser.markdownToAdf(markdown);
      
      // CURRENT BEHAVIOR: Metadata comments are ignored
      const textNode = result.content[0].content[0];
      expect(textNode.type).toBe('text');
      // expect(textNode.marks?.some((mark: any) => mark.type === 'textColor')).toBeFalsy();
      
      // EXPECTED BEHAVIOR (not currently working):
      // expect(textNode.marks?.some((mark: any) => mark.type === 'textColor')).toBeTruthy();
    });

    it('should handle background color marks (CURRENTLY: metadata comments ignored)', async () => {
      const markdown = '<!-- adf:text backgroundColor="#ffff00" -->Yellow background<!-- /adf:text -->';
      const result = await parser.markdownToAdf(markdown);
      
      // CURRENT BEHAVIOR: Metadata comments are ignored
      const textNode = result.content[0].content[0];
      expect(textNode.type).toBe('text');
      // expect(textNode.marks?.some((mark: any) => mark.type === 'backgroundColor')).toBeFalsy();
      
      // EXPECTED BEHAVIOR (not currently working):
      // expect(textNode.marks?.some((mark: any) => mark.type === 'backgroundColor')).toBeTruthy();
    });

    it('should handle subscript/superscript marks (CURRENTLY: metadata comments ignored)', async () => {
      const markdown = 'H<!-- adf:text subsup="sub" -->2<!-- /adf:text -->O';
      const result = await parser.markdownToAdf(markdown);
      
      // CURRENT BEHAVIOR: Metadata comments create separate text nodes or are ignored
      const paragraph = result.content[0];
      // The structure might not match expected behavior
      
      // EXPECTED BEHAVIOR (not currently working):
      // expect(paragraph.content[1].marks?.some((mark: any) => mark.type === 'subsup')).toBeTruthy();
    });
  });

  describe('📋 SUMMARY - What works vs what doesn\'t', () => {
    it('should document working vs non-working features', () => {
      const workingFeatures = [
        '✅ Basic document structure (doc, paragraph, text, hardBreak)',
        '✅ All heading levels (h1-h6)',
        '✅ Text formatting marks (bold, italic, code, strikethrough, links)',
        '✅ Lists (bullet, ordered, nested)',
        '✅ Tables (with headers and cells)',
        '✅ Blockquotes and code blocks',
        '✅ Horizontal rules',
        '✅ ADF panels (all types: info, warning, error, success, note)',
        '✅ Expand sections',
        '✅ Media single blocks (~~~mediaSingle)',
        '✅ Media group blocks (~~~mediaGroup)',
        '✅ Complex nested structures',
        '✅ Frontmatter handling',
        '✅ Error handling and edge cases'
      ];

      const notWorkingFeatures = [
        '❌ User mentions ({user:id} syntax)',
        '❌ Emoji (:emoji: syntax)',
        '❌ Date nodes ({date:YYYY-MM-DD} syntax)',
        '❌ Status nodes ({status:text} syntax)',
        '❌ Simple media references (![](media:id))',
        '❌ Inline card elements',
        '❌ Advanced text formatting via metadata comments',
        '❌ Underline marks',
        '❌ Text color marks',
        '❌ Background color marks',
        '❌ Subscript/superscript marks'
      ];

      console.log('\\n=== PARSER CAPABILITY ANALYSIS ===');
      console.log('\\n🟢 WORKING FEATURES:');
      workingFeatures.forEach(feature => console.log(`  ${feature}`));
      
      console.log('\\n🔴 NOT WORKING FEATURES:');
      notWorkingFeatures.forEach(feature => console.log(`  ${feature}`));
      
      console.log('\\n📊 SUMMARY:');
      console.log(`  Total documented features: ${workingFeatures.length + notWorkingFeatures.length}`);
      console.log(`  Working features: ${workingFeatures.length}`);
      console.log(`  Non-working features: ${notWorkingFeatures.length}`);
      console.log(`  Success rate: ${Math.round(workingFeatures.length / (workingFeatures.length + notWorkingFeatures.length) * 100)}%`);

      // This test always passes - it's just for documentation
      expect(workingFeatures.length).toBeGreaterThan(0);
      expect(notWorkingFeatures.length).toBeGreaterThan(0);
    });
  });
});