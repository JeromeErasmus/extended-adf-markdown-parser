# Extended Markdown Element Specifications

This document provides an overview of all supported elements in the Extended ADF Markdown Parser. Each element has its own detailed specification document with syntax, schema, and examples.

## Overview

This parser supports standard Markdown plus Atlassian Document Format (ADF) extensions, providing bidirectional conversion between Markdown and ADF with full fidelity preservation.

## Element Categories

### Core System Elements
- **[Metadata Comments](./specifications/element-specifications-metadata-comments.md)** - Custom attribute system for any element

### Text Structure Elements
- **[Headings](./specifications/element-specifications-headings.md)** - Document hierarchy (H1-H6)
- **[Paragraphs](./specifications/element-specifications-paragraphs.md)** - Basic text blocks with styling options

### Text Formatting Elements
- **[Bold](./specifications/element-specifications-bold.md)** - Strong emphasis text formatting
- **[Italic](./specifications/element-specifications-italic.md)** - Emphasis text formatting  
- **[Strikethrough](./specifications/element-specifications-strikethrough.md)** - Crossed-out text
- **[Inline Code](./specifications/element-specifications-inline-code.md)** - Code spans within text
- **[Underline](./specifications/element-specifications-underline.md)** - Underlined text formatting
- **[Subscript/Superscript](./specifications/element-specifications-subscript-superscript.md)** - Sub and superscript text
- **[Text Color](./specifications/element-specifications-text-color.md)** - Custom text colors
- **[Background Color](./specifications/element-specifications-background-color.md)** - Text background highlighting
- **[Links](./specifications/element-specifications-links.md)** - Navigation and references

### List Elements
- **[Bullet Lists](./specifications/element-specifications-bullet-lists.md)** - Unordered lists with various markers
- **[Ordered Lists](./specifications/element-specifications-ordered-lists.md)** - Numbered lists with custom start values

### Block Elements
- **[Code Blocks](./specifications/element-specifications-code-blocks.md)** - Multi-line code with syntax highlighting
- **[Tables](./specifications/element-specifications-tables.md)** - Structured data with headers and cells
- **[Blockquotes](./specifications/element-specifications-blockquotes.md)** - Quoted content blocks
- **[Horizontal Rules](./specifications/element-specifications-horizontal-rules.md)** - Section dividers

### ADF Extension Elements
- **[Panels](./specifications/element-specifications-panels.md)** - Semantic content containers (info, warning, error, success, note)
- **[Expand Sections](./specifications/element-specifications-expand-sections.md)** - Collapsible content areas

### Media Elements
- **[Media](./specifications/element-specifications-media.md)** - Individual media items (images, videos, files)
- **[Media Single](./specifications/element-specifications-media-single.md)** - Single media with layout control
- **[Media Group](./specifications/element-specifications-media-group.md)** - Multiple media collections

### Social and Interactive Elements
- **[Mention](./specifications/element-specifications-mention.md)** - User and group references
- **[Emoji](./specifications/element-specifications-emoji.md)** - Emoji characters and expressions
- **[Date](./specifications/element-specifications-date.md)** - Date and timestamp elements
- **[Status](./specifications/element-specifications-status.md)** - Status indicators and badges
- **[Inline Card](./specifications/element-specifications-inline-card.md)** - Rich link previews

### Advanced Features
- **[Frontmatter](./specifications/element-specifications-frontmatter.md)** - YAML metadata headers

## Element Reference Table

