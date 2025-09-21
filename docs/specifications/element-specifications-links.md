# links

## Description

Links provide navigation to other documents, sections, or external resources. The parser supports inline links, reference links, automatic links, and links with custom attributes for behavior control.

## .md markdown syntax

### Inline Links
```markdown
[Link text](https://example.com)
[Link with title](https://example.com "Link Title")
```

### Reference Links
```markdown
[Link text][reference-id]
[Another link][1]

[reference-id]: https://example.com
[1]: https://another-example.com "Optional Title"
```

### Automatic Links
```markdown
<https://example.com>
<email@example.com>
```

### Links with Custom Attributes
```markdown
<!-- adf:link target="_blank" rel="noopener noreferrer" -->
[External Link](https://example.com)
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
      "description": "Link text content"
    },
    "marks": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "const": "link"
          },
          "attrs": {
            "type": "object",
            "properties": {
              "href": {
                "type": "string",
                "format": "uri",
                "description": "Link destination URL"
              },
              "title": {
                "type": "string",
                "description": "Optional link title"
              },
              "target": {
                "type": "string",
                "enum": ["_blank", "_self", "_parent", "_top"],
                "description": "Link target window"
              },
              "rel": {
                "type": "string",
                "description": "Link relationship"
              }
            },
            "required": ["href"],
            "additionalProperties": true
          }
        }
      }
    }
  },
  "required": ["type", "text", "marks"]
}
```

## Examples

### Basic External Link
```markdown
Visit [Google](https://google.com) for search.
```

### Link with Title
```markdown
Check out [OpenAI](https://openai.com "Artificial Intelligence Company") for AI research.
```

### Email Link
```markdown
Contact us at <support@example.com>
```

### Reference Style Links
```markdown

We also recommend reading [this guide][guide].

[docs]: https://example.com/docs "Documentation"
[api]: https://example.com/api "API Reference"  
[guide]: https://example.com/guide
```

### External Link with Security Attributes
```markdown
<!-- adf:link target="_blank" rel="noopener noreferrer" -->
[External Resource](https://external-site.com)
```

### Internal Navigation Links
```markdown
Jump to [Section 2](#section-2) or [Conclusion](#conclusion).

See also:
- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Advanced Usage](#advanced-usage)
```

### Links in Different Contexts
```markdown
**Navigation Menu:**
- [Home](/)
- [About](/about)
- [Services](/services)
- [Contact](/contact)

**Footer Links:**
- [Privacy Policy](/privacy)
- [Terms of Service](/terms)
- [Cookie Policy](/cookies)

**Social Media:**
- [Twitter](https://twitter.com/username)
- [LinkedIn](https://linkedin.com/in/username)
- [GitHub](https://github.com/username)
```

### Links with Rich Context
```markdown
The **[Extended ADF Parser](https://github.com/user/repo)** supports bidirectional conversion between *[Atlassian Document Format](https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/)* and Markdown.

Key features include:
1. [Full fidelity conversion](https://example.com/fidelity)
2. [Custom attribute support](https://example.com/attributes)
3. [Validation and error handling](https://example.com/validation)
```

### Multimedia Links
```markdown
Download resources:
- [PDF Guide](https://example.com/guide.pdf) (2.3 MB)
- [Video Tutorial](https://example.com/video.mp4) (45 minutes)
- [Sample Code](https://example.com/code.zip) (ZIP archive)
```

### Formatted Link Text
```markdown

Need help? Contact our [*support team*](mailto:support@example.com).

Download the [`example.config.js`](https://example.com/config) file.
```