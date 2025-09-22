# Markdown to ADF Conversion

Convert Extended Markdown to Atlassian Document Format (ADF) with full feature support and customization options.

## Overview

The library provides two specialized parsers for converting Markdown to ADF, each optimized for different use cases and performance requirements.

## Choosing the Right Parser

The library provides two parser implementations optimized for different use cases:

### Basic MarkdownParser

Use the basic `MarkdownParser` when you need:
- **High Performance**: Synchronous operation with minimal overhead for simple documents
- **Simple Conversion**: Basic markdown → ADF conversion with automatic metadata comment detection
- **Lightweight Processing**: Memory-efficient parsing for large volumes
- **Smart Processing**: Automatically switches to enhanced processing when metadata comments are detected

```typescript
import { MarkdownParser } from 'extended-markdown-adf-parser';

const parser = new MarkdownParser({
  strict: false  // Enable error recovery (recommended)
});

// Fast, synchronous parsing
const adf = parser.parse(markdown);
```

**Best for**: High-throughput applications, simple markdown conversion, performance-critical scenarios.

### Enhanced MarkdownParser

Use the `EnhancedMarkdownParser` when you need:
- **Bidirectional Conversion**: Full ADF → Markdown → ADF round-trip fidelity
- **GitHub Flavored Markdown**: Tables, strikethrough, task lists, autolinks
- **YAML Frontmatter**: Document metadata headers
- **Advanced Features**: Async/sync support, complex attribute preservation
- **Always Enhanced Processing**: Consistent enhanced processing regardless of content

```typescript
import { EnhancedMarkdownParser } from 'extended-markdown-adf-parser';

const parser = new EnhancedMarkdownParser({
  strict: false,
  gfm: true,              // GitHub Flavored Markdown (default: true)
  frontmatter: true,      // YAML frontmatter support (default: true)  
  adfExtensions: true,    // ADF fence blocks (default: true)
  maxNestingDepth: 5      // Prevent infinite recursion (default: 5)
});

// Async parsing with full feature support
const adf = await parser.parse(markdown);

// Bidirectional conversion
const reconstructedMarkdown = await parser.stringify(adf);
```

**Best for**: Content management systems, documentation tools, full-featured markdown processing.

### Decision Matrix

| Feature | Basic Parser | Enhanced Parser |
|---------|:------------:|:---------------:|
| **Performance** | ⚡ Fastest* | 🔄 Good |
| **Memory Usage** | 💚 Minimal* | 🟡 Moderate |
| **Async/Sync** | ✅ Sync only | ✅ Both |
| **Metadata Comments** | ✅ Yes | ✅ Yes |
| **Bidirectional** | ❌ Markdown→ADF only | ✅ Full round-trip |
| **GitHub Flavored MD** | ❌ Basic | ✅ Complete |
| **YAML Frontmatter** | ❌ No | ✅ Yes |
| **ADF Extensions** | ✅ All ADF blocks | ✅ All ADF blocks |
| **Custom Attributes** | ✅ Via metadata | ✅ Via metadata |

**Performance Notes:**
- *Basic Parser maintains fast performance for documents without metadata comments
- *When metadata comments are detected, Basic Parser automatically uses enhanced processing (similar performance to Enhanced Parser)
- *Memory usage remains minimal for simple documents, moderate when metadata comments are present

## Configuration Options

### Basic Parser Options

```typescript
interface MarkdownParseOptions {
  tokenizer?: TokenizeOptions;
  astBuilder?: ASTBuildOptions;
}

// High-performance configuration
const fastParser = new MarkdownParser({
  astBuilder: {
    strict: false,
    preserveWhitespace: false
  }
});

// Strict validation configuration
const strictParser = new MarkdownParser({
  tokenizer: { strict: true },
  astBuilder: { strict: true }
});
```

### Enhanced Parser Options

```typescript
interface EnhancedMarkdownParseOptions {
  strict?: boolean;               // Enable strict parsing mode
  customBlockTypes?: string[];    // Custom ADF block types to support  
  maxNestingDepth?: number;       // Maximum nesting depth allowed
  gfm?: boolean;                  // Enable GitHub Flavored Markdown extensions
  frontmatter?: boolean;          // Enable frontmatter parsing
  adfExtensions?: boolean;        // Enable ADF fence block extensions
}

// Content management system configuration
const cmsParser = new EnhancedMarkdownParser({
  strict: false,
  gfm: true,
  frontmatter: true,
  adfExtensions: true,
  maxNestingDepth: 8
});
```

## Advanced Features

### Metadata Comments

Add custom ADF attributes to any element:

```typescript
const markdownWithMetadata = `
<!-- adf:heading attrs='{"id":"custom-heading","textAlign":"center"}' -->
# Centered Heading

<!-- adf:paragraph textAlign="justify" lineHeight="1.5" -->
This paragraph is justified with custom line height.

<!-- adf:panel backgroundColor="#f0f8ff" borderColor="#4169e1" -->
~~~panel type=info title="Custom Styled Panel"
This panel has custom background and border colors.
~~~
`;

const parser = new EnhancedMarkdownParser();
const adf = await parser.parse(markdownWithMetadata);
// Custom attributes are preserved in the ADF structure
```

### YAML Frontmatter

Document metadata support:

```typescript
const markdownWithFrontmatter = `---
title: "Technical Documentation"
author: "Development Team"
version: "2.1.0"
tags: [docs, api, guide]
metadata:
  audience: "developers"
  difficulty: "intermediate"
---

# API Documentation

Content follows here...`;

const parser = new EnhancedMarkdownParser({ frontmatter: true });
const adf = await parser.parse(markdownWithFrontmatter);
// Frontmatter is available in adf.frontmatter property
```

### GitHub Flavored Markdown

Enhanced table support, strikethrough, and more:

```typescript
const gfmMarkdown = `
| Feature | Basic | Enhanced |
|---------|:-----:|:--------:|
| Tables | ❌ | ✅ |
| ~~Strikethrough~~ | ❌ | ✅ |
| Task Lists | ❌ | ✅ |

- [x] Completed task
- [ ] Pending task
- [ ] Another pending task

Autolink: https://example.com
`;

const parser = new EnhancedMarkdownParser({ gfm: true });
const adf = await parser.parse(gfmMarkdown);
```

## Performance

| Parser Type | Speed | Memory | Use Case |
|-------------|:-----:|:------:|----------|
| **Basic** | ~1ms | ~50KB | High-volume processing |
| **Enhanced** | ~3ms | ~150KB | Feature-rich documents |

For detailed error handling patterns and troubleshooting, see **[Error Handling Guide](./error-handling.md)**.

## Next Steps

- **[ADF to Markdown](./adf-to-markdown.md)** - Convert ADF back to markdown
- **[Element Specifications](./specifications/)** - Detailed element documentation
- **[Advanced Installation](./installation-advanced.md)** - Framework integration