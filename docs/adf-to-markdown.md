# ADF to Markdown Conversion

Convert Atlassian Document Format (ADF) to Extended Markdown with full fidelity and metadata preservation.

## Overview

ADF to Markdown conversion uses a unified converter system with 41 specialized converters to transform ADF node structures into Extended Markdown syntax. Unlike Markdown to ADF conversion (which has two parser types), ADF to Markdown uses a single, efficient converter architecture.

## Architecture

```
Main Parser (src/index.ts)
├── adfToMarkdown() method
├── adfToMarkdownWithRecovery() method  
└── Converter Registry System:
    ├── Node Converters (32 types)
    │   ├── PanelConverter → ~~~panel type=info~~~
    │   ├── HeadingConverter → # Heading
    │   ├── TableConverter → | Table | Format |
    │   ├── MediaSingleConverter → ![alt](adf:media:id)
    │   └── ... (28 more specialized converters)
    └── Mark Converters (9 types)
        ├── StrongConverter → **bold text**
        ├── LinkConverter → [text](url)
        ├── TextColorConverter → <mark style="color:#ff0000">text</mark>
        └── ... (6 more formatting converters)
```

## Basic Usage

### Using the Main Parser

```typescript
import { Parser } from 'extended-markdown-adf-parser';

const parser = new Parser();

// ADF document
const adf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'Document Title' }]
    },
    {
      type: 'panel',
      attrs: { panelType: 'info', title: 'Information' },
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'This is an ' },
            { type: 'text', text: 'important', marks: [{ type: 'strong' }] },
            { type: 'text', text: ' information panel.' }
          ]
        }
      ]
    }
  ]
};

// Convert to markdown
const markdown = parser.adfToMarkdown(adf);
console.log(markdown);

// Output:
// # Document Title
//
// ~~~panel type=info title="Information"  
// This is an **important** information panel.
// ~~~
```

### Using Enhanced Parser for Metadata

```typescript
import { EnhancedMarkdownParser } from 'extended-markdown-adf-parser';

const parser = new EnhancedMarkdownParser();

// ADF with custom attributes
const adf = {
  version: 1,
  type: 'doc', 
  content: [
    {
      type: 'heading',
      attrs: { 
        level: 1,
        id: 'custom-heading',
        textAlign: 'center'
      },
      content: [{ type: 'text', text: 'Centered Heading' }]
    },
    {
      type: 'panel',
      attrs: {
        panelType: 'warning',
        backgroundColor: '#fff3cd',
        borderColor: '#ffc107'
      },
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Custom styled panel' }]
        }
      ]
    }
  ]
};

// Convert with metadata preservation
const markdown = await parser.stringify(adf);
console.log(markdown);

// Output:
// <!-- adf:heading id="custom-heading" textAlign="center" -->
// # Centered Heading
//
// <!-- adf:panel backgroundColor="#fff3cd" borderColor="#ffc107" -->
// ~~~panel type=warning
// Custom styled panel
// ~~~
```

## Available Methods

### Synchronous Conversion

```typescript
// Main parser method
const markdown = parser.adfToMarkdown(adf, options);

// With error recovery
const markdown = await parser.adfToMarkdownWithRecovery(adf, options);
```

### Enhanced Parser Methods

```typescript
const enhancedParser = new EnhancedMarkdownParser();

// Async conversion with full metadata support
const markdown = await enhancedParser.stringify(adf);

// Round-trip conversion
const originalAdf = { /* ADF document */ };
const markdown = await enhancedParser.stringify(originalAdf);
const reconstructed = await enhancedParser.parse(markdown);
// reconstructed should match originalAdf
```

## Conversion Options

```typescript
interface ConversionOptions {
  strict?: boolean;              // Enable strict mode (throws on errors)
  preserveUnknownNodes?: boolean; // Keep unknown node types (default: true)
  enableLogging?: boolean;       // Enable conversion warnings (default: false)
}

// Usage examples
const markdown1 = parser.adfToMarkdown(adf, { strict: true });
const markdown2 = parser.adfToMarkdown(adf, { 
  preserveUnknownNodes: false,
  enableLogging: true 
});
```

## Supported Elements

All ADF elements are supported through dedicated converters:

### Document Structure
```typescript
// Document root
{ type: 'doc' } → Full markdown document

// Paragraphs with attributes
{ 
  type: 'paragraph',
  attrs: { textAlign: 'center' },
  content: [{ type: 'text', text: 'Centered text' }]
} 
→ <!-- adf:paragraph textAlign="center" -->
  Centered text

// Hard breaks
{ type: 'hardBreak' } → \n (line break)
```

### Headings
```typescript
// All heading levels (1-6)
{
  type: 'heading',
  attrs: { level: 2, id: 'section-1' },
  content: [{ type: 'text', text: 'Section Title' }]
}
→ <!-- adf:heading id="section-1" -->
  ## Section Title
```

### Text Formatting
```typescript
// Bold text
{ type: 'text', text: 'bold', marks: [{ type: 'strong' }] }
→ **bold**

// Italic text  
{ type: 'text', text: 'italic', marks: [{ type: 'em' }] }
→ *italic*

// Links
{ 
  type: 'text', 
  text: 'Click here', 
  marks: [{ type: 'link', attrs: { href: 'https://example.com' } }] 
}
→ [Click here](https://example.com)

// Text color
{
  type: 'text',
  text: 'colored text',
  marks: [{ type: 'textColor', attrs: { color: '#ff0000' } }]
}
→ <mark style="color:#ff0000">colored text</mark>

// Multiple marks
{
  type: 'text',
  text: 'bold italic',
  marks: [{ type: 'strong' }, { type: 'em' }]
}
→ ***bold italic***
```

