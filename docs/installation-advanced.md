# Advanced Installation

Advanced installation configurations for different environments and frameworks.

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

## Bundle Size Optimization

### Tree Shaking (Webpack/Vite)

```javascript
// Import only what you need
import { Parser } from 'extended-markdown-adf-parser';

// Instead of
import * as AdfParser from 'extended-markdown-adf-parser';
```

### Lazy Loading

```javascript
// Lazy load for better performance
const loadParser = async () => {
  const { Parser } = await import('extended-markdown-adf-parser');
  return new Parser();
};

// Use when needed
const parser = await loadParser();
```