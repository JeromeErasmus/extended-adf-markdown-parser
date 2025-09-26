# Markdown to ADF Conversion

Convert Extended Markdown to Atlassian Document Format (ADF) with full feature support and customization options.

## Overview

The library features a **unified architecture** (v2.1.6+) with consistent, high-quality conversion across all parser interfaces. All parsers now use shared conversion engines internally.

## Unified Parser Architecture (v2.1.6+)

The library provides multiple interfaces to the same high-quality conversion engine:

### Main Parser Class (Recommended)

The unified `Parser` class provides all features by default:

```typescript
import { Parser } from 'extended-markdown-adf-parser';

// All features enabled by default
const parser = new Parser({
  strict: false,          // Error recovery enabled
  preserveUnknownNodes: true  // Preserve unknown ADF nodes
});

// Synchronous parsing
const adf = parser.markdownToAdf(markdown);

// Asynchronous parsing
const adf2 = await parser.markdownToAdfAsync(markdown);
```

**Features Included:**
- ✅ GitHub Flavored Markdown (tables, strikethrough, task lists)
- ✅ YAML Frontmatter support
- ✅ ADF Fence blocks (`~~~panel`, `~~~expand`, etc.)
- ✅ Social elements (`{user:mention}`, `:emoji:`, `{status:text}`)
- ✅ Sync/async support
- ✅ Error recovery
- ✅ Performance monitoring

### EnhancedMarkdownParser (Backward Compatibility)

Maintained for backward compatibility - **same functionality as Parser**:

```typescript
import { EnhancedMarkdownParser } from 'extended-markdown-adf-parser';

// Identical functionality to Parser class
const parser = new EnhancedMarkdownParser();

// Alternative API methods
const adf = parser.parseSync(markdown);          // Same as parser.markdownToAdf()
const adf2 = await parser.parse(markdown);      // Same as parser.markdownToAdfAsync()
```

### Direct Engine Usage (Advanced)

For custom implementations:

```typescript
import { MarkdownToAdfEngine } from 'extended-markdown-adf-parser';

const engine = new MarkdownToAdfEngine({
  strict: false,
  gfm: true,
  frontmatter: true,
  enableAdfExtensions: true
});

const adf = engine.convert(markdown);
const adf2 = await engine.convertAsync(markdown);
```

### All Approaches Produce Identical Results

**Key Benefit**: No more choosing between different quality levels - all interfaces provide the same high-quality conversion.

| Interface | Use Case | API Methods |
|-----------|----------|-------------|
| **Parser** | Recommended for new projects | `markdownToAdf()`, `markdownToAdfAsync()` |
| **EnhancedMarkdownParser** | Backward compatibility | `parseSync()`, `parse()` |
| **MarkdownToAdfEngine** | Custom implementations | `convert()`, `convertAsync()` |

**Migration Benefits:**
- 🎯 **Consistent Quality**: All approaches now produce identical, high-quality results
- ✨ **Simplified API**: No more `enableAdfExtensions` flag needed
- 🔧 **Social Elements**: Proper parsing of mentions, emojis, status, dates everywhere
- ⚡ **Performance**: Shared engines improve maintainability and consistency

## Configuration Options

### Unified Parser Options

All parser interfaces support the same configuration options:

```typescript
interface ConversionOptions {
  strict?: boolean;               // Enable strict parsing mode (default: false)
  gfm?: boolean;                 // GitHub Flavored Markdown (default: true)
  frontmatter?: boolean;         // YAML frontmatter support (default: true)
  enableAdfExtensions?: boolean; // ADF fence blocks (default: true)
  maxDepth?: number;             // Maximum nesting depth (default: 5)
  enableLogging?: boolean;       // Enable debug logging (default: false)
  preserveWhitespace?: boolean;  // Preserve whitespace (default: false)
  validateInput?: boolean;       // Validate input (default: false)
  preserveUnknownNodes?: boolean; // Preserve unknown nodes (default: true)
  // Error recovery options
  maxRetries?: number;           // Max retry attempts (default: 3)
  retryDelay?: number;           // Retry delay in ms (default: 100)
  fallbackStrategy?: 'strict' | 'best-effort'; // Fallback strategy (default: 'best-effort')
}

// Example configurations
const parser = new Parser({
  strict: false,
  gfm: true,
  frontmatter: true,
  enableAdfExtensions: true,
  maxDepth: 8,
  preserveUnknownNodes: true
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

const parser = new Parser();
const adf = parser.markdownToAdf(markdownWithMetadata);
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

const parser = new Parser({ frontmatter: true });
const adf = await parser.markdownToAdfAsync(markdownWithFrontmatter);
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

const parser = new Parser({ gfm: true });
const adf = await parser.markdownToAdfAsync(gfmMarkdown);
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