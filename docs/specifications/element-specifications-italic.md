# italic

## Description

Italic text formatting provides emphasis to text content using the emphasis mark in ADF. It supports both asterisk (`*`) and underscore (`_`) syntax in Markdown and can be combined with other text formatting marks.

## .md markdown syntax

### Standard Italic Syntax
```markdown
*italic text*
_italic text_
```

### Italic in Context
```markdown
This is *emphasized text* that stands out.
```

### Combined Formatting
```markdown
*Italic with **bold inside***
***Both italic and bold***
```

### Italic with Custom Attributes
```markdown
<!-- adf:text color="#0066cc" -->
*Blue italic text*
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
            "const": "em"
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

### Simple Italic Text
```markdown
This is *italic text* in a sentence.
```

### Emphasis in Quotes
```markdown
As Shakespeare wrote, *"To be or not to be, that is the question."*
```

### Italic in Lists
```markdown
- *Introduction*: Getting started with the basics
- *Advanced Topics*: Deep dive into complex features
- *Conclusion*: Summary and next steps
```

### Book and Publication Titles
```markdown
I recently read *The Pragmatic Programmer* and found it insightful.
The article was published in *Nature* journal.
```

### Italic with Links
```markdown
Read the *[complete guide](https://example.com)* for detailed instructions.
```

### Foreign Words and Phrases
```markdown
The restaurant serves *authentic* Italian cuisine.
This is a *pro bono* legal service.
```

### Variable Names and Parameters
```markdown
Set the *baseUrl* parameter to your API endpoint.
The function accepts a *callback* parameter.
```

### Nested Formatting
```markdown
*This is italic with **bold** inside*
**This is bold with *italic* inside**
```

### Italic in Technical Writing
```markdown
The *POST* method sends data to the server.
Use *HTTPS* for secure connections.
```

### Italic Code References
```markdown
The *`render`* method is called automatically.
Make sure to import *`React`* at the top of your file.
```

### Italic in Panels
```markdown
~~~panel type=note
*Note:* This feature is currently in beta.
~~~
```