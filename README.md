# Extended ADF Markdown Parser

A bidirectional parser for converting between Atlassian Document Format (ADF) and Extended Markdown.

## Features

- 🔄 **Bidirectional Conversion**: Convert ADF to Extended Markdown and back
- 📝 **Extended Markdown Syntax**: Support for ADF-specific elements like panels, expands, and media
- ✅ **Full Fidelity**: Preserves all ADF attributes through metadata annotations
- 🎯 **Type Safe**: Written in TypeScript with complete type definitions
- 🧪 **Well Tested**: Comprehensive test suite with >90% coverage
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

### Panels
```markdown
~~~panel type=info
This is an info panel
~~~
```

### Expands
```markdown
~~~expand title="Click to expand"
Hidden content
~~~
```

### Media
```markdown
![Alt text](adf://media/123)
```

## Development

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
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT