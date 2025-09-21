# text-color

## Description

Text color formatting applies custom colors to text content using the textColor mark in ADF. It supports hex color values and can be combined with other text formatting marks to create rich, visually distinctive content.

## .md markdown syntax

### Text Color with Metadata Comment
```markdown
<!-- adf:text color="#ff0000" -->
Red colored text
```

### Multiple Colors
```markdown
<!-- adf:text color="#0066cc" -->
Blue text
<!-- adf:text color="#00cc66" -->
Green text
```

### Text Color with Other Formatting
```markdown
<!-- adf:text color="#ff6600" -->
**Bold orange text**
<!-- adf:text color="#9900cc" -->
*Italic purple text*
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
            "const": "textColor"
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

### Status Messages
```markdown
<!-- adf:text color="#ff0000" -->
Error: Operation failed
<!-- adf:text color="#00aa00" -->
Success: Operation completed
<!-- adf:text color="#ff8800" -->
Warning: Check your input
```

### Brand Colors
```markdown
Welcome to 
<!-- adf:text color="#1890ff" -->
Atlassian
products!
```

### Syntax Highlighting
```markdown
<!-- adf:text color="#0066cc" -->
function
<!-- adf:text color="#000000" -->
 
<!-- adf:text color="#cc0066" -->
calculateTotal
<!-- adf:text color="#000000" -->
() {
```

### Category Labels
```markdown
Categories:
<!-- adf:text color="#ff6b6b" -->
#urgent
<!-- adf:text color="#4ecdc4" -->
#feature
<!-- adf:text color="#45b7d1" -->
#documentation
```

### Pricing Information
```markdown
Regular Price: 
<!-- adf:text color="#999999" -->
~~$199~~
Sale Price: 
<!-- adf:text color="#ff0000" -->
$149
```

### Color-Coded Lists
```markdown
- <!-- adf:text color="#ff0000" -->High Priority: Critical bug fixes
- <!-- adf:text color="#ff8800" -->Medium Priority: Feature enhancements  
- <!-- adf:text color="#00aa00" -->Low Priority: Documentation updates
```

### Temperature Readings
```markdown
Temperature: 
<!-- adf:text color="#ff0000" -->
35°C (Hot)
Humidity: 
<!-- adf:text color="#0066cc" -->
60% (Normal)
```

### Progress Indicators
```markdown
Progress:
<!-- adf:text color="#00aa00" -->
████████
<!-- adf:text color="#cccccc" -->
██
80% Complete
```

### Code Documentation
```markdown
The 
<!-- adf:text color="#0066cc" -->
`primary`
 parameter accepts 
<!-- adf:text color="#cc6600" -->
string
 values.
```

### Combined with Background Colors
```markdown
<!-- adf:text color="#ffffff" backgroundColor="#ff0000" -->
White text on red background
<!-- adf:text color="#000000" backgroundColor="#ffff00" -->
Black text on yellow background
```