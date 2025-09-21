# expand-sections

## Description

Expand sections provide collapsible/expandable content areas that help organize information and reduce visual clutter. Users can click to show or hide the content, making documents more navigable and focused. Supports rich content including text, lists, code blocks, and nested elements.

## .md markdown syntax

### Basic Expand Section
```markdown
~~~expand title="Click to expand this section"
This content is hidden by default and revealed when clicked.
It supports **rich formatting** and [links](https://example.com).
~~~
```

### Expand with Custom Attributes
```markdown
<!-- adf:expand defaultOpen="true" titleColor="#0052cc" -->
~~~expand title="Auto-opened Section"
This expand section opens automatically with a blue title.
~~~
```

### HTML Details Syntax (Alternative)
```markdown
<details>
<summary>Click to expand this section</summary>

This content is hidden by default.

</details>
```

### Nested Expand Sections
```markdown
~~~expand title="Parent Section"
This is the parent content.

<details>
<summary>Nested Section</summary>

This is nested content inside the parent expand.

</details>

More parent content here.
~~~
```

## .adf-schema.json schema

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "const": "expand"
    },
    "attrs": {
      "type": "object",
      "properties": {
        "title": {
          "type": "string",
          "description": "Title text shown in the expand header"
        },
        "defaultOpen": {
          "type": "boolean",
          "description": "Whether the expand starts open",
          "default": false
        },
        "titleColor": {
          "type": "string",
          "pattern": "^#[0-9a-fA-F]{6}$",
          "description": "Custom color for the title"
        }
      },
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

### Basic Expand
```markdown
~~~expand title="Technical Details"
This section contains detailed technical information that most users don't need to see immediately.

- System requirements
- Configuration details
- Advanced options
~~~
```

### Auto-Expanded Section
```markdown
<!-- adf:expand defaultOpen="true" -->
~~~expand title="Important Notice"
This information is displayed by default because it's critical.
~~~
```

### Expand with Rich Content
```markdown
~~~expand title="Code Examples"
Here are some code examples for this feature:

**JavaScript:**
```javascript
function toggleExpand(element) {
  element.classList.toggle('open');
}
```

**CSS:**
```css
.expand-section {
  border: 1px solid #ddd;
  border-radius: 4px;
}
```

For more examples, visit our [documentation](https://example.com).
~~~
```

### FAQ-Style Expands
```markdown
~~~expand title="How do I install the package?"
You can install using npm or yarn:

```bash
npm install extended-markdown-adf-parser
# or
yarn add extended-markdown-adf-parser
```
~~~

~~~expand title="What Node.js versions are supported?"
This package requires Node.js version 20.11.1 or higher.
~~~

~~~expand title="How do I report bugs?"
Please create an issue on our [GitHub repository](https://github.com/example/repo/issues).
~~~
```

### Nested Information Architecture
```markdown
~~~expand title="API Documentation"
This section covers our complete API.

## Authentication
All API calls require authentication.

<details>
<summary>API Key Method</summary>

Include your API key in the header:
```
Authorization: Bearer your-api-key
```

</details>

<details>
<summary>OAuth Method</summary>

Use OAuth 2.0 flow for user authentication.

</details>

## Endpoints
Available API endpoints:

~~~expand title="User Management"
- GET /users
- POST /users  
- PUT /users/{id}
- DELETE /users/{id}
~~~

~~~expand title="Data Operations"
- GET /data
- POST /data
- PUT /data/{id}
~~~
~~~
```

### Styled Expand Section
```markdown
<!-- adf:expand titleColor="#0052cc" defaultOpen="false" -->
~~~expand title="Configuration Options"
Advanced configuration settings:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| timeout | number | 5000 | Request timeout |
| retries | number | 3 | Retry attempts |
| debug | boolean | false | Enable debug mode |
~~~
```