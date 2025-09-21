# Extended ADF Markdown Parser

A bidirectional parser for converting between [Atlassian Document Format (ADF)](https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/) and Extended Markdown.

**[Complete Documentation](https://jeromeerasmus.gitbook.io/extended-markdown-adf-parser)** - Full guide with examples, API reference, and advanced usage patterns.

**What is ADF?** Atlassian Document Format (ADF) is a JSON-based document format used by Atlassian products like Jira and Confluence to represent rich content including text formatting, tables, panels, media, and other structured elements.

## Features

- **Bidirectional Conversion**: Convert ADF to Extended Markdown and back  
  Seamlessly transform content between Atlassian Document Format and Extended Markdown with complete round-trip fidelity.

- **Extended Markdown Syntax**: Support for ADF-specific elements like panels, expands, and media  
  Beyond standard Markdown, includes ADF extensions such as info panels, expandable sections, and media placeholders.

- **Full Fidelity**: Preserves all ADF attributes through metadata annotations  
  Custom attributes and styling information are maintained using HTML comment metadata, ensuring no data loss during conversion.

- **Type Safe**: Written in TypeScript with complete type definitions  
  Full TypeScript support with comprehensive type definitions for all ADF nodes, ensuring compile-time safety and excellent IDE support.


- **Zero Runtime Dependencies**: Lightweight and portable (uses well-established libraries)  
  Built on proven libraries like unified/remark ecosystem, with no additional runtime dependencies for your applications.

## Supported Elements

This parser provides bidirectional conversion support between Markdown and ADF. The table below shows all supported elements and their conversion capabilities:

| Element Type | ADF Node | Description | Markdown → ADF | ADF → Markdown |
|--------------|----------|-------------|:--------------:|:--------------:|
| **DOCUMENT STRUCTURE** |
| Document | `doc` | Root document container | ✅ | ✅ |
| Paragraph | `paragraph` | Text paragraphs with attributes | ✅ | ✅ |
| Hard Break | `hardBreak` | Explicit line breaks | ✅ | ✅ |
| Text | `text` | Raw text content | ✅ | ✅ |
| **HEADINGS** |
| Heading L1 | `heading` | Level 1 heading | ✅ | ✅ |
| Heading L2 | `heading` | Level 2 heading | ✅ | ✅ |
| Heading L3 | `heading` | Level 3 heading | ✅ | ✅ |
| Heading L4 | `heading` | Level 4 heading | ✅ | ✅ |
| Heading L5 | `heading` | Level 5 heading | ✅ | ✅ |
| Heading L6 | `heading` | Level 6 heading | ✅ | ✅ |
| **TEXT FORMATTING** |
| Bold | `mark:strong` | Bold text formatting | ✅ | ✅ |
| Italic | `mark:em` | Italic text formatting | ✅ | ✅ |
| Inline Code | `mark:code` | Inline code spans | ✅ | ✅ |
| Strikethrough | `mark:strike` | Crossed out text | ✅ | ✅ |
| Underline | `mark:underline` | Underlined text | ✅ | ✅ |
| Text Color | `mark:textColor` | Custom text colors | ✅ | ✅ |
| Background Color | `mark:backgroundColor` | Text background colors | ✅ | ✅ |
| Link | `mark:link` | Hyperlinks with titles | ✅ | ✅ |
| Subscript/Superscript | `mark:subsup` | Sub/superscript text | ✅ | ✅ |
| **LISTS** |
| Bullet List | `bulletList` | Unordered lists | ✅ | ✅ |
| Ordered List | `orderedList` | Numbered lists | ✅ | ✅ |
| List Item | `listItem` | Individual list items | ✅ | ✅ |
| **TABLES** |
| Table | `table` | Complete table structures | ✅ | ✅ |
| Table Row | `tableRow` | Individual table rows | ✅ | ✅ |
| Table Header | `tableHeader` | Table header cells | ✅ | ✅ |
| Table Cell | `tableCell` | Regular table cells | ✅ | ✅ |
| **QUOTES & CODE** |
| Blockquote | `blockquote` | Quote blocks with nesting | ✅ | ✅ |
| Code Block | `codeBlock` | Fenced code blocks | ✅ | ✅ |
| Horizontal Rule | `rule` | Document dividers | ✅ | ✅ |
| **ADF PANELS** |
| Info Panel | `panel` | Information panels | ✅ | ✅ |
| Warning Panel | `panel` | Warning panels | ✅ | ✅ |
| Error Panel | `panel` | Error panels | ✅ | ✅ |
| Success Panel | `panel` | Success panels | ✅ | ✅ |
| Note Panel | `panel` | Note panels | ✅ | ✅ |
| **MEDIA ELEMENTS** |
| Media | `media` | Individual media items | ✅ | ✅ |
| Media Single | `mediaSingle` | Single media with layout | ✅ | ✅ |
| Media Group | `mediaGroup` | Multiple media grouped | ✅ | ✅ |
| **INTERACTIVE ELEMENTS** |
| Expand | `expand` | Collapsible content sections | ✅ | ✅ |
| Inline Card | `inlineCard` | Embedded link previews | ✅ | ✅ |
| **SOCIAL ELEMENTS** |
| Mention | `mention` | User mentions | ✅ | ✅ |
| Emoji | `emoji` | Emoji characters | ✅ | ✅ |
| Date | `date` | Date stamps | ✅ | ✅ |
| Status | `status` | Status indicators | ✅ | ✅ |

## Installation

```bash
npm install extended-markdown-adf-parser
# or
yarn add extended-markdown-adf-parser
```

## Usage

### Simple Example

```typescript
import { Parser } from 'extended-markdown-adf-parser';

const parser = new Parser();

// Convert ADF to Extended Markdown
const adf = {
  type: 'doc',
  version: 1,
  content: [
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Hello World' }
      ]
    }
  ]
};

const markdown = parser.adfToMarkdown(adf);
console.log(markdown); // "Hello World"

// Convert Extended Markdown back to ADF
const reconstructed = parser.markdownToAdf(markdown);
console.log(reconstructed); // Original ADF structure
```

### Complex Example with ADF Extensions

```typescript
import { Parser } from 'extended-markdown-adf-parser';

const parser = new Parser({ enableAdfExtensions: true });

// Extended Markdown with metadata and ADF elements
const extendedMarkdown = `---
title: "Complete Document Example"
author: "Extended ADF Parser"
---

<!-- adf:heading id="main-title" textAlign="center" -->
# Main Document Title

<!-- adf:paragraph textAlign="justify" lineHeight="1.6" -->
This is a justified paragraph with custom line spacing that demonstrates the full capabilities of the Extended ADF Markdown Parser.

<!-- adf:panel backgroundColor="#e6f7ff" borderColor="#1890ff" -->
~~~panel type=info title="Important Information"
This panel contains important information with custom styling.

<!-- adf:bulletList bulletStyle="square" -->
- Custom styled bullet list
- With square bullets
- Inside the panel
~~~

## Standard Markdown Section

This section uses standard Markdown without ADF extensions:

- **Bold text**
- *Italic text*  
- \`Inline code\`
- ~~Strikethrough~~

\`\`\`javascript
// Code block with syntax highlighting
function example() {
    return "Hello, World!";
}
\`\`\`

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |

<!-- adf:expand defaultOpen="true" -->
~~~expand title="Additional Resources"
This expandable section contains additional resources and links for further reading.

[External Documentation](https://example.com)
~~~`;

// Convert to ADF
const adf = parser.markdownToAdf(extendedMarkdown);

// Convert back to markdown
const reconstructedMarkdown = parser.adfToMarkdown(adf);

console.log('ADF Document:', JSON.stringify(adf, null, 2));
console.log('Reconstructed Markdown:', reconstructedMarkdown);
```



### 📋 Extended Markdown Syntax

#### Metadata Comments
Apply custom attributes to any element:
```markdown
<!-- adf:paragraph textAlign="center" -->
This paragraph is centered.

<!-- adf:heading id="custom-id" anchor="custom-anchor" -->
# Custom Heading
```

#### ADF Fence Blocks
```markdown
~~~panel type=info title="Information"
Content with **formatting** inside panels.
~~~

~~~expand title="Click to expand" expanded=true
Collapsible content that starts expanded.
~~~

~~~mediaSingle layout=center width=80
![Description](media:media-id-here)
~~~

~~~mediaGroup
![Image 1](media:id-1)
![Image 2](media:id-2)
~~~
```

#### Media References
```markdown
# Media placeholders
![Alt text](media:media-id-123)

# User mentions  
{user:username}
{user:user-id-123}

# Media references
{media:media-id-456}
```

#### Frontmatter Support
```yaml
---
title: "Document Title"
author: "Author Name"
tags: [tag1, tag2, tag3]
metadata:
  custom: "value"
---
```

## Development

### Prerequisites

This project uses [Volta](https://volta.sh/) for Node.js and Yarn version management. The required versions are automatically configured:

- **Node.js**: v20.11.1
- **Yarn**: v4.7.0

If you don't have Volta installed:

```bash
# Install Volta
curl https://get.volta.sh | bash

# Volta will automatically use the correct versions when you enter the project directory
cd extended-markdown-adf-parser
```

### Using Makefile (Recommended)

```bash
# Show all available commands
make help

# Install dependencies
make install

# Run all tests
make test

# Run only unit tests
make test-unit

# Run only integration tests
make test-integration

# Run tests with coverage
make test-coverage

# Build the library
make build

# Run linting
make lint

# Format code
make format
```

### Using Yarn Directly

```bash
# Install dependencies
yarn install

# Run tests
yarn test

# Run tests with coverage
yarn test:coverage

# Build the library
yarn build

# Run linting
yarn lint

# Format code
yarn format
```

## Project Structure

```
src/
├── parser/           # Core parsing logic
│   ├── adf-to-markdown/
│   └── markdown-to-adf/
├── validators/       # ADF and Markdown validators
├── types/           # TypeScript type definitions
├── errors/          # Custom error classes
└── index.ts         # Main entry point

tests/
├── unit/            # Unit tests organized by component
│   ├── converters/  # Tests for individual ADF->Markdown converters
│   ├── validators/  # Tests for ADF and Markdown validators
│   ├── parser/      # Tests for tokenizer, parser, and AST builder
│   └── core/        # Tests for registry and integration components
├── integration/     # Integration test suites
└── fixtures/        # Test fixtures for robustness testing
    ├── adf/         # ADF input files (.adf extension)
    └── markdown/    # Expected output files (.md extension)
```

## Test Fixtures

The project includes comprehensive ADF test fixtures for robustness testing:

### File Extensions:
- **`.adf`** - Atlassian Document Format files (JSON format) containing real ADF documents
- **`.md`** - Expected Markdown output files corresponding to each ADF fixture

### Available Fixtures:
- **simple-document**: Basic ADF with headings, paragraphs, and lists
- **rich-content**: Panels, code blocks, blockquotes with complex formatting
- **table-document**: Tables with headers, text colors, and various marks  
- **media-expand**: Media nodes and expandable sections
- **edge-cases**: Complex scenarios with overlapping marks and edge cases

Each fixture pair (`.adf` + `.md`) represents a real-world ADF document and its expected Markdown conversion, providing confidence in the parser's robustness across diverse content scenarios.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT