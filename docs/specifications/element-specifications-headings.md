# headings

## Description

Headings provide document structure and hierarchy. The parser supports all six heading levels (H1-H6) using ATX syntax and also supports Setext syntax for H1 and H2. Headings can be enhanced with custom attributes using metadata comments.

## .md markdown syntax

### ATX Headings (Preferred)
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

<!-- adf:heading anchor="introduction" color="#0052cc" -->
## Introduction Section
```

## .adf-schema.json schema

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "const": "heading"
    },
    "attrs": {
      "type": "object",
      "properties": {
        "level": {
          "type": "integer",
          "minimum": 1,
          "maximum": 6,
          "description": "Heading level (1-6)"
        },
        "id": {
          "type": "string",
          "description": "Custom ID for the heading"
        },
        "textAlign": {
          "type": "string",
          "enum": ["left", "center", "right", "justify"],
          "description": "Text alignment"
        },
        "anchor": {
          "type": "string",
          "description": "Anchor link identifier"
        }
      },
      "required": ["level"],
      "additionalProperties": true
    },
    "content": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "const": "text"
          },
          "text": {
            "type": "string"
          }
        }
      },
      "minItems": 1
    }
  },
  "required": ["type", "attrs", "content"]
}
```

## Examples

### Basic Headings
```markdown
# Main Document Title

## Section Heading

### Subsection

#### Sub-subsection

##### Minor Heading

###### Smallest Heading
```

### Centered Heading
```markdown
<!-- adf:heading textAlign="center" -->
# Welcome to Our Documentation
```

### Heading with Custom ID
```markdown
<!-- adf:heading id="getting-started" -->
## Getting Started

This heading can be linked to with #getting-started
```

### Colored Heading
```markdown
<!-- adf:heading color="#ff6600" -->
# Orange Title
```

### Heading with Multiple Attributes
```markdown
<!-- adf:heading id="conclusion" textAlign="center" color="#0052cc" -->
## Conclusion
```