| Element | Type | ADF Node | Specification File |
|---------|------|----------|-------------------|
| Metadata Comments | System | N/A | [element-specifications-metadata-comments.md](./specifications/element-specifications-metadata-comments.md) |
| Headings | Block | `heading` | [element-specifications-headings.md](./specifications/element-specifications-headings.md) |
| Paragraphs | Block | `paragraph` | [element-specifications-paragraphs.md](./specifications/element-specifications-paragraphs.md) |
| Bold | Inline | `mark:strong` | [element-specifications-bold.md](./specifications/element-specifications-bold.md) |
| Italic | Inline | `mark:em` | [element-specifications-italic.md](./specifications/element-specifications-italic.md) |
| Strikethrough | Inline | `mark:strike` | [element-specifications-strikethrough.md](./specifications/element-specifications-strikethrough.md) |
| Inline Code | Inline | `mark:code` | [element-specifications-inline-code.md](./specifications/element-specifications-inline-code.md) |
| Underline | Inline | `mark:underline` | [element-specifications-underline.md](./specifications/element-specifications-underline.md) |
| Text Color | Inline | `mark:textColor` | [element-specifications-text-color.md](./specifications/element-specifications-text-color.md) |
| Background Color | Inline | `mark:backgroundColor` | [element-specifications-background-color.md](./specifications/element-specifications-background-color.md) |
| Subscript/Superscript | Inline | `mark:subsup` | [element-specifications-subscript-superscript.md](./specifications/element-specifications-subscript-superscript.md) |
| Links | Inline | `mark:link` | [element-specifications-links.md](./specifications/element-specifications-links.md) |
| Bullet Lists | Block | `bulletList` | [element-specifications-bullet-lists.md](./specifications/element-specifications-bullet-lists.md) |
| Ordered Lists | Block | `orderedList` | [element-specifications-ordered-lists.md](./specifications/element-specifications-ordered-lists.md) |
| Code Blocks | Block | `codeBlock` | [element-specifications-code-blocks.md](./specifications/element-specifications-code-blocks.md) |
| Tables | Block | `table` | [element-specifications-tables.md](./specifications/element-specifications-tables.md) |
| Blockquotes | Block | `blockquote` | [element-specifications-blockquotes.md](./specifications/element-specifications-blockquotes.md) |
| Horizontal Rules | Block | `rule` | [element-specifications-horizontal-rules.md](./specifications/element-specifications-horizontal-rules.md) |
| Panels | Block | `panel` | [element-specifications-panels.md](./specifications/element-specifications-panels.md) |
| Expand Sections | Block | `expand` | [element-specifications-expand-sections.md](./specifications/element-specifications-expand-sections.md) |
| Media | Block | `media` | [element-specifications-media.md](./specifications/element-specifications-media.md) |
| Media Single | Block | `mediaSingle` | [element-specifications-media-single.md](./specifications/element-specifications-media-single.md) |
| Media Group | Block | `mediaGroup` | [element-specifications-media-group.md](./specifications/element-specifications-media-group.md) |
| Mention | Inline | `mention` | [element-specifications-mention.md](./specifications/element-specifications-mention.md) |
| Emoji | Inline | `emoji` | [element-specifications-emoji.md](./specifications/element-specifications-emoji.md) |
| Date | Inline | `date` | [element-specifications-date.md](./specifications/element-specifications-date.md) |
| Status | Inline | `status` | [element-specifications-status.md](./specifications/element-specifications-status.md) |
| Inline Card | Inline | `inlineCard` | [element-specifications-inline-card.md](./specifications/element-specifications-inline-card.md) |
| Frontmatter | Meta | N/A | [element-specifications-frontmatter.md](./specifications/element-specifications-frontmatter.md) |

## Usage Patterns

### Basic Document Structure
```markdown
---
title: "Document Title"
author: "Author Name"
---

# Main Heading

This is a paragraph with **bold** and *italic* text.

## Section Heading

- Bullet list item
- Another item

1. Ordered list item
2. Another numbered item
```

### ADF Extensions Usage
```markdown
~~~panel type=info title="Information Panel"
This is an information panel with rich content.
~~~

~~~expand title="Click to expand"
This content is collapsible.
~~~
```

### Custom Attributes
```markdown
<!-- adf:paragraph textAlign="center" -->
This paragraph is center-aligned.

<!-- adf:heading id="custom-id" -->
# Heading with Custom ID
```

## File Naming Convention

Individual element specification files follow the pattern:
```
element-specifications-<element-name>.md
```

Where `<element-name>` is the lowercase, hyphenated element identifier.

## Schema Validation

Each element specification includes:
- **Description** - Purpose and use cases
- **Markdown Syntax** - How to write it in Markdown
- **ADF Schema** - JSON schema for the ADF representation
- **Examples** - Practical usage examples

## Next Steps

- Browse individual element specifications for detailed syntax
- See [Quick Start Guide](./quick-start.md) for getting started
- Review [Installation Guide](./installation.md) for setup instructions
- Check the main [README](../README.md) for supported elements overview
