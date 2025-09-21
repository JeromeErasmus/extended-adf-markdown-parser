# underline

## Description

Underline text formatting adds an underline decoration to text content using the underline mark in ADF. It provides emphasis through visual decoration and can be combined with other text formatting marks.

## .md markdown syntax

### Standard Underline Syntax
```markdown
<!-- adf:text marks="underline" -->
<u>underlined text</u>
```

### Underline with Custom Attributes
```markdown
<!-- adf:text color="#0066cc" underlineStyle="solid" -->
<u>Blue underlined text</u>
```

### Combined Formatting
```markdown
<u>**Bold underlined text**</u>
<u>*Italic underlined text*</u>
```

## .adf-schema.json schema

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "const": "text"
    },
    "text": {
      "type": "string",
      "description": "Text content"
    },
    "marks": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "const": "underline"
          },
          "attrs": {
            "type": "object",
            "properties": {
              "color": {
                "type": "string",
                "pattern": "^#[0-9a-fA-F]{6}$",
                "description": "Text color (hex)"
              }
            },
            "additionalProperties": true
          }
        }
      },
      "minItems": 1
    }
  },
  "required": ["type", "text", "marks"]
}
```

## Examples

### Simple Underlined Text
```markdown
This is <u>underlined text</u> in a sentence.
```

### Important Information
```markdown
<u>Important:</u> Please read the following carefully.
```

### Legal Documents
```markdown
The undersigned agrees to the <u>terms and conditions</u>.
```

### Names and Titles
```markdown
Book title: <u>The Great Gatsby</u>
Author: <u>F. Scott Fitzgerald</u>
```

### Combined with Other Formatting
```markdown
<u>**Bold underlined heading**</u>
<u>*Italic underlined emphasis*</u>
```

### In Lists
```markdown
- <u>Term 1</u>: Definition of first term
- <u>Term 2</u>: Definition of second term
- <u>Term 3</u>: Definition of third term
```

### Keyboard Shortcuts
```markdown
Press <u>Ctrl+U</u> to toggle underline formatting.
```

### Form Fields
```markdown
Name: <u>                    </u>
Date: <u>                    </u>
Signature: <u>                    </u>
```

### Academic Citations
```markdown
See <u>Smith, J. (2023)</u> for more details.
```

### Nested Formatting
```markdown
<u>This underlined text contains **bold** and *italic* sections</u>
```