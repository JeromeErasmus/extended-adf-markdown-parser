# Extended ADF Markdown Parser

A bidirectional parser for converting between Atlassian Document Format (ADF) and Extended Markdown.

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

## Installation

```bash
npm install extended-adf-parser
# or
yarn add extended-adf-parser
```

## Usage

### Simple Example

```typescript
import { Parser } from 'extended-adf-parser';

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
import { Parser } from 'extended-adf-parser';

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

## Extended Markdown Syntax

This parser supports standard Markdown plus ADF-specific extensions. For complete element specifications and formatting examples, see [docs/ELEMENT-SPECIFICATIONS.md](docs/ELEMENT-SPECIFICATIONS.md).

### Key Features:
- **Metadata Comments**: `<!-- adf:nodeType attributeName="value" -->`
- **Panels**: `~~~panel type=info title="Panel Title"`  
- **Expand Sections**: `~~~expand title="Click to expand"`
- **Media Elements**: `![Alt text](adf:media:media-id)`
- **Custom Attributes**: Apply styling and behavior to any element
- **Frontmatter**: YAML and TOML frontmatter support

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
cd extended-adf-parser
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