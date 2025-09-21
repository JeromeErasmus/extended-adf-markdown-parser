# bold

## Description

Bold text formatting provides strong emphasis to text content. It uses the strong mark in ADF and supports both asterisk (`**`) and underscore (`__`) syntax in Markdown. Bold formatting can be combined with other text formatting marks.

## .md markdown syntax

### Standard Bold Syntax
```markdown
**bold text**
__bold text__
```

### Bold in Context
```markdown
This is **important information** that needs emphasis.
```

### Combined Formatting
```markdown
**Bold with *italic inside***
***Bold and italic combined***
```

### Bold with Custom Attributes
```markdown
<!-- adf:text color="#ff0000" -->
**Red bold text**
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
            "const": "strong"
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

### Simple Bold Text
```markdown
This is **bold text** in a sentence.
```

### Multiple Bold Words
```markdown
**Important:** This document contains **critical** information.
```

### Bold in Lists
```markdown
- **Feature 1**: Description of feature
- **Feature 2**: Another important feature
- **Feature 3**: Final feature
```

### Bold in Headings
```markdown
# **Bold Heading**
## Regular Heading with **Bold Word**
```

### Bold with Links
```markdown
Visit our **[documentation](https://example.com)** for more details.
```

### Bold in Tables
```markdown
| Feature | Status |
|---------|--------|
| **Authentication** | Complete |
| **Authorization** | In Progress |
| **Data Validation** | Complete |
```

### Nested Formatting
```markdown
**This is bold with *italic* inside**
*This is italic with **bold** inside*
```

### Bold Code References
```markdown
The **`useState`** hook is essential for React components.
Make sure to call **`npm install`** before running the project.
```

### Bold in Panels
```markdown
~~~panel type=warning
**Warning:** This action cannot be undone.
~~~
```

### Bold with Strikethrough
```markdown
~~**This was bold but now crossed out**~~
**~~This is bold strikethrough~~**
```