# Advanced Installation

Advanced installation configurations for different environments and frameworks.

## Module System Support

This package provides **dual module support** with both CommonJS and ES Modules built into the same package. No configuration changes are needed - the appropriate format is automatically selected based on your environment.

### Package Exports Structure

The package includes the following build outputs:

```
dist/
├── index.js          # CommonJS main entry
├── index.mjs         # ES Modules main entry  
├── index.d.ts        # TypeScript definitions
├── streaming.js      # CommonJS streaming module
├── streaming.mjs     # ES Modules streaming module
├── streaming.d.ts    # Streaming TypeScript definitions
├── performance.js    # CommonJS performance module
├── performance.mjs   # ES Modules performance module
├── performance.d.ts  # Performance TypeScript definitions
├── errors.js         # CommonJS error handling
├── errors.mjs        # ES Modules error handling
└── errors.d.ts       # Error handling TypeScript definitions
```

## Environment-Specific Setup

### Node.js Projects

#### ESM Projects (package.json with "type": "module")

```json
{
  "type": "module",
  "dependencies": {
    "extended-markdown-adf-parser": "^1.0.7"
  }
}
```

```javascript
// Direct import works - uses index.mjs automatically
import { Parser } from 'extended-markdown-adf-parser';

// Modular imports also work
import { StreamingParser } from 'extended-markdown-adf-parser/streaming';
import { PerformanceMonitor } from 'extended-markdown-adf-parser/performance';
```

#### CommonJS Projects

```json
{
  "dependencies": {
    "extended-markdown-adf-parser": "^1.0.7"
  }
}
```

```javascript
// Direct require works - uses index.js automatically
const { Parser } = require('extended-markdown-adf-parser');

// Modular imports also work
const { StreamingParser } = require('extended-markdown-adf-parser/streaming');
const { PerformanceMonitor } = require('extended-markdown-adf-parser/performance');
```

#### Mixed Projects (CommonJS with ESM imports)

```javascript
// You can mix both approaches
const { Parser } = require('extended-markdown-adf-parser');

// Or use dynamic import for ESM in CommonJS
const loadParser = async () => {
  const { Parser } = await import('extended-markdown-adf-parser');
  return new Parser();
};
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

The package provides complete TypeScript support for both module systems:

```typescript
// ES Modules - Import types explicitly
import type { 
  ADFDocument, 
  ADFNode, 
  ConversionOptions,
  ValidationResult
} from 'extended-markdown-adf-parser';

// Import runtime components
import { Parser, MarkdownValidator, AdfValidator } from 'extended-markdown-adf-parser';
```

```typescript
// CommonJS - Types work seamlessly
const { Parser }: { 
  Parser: typeof import('extended-markdown-adf-parser').Parser 
} = require('extended-markdown-adf-parser');

// Or with modern CommonJS
import type { ADFDocument } from 'extended-markdown-adf-parser';
const { Parser } = require('extended-markdown-adf-parser');
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

**ES Modules:**
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

**CommonJS:**
```javascript
const express = require('express');
const { Parser } = require('extended-markdown-adf-parser');

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

## Bundle Size Optimization

### Automatic Module Selection

The package automatically selects the optimal format for your build system:

- **Webpack 5**: Uses ES Modules (`.mjs`) for better tree-shaking
- **Rollup/Vite**: Uses ES Modules (`.mjs`) for optimal bundling
- **Node.js**: Uses CommonJS (`.js`) or ESM (`.mjs`) based on your `package.json`
- **TypeScript**: Uses appropriate format with full type support

### Tree Shaking (Webpack/Vite)

```javascript
// Import only what you need - works with both module formats
import { Parser } from 'extended-markdown-adf-parser';

// Modular imports for even smaller bundles
import { StreamingParser } from 'extended-markdown-adf-parser/streaming';
import { PerformanceMonitor } from 'extended-markdown-adf-parser/performance';

// Instead of importing everything
import * as AdfParser from 'extended-markdown-adf-parser'; // ❌ Don't do this
```

### Lazy Loading

```javascript
// ESM lazy loading
const loadParser = async () => {
  const { Parser } = await import('extended-markdown-adf-parser');
  return new Parser();
};

// CommonJS lazy loading
const loadParserCJS = async () => {
  const { Parser } = require('extended-markdown-adf-parser');
  return new Parser();
};

// Use when needed
const parser = await loadParser();
```

### Bundle Analysis

The package provides different entry points for optimal bundling:

```javascript
// Main entry (includes all features)
import { Parser } from 'extended-markdown-adf-parser';

// Streaming-only (smaller bundle)
import { StreamingParser } from 'extended-markdown-adf-parser/streaming';

// Performance monitoring only  
import { PerformanceMonitor } from 'extended-markdown-adf-parser/performance';

// Error handling only
import { ErrorRecoveryManager } from 'extended-markdown-adf-parser/errors';
```