### Lists
```typescript
// Bullet lists
{
  type: 'bulletList',
  content: [
    { type: 'listItem', content: [/* paragraph */] }
  ]
}
→ - List item
  - Another item

// Ordered lists with custom start
{
  type: 'orderedList',
  attrs: { order: 5 },
  content: [/* list items */]
}
→ 5. First item
   6. Second item
```

### Tables
```typescript
{
  type: 'table',
  attrs: { 
    isNumberColumnEnabled: false,
    layout: 'default' 
  },
  content: [
    {
      type: 'tableRow',
      content: [
        { type: 'tableHeader', content: [/* text */] },
        { type: 'tableHeader', content: [/* text */] }
      ]
    },
    {
      type: 'tableRow', 
      content: [
        { type: 'tableCell', content: [/* text */] },
        { type: 'tableCell', content: [/* text */] }
      ]
    }
  ]
}
→ | Header 1 | Header 2 |
  |----------|----------|
  | Cell 1   | Cell 2   |
```

### Code Blocks
```typescript
{
  type: 'codeBlock',
  attrs: { language: 'javascript' },
  content: [{ type: 'text', text: 'console.log("Hello");' }]
}
→ ```javascript
  console.log("Hello");
  ```
```

### ADF-Specific Elements

#### Panels
```typescript
{
  type: 'panel',
  attrs: { 
    panelType: 'warning',
    title: 'Important Notice',
    backgroundColor: '#fff3cd'
  },
  content: [/* paragraphs */]
}
→ <!-- adf:panel backgroundColor="#fff3cd" -->
  ~~~panel type=warning title="Important Notice"
  Panel content here
  ~~~
```

#### Expand Sections
```typescript
{
  type: 'expand',
  attrs: { 
    title: 'Click to expand',
    expanded: true 
  },
  content: [/* content */]
}
→ ~~~expand title="Click to expand" expanded=true
  Expandable content here
  ~~~
```

#### Media Elements
```typescript
// Single media
{
  type: 'mediaSingle',
  attrs: { layout: 'center', width: 80 },
  content: [{
    type: 'media',
    attrs: { 
      id: 'media-123',
      type: 'file',
      alt: 'Description'
    }
  }]
}
→ <!-- adf:mediaSingle layout="center" width="80" -->
  ![Description](adf:media:media-123)

// Media group
{
  type: 'mediaGroup',
  content: [
    { type: 'media', attrs: { id: 'img1' } },
    { type: 'media', attrs: { id: 'img2' } }
  ]
}
→ ~~~mediaGroup
  ![](adf:media:img1)
  ![](adf:media:img2) 
  ~~~
```

#### Social Elements
```typescript
// User mentions
{ 
  type: 'mention',
  attrs: { 
    id: 'user123',
    text: '@john.doe'
  }
}
→ @[john.doe](mention:user123)

// Status indicators
{
  type: 'status',
  attrs: {
    text: 'In Progress',
    color: 'blue'
  }
}
→ [status:In Progress:blue]

// Dates  
{
  type: 'date',
  attrs: { timestamp: '1640995200000' }
}
→ [date:2022-01-01]

// Emojis
{ 
  type: 'emoji',
  attrs: { 
    shortName: ':smile:',
    text: '😊'
  }
}
→ :smile:
```

## Metadata Comments

When using the Enhanced parser, custom attributes are preserved as HTML comments:

```typescript
// ADF with custom attributes
const adf = {
  type: 'paragraph',
  attrs: {
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
    padding: '16px',
    borderRadius: '8px'
  },
  content: [{ type: 'text', text: 'Styled paragraph' }]
};

// Converts to:
// <!-- adf:paragraph textAlign="center" backgroundColor="#f0f0f0" padding="16px" borderRadius="8px" -->
// Styled paragraph
```

### Metadata Comment Formats

```typescript
// Compact format (single line)
<!-- adf:panel type="info" title="Panel Title" -->

// JSON attributes format
<!-- adf:heading attrs='{"level":1,"id":"custom-id","textAlign":"center"}' -->

// Mixed format
<!-- adf:table isNumberColumnEnabled="false" layout="wide" attrs='{"customData":"value"}' -->
```


## Performance

ADF to Markdown conversion is consistently fast with linear memory usage:

| Document Size | Conversion Time | Memory Usage |
|---------------|:---------------:|:------------:|
| Small (< 100 nodes) | < 1ms | ~50KB |
| Medium (< 1000 nodes) | < 5ms | ~150KB |
| Large (< 10000 nodes) | < 50ms | ~500KB |

Parser instances are reusable for optimal performance in batch operations.


## Next Steps

- **[Markdown to ADF](./markdown-to-adf.md)** - Convert markdown to ADF format
- **[Round-Trip Conversion](./quick-start.md#round-trip-conversion)** - Bidirectional conversion patterns
- **[Element Specifications](./specifications/)** - Detailed element documentation
- **[Installation Advanced](./installation-advanced.md)** - Integration guides