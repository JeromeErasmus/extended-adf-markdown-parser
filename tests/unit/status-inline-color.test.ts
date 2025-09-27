/**
 * @file Tests for enhanced status element inline color syntax
 */

import { describe, it, expect } from '@jest/globals';
import { Parser } from '../../src/index.js';

describe('Status Inline Color Syntax', () => {
  const parser = new Parser({ enableAdfExtensions: true });

  describe('Basic status without color', () => {
    it('should parse basic status with default neutral color', () => {
      const markdown = 'Task status: {status:In Progress}';
      const adf = parser.markdownToAdf(markdown);
      
      const paragraph = adf.content[0];
      expect(paragraph.type).toBe('paragraph');
      expect(paragraph.content).toHaveLength(2);
      
      expect(paragraph.content[0].type).toBe('text');
      expect(paragraph.content[0].text).toBe('Task status: ');
      
      expect(paragraph.content[1].type).toBe('status');
      expect(paragraph.content[1].attrs.text).toBe('In Progress');
      expect(paragraph.content[1].attrs.color).toBe('neutral');
    });
  });

  describe('Status with inline color syntax', () => {
    it('should parse status with green color', () => {
      const markdown = 'Task status: {status:Complete|color:green}';
      const adf = parser.markdownToAdf(markdown);
      
      const paragraph = adf.content[0];
      const statusNode = paragraph.content[1];
      
      expect(statusNode.type).toBe('status');
      expect(statusNode.attrs.text).toBe('Complete');
      expect(statusNode.attrs.color).toBe('green');
    });

    it('should parse status with red color', () => {
      const markdown = 'Issue: {status:Blocked|color:red}';
      const adf = parser.markdownToAdf(markdown);
      
      const paragraph = adf.content[0];
      const statusNode = paragraph.content[1];
      
      expect(statusNode.type).toBe('status');
      expect(statusNode.attrs.text).toBe('Blocked');
      expect(statusNode.attrs.color).toBe('red');
    });

    it('should parse status with yellow color', () => {
      const markdown = 'Status: {status:In Progress|color:yellow}';
      const adf = parser.markdownToAdf(markdown);
      
      const paragraph = adf.content[0];
      const statusNode = paragraph.content[1];
      
      expect(statusNode.type).toBe('status');
      expect(statusNode.attrs.text).toBe('In Progress');
      expect(statusNode.attrs.color).toBe('yellow');
    });

    it('should parse status with blue color', () => {
      const markdown = 'Info: {status:Available|color:blue}';
      const adf = parser.markdownToAdf(markdown);
      
      const paragraph = adf.content[0];
      const statusNode = paragraph.content[1];
      
      expect(statusNode.type).toBe('status');
      expect(statusNode.attrs.text).toBe('Available');
      expect(statusNode.attrs.color).toBe('blue');
    });

    it('should parse status with purple color', () => {
      const markdown = 'Priority: {status:High|color:purple}';
      const adf = parser.markdownToAdf(markdown);
      
      const paragraph = adf.content[0];
      const statusNode = paragraph.content[1];
      
      expect(statusNode.type).toBe('status');
      expect(statusNode.attrs.text).toBe('High');
      expect(statusNode.attrs.color).toBe('purple');
    });

    it('should parse status with neutral color explicitly', () => {
      const markdown = 'Status: {status:Draft|color:neutral}';
      const adf = parser.markdownToAdf(markdown);
      
      const paragraph = adf.content[0];
      const statusNode = paragraph.content[1];
      
      expect(statusNode.type).toBe('status');
      expect(statusNode.attrs.text).toBe('Draft');
      expect(statusNode.attrs.color).toBe('neutral');
    });
  });

  describe('Invalid color validation', () => {
    it('should default to neutral for invalid color', () => {
      const markdown = 'Status: {status:Testing|color:orange}'; // orange not valid
      const adf = parser.markdownToAdf(markdown);
      
      const paragraph = adf.content[0];
      const statusNode = paragraph.content[1];
      
      expect(statusNode.type).toBe('status');
      expect(statusNode.attrs.text).toBe('Testing');
      expect(statusNode.attrs.color).toBe('neutral'); // Should fallback to neutral
    });

    it('should default to neutral for empty color', () => {
      const markdown = 'Status: {status:Testing|color:}'; // empty color
      const adf = parser.markdownToAdf(markdown);
      
      const paragraph = adf.content[0];
      const statusNode = paragraph.content[1];
      
      expect(statusNode.type).toBe('status');
      expect(statusNode.attrs.text).toBe('Testing');
      expect(statusNode.attrs.color).toBe('neutral'); // Should fallback to neutral
    });
  });

  describe('Complex text with spaces and special characters', () => {
    it('should handle status text with spaces', () => {
      const markdown = 'Status: {status:Waiting for Approval|color:yellow}';
      const adf = parser.markdownToAdf(markdown);
      
      const paragraph = adf.content[0];
      const statusNode = paragraph.content[1];
      
      expect(statusNode.type).toBe('status');
      expect(statusNode.attrs.text).toBe('Waiting for Approval');
      expect(statusNode.attrs.color).toBe('yellow');
    });

    it('should handle status text with special characters', () => {
      const markdown = 'Bug: {status:Bug-Fix #123|color:red}';
      const adf = parser.markdownToAdf(markdown);
      
      const paragraph = adf.content[0];
      const statusNode = paragraph.content[1];
      
      expect(statusNode.type).toBe('status');
      expect(statusNode.attrs.text).toBe('Bug-Fix #123');
      expect(statusNode.attrs.color).toBe('red');
    });
  });

  describe('Multiple status elements', () => {
    it('should handle multiple status elements with different colors', () => {
      const markdown = 'Project: {status:Complete|color:green} Testing: {status:In Progress|color:yellow}';
      const adf = parser.markdownToAdf(markdown);
      
      const paragraph = adf.content[0];
      expect(paragraph.content).toHaveLength(4); // "Project: ", status, " Testing: ", status
      
      const firstStatus = paragraph.content[1];
      expect(firstStatus.type).toBe('status');
      expect(firstStatus.attrs.text).toBe('Complete');
      expect(firstStatus.attrs.color).toBe('green');
      
      const secondStatus = paragraph.content[3];
      expect(secondStatus.type).toBe('status');
      expect(secondStatus.attrs.text).toBe('In Progress');
      expect(secondStatus.attrs.color).toBe('yellow');
    });
  });

  describe('Backward compatibility', () => {
    it('should still support old syntax without color', () => {
      const markdown = 'Old format: {status:Working} and new: {status:Done|color:green}';
      const adf = parser.markdownToAdf(markdown);
      
      const paragraph = adf.content[0];
      expect(paragraph.content).toHaveLength(4);
      
      // Old format should default to neutral
      const oldFormatStatus = paragraph.content[1];
      expect(oldFormatStatus.type).toBe('status');
      expect(oldFormatStatus.attrs.text).toBe('Working');
      expect(oldFormatStatus.attrs.color).toBe('neutral');
      
      // New format should use specified color
      const newFormatStatus = paragraph.content[3];
      expect(newFormatStatus.type).toBe('status');
      expect(newFormatStatus.attrs.text).toBe('Done');
      expect(newFormatStatus.attrs.color).toBe('green');
    });
  });

  describe('Round-trip conversion', () => {
    it('should maintain color information through round-trip conversion', () => {
      const originalMarkdown = 'Status: {status:Complete|color:green}';
      const adf = parser.markdownToAdf(originalMarkdown);
      const convertedMarkdown = parser.adfToMarkdown(adf);
      const reconvertedAdf = parser.markdownToAdf(convertedMarkdown);
      
      // Check that color is preserved in the reconverted ADF
      const paragraph = reconvertedAdf.content[0];
      const statusNode = paragraph.content.find((node: any) => node.type === 'status');
      
      expect(statusNode).toBeDefined();
      expect(statusNode.attrs.text).toBe('Complete');
      expect(statusNode.attrs.color).toBe('green');
    });
  });

  describe('Integration with other elements', () => {
    it('should work alongside other social elements', () => {
      const markdown = 'Meeting with {user:alice} on {date:2025-01-15}. Status: {status:Confirmed|color:green} :thumbsup:';
      const adf = parser.markdownToAdf(markdown);
      
      const paragraph = adf.content[0];
      const statusNode = paragraph.content.find((node: any) => node.type === 'status');
      
      expect(statusNode).toBeDefined();
      expect(statusNode.attrs.text).toBe('Confirmed');
      expect(statusNode.attrs.color).toBe('green');
      
      // Ensure other elements are also present
      const mentionNode = paragraph.content.find((node: any) => node.type === 'mention');
      const dateNode = paragraph.content.find((node: any) => node.type === 'date');
      const emojiNode = paragraph.content.find((node: any) => node.type === 'emoji');
      
      expect(mentionNode).toBeDefined();
      expect(dateNode).toBeDefined();
      expect(emojiNode).toBeDefined();
    });
  });
});