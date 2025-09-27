/**
 * @file social-elements-in-panels.test.ts
 * @description Tests for social elements (mentions, emojis, status, dates) inside panel blocks
 * @author Extended ADF Parser
 */

import Parser from '../index.js';

describe('Social Elements in Panels', () => {
  let parser: Parser;

  beforeEach(() => {
    parser = new Parser();
  });

  describe('Basic Social Elements in Panels', () => {
    it('should parse mentions in info panels', async () => {
      const markdown = `~~~panel type=info title="Team Members"
Project lead: {user:john.doe}
~~~`;
      
      const result = await parser.markdownToAdf(markdown);
      
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('panel');
      expect(result.content[0].attrs.panelType).toBe('info');
      
      // Check for mention node in panel content
      const panelContent = result.content[0].content;
      const paragraph = panelContent[0];
      const mentionNode = paragraph.content.find((node: any) => node.type === 'mention');
      
      expect(mentionNode).toBeDefined();
      expect(mentionNode.attrs.id).toBe('john.doe');
      expect(mentionNode.attrs.text).toBe('@john.doe');
      expect(mentionNode.attrs.userType).toBe('DEFAULT');
    });

    it('should parse emojis in warning panels', async () => {
      const markdown = `~~~panel type=warning title="Alert"
Warning: System maintenance :warning: :wrench:
~~~`;
      
      const result = await parser.markdownToAdf(markdown);
      
      expect(result.content[0].type).toBe('panel');
      expect(result.content[0].attrs.panelType).toBe('warning');
      
      // Check for emoji nodes
      const panelContent = result.content[0].content;
      const paragraph = panelContent[0];
      const emojiNodes = paragraph.content.filter((node: any) => node.type === 'emoji');
      
      expect(emojiNodes).toHaveLength(2);
      expect(emojiNodes[0].attrs.shortName).toBe(':warning:');
      expect(emojiNodes[1].attrs.shortName).toBe(':wrench:');
    });

    it('should parse status indicators in success panels', async () => {
      const markdown = `~~~panel type=success title="Deployment"
Status: {status:completed} and {status:deployed}
~~~`;
      
      const result = await parser.markdownToAdf(markdown);
      
      expect(result.content[0].type).toBe('panel');
      expect(result.content[0].attrs.panelType).toBe('success');
      
      // Check for status nodes
      const panelContent = result.content[0].content;
      const paragraph = panelContent[0];
      const statusNodes = paragraph.content.filter((node: any) => node.type === 'status');
      
      expect(statusNodes).toHaveLength(2);
      expect(statusNodes[0].attrs.text).toBe('completed');
      expect(statusNodes[1].attrs.text).toBe('deployed');
      expect(statusNodes[0].attrs.color).toBe('neutral');
      expect(statusNodes[0].attrs.style).toBe('default');
    });

    it('should parse dates in note panels', async () => {
      const markdown = `~~~panel type=note title="Timeline"
Due date: {date:2024-03-15}
Started: {date:2024-02-01}
~~~`;
      
      const result = await parser.markdownToAdf(markdown);
      
      expect(result.content[0].type).toBe('panel');
      expect(result.content[0].attrs.panelType).toBe('note');
      
      // Check for date nodes
      const panelContent = result.content[0].content;
      const paragraph = panelContent[0];
      const dateNodes = paragraph.content.filter((node: any) => node.type === 'date');
      
      expect(dateNodes).toHaveLength(2);
      // Dates should be converted to Unix timestamps
      const timestamp1 = new Date('2024-03-15T00:00:00.000Z').getTime().toString();
      const timestamp2 = new Date('2024-02-01T00:00:00.000Z').getTime().toString();
      expect(dateNodes[0].attrs.timestamp).toBe(timestamp1);
      expect(dateNodes[1].attrs.timestamp).toBe(timestamp2);
    });
  });

  describe('Mixed Social Elements in Panels', () => {
    it('should handle all social element types in one panel', async () => {
      const markdown = `~~~panel type=info title="Project Status"
Assigned to: {user:project.manager} :briefcase:
Current status: {status:in-progress}
Due date: {date:2024-04-01}
~~~`;
      
      const result = await parser.markdownToAdf(markdown);
      
      expect(result.content[0].type).toBe('panel');
      
      // Check all social elements are present
      const panelContent = result.content[0].content;
      const paragraph = panelContent[0];
      const content = paragraph.content;
      
      const mentionNode = content.find((node: any) => node.type === 'mention');
      const emojiNode = content.find((node: any) => node.type === 'emoji');
      const statusNode = content.find((node: any) => node.type === 'status');
      const dateNode = content.find((node: any) => node.type === 'date');
      
      expect(mentionNode).toBeDefined();
      expect(emojiNode).toBeDefined(); 
      expect(statusNode).toBeDefined();
      expect(dateNode).toBeDefined();
      
      expect(mentionNode.attrs.id).toBe('project.manager');
      expect(emojiNode.attrs.shortName).toBe(':briefcase:');
      expect(statusNode.attrs.text).toBe('in-progress');
      const expectedTimestamp = new Date('2024-04-01T00:00:00.000Z').getTime().toString();
      expect(dateNode.attrs.timestamp).toBe(expectedTimestamp);
    });

    it('should handle social elements mixed with formatting in panels', async () => {
      const markdown = `~~~panel type=info title="Team Update"
**Lead:** {user:team.lead} :crown:
*Status:* {status:active}
***Due:*** {date:2024-05-15}
~~~`;
      
      const result = await parser.markdownToAdf(markdown);
      
      expect(result.content[0].type).toBe('panel');
      
      const panelContent = result.content[0].content;
      const paragraph = panelContent[0];
      const content = paragraph.content;
      
      // Check for social elements
      const mentionNode = content.find((node: any) => node.type === 'mention');
      const emojiNode = content.find((node: any) => node.type === 'emoji');
      const statusNode = content.find((node: any) => node.type === 'status');
      const dateNode = content.find((node: any) => node.type === 'date');
      
      expect(mentionNode).toBeDefined();
      expect(emojiNode).toBeDefined();
      expect(statusNode).toBeDefined(); 
      expect(dateNode).toBeDefined();
      
      // Check for formatting marks
      const boldNodes = content.filter((node: any) => 
        node.type === 'text' && node.marks && 
        node.marks.some((mark: any) => mark.type === 'strong')
      );
      const italicNodes = content.filter((node: any) => 
        node.type === 'text' && node.marks && 
        node.marks.some((mark: any) => mark.type === 'em')
      );
      
      expect(boldNodes.length).toBeGreaterThan(0);
      expect(italicNodes.length).toBeGreaterThan(0);
    });
  });

  describe('Social Elements in Panel Lists', () => {
    it('should handle social elements in bullet lists within panels', async () => {
      const markdown = `~~~panel type=info title="Team Roster"
**Team Members:**

- Lead: {user:team.lead} :star:
- Developer: {user:dev1} {status:active}
- QA: {user:qa.lead} {status:available}
~~~`;
      
      const result = await parser.markdownToAdf(markdown);
      
      expect(result.content[0].type).toBe('panel');
      
      const panelContent = result.content[0].content;
      
      // Should have paragraph and bulletList
      expect(panelContent.some((node: any) => node.type === 'paragraph')).toBeTruthy();
      expect(panelContent.some((node: any) => node.type === 'bulletList')).toBeTruthy();
      
      const bulletList = panelContent.find((node: any) => node.type === 'bulletList');
      expect(bulletList.content).toHaveLength(3); // 3 list items
      
      // Check first list item contains mention and emoji
      const firstItem = bulletList.content[0];
      const firstItemContent = firstItem.content[0].content; // listItem > paragraph > content
      
      const mentionInList = firstItemContent.find((node: any) => node.type === 'mention');
      const emojiInList = firstItemContent.find((node: any) => node.type === 'emoji');
      
      expect(mentionInList).toBeDefined();
      expect(emojiInList).toBeDefined();
      expect(mentionInList.attrs.id).toBe('team.lead');
      expect(emojiInList.attrs.shortName).toBe(':star:');
      // Unicode emojis don't have id field per Atlassian docs
      expect(emojiInList.attrs.id).toBeUndefined();
      expect(emojiInList.attrs.text).toBe('⭐');
      
      // Check second list item contains mention and status
      const secondItem = bulletList.content[1];
      const secondItemContent = secondItem.content[0].content;
      
      const mentionInSecondItem = secondItemContent.find((node: any) => node.type === 'mention');
      const statusInSecondItem = secondItemContent.find((node: any) => node.type === 'status');
      
      expect(mentionInSecondItem).toBeDefined();
      expect(statusInSecondItem).toBeDefined();
      expect(mentionInSecondItem.attrs.id).toBe('dev1');
      expect(statusInSecondItem.attrs.text).toBe('active');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty panels with social elements in title', async () => {
      const markdown = `~~~panel type=info title="Assigned to {user:assignee}"
Content here
~~~`;
      
      const result = await parser.markdownToAdf(markdown);
      
      expect(result.content[0].type).toBe('panel');
      // Title is an attribute, not parsed for social elements
      expect(result.content[0].attrs.title).toBe('Assigned to {user:assignee}');
    });

    it('should handle panels with only social elements', async () => {
      const markdown = `~~~panel type=success
{user:admin} {status:completed} {date:2024-01-01} :tada:
~~~`;
      
      const result = await parser.markdownToAdf(markdown);
      
      expect(result.content[0].type).toBe('panel');
      
      const panelContent = result.content[0].content;
      const paragraph = panelContent[0];
      const content = paragraph.content;
      
      expect(content.filter((node: any) => node.type === 'mention')).toHaveLength(1);
      expect(content.filter((node: any) => node.type === 'status')).toHaveLength(1);
      expect(content.filter((node: any) => node.type === 'date')).toHaveLength(1);
      expect(content.filter((node: any) => node.type === 'emoji')).toHaveLength(1);
    });

    it('should handle malformed social elements gracefully', async () => {
      const markdown = `~~~panel type=warning
Valid: {user:valid.user}
Invalid: {user:} {status} :emoji-without-colon
Partial: {date:invalid-date} 
~~~`;
      
      const result = await parser.markdownToAdf(markdown);
      
      expect(result.content[0].type).toBe('panel');
      
      const panelContent = result.content[0].content;
      const paragraph = panelContent[0];
      const content = paragraph.content;
      
      // Should have the valid mention
      const mentions = content.filter((node: any) => node.type === 'mention');
      expect(mentions).toHaveLength(1);
      expect(mentions[0].attrs.id).toBe('valid.user');
      
      // Invalid elements should be treated as plain text
      const textNodes = content.filter((node: any) => node.type === 'text');
      expect(textNodes.length).toBeGreaterThan(0);
    });
  });

  describe('Complex Panel Content', () => {
    it('should convert complex panel with multiple paragraphs and social elements', async () => {
      const originalMarkdown = `~~~panel type=info title="Project Info"
**Project Lead:** {user:project.lead} :star:

**Current Status:** {status:in-progress}

**Due Date:** {date:2024-06-01}
~~~`;
      
      // Convert to ADF
      const adfResult = await parser.markdownToAdf(originalMarkdown);
      
      expect(adfResult.content[0].type).toBe('panel');
      expect(adfResult.content[0].attrs.panelType).toBe('info');
      
      const panelContent = adfResult.content[0].content;
      
      // Should have multiple paragraphs
      const paragraphs = panelContent.filter((node: any) => node.type === 'paragraph');
      expect(paragraphs.length).toBeGreaterThan(1);
      
      // Check for all social elements across all paragraphs
      const adfString = JSON.stringify(panelContent);
      expect(adfString).toContain('"type":"mention"');
      expect(adfString).toContain('"type":"emoji"');
      expect(adfString).toContain('"type":"status"');  
      expect(adfString).toContain('"type":"date"');
      
      // Check for formatting marks
      expect(adfString).toContain('"type":"strong"');
    });
  });
});