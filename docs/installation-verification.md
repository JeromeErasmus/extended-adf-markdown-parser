# Installation Verification

This guide helps you verify that the Extended Markdown ADF Parser is properly installed and working correctly with both CommonJS and ES Modules.

## Module System Support Test

This package supports both CommonJS and ES Modules automatically. Test the approach that matches your environment:

### CommonJS Test

**test-commonjs.js**:
```javascript
const { Parser } = require('extended-markdown-adf-parser');

const parser = new Parser();
console.log('✅ CommonJS installation successful!');

// Quick functionality test
const markdown = '# Hello World\n\nThis is a **test** document.';
const adf = parser.markdownToAdf(markdown);
const backToMarkdown = parser.adfToMarkdown(adf);

console.log('✅ CommonJS conversion working!');
console.log('Original:', markdown);
console.log('Round-trip result:', backToMarkdown);

// Test modular imports
const { StreamingParser } = require('extended-markdown-adf-parser/streaming');
console.log('✅ CommonJS modular imports working!');
```

### ES Modules Test

**test-esm.mjs** (or use .js with "type": "module" in package.json):
```javascript
import { Parser } from 'extended-markdown-adf-parser';

const parser = new Parser();
console.log('✅ ESM installation successful!');

// Quick functionality test
const markdown = '# Hello World\n\nThis is a **test** document.';
const adf = parser.markdownToAdf(markdown);
const backToMarkdown = parser.adfToMarkdown(adf);

console.log('✅ ESM conversion working!');
console.log('Original:', markdown);
console.log('Round-trip result:', backToMarkdown);

// Test modular imports
import { StreamingParser } from 'extended-markdown-adf-parser/streaming';
console.log('✅ ESM modular imports working!');
```

### TypeScript Test

**test-typescript.ts**:
```typescript
// Test both import styles
import { Parser, type ADFDocument, type ConversionOptions } from 'extended-markdown-adf-parser';

const parser = new Parser();
console.log('✅ TypeScript installation successful!');

// Type checking works
const markdown: string = '# Hello World';
const options: ConversionOptions = { strict: false };
const adf: ADFDocument = parser.markdownToAdf(markdown, options);
console.log('✅ TypeScript types working!');

// Test modular imports with types
import { StreamingParser, type StreamingOptions } from 'extended-markdown-adf-parser/streaming';
const streamingOptions: StreamingOptions = { chunkSize: 1000 };
console.log('✅ TypeScript modular imports and types working!');
```

### Mixed Environment Test

**test-mixed.js** (CommonJS file that tests both approaches):
```javascript
// Test CommonJS approach
const { Parser: CommonJSParser } = require('extended-markdown-adf-parser');
console.log('✅ CommonJS require() working!');

// Test dynamic ESM import from CommonJS
async function testESMImport() {
  const { Parser: ESMParser } = await import('extended-markdown-adf-parser');
  console.log('✅ Dynamic ESM import from CommonJS working!');
  
  // Both should work the same way
  const cjsParser = new CommonJSParser();
  const esmParser = new ESMParser();
  
  const testMarkdown = '# Test';
  const cjsResult = cjsParser.markdownToAdf(testMarkdown);
  const esmResult = esmParser.markdownToAdf(testMarkdown);
  
  console.log('✅ Both module systems produce identical results!');
  console.log('Results match:', JSON.stringify(cjsResult) === JSON.stringify(esmResult));
}

testESMImport().catch(console.error);
```

## Run the Tests

Choose the test that matches your environment:

```bash
# Test CommonJS support
node test-commonjs.js

# Test ES Modules support  
node test-esm.mjs

# Test TypeScript support (requires ts-node or tsc)
npx ts-node test-typescript.ts
# or compile first:
# npx tsc test-typescript.ts && node test-typescript.js

# Test mixed environment (CommonJS + dynamic ESM import)
node test-mixed.js
```

## Expected Output

All tests should produce output similar to:

```
✅ [Module System] installation successful!
✅ [Module System] conversion working!
Original: # Hello World

This is a **test** document.
Round-trip result: # Hello World

This is a **test** document.
✅ [Module System] modular imports working!
```
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
npm install extended-markdown-adf-parser@1.1.0
yarn add extended-markdown-adf-parser@1.1.0
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