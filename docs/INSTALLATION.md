# Installation Guide

Complete installation instructions for the Extended Markdown ADF Parser across different environments and package managers.

## Prerequisites

### Node.js Requirements

- **Node.js**: Version 20.11.1 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Yarn**: Version 4.7.0 or higher (optional, but recommended)

### Development Prerequisites

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

Check your current versions:
```bash
node --version
npm --version
yarn --version  # if using Yarn
```

### TypeScript Support

This package includes full TypeScript definitions. No additional `@types` packages are required.

- **TypeScript**: Version 4.5.0 or higher (if using TypeScript)
- **ESM Support**: This package is ESM-only and requires Node.js 18+ with ES modules

## Package Installation

### Using npm

```bash
# Install the latest stable version
npm install extended-markdown-adf-parser

# Install a specific version
npm install extended-markdown-adf-parser@1.0.4

# Install as a development dependency
npm install --save-dev extended-markdown-adf-parser
```

### Using Yarn

```bash
# Install the latest stable version
yarn add extended-markdown-adf-parser

# Install a specific version
yarn add extended-markdown-adf-parser@1.0.4

# Install as a development dependency
yarn add --dev extended-markdown-adf-parser
```

### Using pnpm

```bash
# Install the latest stable version
pnpm add extended-markdown-adf-parser

# Install a specific version
pnpm add extended-markdown-adf-parser@1.0.4

# Install as a development dependency
pnpm add --save-dev extended-markdown-adf-parser
```

## Verification

### Basic Import Test

Create a test file to verify the installation:

**test-installation.js** (CommonJS environments):
```javascript
// For CommonJS environments, use dynamic import
(async () => {
  const { Parser } = await import('extended-markdown-adf-parser');
  const parser = new Parser();
  console.log('✅ Installation successful!');
  console.log('Parser version:', parser.version || 'Unknown');
})();
```

**test-installation.mjs** (ES Modules):
```javascript
import { Parser } from 'extended-markdown-adf-parser';

const parser = new Parser();
console.log('✅ Installation successful!');

// Quick functionality test
const markdown = '# Hello World\n\nThis is a **test** document.';
const adf = parser.markdownToAdf(markdown);
const backToMarkdown = parser.adfToMarkdown(adf);

console.log('✅ Basic conversion working!');
console.log('Original:', markdown);
console.log('Round-trip result:', backToMarkdown);
```

**test-installation.ts** (TypeScript):
```typescript
import { Parser, type AdfDocument } from 'extended-markdown-adf-parser';

const parser = new Parser();
console.log('✅ TypeScript installation successful!');

// Type checking works
const markdown: string = '# Hello World';
const adf: AdfDocument = parser.markdownToAdf(markdown);
console.log('✅ TypeScript types working!');
```

### Run the Test

```bash
# For CommonJS
node test-installation.js

# For ES Modules
node test-installation.mjs

# For TypeScript (requires ts-node)
npx ts-node test-installation.ts
```

## Environment-Specific Setup

### Node.js Projects

#### ESM Projects (package.json with "type": "module")

```json
{
  "type": "module",
  "dependencies": {
    "extended-markdown-adf-parser": "^1.0.4"
  }
}
```

```javascript
// Direct import works
import { Parser } from 'extended-markdown-adf-parser';
```

#### CommonJS Projects

```json
{
  "dependencies": {
    "extended-markdown-adf-parser": "^1.0.4"
  }
}
```

```javascript
// Use dynamic import
const { Parser } = await import('extended-markdown-adf-parser');
```

### TypeScript Projects

#### tsconfig.json Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

#### Type Imports

```typescript
// Import types explicitly
import type { 
  AdfDocument, 
  AdfNode, 
  ParserOptions,
  MarkdownValidationResult,
  AdfValidationResult 
} from 'extended-markdown-adf-parser';

// Import runtime components
import { Parser, MarkdownValidator, AdfValidator } from 'extended-markdown-adf-parser';
```

