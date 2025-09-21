# Claude Development Notes

## Version Management

**IMPORTANT: This project uses Volta for Node.js and Yarn version management.**

### Volta Configuration
- **Node.js**: v20.11.1 (pinned via `volta.node` in package.json)
- **Yarn**: v4.7.0 (pinned via `volta.yarn` in package.json)
- **Automatic**: Volta automatically uses correct versions when entering project directory

### Installation
```bash
# Install Volta (if not already installed)
curl https://get.volta.sh | bash

# Volta will automatically use the correct versions in this project
cd extended-markdown-adf-parser
```

## Package Manager

**IMPORTANT: This project uses Yarn 4.7.0 as the package manager, NOT npm.**

### Why Yarn?
- Specified in `package.json`: `"packageManager": "yarn@4.7.0"`
- Build scripts use yarn: `"prepublishOnly": "yarn test && yarn build"`
- Faster dependency resolution and installation
- Better workspace support for monorepos
- Version managed by Volta

## Module System

**IMPORTANT: This package is ESM-only (ES Modules). It does NOT support CommonJS.**

### Why ESM-Only?
- Dependencies (`unified`, `remark-*`) are ESM-only packages
- Modern Node.js standard (Node.js 18+ required)
- Cleaner import/export syntax
- Better tree-shaking and bundling support

### Usage Examples:
```javascript
// ✅ ESM Import (works)
import { Parser } from 'extended-markdown-adf-parser';

// ✅ Dynamic Import (works in CommonJS)
const { Parser } = await import('extended-markdown-adf-parser');

// ❌ CommonJS require (will fail)
const { Parser } = require('extended-markdown-adf-parser');
```

### Makefile Commands (Recommended):
**Use the Makefile for standardized command execution:**
```bash
# Show all available commands
make help

# Install dependencies
make install

# Run tests
make test

# Run tests with coverage
make test-coverage

# Run tests in watch mode
make test-watch

# Build the project
make build

# Build and watch for changes
make dev

# Run linting
make lint

# Format code
make format

# Clean build artifacts
make clean

# Pre-publish checks
make prepublish
```

### Direct Yarn Commands (Alternative):
```bash
# Install dependencies
yarn install

# Run tests
yarn test

# Run tests with coverage
yarn test:coverage

# Run tests in watch mode
yarn test:watch

# Build the project
yarn build

# Run linting
yarn lint

# Format code
yarn format
```

### ❌ Don't Use:
```bash
npm install  # Use make install or yarn install instead
npm test     # Use make test or yarn test instead
npm run build # Use make build or yarn build instead
```

## Development Workflow

**Preferred workflow using Makefile:**
1. **Install dependencies**: `make install`
2. **Run tests**: `make test` (288 tests should pass)
3. **Build**: `make build`
4. **Lint**: `make lint`

**Alternative workflow using Yarn directly:**
1. **Install dependencies**: `yarn install`
2. **Run tests**: `yarn test` (288 tests should pass)
3. **Build**: `yarn build`
4. **Lint**: `yarn lint`

## Project Structure

- `src/` - Source code
- `src/__tests__/` - Test files
- `src/parser/` - Core parsing logic
- `src/types/` - TypeScript type definitions
- `dist/` - Built files (generated)

## Test Coverage

This project has 100% converter test coverage:
- **26 test suites**
- **288 tests** 
- **16 node converters** tested
- **7 mark converters** tested

### Test Fixtures

The project includes comprehensive ADF test fixtures for robustness testing:

#### File Extensions:
- **`.adf`** - Atlassian Document Format files (JSON format) containing real ADF documents
- **`.md`** - Expected Markdown output files corresponding to each ADF fixture

#### Fixture Structure:
```
tests/fixtures/
├── adf/           # ADF input files (.adf extension)
│   ├── simple-document.adf
│   ├── rich-content.adf
│   ├── table-document.adf
│   ├── media-expand.adf
│   └── edge-cases.adf
└── markdown/      # Expected output files (.md extension)
    ├── simple-document.md
    ├── rich-content.md
    ├── table-document.md
    ├── media-expand.md
    └── edge-cases.md
```

#### Fixture Contents:
- **simple-document**: Basic ADF with headings, paragraphs, and lists
- **rich-content**: Panels, code blocks, blockquotes with complex formatting
- **table-document**: Tables with headers, text colors, and various marks
- **media-expand**: Media nodes and expandable sections
- **edge-cases**: Complex scenarios with overlapping marks and edge cases