# Quick Start Guide

Get up and running with the Extended Markdown ADF Parser in minutes.

## Installation

### Quick Installation

```bash
npm install extended-markdown-adf-parser
# or
yarn add extended-markdown-adf-parser
```

**Need more help?** For detailed installation instructions, see:
- **[Installation Guide](./installation-guide.md)** - Complete installation instructions and prerequisites
- **[Installation Verification](./installation-verification.md)** - Test that everything is working correctly
- **[Advanced Installation](./installation-advanced.md)** - Framework integration and environment-specific setup
- **[Installation Troubleshooting](./installation-troubleshooting.md)** - Common issues and solutions

## Basic Usage

### 1. Import the Parser

#### ES Modules (Recommended)
```typescript
import { Parser } from 'extended-markdown-adf-parser';

// Create a parser instance
const parser = new Parser();
```

#### CommonJS
```javascript
const { Parser } = require('extended-markdown-adf-parser');

// Create a parser instance
const parser = new Parser();
```

#### TypeScript with Type Imports
```typescript
import { Parser, type ADFDocument, type ConversionOptions } from 'extended-markdown-adf-parser';

// Create a parser instance with options (ADF extensions enabled by default)
const parser = new Parser({
  strict: false
});
```

### 2. Convert ADF to Markdown

```typescript
// Example ADF document
const adf = {
  type: 'doc',
  version: 1,
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'Welcome to ADF Parser' }]
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'This is ' },
        { type: 'text', text: 'bold text', marks: [{ type: 'strong' }] },
        { type: 'text', text: ' and this is ' },
        { type: 'text', text: 'italic text', marks: [{ type: 'em' }] },
        { type: 'text', text: '.' }
      ]
    }
  ]
};

// Convert to markdown
const markdown = parser.adfToMarkdown(adf);
console.log(markdown);
// Output:
// # Welcome to ADF Parser
// 
// This is **bold text** and this is *italic text*.
```

### 3. Convert Markdown to ADF

```typescript
const markdown = `# My Document

This is a paragraph with **bold** and *italic* text.

## Features List

- Feature 1
- Feature 2
- Feature 3

\`\`\`javascript
console.log("Hello World!");
\`\`\``;

// Convert to ADF
const adf = parser.markdownToAdf(markdown);
console.log(JSON.stringify(adf, null, 2));
```

## Working with ADF Extensions

The parser supports ADF-specific elements like panels, expand sections, and media through extended markdown syntax.

### Panels

```typescript
const markdownWithPanel = `
~~~panel type=info title="Important Information"
This is an information panel with **formatted content**.

- List items work too
- Multiple paragraphs supported
~~~
`;

const adf = parser.markdownToAdf(markdownWithPanel);
const backToMarkdown = parser.adfToMarkdown(adf);
```

### Expand Sections

```typescript
const markdownWithExpand = `
~~~expand title="Click to expand" expanded=true
This content is inside an expandable section.

## Nested content works
- Including lists
- And other elements
~~~
`;

const adf = parser.markdownToAdf(markdownWithExpand);
```

### Media Elements

```typescript
const markdownWithMedia = `
~~~mediaSingle layout=center width=80
![Alt text](media:123456789)
~~~
`;

const adf = parser.markdownToAdf(markdownWithMedia);
```

### Social Elements

The parser supports Atlassian social elements with bidirectional conversion:

```typescript
const markdownWithSocial = `
# Team Update

Meeting scheduled for 2025-09-27 with {user:alice} and {user:bob}.

Status: {status:in-progress} :rocket: :thumbsup:

Deadline: {date:2025-12-31}
`;

const adf = parser.markdownToAdf(markdownWithSocial);
// Dates are converted to Unix timestamps in ADF
// Emojis use Atlassian-compliant format with colons

const backToMarkdown = parser.adfToMarkdown(adf);
// Preserves social elements and converts timestamps back to YYYY-MM-DD
```

#### Date Format Support
- **Standalone dates**: `2025-09-27` → Unix timestamp in ADF
- **Braced format**: `{date:2025-09-27}` → Unix timestamp in ADF  
- **Round-trip accuracy**: Maintains date precision through multiple conversions

#### Emoji Format Standards
- **Input**: `:smile:` (colon format)
- **ADF**: `{"shortName": ":smile:", "text": "😄"}` (Atlassian-compliant)
- **Output**: `:smile:` (preserved format)

## Advanced Features

### Custom Attributes with Metadata Comments

Add custom attributes to any element using metadata comments:

```typescript
const extendedMarkdown = `
<!-- adf:paragraph textAlign="center" -->
This paragraph will be centered in ADF.

<!-- adf:heading id="custom-heading" -->
# Heading with Custom ID

<!-- adf:panel backgroundColor="#e6f7ff" borderColor="#1890ff" -->
~~~panel type=info
Custom styled panel with background and border colors.
~~~
`;

const adf = parser.markdownToAdf(extendedMarkdown);
```

### Frontmatter Support

```typescript
const markdownWithFrontmatter = `---
title: "My Document"
author: "John Doe"
tags: [markdown, adf, parser]
---

# Document Title

Content goes here...`;

const adf = parser.markdownToAdf(markdownWithFrontmatter);
// Frontmatter is preserved in the ADF document metadata
```

### Parser Options

```typescript
const parser = new Parser({
  enableAdfExtensions: true,  // Enable ADF fence blocks (default: true)
  preserveUnknownNodes: true, // Keep unknown ADF nodes (default: true)
  strictMode: false          // Strict parsing mode (default: false)
});
```

## Parser Selection

The library provides two parser implementations optimized for different use cases. For detailed guidance on choosing between them, see:

**→ [Markdown to ADF Conversion Guide](./markdown-to-adf.md)** - Complete parser comparison, configuration options, and migration strategies

## Round-Trip Conversion

The parser maintains full fidelity for round-trip conversions:

```typescript
// Start with ADF
const originalAdf = { /* your ADF document */ };

// Convert to markdown and back
const markdown = parser.adfToMarkdown(originalAdf);
const reconstructedAdf = parser.markdownToAdf(markdown);

// reconstructedAdf should be identical to originalAdf
```

## Error Handling

For comprehensive error handling patterns, validation, and troubleshooting, see **[Error Handling Guide](./error-handling.md)**.

## Common Patterns

### Processing Multiple Documents

```typescript
const documents = [markdown1, markdown2, markdown3];

const adfDocuments = documents.map(md => {
  try {
    return parser.markdownToAdf(md);
  } catch (error) {
    console.error('Failed to parse:', error.message);
    return null;
  }
}).filter(Boolean);
```

### Working with Large Documents

```typescript
// For large documents, consider using streaming
import { StreamingParser } from 'extended-markdown-adf-parser';

const streamingParser = new StreamingParser({
  chunkSize: 1000,
  enableValidation: true
});

const result = await streamingParser.parseAsync(largeMarkdownString);
```

### Custom Node Processing

```typescript
// Access internal converters for custom processing
import { ConverterRegistry } from 'extended-markdown-adf-parser';

const registry = new ConverterRegistry();
const converter = registry.getNodeConverter('paragraph');

// Custom processing logic here
```

## Next Steps

### Core Elements
- **[Metadata Comments](./specifications/element-specifications-metadata-comments.md)** - Custom attribute system for any element
- **[Headings](./specifications/element-specifications-headings.md)** - Document hierarchy (H1-H6)
- **[Paragraphs](./specifications/element-specifications-paragraphs.md)** - Basic text blocks with styling options

### Text Formatting
- **[Bold](./specifications/element-specifications-bold.md)** - Strong emphasis text formatting
- **[Italic](./specifications/element-specifications-italic.md)** - Emphasis text formatting
- **[Links](./specifications/element-specifications-links.md)** - Navigation and references

### ADF Extensions
- **[Panels](./specifications/element-specifications-panels.md)** - Semantic content containers (info, warning, error, success, note)
- **[Expand Sections](./specifications/element-specifications-expand-sections.md)** - Collapsible content areas

### Media Elements
- **[Media Single](./specifications/element-specifications-media-single.md)** - Single media with layout control
- **[Media Group](./specifications/element-specifications-media-group.md)** - Multiple media collections

### Advanced Features
- **[Frontmatter](./specifications/element-specifications-frontmatter.md)** - YAML metadata headers

## Need Help?

- **[Report Issues](https://github.com/JeromeErasmus/extended-markdown-adf-parser/issues)**
- **[Contact](mailto:jerome.erasmus@gmail.com)**