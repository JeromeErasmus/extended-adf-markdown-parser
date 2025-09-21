# bullet-lists

## Description

Bullet lists (unordered lists) present items in no particular order using bullet markers. They support nesting, multiple marker types, and custom attributes for styling. Bullet lists can contain rich content including text formatting, links, and nested elements.

## .md markdown syntax

### Basic Bullet Lists
```markdown
- Item 1
- Item 2
- Item 3
```

### Alternative Markers
```markdown
* Item using asterisk
+ Item using plus sign
- Item using hyphen
```

### Nested Lists
```markdown
- Item 1
  - Nested item 1.1
  - Nested item 1.2
    - Deep nested item 1.2.1
- Item 2
- Item 3
```

### Lists with Custom Attributes
```markdown
<!-- adf:bulletList bulletStyle="square" -->
- Square bullet list
- Another item with square bullets
```

## .adf-schema.json schema

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "const": "bulletList"
    },
    "attrs": {
      "type": "object",
      "properties": {
        "bulletStyle": {
          "type": "string",
          "enum": ["disc", "circle", "square"],
          "description": "Bullet marker style"
        }
      },
      "additionalProperties": true
    },
    "content": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "const": "listItem"
          },
          "content": {
            "type": "array",
            "items": {
              "type": "object",
              "description": "Any valid ADF content nodes"
            }
          }
        },
        "required": ["type", "content"]
      },
      "minItems": 1
    }
  },
  "required": ["type", "content"]
}
```

## Examples

### Simple List
```markdown
- Apple
- Banana
- Orange
```

### List with Formatting
```markdown
- **Bold item**
- *Italic item*
- `Code item`
- [Link item](https://example.com)
```

### Multi-level Nested List
```markdown
- Fruits
  - Citrus
    - Orange
    - Lemon
    - Lime
  - Berries
    - Strawberry
    - Blueberry
- Vegetables
  - Root vegetables
    - Carrot
    - Potato
  - Leafy greens
    - Spinach
    - Lettuce
```

### List with Rich Content
```markdown
- **Project Setup**
  
  Initialize your project with the following command:
  
  ```bash
  npm init -y
  ```
  
- **Install Dependencies**
  
  Add the required packages:
  
  - Production dependencies
  - Development dependencies
  - Optional peer dependencies

- **Configuration**
  
  Create configuration files for:
  
  1. TypeScript (`tsconfig.json`)
  2. ESLint (`.eslintrc.js`)
  3. Prettier (`.prettierrc`)
```

### Custom Styled List
```markdown
<!-- adf:bulletList bulletStyle="square" -->
- Square bullet item 1
- Square bullet item 2
- Square bullet item 3
```

### Mixed Content List
```markdown
- Text item with **bold** and *italic*
- Item with inline `code`
- Item with [external link](https://example.com)
- Item with image: ![alt text](https://example.com/image.jpg)
- Multi-line item that spans
  across multiple lines with proper indentation
```