### Frontend Frameworks

#### React/Next.js

```bash
npm install extended-markdown-adf-parser
```

```tsx
// components/AdfRenderer.tsx
import { Parser } from 'extended-markdown-adf-parser';
import { useState, useEffect } from 'react';

export function AdfRenderer({ markdown }: { markdown: string }) {
  const [adf, setAdf] = useState(null);
  
  useEffect(() => {
    const parser = new Parser();
    setAdf(parser.markdownToAdf(markdown));
  }, [markdown]);
  
  return <div>{/* Render ADF */}</div>;
}
```

#### Vue.js

```bash
npm install extended-markdown-adf-parser
```

```vue
<template>
  <div>{{ convertedMarkdown }}</div>
</template>

<script setup lang="ts">
import { Parser } from 'extended-markdown-adf-parser';
import { computed } from 'vue';

const props = defineProps<{ adf: any }>();

const parser = new Parser();
const convertedMarkdown = computed(() => 
  parser.adfToMarkdown(props.adf)
);
</script>
```

### Server Environments

#### Express.js

```javascript
import express from 'express';
import { Parser } from 'extended-markdown-adf-parser';

const app = express();
const parser = new Parser();

app.post('/convert/markdown-to-adf', (req, res) => {
  try {
    const adf = parser.markdownToAdf(req.body.markdown);
    res.json({ adf });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000);
```

#### Serverless Functions

**Vercel:**
```javascript
// api/convert.js
import { Parser } from 'extended-markdown-adf-parser';

const parser = new Parser();

export default function handler(req, res) {
  const { markdown } = req.body;
  const adf = parser.markdownToAdf(markdown);
  res.json({ adf });
}
```

**AWS Lambda:**
```javascript
import { Parser } from 'extended-markdown-adf-parser';

const parser = new Parser();

export const handler = async (event) => {
  const { markdown } = JSON.parse(event.body);
  const adf = parser.markdownToAdf(markdown);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ adf })
  };
};
```

## Troubleshooting

### Common Issues

#### "Cannot use import statement outside a module"

**Solution 1:** Add `"type": "module"` to package.json
```json
{
  "type": "module"
}
```

**Solution 2:** Use dynamic import in CommonJS
```javascript
const { Parser } = await import('extended-markdown-adf-parser');
```

**Solution 3:** Use .mjs file extension
```bash
mv script.js script.mjs
```

#### "Module not found" in TypeScript

**Solution:** Check your tsconfig.json module resolution:
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

#### Performance Issues with Large Documents

**Solution:** Use the streaming parser:
```javascript
import { StreamingParser } from 'extended-markdown-adf-parser/streaming';

const streamingParser = new StreamingParser({
  chunkSize: 1000
});

const result = await streamingParser.parseAsync(largeMarkdown);
```

### Bundle Size Optimization

#### Tree Shaking (Webpack/Vite)

```javascript
// Import only what you need
import { Parser } from 'extended-markdown-adf-parser';

// Instead of
import * as AdfParser from 'extended-markdown-adf-parser';
```

#### Lazy Loading

```javascript
// Lazy load for better performance
const loadParser = async () => {
  const { Parser } = await import('extended-markdown-adf-parser');
  return new Parser();
};

// Use when needed
const parser = await loadParser();
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

## Support

If you encounter installation issues:

- 🐛 **[Report Issues](https://github.com/JeromeErasmus/extended-markdown-adf-parser/issues)**
- 📖 **[Documentation](https://jeromeerasmus.gitbook.io/extended-markdown-adf-parser)**
- 💬 **[Discussions](https://github.com/JeromeErasmus/extended-markdown-adf-parser/discussions)**

Include the following information when reporting installation issues:
- Node.js version (`node --version`)
- npm/Yarn version  
- Operating system
- Error messages
- Package.json configuration