# panels

## Description

ADF panels provide rich content containers with semantic meaning and visual styling. They are used to highlight important information, warnings, errors, success messages, and notes. Panels support nested content including text formatting, lists, code blocks, and other elements.

## .md markdown syntax

### Basic Panel Syntax
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

### Panels with Custom Attributes
```markdown
<!-- adf:panel backgroundColor="#e6f3ff" borderColor="#0052cc" padding="16px" -->
~~~panel type=info title="Custom Styled Panel"
This panel has custom background, border, and padding.
~~~
```

### Panels with Rich Content
```markdown
~~~panel type=warning title="Development Guidelines"
Please follow these **important** guidelines:

1. Always test your code
2. Write clear documentation
3. Use meaningful commit messages

```javascript
// Example code
function validate(input) {
  return input.length > 0;
}
```

For more information, see [our guide](https://example.com).
~~~
```

## .adf-schema.json schema

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "const": "panel"
    },
    "attrs": {
      "type": "object",
      "properties": {
        "panelType": {
          "type": "string",
          "enum": ["info", "warning", "error", "success", "note"],
          "description": "Panel semantic type"
        },
        "title": {
          "type": "string",
          "description": "Optional panel title"
        },
        "backgroundColor": {
          "type": "string",
          "pattern": "^#[0-9a-fA-F]{6}$",
          "description": "Custom background color (hex)"
        },
        "borderColor": {
          "type": "string",
          "pattern": "^#[0-9a-fA-F]{6}$",
          "description": "Custom border color (hex)"
        },
        "padding": {
          "type": "string",
          "description": "CSS padding value"
        }
      },
      "required": ["panelType"],
      "additionalProperties": true
    },
    "content": {
      "type": "array",
      "items": {
        "type": "object",
        "description": "Any valid ADF content nodes"
      },
      "minItems": 1
    }
  },
  "required": ["type", "attrs", "content"]
}
```

## Examples

### Info Panel
```markdown
~~~panel type=info
This is general information that might be helpful to know.
~~~
```

### Warning Panel with Title
```markdown
~~~panel type=warning title="Before You Begin"
Make sure you have backed up your data before proceeding with this operation.
~~~
```

### Error Panel
```markdown
~~~panel type=error title="Critical Issue"
This operation cannot be completed due to insufficient permissions.
~~~
```

### Success Panel
```markdown
~~~panel type=success
Your changes have been saved successfully!
~~~
```

### Note Panel with Complex Content
```markdown
~~~panel type=note title="Technical Details"
**Implementation Notes:**

The following considerations apply:
- Performance impact is minimal
- Backward compatibility is maintained
- Unit tests cover 98% of code paths

```bash
# Run tests
npm test
```
~~~
```

### Custom Styled Panel
```markdown
<!-- adf:panel backgroundColor="#fff3cd" borderColor="#ffc107" -->
~~~panel type=warning title="Custom Warning"
This panel uses custom yellow styling to match our brand colors.
~~~
```