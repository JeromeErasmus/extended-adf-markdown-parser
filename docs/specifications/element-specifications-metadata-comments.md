# metadata-comments

## Description

Metadata comments allow you to specify custom ADF attributes that aren't expressible in standard Markdown syntax. They use HTML comment syntax with a specific pattern and provide a way to apply custom styling, behavior, and attributes to any element.

## .md markdown syntax

### Basic Syntax
```markdown
<!-- adf:nodeType attributeName="value" -->
Content here
```

### Multiple Attributes
```markdown
<!-- adf:nodeType attr1="value1" attr2="value2" attr3="value3" -->
Content here
```

### Multiple Metadata Comments
You can apply multiple metadata comments to the same element:
```markdown
<!-- adf:paragraph textAlign="center" -->
<!-- adf:paragraph backgroundColor="#fff3cd" -->
This paragraph has both center alignment and yellow background.
```

## .adf-schema.json schema

```json
{
  "type": "object",
  "properties": {
    "nodeType": {
      "type": "string",
      "description": "The ADF node type this metadata applies to",
      "enum": ["paragraph", "heading", "panel", "table", "media", "expand", "bulletList", "orderedList", "codeBlock", "blockquote"]
    },
    "attributes": {
      "type": "object",
      "additionalProperties": true,
      "description": "Custom attributes to apply to the node"
    }
  },
  "required": ["nodeType"]
}
```

## Examples

### Text Alignment
```markdown
<!-- adf:paragraph textAlign="center" -->
This paragraph is centered.

<!-- adf:heading textAlign="right" -->
# Right-aligned Heading
```

### Colors and Styling
```markdown
<!-- adf:paragraph backgroundColor="#f0f0f0" color="#333" -->
Gray background paragraph with dark text.

<!-- adf:panel backgroundColor="#e6f3ff" borderColor="#0052cc" -->
~~~panel type=info
Custom styled panel with background and border colors.
~~~
```

### Layout and Dimensions
```markdown
<!-- adf:mediaSingle layout="center" width="80" -->
![Centered Image](media:image-123)

<!-- adf:table layout="full-width" -->
| Full Width | Table |
|------------|-------|
| Content    | Here  |
```

### Complex Attributes
```markdown
<!-- adf:expand defaultOpen="true" titleColor="#0052cc" -->
~~~expand title="Auto-opened Section"
This expand section opens automatically with a blue title.
~~~
```