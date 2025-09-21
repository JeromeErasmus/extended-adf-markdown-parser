# paragraphs

## Description

Paragraphs are the basic building blocks of text content in documents. They represent blocks of text separated by blank lines and can contain inline formatting, links, and other inline elements. Paragraphs support custom attributes for alignment, spacing, and styling.

## .md markdown syntax

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

<!-- adf:paragraph backgroundColor="#f0f0f0" color="#333" -->
This paragraph has a gray background with dark text.
```

## .adf-schema.json schema

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "const": "paragraph"
    },
    "attrs": {
      "type": "object",
      "properties": {
        "textAlign": {
          "type": "string",
          "enum": ["left", "center", "right", "justify"],
          "description": "Text alignment"
        },
        "lineHeight": {
          "type": "number",
          "minimum": 0.5,
          "maximum": 3.0,
          "description": "Line height multiplier"
        },
        "backgroundColor": {
          "type": "string",
          "pattern": "^#[0-9a-fA-F]{6}$",
          "description": "Background color (hex)"
        },
        "color": {
          "type": "string",
          "pattern": "^#[0-9a-fA-F]{6}$",
          "description": "Text color (hex)"
        },
        "padding": {
          "type": "string",
          "description": "CSS padding value"
        }
      },
      "additionalProperties": true
    },
    "content": {
      "type": "array",
      "items": {
        "oneOf": [
          {
            "type": "object",
            "properties": {
              "type": {
                "type": "string",
                "const": "text"
              },
              "text": {
                "type": "string"
              },
              "marks": {
                "type": "array",
                "items": {
                  "type": "object"
                }
              }
            }
          },
          {
            "type": "object",
            "properties": {
              "type": {
                "type": "string",
                "const": "hardBreak"
              }
            }
          }
        ]
      }
    }
  },
  "required": ["type", "content"]
}
```

## Examples

### Simple Text
```markdown
This is a basic paragraph with just plain text.
```

### Formatted Text
```markdown
This paragraph contains **bold text**, *italic text*, `inline code`, and a [link](https://example.com).
```

### Center-Aligned Paragraph
```markdown
<!-- adf:paragraph textAlign="center" -->
This text is centered on the page.
```

### Justified Text with Custom Spacing
```markdown
<!-- adf:paragraph textAlign="justify" lineHeight="1.8" -->
This paragraph uses justified alignment and increased line spacing for better readability in longer text blocks. The spacing helps improve comprehension and visual appeal.
```

### Styled Paragraph
```markdown
<!-- adf:paragraph backgroundColor="#e6f3ff" color="#0052cc" padding="16px" -->
This paragraph has a light blue background, blue text, and custom padding to create a highlighted callout effect.
```

### Multiple Attributes
```markdown
<!-- adf:paragraph textAlign="center" backgroundColor="#fff3cd" color="#856404" padding="12px 20px" -->
This is a centered paragraph with a yellow background and brown text, creating a warning-style callout.
```