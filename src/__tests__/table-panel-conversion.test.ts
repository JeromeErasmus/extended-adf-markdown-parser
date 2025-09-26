/**
 * @file table-panel-conversion.test.ts
 * @description Comprehensive tests for table and panel conversion to verify proper ADF node generation
 */

import { Parser } from '../index.js';

describe('Table and Panel Conversion Tests', () => {
  let parser: Parser;

  beforeEach(() => {
    parser = new Parser({ enableAdfExtensions: true });
  });

  describe('Table Conversion', () => {
    it('should convert simple markdown table to proper ADF table node', async () => {
      const markdown = `
| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
| Data 3   | Data 4   |
      `.trim();

      const result = await parser.markdownToAdf(markdown);
      
      // Should have one table node
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('table');
      
      const table = result.content[0];
      
      // Table should have 3 rows (header + 2 data rows)
      expect(table.content).toHaveLength(3);
      
      // First row should be table headers
      const headerRow = table.content[0];
      expect(headerRow.type).toBe('tableRow');
      expect(headerRow.content).toHaveLength(2);
      expect(headerRow.content[0].type).toBe('tableHeader');
      expect(headerRow.content[1].type).toBe('tableHeader');
      
      // Check header content
      expect(headerRow.content[0].content[0].text).toBe('Column 1');
      expect(headerRow.content[1].content[0].text).toBe('Column 2');
      
      // Data rows should be table cells
      const dataRow1 = table.content[1];
      expect(dataRow1.type).toBe('tableRow');
      expect(dataRow1.content[0].type).toBe('tableCell');
      expect(dataRow1.content[1].type).toBe('tableCell');
      
      // Check data content
      expect(dataRow1.content[0].content[0].text).toBe('Data 1');
      expect(dataRow1.content[1].content[0].text).toBe('Data 2');
    });

    it('should NOT convert table to paragraph node with raw text', async () => {
      const markdown = `
| Component | Version |
|-----------|---------|
| Node.js   | 18.0.0+ |
      `.trim();

      const result = await parser.markdownToAdf(markdown);
      
      // Should be a table node, not a paragraph
      expect(result.content[0].type).not.toBe('paragraph');
      expect(result.content[0].type).toBe('table');
      
      // Should not contain raw markdown text
      const tableNode = result.content[0];
      const hasRawMarkdown = JSON.stringify(tableNode).includes('|');
      expect(hasRawMarkdown).toBe(false);
    });

    it('should handle table with basic content structure', async () => {
      const markdown = `
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
      `.trim();

      const result = await parser.markdownToAdf(markdown);
      
      expect(result.content[0].type).toBe('table');
      const table = result.content[0];
      
      // Check that table has proper structure
      expect(table.content).toHaveLength(2); // header row + data row
      const headerRow = table.content[0];
      const dataRow = table.content[1];
      
      // Check header row
      expect(headerRow.content).toHaveLength(3);
      expect(headerRow.content[0].type).toBe('tableHeader');
      expect(headerRow.content[0].content[0].text).toBe('Header 1');
      
      // Check data row  
      expect(dataRow.content).toHaveLength(3);
      expect(dataRow.content[0].type).toBe('tableCell');
      expect(dataRow.content[0].content[0].text).toBe('Data 1');
    });
  });

  describe('Panel Conversion', () => {
    it('should convert info panel to proper ADF panel node', async () => {
      const markdown = `
~~~panel type=info title="Information"
This is an info panel with important information.
~~~
      `.trim();

      const result = await parser.markdownToAdf(markdown);
      
      // Should have one panel node
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('panel');
      
      const panel = result.content[0];
      
      // Check panel attributes
      expect(panel.attrs).toBeDefined();
      expect(panel.attrs.panelType).toBe('info');
      
      // Check panel content
      expect(panel.content).toHaveLength(1);
      expect(panel.content[0].type).toBe('paragraph');
      expect(panel.content[0].content[0].text).toContain('This is an info panel');
    });

    it('should convert warning panel to proper ADF panel node', async () => {
      const markdown = `
~~~panel type=warning title="Warning"
This is a warning message.
~~~
      `.trim();

      const result = await parser.markdownToAdf(markdown);
      
      expect(result.content[0].type).toBe('panel');
      expect(result.content[0].attrs.panelType).toBe('warning');
    });

    it('should convert success panel to proper ADF panel node', async () => {
      const markdown = `
~~~panel type=success title="Success"
Operation completed successfully!
~~~
      `.trim();

      const result = await parser.markdownToAdf(markdown);
      
      expect(result.content[0].type).toBe('panel');
      expect(result.content[0].attrs.panelType).toBe('success');
    });

    it('should convert error panel to proper ADF panel node', async () => {
      const markdown = `
~~~panel type=error title="Error"
Something went wrong!
~~~
      `.trim();

      const result = await parser.markdownToAdf(markdown);
      
      expect(result.content[0].type).toBe('panel');
      expect(result.content[0].attrs.panelType).toBe('error');
    });

    it('should NOT convert panel to codeBlock node', async () => {
      const markdown = `
~~~panel type=info title="Test"
This should be a panel, not a code block.
~~~
      `.trim();

      const result = await parser.markdownToAdf(markdown);
      
      // Should be a panel node, not a codeBlock
      expect(result.content[0].type).not.toBe('codeBlock');
      expect(result.content[0].type).toBe('panel');
      
      // Should not have language property (which codeBlock would have)
      expect(result.content[0].attrs).not.toHaveProperty('language');
      expect(result.content[0].attrs).toHaveProperty('panelType');
    });

    it('should handle panel with multiple paragraphs', async () => {
      const markdown = `
~~~panel type=note title="Multiple Paragraphs"
First paragraph in the panel.

Second paragraph in the panel.
~~~
      `.trim();

      const result = await parser.markdownToAdf(markdown);
      
      const panel = result.content[0];
      expect(panel.type).toBe('panel');
      expect(panel.content.length).toBeGreaterThan(1); // Multiple paragraphs
    });
  });

  describe('Expand Section Conversion', () => {
    it('should convert expand section to proper ADF expand node', async () => {
      const markdown = `
~~~expand title="Click to expand"
Hidden content goes here.
~~~
      `.trim();

      const result = await parser.markdownToAdf(markdown);
      
      expect(result.content[0].type).toBe('expand');
      expect(result.content[0].attrs.title).toBe('Click to expand');
    });

    it('should NOT convert expand to codeBlock node', async () => {
      const markdown = `
~~~expand title="Troubleshooting"
Detailed troubleshooting steps.
~~~
      `.trim();

      const result = await parser.markdownToAdf(markdown);
      
      expect(result.content[0].type).not.toBe('codeBlock');
      expect(result.content[0].type).toBe('expand');
    });
  });

  describe('Mixed Content Conversion', () => {
    it('should handle document with both tables and panels', async () => {
      const markdown = `
# Requirements

~~~panel type=info title="Prerequisites"
Before installing, ensure your system meets these requirements.
~~~

| Component | Version |
|-----------|---------|
| Node.js   | 18.0.0+ |
| npm       | 8.0.0+  |

~~~panel type=success title="Success"
Installation completed successfully!
~~~
      `.trim();

      const result = await parser.markdownToAdf(markdown);
      
      // Should have multiple nodes: heading, panel, table, panel
      expect(result.content.length).toBeGreaterThan(3);
      
      // Find and verify each type
      const heading = result.content.find((node: any) => node.type === 'heading');
      const panels = result.content.filter((node: any) => node.type === 'panel');
      const table = result.content.find((node: any) => node.type === 'table');
      
      expect(heading).toBeDefined();
      expect(panels).toHaveLength(2);
      expect(table).toBeDefined();
      
      // Verify panel types
      expect(panels[0].attrs.panelType).toBe('info');
      expect(panels[1].attrs.panelType).toBe('success');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty table cells', async () => {
      const markdown = `
| Header 1 | Header 2 |
|----------|----------|
| Value    |          |
|          | Value    |
      `.trim();

      const result = await parser.markdownToAdf(markdown);
      
      expect(result.content[0].type).toBe('table');
      const table = result.content[0];
      
      // Should handle empty cells gracefully
      expect(table.content).toHaveLength(3); // header + 2 data rows
    });

    it('should handle panel with no title', async () => {
      const markdown = `
~~~panel type=info
Panel content without a title.
~~~
      `.trim();

      const result = await parser.markdownToAdf(markdown);
      
      expect(result.content[0].type).toBe('panel');
      expect(result.content[0].attrs.panelType).toBe('info');
    });
  });
});