# Extended ADF Markdown Parser

A bidirectional parser for converting between Atlassian Document Format (ADF) and Extended Markdown.

## Features

- 🔄 **Bidirectional Conversion**: Convert ADF to Extended Markdown and back
- 📝 **Extended Markdown Syntax**: Support for ADF-specific elements like panels, expands, and media
- ✅ **Full Fidelity**: Preserves all ADF attributes through metadata annotations
- 🎯 **Type Safe**: Written in TypeScript with complete type definitions
- 🧪 **Well Tested**: Comprehensive test suite with extensive coverage
- 📦 **Zero Runtime Dependencies**: Lightweight and portable (uses well-established libraries)

## Installation

```bash
npm install @extended-adf/parser
# or
yarn add @extended-adf/parser
```

## Usage

```typescript
import Parser from '@extended-adf/parser';

const parser = new Parser();

// Convert ADF to Extended Markdown
const adf = {
  type: 'doc',
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

## Extended Markdown Syntax

This parser supports standard Markdown plus ADF-specific extensions. For complete element specifications and formatting examples, see [docs/ELEMENT-SPECIFICATIONS.md](docs/ELEMENT-SPECIFICATIONS.md).

Quick examples:
- **Panels**: `~~~panel type=info`  
- **Expands**: `~~~expand title="Click to expand"`
- **Media**: `![Alt text](adf:media:id)`

## Development

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