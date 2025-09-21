# ordered-lists

## Description

Ordered lists (numbered lists) present items in a specific sequence using numeric markers. They support custom start numbers, nesting, and can contain rich content. The parser preserves numbering and supports custom attributes for styling.

## .md markdown syntax

### Basic Ordered Lists
```markdown
1. First item
2. Second item
3. Third item
```

### Lists with Custom Start Numbers
```markdown
5. Fifth item
6. Sixth item
7. Seventh item
```

### Nested Ordered Lists
```markdown
1. First item
   1. Nested first
   2. Nested second
2. Second item
3. Third item
   1. Another nested item
   2. And another
```

### Lists with Custom Attributes
```markdown
<!-- adf:orderedList order="5" -->
1. Custom ordered list starting at 5
2. Second item (displays as 6)
3. Third item (displays as 7)
```

## .adf-schema.json schema

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "const": "orderedList"
    },
    "attrs": {
      "type": "object",
      "properties": {
        "order": {
          "type": "integer",
          "minimum": 1,
          "description": "Starting number for the list"
        },
        "numberStyle": {
          "type": "string",
          "enum": ["decimal", "lower-alpha", "upper-alpha", "lower-roman", "upper-roman"],
          "description": "Numbering style"
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
            "const": "listItem"
          },
          "content": {
            "type": "array",
            "items": {
              "type": "object",
              "description": "Any valid ADF content nodes"
            }
          }
        },
        "required": ["type", "content"]
      },
      "minItems": 1
    }
  },
  "required": ["type", "content"]
}
```

## Examples

### Step-by-Step Instructions
```markdown
1. Download the installer
2. Run the installation wizard
3. Accept the license agreement
4. Choose installation directory
5. Complete the setup
```

### Recipe Format
```markdown
1. **Prepare ingredients:**
   - 2 cups flour
   - 1 cup sugar
   - 3 eggs
   
2. **Mix dry ingredients**
   
3. **Add wet ingredients gradually**
   
4. **Bake at 350°F for 30 minutes**
```

### Nested Procedures
```markdown
1. **Setup Phase**
   1. Install Node.js
   2. Install package manager
      1. npm (comes with Node.js)
      2. yarn (optional alternative)
   3. Verify installation
   
2. **Configuration Phase**
   1. Create project directory
   2. Initialize package.json
   3. Install dependencies
   
3. **Development Phase**
   1. Write code
   2. Write tests
   3. Run tests
```

### Custom Start Number
```markdown
<!-- adf:orderedList order="10" -->
1. This will display as item 10
2. This will display as item 11
3. This will display as item 12
```

### Mixed Content List
```markdown
1. **Introduction**
   
   Welcome to our tutorial series.
   
2. **Prerequisites**
   
   Make sure you have:
   - Basic JavaScript knowledge
   - A code editor
   - Node.js installed
   
3. **Getting Started**
   
   ```bash
   npm init -y
   npm install express
   ```
   
4. **Next Steps**
   
   Continue to [Chapter 2](https://example.com/chapter2)
```

### Legal Document Style
```markdown
1. **Terms of Service**

2. **Privacy Policy**

3. **Limitations of Liability**
   1. Service Availability
   2. Data Loss
   3. Third-party Content
      1. External Links
      2. User-generated Content
      3. Partner Services

4. **Contact Information**
```