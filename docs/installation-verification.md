# Installation Verification

This guide helps you verify that the Extended Markdown ADF Parser is properly installed and working correctly.

## Basic Import Test

Create a test file to verify the installation:

**test-installation.js** (CommonJS environments):
```javascript
// For CommonJS environments, use dynamic import
(async () => {
  const { Parser } = await import('extended-markdown-adf-parser');
  const parser = new Parser();
  console.log('Installation successful!');
  console.log('Parser version:', parser.version || 'Unknown');
})();
```

**test-installation.mjs** (ES Modules):
```javascript
import { Parser } from 'extended-markdown-adf-parser';

const parser = new Parser();
console.log('Installation successful!');

// Quick functionality test
const markdown = '# Hello World\n\nThis is a **test** document.';
const adf = parser.markdownToAdf(markdown);
const backToMarkdown = parser.adfToMarkdown(adf);

console.log('Basic conversion working!');
console.log('Original:', markdown);
console.log('Round-trip result:', backToMarkdown);
```

**test-installation.ts** (TypeScript):
```typescript
import { Parser, type AdfDocument } from 'extended-markdown-adf-parser';

const parser = new Parser();
console.log('TypeScript installation successful!');

// Type checking works
const markdown: string = '# Hello World';
const adf: AdfDocument = parser.markdownToAdf(markdown);
console.log('TypeScript types working!');
```

## Run the Test

```bash
# For CommonJS
node test-installation.js

# For ES Modules
node test-installation.mjs

# For TypeScript (requires ts-node)
npx ts-node test-installation.ts
```

## Version Management

### Checking Installed Version

```bash
npm list extended-markdown-adf-parser
yarn list extended-markdown-adf-parser
```

### Updating

```bash
# Update to latest
npm update extended-markdown-adf-parser
yarn upgrade extended-markdown-adf-parser

# Update to specific version
npm install extended-markdown-adf-parser@1.0.4
yarn add extended-markdown-adf-parser@1.0.4
```

### Version Compatibility

| Package Version | Node.js | TypeScript | Features |
|----------------|---------|------------|----------|
| 1.0.x          | 20+     | 4.5+       | All features |
| 0.9.x          | 18+     | 4.0+       | Legacy support |

## Development Setup

For contributing to the package or running from source:

```bash
# Clone the repository
git clone https://github.com/JeromeErasmus/extended-markdown-adf-parser.git
cd extended-markdown-adf-parser

# Install dependencies (requires Yarn 4.7.0+)
yarn install

# Build the package
yarn build

# Run tests
yarn test

# Link for local development
yarn link
```