# strikethrough

## Description

Strikethrough text formatting indicates deleted, incorrect, or no longer relevant content. It uses the strike mark in ADF and the `~~` syntax in Markdown. Strikethrough can be combined with other text formatting marks.

## .md markdown syntax

### Standard Strikethrough Syntax
```markdown
~~strikethrough text~~
```

### Strikethrough in Context
```markdown
The price was ~~$100~~ now $75.
```

### Combined Formatting
```markdown
~~**Bold strikethrough text**~~
~~*Italic strikethrough text*~~
```

### Strikethrough with Custom Attributes
```markdown
<!-- adf:text color="#999999" -->
~~Grayed out deleted text~~
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
            "const": "strike"
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

### Price Changes
```markdown
Original price: ~~$199~~ Sale price: $149
```

### Completed Tasks
```markdown
- [x] ~~Design mockups~~
- [x] ~~Implement authentication~~
- [ ] Add user dashboard
- [ ] Write documentation
```

### Corrections and Updates
```markdown
The meeting is scheduled for ~~Tuesday~~ Wednesday at 2 PM.
```

### Outdated Information
```markdown
~~This feature is not yet available~~ 
**Update:** This feature is now live!
```

### Version Changes
```markdown
### Changelog v2.0

- **Added:** New dashboard interface
- **Changed:** Improved performance
- **~~Deprecated~~:** Legacy API endpoints
- **Removed:** ~~Old authentication system~~
```

### Combined with Other Formatting
```markdown
~~**This was important but now obsolete**~~
~~*This italic text is no longer relevant*~~
```

### In Documentation
```markdown
### Installation Methods

**Option 1:** Download from website
**~~Option 2:~~ Use package manager** (Recommended)
~~Option 3: Manual compilation~~ (No longer supported)
```

### Legal and Contract Changes
```markdown
The contract terms are as follows:
- Payment due: ~~30 days~~ 15 days
- Late fee: ~~$25~~ $50
```

### Code Examples
```markdown
```javascript
// Old way (deprecated)
~~const data = getData();~~

// New way (recommended)
const data = await fetchData();
```
```

### Strikethrough in Tables
```markdown
| Feature | Status |
|---------|--------|
| Login | Active |
| Registration | ~~Disabled~~ Active |
| Password Reset | ~~Pending~~ Complete |
```

### Editorial Marks
```markdown
The quick ~~brown~~ red fox jumps over the lazy dog.
```

### Nested Strikethrough
```markdown
~~This entire sentence is crossed out with **bold words** inside~~
```