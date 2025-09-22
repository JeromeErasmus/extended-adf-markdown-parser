# Error Handling

Comprehensive error handling patterns for the Extended Markdown ADF Parser library.

## Overview

The library provides robust error handling mechanisms for both parsing directions (Markdown ↔ ADF) with support for strict and graceful error recovery modes.

## Basic Parser Error Handling

### Configuration

```typescript
const parser = new MarkdownParser({ 
  tokenizer: { strict: false },  // Enable error recovery
  astBuilder: { strict: false }
});

try {
  const adf = parser.parse(malformedMarkdown);
  // Graceful degradation in non-strict mode
} catch (error) {
  console.error('Parsing failed:', error.message);
  // Handle error appropriately
}
```

## Enhanced Parser Error Handling

### Async Error Handling

```typescript
const parser = new EnhancedMarkdownParser({ strict: false });

// Async error handling
try {
  const adf = await parser.parse(complexMarkdown);
} catch (error) {
  console.error('Enhanced parsing failed:', error.message);
}
```

### Validation Before Parsing

```typescript
// Validation before parsing
const validation = await parser.validate(markdown);
if (!validation.valid) {
  console.log('Validation errors:', validation.errors);
  console.log('Validation warnings:', validation.warnings);
}
```

## ADF to Markdown Error Handling

### With Recovery Mode

```typescript
// With error recovery
const markdown = await parser.adfToMarkdownWithRecovery(adf, options);
```

### Configuration Options

```typescript
interface ConversionOptions {
  strict?: boolean;              // Enable strict mode (throws on errors)
  preserveUnknownNodes?: boolean; // Keep unknown node types (default: true)
  enableLogging?: boolean;       // Enable conversion warnings (default: false)
}

// Usage examples
const markdown1 = parser.adfToMarkdown(adf, { strict: true });
const markdown2 = parser.adfToMarkdown(adf, { 
  preserveUnknownNodes: false,
  enableLogging: true 
});
```

## Common Error Patterns

### Invalid Markdown

```typescript
try {
  const adf = parser.markdownToAdf(invalidMarkdown);
} catch (error) {
  console.error('Parsing failed:', error.message);
}
```

### Validation with Error Reporting

```typescript
import { MarkdownValidator, AdfValidator } from 'extended-markdown-adf-parser';

const markdownValidator = new MarkdownValidator();
const adfValidator = new AdfValidator();

// Validate markdown before parsing
const markdownIssues = markdownValidator.validate(markdown);
if (markdownIssues.errors.length > 0) {
  console.log('Markdown validation errors:', markdownIssues.errors);
}

// Validate ADF before processing
const isValidAdf = adfValidator.isValidAdf(adfDocument);
if (!isValidAdf) {
  console.log('Invalid ADF document');
}
```

### Batch Processing with Error Handling

```typescript
const documents = [markdown1, markdown2, markdown3];

const adfDocuments = documents.map(md => {
  try {
    return parser.markdownToAdf(md);
  } catch (error) {
    console.error('Failed to parse:', error.message);
    return null;
  }
}).filter(Boolean);
```

## Debug Mode

### Detailed Error Reporting

```typescript
const parser = new EnhancedMarkdownParser({
  strict: true,  // Enable strict mode for debugging
  // Add custom error handling
});

// Enable detailed error reporting
try {
  const adf = await parser.parse(markdown);
} catch (error) {
  console.error('Detailed error:', error);
  console.error('Stack trace:', error.stack);
}
```

## Troubleshooting

### Memory Usage Issues

Enhanced parser uses more memory due to unified/remark ecosystem:
- **Solution**: Use basic parser for high-volume processing
- **Monitor**: Memory usage in production environments

### Performance Issues

Enhanced parser is slower due to additional features:
- **Solution**: Profile your specific use case
- **Consider**: Hybrid approach (basic for simple, enhanced for complex)

### Async/Sync Mismatch

Enhanced parser's main method is async:
- **Solution**: Use `parseSync()` for synchronous operation
- **Be aware**: Some features may be limited in sync mode