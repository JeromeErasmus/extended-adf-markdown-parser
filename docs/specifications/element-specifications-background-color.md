# background-color

## Description

Background color formatting applies background colors to text content using the backgroundColor mark in ADF. It supports hex color values and is commonly used for highlighting important information or creating visual emphasis.

## .md markdown syntax

### Background Color with Metadata Comment
```markdown
<!-- adf:text backgroundColor="#ffff00" -->
Highlighted text with yellow background
```

### Background Color with Text Color
```markdown
<!-- adf:text color="#ffffff" backgroundColor="#ff0000" -->
White text on red background
```

### Multiple Background Colors
```markdown
<!-- adf:text backgroundColor="#e6f7ff" -->
Light blue background
<!-- adf:text backgroundColor="#fff2e6" -->
Light orange background
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
            "const": "backgroundColor"
          },
          "attrs": {
            "type": "object",
            "properties": {
              "color": {
                "type": "string",
                "pattern": "^#[0-9a-fA-F]{6}$",
                "description": "Background color (hex)"
              }
            },
            "required": ["color"],
            "additionalProperties": false
          }
        },
        "required": ["type", "attrs"]
      },
      "minItems": 1
    }
  },
  "required": ["type", "text", "marks"]
}
```

## Examples

### Important Notices
```markdown
<!-- adf:text backgroundColor="#fff2cc" -->
Important: Please save your work before proceeding.
```

### Highlighted Terms
```markdown
The 
<!-- adf:text backgroundColor="#ffff00" -->
API key
 is required for authentication.
```

### Color-Coded Categories
```markdown
Status: 
<!-- adf:text color="#ffffff" backgroundColor="#00aa00" -->
Active
<!-- adf:text color="#ffffff" backgroundColor="#ff0000" -->
Inactive
<!-- adf:text color="#000000" backgroundColor="#ffff00" -->
Pending
```

### Code Highlighting
```markdown
Use the 
<!-- adf:text backgroundColor="#f0f0f0" -->
`console.log()`
 function for debugging.
```

### Warning Messages
```markdown
<!-- adf:text color="#cc0000" backgroundColor="#ffe6e6" -->
Warning: This action cannot be undone.
```

### Success Messages
```markdown
<!-- adf:text color="#006600" backgroundColor="#e6ffe6" -->
Success: Data saved successfully.
```

### Info Messages
```markdown
<!-- adf:text color="#0066cc" backgroundColor="#e6f3ff" -->
Info: New features are available.
```

### Table Cell Highlighting
```markdown
| Name | Status | Priority |
|------|--------|----------|
| Task 1 | <!-- adf:text backgroundColor="#e6ffe6" -->Complete | High |
| Task 2 | <!-- adf:text backgroundColor="#ffe6e6" -->Failed | Critical |
| Task 3 | <!-- adf:text backgroundColor="#fff2cc" -->Pending | Medium |
```

### Keyboard Shortcuts
```markdown
Press 
<!-- adf:text backgroundColor="#f0f0f0" -->
Ctrl+C
 to copy and 
<!-- adf:text backgroundColor="#f0f0f0" -->
Ctrl+V
 to paste.
```

### Version Labels
```markdown
Available in:
<!-- adf:text color="#ffffff" backgroundColor="#1890ff" -->
v2.0+
<!-- adf:text color="#ffffff" backgroundColor="#52c41a" -->
Latest
```

### Priority Levels
```markdown
- <!-- adf:text color="#ffffff" backgroundColor="#ff4d4f" -->Critical Priority: System down
- <!-- adf:text color="#000000" backgroundColor="#faad14" -->High Priority: Performance issue
- <!-- adf:text color="#ffffff" backgroundColor="#1890ff" -->Medium Priority: Feature request
- <!-- adf:text color="#000000" backgroundColor="#d9d9d9" -->Low Priority: Documentation
```

### Highlighted Quotes
```markdown
As the saying goes: 
<!-- adf:text backgroundColor="#f6ffed" -->
"The early bird catches the worm."
```