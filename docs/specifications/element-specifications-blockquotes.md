# blockquotes

## Description

Blockquote elements represent quoted text or content from another source. They use the blockquote node in ADF and support nested content including paragraphs, lists, and other formatting. Blockquotes can contain multiple paragraphs and complex nested structures.

## .md markdown syntax

### Standard Blockquote Syntax
```markdown
> This is a simple blockquote.
```

### Multi-line Blockquotes
```markdown
> This is the first line of the blockquote.
> This is the second line of the blockquote.
> This is the third line of the blockquote.
```

### Multi-paragraph Blockquotes
```markdown
> First paragraph of the blockquote.
>
> Second paragraph of the blockquote.
```

### Nested Blockquotes
```markdown
> This is a blockquote.
>
> > This is a nested blockquote inside the first one.
>
> Back to the first level blockquote.
```

### Blockquotes with Custom Attributes
```markdown
<!-- adf:blockquote backgroundColor="#f6f8fa" borderColor="#d1d5db" -->
> Customized blockquote with styling attributes.
```

## .adf-schema.json schema

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "const": "blockquote"
    },
    "content": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "enum": ["paragraph", "heading", "bulletList", "orderedList"]
          }
        }
      },
      "minItems": 1
    },
    "attrs": {
      "type": "object",
      "properties": {
        "backgroundColor": {
          "type": "string",
          "pattern": "^#[0-9a-fA-F]{6}$",
          "description": "Background color (hex)"
        },
        "borderColor": {
          "type": "string",
          "pattern": "^#[0-9a-fA-F]{6}$",
          "description": "Border color (hex)"
        }
      },
      "additionalProperties": true
    }
  },
  "required": ["type", "content"]
}
```

## Examples

### Simple Quote
```markdown
> The only way to do great work is to love what you do. - Steve Jobs
```

### Academic Citation
```markdown
> "The significant problems we face cannot be solved at the same level of thinking we were at when we created them."
>
> — Albert Einstein
```

### Code Documentation
```markdown
> **Note:** This function is deprecated and will be removed in version 2.0.
> Use the new `processData()` function instead.
```

### Warning Messages
```markdown
> **Warning:** Modifying system files can cause instability.
> Please create a backup before proceeding.
```

### Multi-paragraph Quote
```markdown
> This is the first paragraph of a longer quote that spans multiple paragraphs.
>
> This is the second paragraph that continues the thought from the first paragraph.
>
> This is the final paragraph that concludes the extended quotation.
```

### Blockquote with Lists
```markdown
> The three pillars of successful development:
>
> 1. Clear requirements
> 2. Good design
> 3. Thorough testing
>
> Without these, projects are likely to fail.
```

### Nested Blockquotes
```markdown
> Original message:
>
> > I think we should implement feature X next quarter.
> > It would really help our users.
>
> I agree with your assessment. Let's schedule a planning meeting.
```

### Email-style Threading
```markdown
> > > When should we deploy the new version?
> >
> > I suggest deploying on Friday afternoon.
>
> Friday works for me. Let's aim for 3 PM.
```

### Poetry and Literature
```markdown
> Two roads diverged in a yellow wood,
> And sorry I could not travel both
> And be one traveler, long I stood
> And looked down one as far as I could
>
> — Robert Frost, "The Road Not Taken"
```

### Technical Specifications
```markdown
> **API Requirements:**
>
> - Authentication via API key
> - Rate limit: 1000 requests/hour
> - Response format: JSON
> - Supported methods: GET, POST, PUT, DELETE
```

### Customer Testimonials
```markdown
> "This product has completely transformed how we manage our workflow. The intuitive interface and powerful features make it indispensable for our team."
>
> — Sarah Johnson, Project Manager
```

### Legal Disclaimers
```markdown
> **Legal Notice:** This software is provided "as is" without warranty of any kind.
> The authors shall not be liable for any damages arising from the use of this software.
```