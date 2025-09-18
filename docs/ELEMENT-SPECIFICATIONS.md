# Extended Markdown Element Specifications

This document provides comprehensive formatting specifications for all supported elements in the Extended ADF Markdown Parser. This parser supports standard Markdown plus Atlassian Document Format (ADF) extensions.

## Table of Contents

- [Metadata Comments](#metadata-comments)
- [Text Formatting](#text-formatting)
- [Headings](#headings)
- [Paragraphs](#paragraphs)
- [Lists](#lists)
- [Tables](#tables)
- [Code Blocks](#code-blocks)
- [Blockquotes](#blockquotes)
- [ADF Extensions](#adf-extensions)
  - [Panels](#panels)
  - [Expand Sections](#expand-sections)
  - [Media Elements](#media-elements)
- [Horizontal Rules](#horizontal-rules)
- [Links](#links)

## Metadata Comments

Metadata comments allow you to specify custom ADF attributes that aren't expressible in standard Markdown syntax. They use HTML comment syntax with a specific pattern.

### Basic Syntax
```markdown
<!-- adf:nodeType attributeName="value" -->
Content here
```

### Alternative JSON Format (Legacy)
```markdown
<!-- adf:nodeType attrs='{"attributeName":"value"}' -->
Content here
```

### Examples
```markdown
<!-- adf:paragraph textAlign="center" backgroundColor="#f0f0f0" -->
This paragraph is centered with a light gray background.

<!-- adf:heading id="custom-section" textAlign="center" -->
# Custom Heading

<!-- adf:panel backgroundColor="#e6f3ff" borderColor="#0052cc" -->
~~~panel type=info
Panel with custom styling.
~~~
```

### Multiple Metadata Comments
You can apply multiple metadata comments to the same element:
```markdown
<!-- adf:paragraph textAlign="center" -->
<!-- adf:paragraph backgroundColor="#fff3cd" -->
This paragraph has both center alignment and yellow background.
```

## Text Formatting

### Bold Text
```markdown
**bold text** or __bold text__
```

### Italic Text
```markdown
*italic text* or _italic text_
```

### Strikethrough
```markdown
~~strikethrough text~~
```

### Inline Code
```markdown
`inline code`
```

### Subscript/Superscript (with metadata)
```markdown
<!-- adf:subsup type="sub" -->
H<sub>2</sub>O

<!-- adf:subsup type="sup" -->
E=mc<sup>2</sup>
```

### Custom Text Color
```markdown
<!-- adf:text color="#ff0000" -->
**Red bold text**
```

## Headings

### Standard ATX Headings
```markdown
# Heading 1
## Heading 2  
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

### Setext Headings (H1 and H2 only)
```markdown
Heading 1
=========

Heading 2
---------
```

### Headings with Custom Attributes
```markdown
<!-- adf:heading id="custom-section" textAlign="center" -->
# Custom Heading
```

## Paragraphs

### Basic Paragraphs
```markdown
This is a simple paragraph of text.

This is another paragraph, separated by a blank line.
```

### Paragraphs with Custom Attributes
```markdown
<!-- adf:paragraph textAlign="center" -->
This paragraph is center-aligned.

<!-- adf:paragraph textAlign="justify" lineHeight="1.6" -->
This paragraph is justified with custom line height.
```

## Lists

### Bullet Lists
```markdown
- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
- Item 3
```

Alternative markers: `*` or `+`

### Ordered Lists
```markdown
1. First item
2. Second item
   1. Nested item 2.1
   2. Nested item 2.2
3. Third item
```

### Lists with Custom Start Numbers
```markdown
5. Fifth item
6. Sixth item
7. Seventh item
```

### Lists with Custom Attributes
```markdown
<!-- adf:orderedList order="5" -->
5. Custom ordered list starting at 5

<!-- adf:bulletList bulletStyle="square" -->
- Square bullet list
- Another item
```

## Tables

### Basic Tables
```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

### Tables with Alignment
```markdown
| Left | Center | Right |
|:-----|:------:|------:|
| L1   | C1     | R1    |
| L2   | C2     | R2    |
```

### Tables with Custom Attributes
```markdown
<!-- adf:table layout="full-width" borderColor="#333" -->
| Header 1 | Header 2 |
|----------|----------|
| Content  | Content  |

<!-- adf:tableCell backgroundColor="#f6f6f6" -->
| Gray cell | Normal cell |
|-----------|-------------|
| Content   | Content     |
```

## Code Blocks

### Fenced Code Blocks
```markdown
```javascript
function example() {
  console.log('Hello, world!');
  return 'success';
}
```
```

### Code Blocks without Language
```markdown
```
Plain text code block
```
```

### Indented Code Blocks
```markdown
    function indented() {
        return 'This is indented code';
    }
```

### Code Blocks with Custom Attributes
```markdown
<!-- adf:codeBlock theme="dark" lineNumbers="true" -->
```python
def greet(name):
    print(f'Hello, {name}!')
```
```

## Blockquotes

### Simple Blockquotes
```markdown
> This is a blockquote.
```

### Multi-paragraph Blockquotes
```markdown
> This is the first paragraph of a blockquote.
>
> This is the second paragraph in the same blockquote.
```

### Nested Blockquotes
```markdown
> This is a blockquote.
> 
> > This is a nested blockquote.
```

### Blockquotes as Panel Alternatives
```markdown
> ℹ️ **Info**
>
> This is an info panel using blockquote syntax.

> ⚠️ **Warning**
>
> This is a warning panel.

> ✅ **Success**
>
> This is a success panel.

> ❌ **Error**
>
> This is an error panel.

> 📝 **Note**
>
> This is a note panel.
```

## ADF Extensions

### Panels

ADF panels provide rich content containers with semantic meaning.

#### Fence Block Syntax
```markdown
~~~panel type=info
This is an info panel with basic content.
~~~

~~~panel type=warning title="Important Warning"
This is a warning panel with a custom title.
~~~

~~~panel type=error
This is an error panel for critical information.
~~~

~~~panel type=success
This is a success panel for positive feedback.
~~~

~~~panel type=note
This is a note panel for additional context.
~~~
```

#### Panel Types
- `info` - Blue information panels
- `warning` - Yellow warning panels  
- `error` - Red error panels
- `success` - Green success panels
- `note` - Gray note panels

#### Panels with Custom Attributes
```markdown
<!-- adf:panel backgroundColor="#e6f3ff" borderColor="#0052cc" padding="16px" -->
~~~panel type=info title="Custom Styled Panel"
This panel has custom background, border, and padding.
~~~
```

### Expand Sections

Expandable/collapsible content sections.

#### Fence Block Syntax
```markdown
~~~expand title="Click to expand this section"
This content is hidden by default and revealed when clicked.
It supports **rich formatting** and [links](https://example.com).
~~~
```

#### HTML Details Syntax (Alternative)
```markdown
<details>
<summary>Click to expand this section</summary>

This content is hidden by default.

</details>
```

#### Nested Expands
```markdown
~~~expand title="Parent Section"
This is the parent content.

~~~nestedExpand title="Nested Section"
This is nested content inside the parent expand.
~~~

More parent content here.
~~~
```

#### Expands with Custom Attributes
```markdown
<!-- adf:expand defaultOpen="true" titleColor="#0052cc" -->
~~~expand title="Auto-opened Section"
This expand section opens automatically.
~~~
```

### Media Elements

#### Media Placeholders
```markdown
![Alt text](adf:media:media-id-123)
```

#### Media with Collections
```markdown
<!-- adf:media collection="project-assets" width="800" height="600" -->
![Architecture Diagram](adf:media:architecture-diagram-2024)
```

#### Media Single (Wrapper)
```markdown
<!-- adf:mediaSingle layout="center" width="75" -->
![Centered Image](adf:media:image-123)
```

#### Media Single Layout Options
- `center` - Centered (default)
- `align-start` - Left aligned
- `align-end` - Right aligned  
- `full-width` - Full width
- `wide` - Wide layout

#### Media Groups (Gallery)
```markdown
![Image 1](adf:media:img1) ![Image 2](adf:media:img2) ![Image 3](adf:media:img3)
```

#### Traditional Image Links (Fallback)
```markdown
![Alt text](https://example.com/image.jpg "optional title")
```

## Horizontal Rules

```markdown
---

***

___

- - -

* * *

_ _ _
```

## Links

### Inline Links
```markdown
[Link text](https://example.com)
[Link with title](https://example.com "Link Title")
```

### Reference Links
```markdown
[Link text][reference-id]
[Another link][1]

[reference-id]: https://example.com
[1]: https://another-example.com "Optional Title"
```

### Automatic Links
```markdown
<https://example.com>
<email@example.com>
```

### Links with Custom Attributes
```markdown
<!-- adf:link target="_blank" rel="noopener noreferrer" -->
[External Link](https://example.com)
```

## Frontmatter Support

### YAML Frontmatter
```markdown
---
title: Document Title
author: Author Name
date: 2024-01-01
tags: [tag1, tag2]
---

# Document Content
```

### TOML Frontmatter
```markdown
+++
title = "Document Title"
author = "Author Name"
date = 2024-01-01
tags = ["tag1", "tag2"]
+++

# Document Content
```

## Common Metadata Attributes

### Text Alignment
- `textAlign: "left" | "center" | "right" | "justify"`

### Colors
- `color: "#hex"` - Text color
- `backgroundColor: "#hex"` - Background color
- `borderColor: "#hex"` - Border color

### Layout
- `layout: "default" | "full-width" | "wide" | "center"`
- `width: number` - Width percentage (0-100)
- `padding: string` - CSS padding value

### Typography
- `fontWeight: "normal" | "bold" | number`
- `fontStyle: "normal" | "italic"`
- `lineHeight: number` - Line height multiplier

### Panel-specific
- `panelType: "info" | "warning" | "error" | "success" | "note"`

### Table-specific
- `isNumberColumnEnabled: boolean`
- `layout: "default" | "full-width" | "wide"`

### Media-specific
- `collection: string` - Media collection identifier
- `type: "file" | "video" | "image"`
- `alt: string` - Alternative text

## Best Practices

1. **Metadata Placement**: Place metadata comments directly before the content they modify
2. **Attribute Format**: Use the newer `key="value"` format instead of JSON when possible  
3. **Spacing**: You can add spacing between metadata comments and content as needed
4. **Round-trip Fidelity**: All custom attributes are preserved during ADF ↔ Markdown conversion
5. **Validation**: Invalid metadata comments are ignored gracefully
6. **Nested Content**: Metadata can be applied to content within ADF fence blocks

## Examples

### Complete Document Example
```markdown
---
title: "Complete Document Example"
author: "Extended ADF Parser"
---

<!-- adf:heading id="main-title" textAlign="center" -->
# Main Document Title

<!-- adf:paragraph textAlign="justify" lineHeight="1.6" -->
This is a justified paragraph with custom line spacing that demonstrates the full capabilities of the Extended ADF Markdown Parser.

<!-- adf:panel backgroundColor="#e6f7ff" borderColor="#1890ff" -->
~~~panel type=info title="Important Information"
This panel contains important information with custom styling.

<!-- adf:bulletList bulletStyle="square" -->
- Custom styled bullet list
- With square bullets
- Inside the panel
~~~

## Standard Markdown Section

This section uses standard Markdown without ADF extensions:

- **Bold text**
- *Italic text*  
- `Inline code`
- ~~Strikethrough~~

```javascript
// Code block with syntax highlighting
function example() {
    return "Hello, World!";
}
```

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |

<!-- adf:expand defaultOpen="true" -->
~~~expand title="Additional Resources"
This expandable section contains additional resources and links for further reading.

[External Documentation](https://example.com)
~~~
```

This specification covers all supported elements and their formatting options in the Extended ADF Markdown Parser. For implementation details and API usage, see the main README.md file.