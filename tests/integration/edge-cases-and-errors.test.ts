/**
 * @file edge-cases.test.ts
 * @description Comprehensive edge case and error handling tests for markdown to ADF conversion
 */

import { MarkdownParser } from '../../src/parser/markdown-to-adf/MarkdownParser.js';
import { MarkdownValidator } from '../../src/validators/MarkdownValidator.js';
import { AdfValidator } from '../../src/validators/AdfValidator.js';
import { Parser } from '../../src/index.js';

describe('Edge Cases and Error Handling Tests', () => {
  let markdownParser: MarkdownParser;
  let validator: MarkdownValidator;
  let adfValidator: AdfValidator;
  let parser: Parser;

  beforeEach(() => {
    markdownParser = new MarkdownParser();
    validator = new MarkdownValidator();
    adfValidator = new AdfValidator();
    parser = new Parser();
  });

  describe('Malformed Input Handling', () => {
    it('should handle unclosed fence blocks', () => {
      const testCases = [
        '```javascript\nfunction test() {\n  console.log("unclosed");',
        '~~~panel type=info\nPanel content without closing',
        '~~~expand title="test"\nExpand without close',
        '```\nCode without close\n\nMore content'
      ];

      testCases.forEach(markdown => {
        expect(() => {
          const adf = markdownParser.parse(markdown);
          expect(adf.version).toBe(1);
          expect(adf.type).toBe('doc');
        }).not.toThrow();
      });
    });

    it('should handle mismatched fence blocks', () => {
      const mismatchedCases = [
        '```javascript\ncode\n~~~',
        '~~~panel type=info\ncontent\n```',
        '````\ncode\n```',
        '~~~\ncontent\n~~~~'
      ];

      mismatchedCases.forEach(markdown => {
        expect(() => {
          const adf = markdownParser.parse(markdown);
          expect(adf.version).toBe(1);
        }).not.toThrow();
      });
    });

    it('should handle malformed tables', () => {
      const malformedTables = [
        '| Header |\n|--------\n| Data |',  // Missing pipe
        '| H1 | H2 |\n|----|\n| D1 | D2 |',  // Mismatched columns
        '| | |\n|-|-|\n| | |',  // Empty cells
        'Header | No pipes\n----- | ----\nData | Here',  // Inconsistent pipes
        '| H1 | H2 |\n|:--:|\n| D1 | D2 |'  // Mismatched alignment
      ];

      malformedTables.forEach(table => {
        expect(() => {
          const adf = markdownParser.parse(table);
          expect(adf.version).toBe(1);
        }).not.toThrow();
      });
    });

    it('should handle invalid heading levels gracefully', () => {
      const invalidHeadings = [
        '####### Level 7',
        '######## Level 8',
        '############# Level 13',
        '#'.repeat(20) + ' Too many'
      ];

      invalidHeadings.forEach(heading => {
        const validation = validator.validate(heading);
        expect(validation.valid).toBe(false);
        
        // But parsing should still work
        expect(() => {
          const adf = markdownParser.parse(heading);
          expect(adf.version).toBe(1);
        }).not.toThrow();
      });
    });

    it('should handle malformed metadata comments', () => {
      const malformedMetadata = [
        '# Heading <!-- adf:heading attrs="{invalid json}" -->',
        '# Heading <!-- adf:heading attrs="not json" -->',
        '# Heading <!-- adf:heading invalid format -->',
        '# Heading <!-- malformed comment',
        '# Heading <!-- adf:heading attrs=\'{unclosed: "quote}\' -->'
      ];

      malformedMetadata.forEach(markdown => {
        expect(() => {
          const adf = markdownParser.parse(markdown);
          expect(adf.version).toBe(1);
        }).not.toThrow();
      });
    });
  });

  describe('Unicode and Special Characters', () => {
    it('should handle various Unicode characters', () => {
      const unicodeTest = `# Títle with Accénts 🎉

Paragraph with émojis: 👍 🌟 💻 🚀

Chinese: 你好世界
Arabic: مرحبا بالعالم
Russian: Привет мир
Japanese: こんにちは世界

Mathematical symbols: ∑ ∫ π √ ≈ ≠ ≤ ≥

Currency: $100 €50 ¥1000 £75

Special quotes: "smart" 'quotes' —em dash— …ellipsis

\`\`\`javascript
const message = "Unicode: αβγ δεζ ηθι";
console.log("🎯 Target reached!");
\`\`\`

| Symbol | Unicode | Description |
|--------|---------|-------------|
| α | U+03B1 | Alpha |
| 🎉 | U+1F389 | Party emoji |`;

      expect(() => {
        const validation = validator.validate(unicodeTest);
        const adf = markdownParser.parse(unicodeTest);
        expect(adf.version).toBe(1);
        expect(adf.content.length).toBeGreaterThan(0);
      }).not.toThrow();
    });

    it('should handle right-to-left text', () => {
      const rtlText = `# Mixed Direction Text

This is English text mixed with Arabic: مرحبا and Hebrew: שלום

> Quote with RTL: هذا اقتباس باللغة العربية

| English | Arabic | Hebrew |
|---------|--------|--------|
| Hello | مرحبا | שלום |
| World | عالم | עולם |`;

      expect(() => {
        const adf = markdownParser.parse(rtlText);
        expect(adf.version).toBe(1);
      }).not.toThrow();
    });

    it('should handle zero-width characters and invisible Unicode', () => {
      const invisibleChars = `# Heading with invisible chars\u200B\u200C\u200D

Paragraph with\uFEFF zero-width\u00A0 spaces.

\`\`\`
Code with\u2000 various\u2001 space\u2002 types
\`\`\``;

      expect(() => {
        const adf = markdownParser.parse(invisibleChars);
        expect(adf.version).toBe(1);
      }).not.toThrow();
    });
  });

  describe('Extreme Content Sizes', () => {
    it('should handle very long lines', () => {
      const veryLongLine = 'A'.repeat(100000);
      const markdown = `# Heading\n\n${veryLongLine}\n\nEnd paragraph.`;

      expect(() => {
        const adf = markdownParser.parse(markdown);
        expect(adf.version).toBe(1);
        expect(adf.content.length).toBeGreaterThan(2);
      }).not.toThrow();
    });

    it('should handle deeply nested structures', () => {
      // Create deeply nested blockquotes
      const deepQuotes = Array(50).fill(0).reduce((acc) => `> ${acc}`, 'Deep content');
      
      expect(() => {
        const adf = markdownParser.parse(deepQuotes);
        expect(adf.version).toBe(1);
      }).not.toThrow();
    });

    it('should handle many similar elements', () => {
      // Create document with many headings
      const manyHeadings = Array(1000).fill(0).map((_, i) => `## Heading ${i}`).join('\n\n');
      
      const startTime = performance.now();
      const adf = markdownParser.parse(manyHeadings);
      const endTime = performance.now();
      
      expect(adf.version).toBe(1);
      expect(adf.content.length).toBe(1000);
      expect(endTime - startTime).toBeLessThan(3000); // Should complete in under 3 seconds
    });

    it('should handle very wide tables', () => {
      const wideTable = `| ${Array(100).fill(0).map((_, i) => `Col${i}`).join(' | ')} |
| ${Array(100).fill('----').join(' | ')} |
| ${Array(100).fill(0).map((_, i) => `Data${i}`).join(' | ')} |`;

      expect(() => {
        const adf = markdownParser.parse(wideTable);
        expect(adf.version).toBe(1);
      }).not.toThrow();
    });
  });

  describe('Unusual Line Endings and Whitespace', () => {
    it('should handle mixed line endings', () => {
      const mixedLineEndings = "# Unix LF\n\n## Windows CRLF\r\n\r\n### Old Mac CR\r\rContent here";
      
      expect(() => {
        const adf = markdownParser.parse(mixedLineEndings);
        expect(adf.version).toBe(1);
        expect(adf.content.length).toBeGreaterThan(2);
      }).not.toThrow();
    });

    it('should handle trailing whitespace', () => {
      const trailingWhitespace = `# Heading   \n\nParagraph with trailing spaces    \n\n- List item   \n- Another item\t\t`;
      
      expect(() => {
        const adf = markdownParser.parse(trailingWhitespace);
        expect(adf.version).toBe(1);
      }).not.toThrow();
    });

    it('should handle tabs vs spaces inconsistency', () => {
      const mixedIndentation = `# Heading

\t- Tab indented list
    - Space indented list
\t\t- Double tab
        - Four spaces
\t    - Mixed tab and spaces`;

      expect(() => {
        const adf = markdownParser.parse(mixedIndentation);
        expect(adf.version).toBe(1);
      }).not.toThrow();
    });

    it('should handle documents that are only whitespace', () => {
      const whitespaceOnly = [
        '',
        '   ',
        '\n\n\n',
        '\t\t\t',
        '   \n\t\n   \n',
        '\u00A0\u2000\u2001\u2002' // Various Unicode spaces
      ];

      whitespaceOnly.forEach(content => {
        const adf = markdownParser.parse(content);
        expect(adf.version).toBe(1);
        expect(adf.type).toBe('doc');
        expect(adf.content).toHaveLength(0);
      });
    });
  });

  describe('Circular References and Infinite Loops', () => {
    it('should prevent infinite recursion in nested structures', () => {
      const deepNesting = `> ${Array(100).fill(0).map(() => '> Quote level').join('\n> ')}\n> Final level`;
      
      expect(() => {
        const adf = markdownParser.parse(deepNesting);
        expect(adf.version).toBe(1);
      }).not.toThrow();
    });

    it('should handle self-referencing links', () => {
      const selfReferencing = `[self][self]

[self]: #self "Self-referencing link"`;

      expect(() => {
        const adf = markdownParser.parse(selfReferencing);
        expect(adf.version).toBe(1);
      }).not.toThrow();
    });

    it('should handle circular reference definitions', () => {
      const circularRefs = `[a][b] and [b][c] and [c][a]

[a]: #a
[b]: #b
[c]: #c`;

      expect(() => {
        const adf = markdownParser.parse(circularRefs);
        expect(adf.version).toBe(1);
      }).not.toThrow();
    });
  });

  describe('Memory and Resource Exhaustion', () => {
    it('should handle repeated pattern matching without memory leaks', () => {
      const repeatedPatterns = Array(1000).fill(0).map(i => 
        `**bold** *italic* \`code\` ~~strike~~ [link](url) {media:123} {user:abc}`
      ).join(' ');

      expect(() => {
        const adf = markdownParser.parse(repeatedPatterns);
        expect(adf.version).toBe(1);
      }).not.toThrow();
    });

    it('should handle many empty elements', () => {
      const manyEmpty = Array(1000).fill(0).map(() => 
        '| | |\n|---|---|\n| | |'
      ).join('\n\n');

      expect(() => {
        const adf = markdownParser.parse(manyEmpty);
        expect(adf.version).toBe(1);
      }).not.toThrow();
    });

    it('should handle complex nested fence blocks', () => {
      let nestedContent = 'Base content';
      
      // Create nested structure (but not infinite due to depth limits)
      for (let i = 0; i < 10; i++) {
        nestedContent = `~~~panel type=info
Panel ${i}:

${nestedContent}

~~~`;
      }

      expect(() => {
        const adf = markdownParser.parse(nestedContent);
        expect(adf.version).toBe(1);
      }).not.toThrow();
    });
  });

  describe('Boundary Value Testing', () => {
    it('should handle minimum and maximum valid heading levels', () => {
      const boundaryHeadings = `# Level 1 (min)
## Level 2
### Level 3
#### Level 4
##### Level 5
###### Level 6 (max)`;

      const adf = markdownParser.parse(boundaryHeadings);
      expect(adf.content).toHaveLength(6);
      expect(adf.content[0].attrs?.level).toBe(1);
      expect(adf.content[5].attrs?.level).toBe(6);
    });

    it('should handle maximum reasonable list nesting', () => {
      const maxNesting = Array(20).fill(0).map((_, i) => 
        '  '.repeat(i) + '- Item at level ' + i
      ).join('\n');

      expect(() => {
        const adf = markdownParser.parse(maxNesting);
        expect(adf.version).toBe(1);
      }).not.toThrow();
    });

    it('should handle zero-length content elements', () => {
      const zeroLength = `#  
      
> 

- 

\`\`\`
\`\`\`

| | |
|---|---|
| | |`;

      expect(() => {
        const adf = markdownParser.parse(zeroLength);
        expect(adf.version).toBe(1);
      }).not.toThrow();
    });
  });

  describe('Error Recovery and Resilience', () => {
    it('should recover from parsing errors and continue', () => {
      const mixedValidInvalid = `# Valid Heading

####### Invalid level 7

Valid paragraph with **bold** text.

~~~panel
Missing required type attribute
~~~

~~~panel type=info
Valid panel content.
~~~

{media:} empty media

Valid final paragraph.`;

      expect(() => {
        const adf = markdownParser.parse(mixedValidInvalid);
        expect(adf.version).toBe(1);
        expect(adf.content.length).toBeGreaterThan(3);
      }).not.toThrow();
    });

    it('should handle partial document corruption', () => {
      const corruptedDoc = `# Good Start

Normal paragraph.

| Header | 
|--------
| Data missing pipe

More content after corruption.

\`\`\`javascript
console.log("this is fine");
\`\`\``;

      expect(() => {
        const adf = markdownParser.parse(corruptedDoc);
        expect(adf.version).toBe(1);
      }).not.toThrow();
    });

    it('should maintain document structure despite local errors', () => {
      const structuredWithErrors = `# Main Document

## Section 1 ✓

Good content here.

### Subsection with problems

####### Invalid heading level

Good paragraph continues.

## Section 2 ✓

More good content.

~~~panel invalid=attribute
Content in invalid panel
~~~

## Section 3 ✓

Final good content.`;

      const adf = markdownParser.parse(structuredWithErrors);
      
      expect(adf.version).toBe(1);
      expect(adf.type).toBe('doc');
      
      // Should still have main document structure
      const headings = adf.content.filter(node => node.type === 'heading');
      expect(headings.length).toBeGreaterThan(3);
    });
  });

  describe('Concurrent Processing Edge Cases', () => {
    it('should handle simultaneous parsing of problematic content', async () => {
      const problematicDocs = [
        '####### Invalid level',
        '~~~panel\nMissing type\n~~~',
        '{media:} empty reference',
        '```\nUnclosed code block',
        '| Invalid | Table |\n|-------|\n| Data |'
      ];

      const promises = problematicDocs.map(doc => 
        Promise.resolve().then(() => markdownParser.parse(doc))
      );

      const results = await Promise.all(promises);
      
      results.forEach(adf => {
        expect(adf.version).toBe(1);
        expect(adf.type).toBe('doc');
      });
    });

    it('should handle parser state isolation between instances', () => {
      const parser1 = new MarkdownParser();
      const parser2 = new MarkdownParser();

      const doc1 = '# Document 1\n\nContent for parser 1.';
      const doc2 = '# Document 2\n\nContent for parser 2.';

      const adf1 = parser1.parse(doc1);
      const adf2 = parser2.parse(doc2);

      expect(adf1.content[0].content?.[0].text).toBe('Document 1');
      expect(adf2.content[0].content?.[0].text).toBe('Document 2');
    });
  });

  describe('Validation Edge Cases', () => {
    it('should handle validation of extremely malformed input', () => {
      const extremelyMalformed = `######## !!!! &&&&

~~~unknown invalid=attributes without=quotes and spaces in values
Content with {media:} empty and {user:} references
and [links]() with empty URLs
~~~

| Malformed | Table |
|--------
| Missing | Cells and | Extra | Columns |
| | Empty | | Cells | |

> Blockquote with unclosed **bold and *italic
> 
> And more problems

\`\`\`
Code block never closed
with nested \`\`\` markers
and unicode: αβγ δεζ
`;

      const validation = validator.validate(extremelyMalformed);
      
      // Should complete validation without throwing
      expect(typeof validation.valid).toBe('boolean');
      expect(Array.isArray(validation.errors)).toBe(true);
      expect(Array.isArray(validation.warnings)).toBe(true);
      
      // Should have multiple errors
      expect(validation.errors.length).toBeGreaterThan(3);
    });
  });

  describe('System Resource Edge Cases', () => {
    it('should handle low memory conditions gracefully', () => {
      // Simulate memory pressure with large but manageable content
      const largeContent = Array(10000).fill(0).map(i => `Line ${i} with some content.`).join('\n\n');
      const markdown = `# Large Document\n\n${largeContent}`;

      expect(() => {
        const adf = markdownParser.parse(markdown);
        expect(adf.version).toBe(1);
        expect(adf.content.length).toBeGreaterThan(1000);
      }).not.toThrow();
    });

    it('should handle high CPU scenarios', () => {
      // Create computationally intensive content
      const complexContent = Array(100).fill(0).map((_, i) => `
## Section ${i}

Paragraph ${i} with **bold**, *italic*, \`code\`, ~~strike~~, and [links](url).

~~~panel type=${['info', 'warning', 'error', 'success'][i % 4]}
Panel ${i} with complex content and {media:${i}} references.
~~~

| Col1 | Col2 | Col3 |
|------|------|------|
| Data${i} | Value${i} | Result${i} |

\`\`\`javascript
// Code block ${i}
function test${i}() {
  return "result${i}";
}
\`\`\`
`).join('\n\n');

      const startTime = performance.now();
      const adf = markdownParser.parse(complexContent);
      const endTime = performance.now();
      
      expect(adf.version).toBe(1);
      expect(adf.content.length).toBeGreaterThan(100);
      expect(endTime - startTime).toBeLessThan(10000); // Under 10 seconds
    });
  });
});