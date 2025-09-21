# tables

## Description

Tables provide structured data presentation with rows, columns, headers, and cells. The parser supports GitHub Flavored Markdown (GFM) table syntax with extensions for custom attributes, cell spanning, and styling options.

## .md markdown syntax

### Basic Tables
```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

### Tables with Alignment
```markdown
| Left | Center | Right |
|:-----|:------:|------:|
| L1   | C1     | R1    |
| L2   | C2     | R2    |
```

### Tables with Custom Attributes
```markdown
<!-- adf:table layout="full-width" borderColor="#333" -->
| Header 1 | Header 2 |
|----------|----------|
| Content  | Content  |
```

### Cell-specific Attributes
```markdown
<!-- adf:tableCell backgroundColor="#f6f6f6" -->
| Gray cell | Normal cell |
|-----------|-------------|
| Content   | Content     |
```

### Tables with Cell Spanning
```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| <!-- adf:tableCell colspan="2" --> Spans 2 columns | Cell 3 |
| Cell 1   | Cell 2   | Cell 3   |
```

## .adf-schema.json schema

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "const": "table"
    },
    "attrs": {
      "type": "object",
      "properties": {
        "isNumberColumnEnabled": {
          "type": "boolean",
          "description": "Enable row numbering"
        },
        "layout": {
          "type": "string",
          "enum": ["default", "full-width", "wide"],
          "description": "Table layout mode"
        },
        "displayMode": {
          "type": "string",
          "enum": ["default", "fixed"]
        }
      },
      "additionalProperties": true
    },
    "content": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "const": "tableRow"
          },
          "content": {
            "type": "array",
            "items": {
              "oneOf": [
                {
                  "type": "object",
                  "properties": {
                    "type": {
                      "type": "string",
                      "const": "tableHeader"
                    }
                  }
                },
                {
                  "type": "object",
                  "properties": {
                    "type": {
                      "type": "string",
                      "const": "tableCell"
                    },
                    "attrs": {
                      "type": "object",
                      "properties": {
                        "colspan": {
                          "type": "integer",
                          "minimum": 1
                        },
                        "rowspan": {
                          "type": "integer", 
                          "minimum": 1
                        },
                        "colwidth": {
                          "type": "array",
                          "items": {
                            "type": "integer"
                          }
                        },
                        "backgroundColor": {
                          "type": "string",
                          "pattern": "^#[0-9a-fA-F]{6}$"
                        }
                      }
                    }
                  }
                }
              ]
            }
          }
        }
      }
    }
  },
  "required": ["type", "content"]
}
```

## Examples

### Simple Data Table
```markdown
| Product | Price | Stock |
|---------|-------|-------|
| Widget  | $10   | 50    |
| Gadget  | $25   | 25    |
| Tool    | $15   | 100   |
```

### Aligned Columns
```markdown
| Item        | Price    | Quantity |
|:------------|:--------:|---------:|
| Left align  | Center   |    Right |
| Text        | $19.99   |       42 |
```

### Full-Width Table
```markdown
<!-- adf:table layout="full-width" -->
| Column 1 | Column 2 | Column 3 | Column 4 |
|----------|----------|----------|----------|
| Data     | Data     | Data     | Data     |
```

### Table with Colored Cells
```markdown
| Status | Description |
|--------|-------------|
| <!-- adf:tableCell backgroundColor="#d4edda" --> Active | Service is running |
| <!-- adf:tableCell backgroundColor="#f8d7da" --> Error | Service is down |
| <!-- adf:tableCell backgroundColor="#fff3cd" --> Warning | Service degraded |
```

### Complex Table with Spanning
```markdown
| <!-- adf:tableCell colspan="3" --> Project Summary |
|---------------------------------------------------|
| Task | Status | Owner |
|------|--------|-------|
| Design | Complete | Alice |
| Development | <!-- adf:tableCell rowspan="2" --> In Progress | Bob |
| Testing | Pending | Bob |
```

### Table with Rich Content
```markdown
| Feature | Description | Example |
|---------|-------------|---------|
| **Bold** | Emphasis | `**text**` |
| *Italic* | Styling | `*text*` |
| Links | [Navigation](https://example.com) | `[text](url)` |
```