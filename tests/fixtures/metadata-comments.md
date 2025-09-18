# Metadata Comments Test Fixtures

## Basic Metadata Comments

### Simple Paragraph Metadata
```markdown
<!-- adf:paragraph attrs='{"textAlign":"center"}' -->
This paragraph should be center-aligned.
```

### Paragraph Metadata with Single Line Break
```markdown
<!-- adf:paragraph attrs='{"textAlign":"center"}' -->

This paragraph should be center-aligned with a line break.
```

### Paragraph Metadata with Multiple Line Breaks
```markdown
<!-- adf:paragraph attrs='{"textAlign":"center"}' -->



This paragraph should be center-aligned with multiple line breaks.
```

### Heading with Custom ID
```markdown
<!-- adf:heading attrs='{"id":"custom-heading","textAlign":"center"}' -->
# Custom Heading
```

### Multiple Metadata for Same Node
```markdown
<!-- adf:paragraph attrs='{"textAlign":"left"}' -->
<!-- adf:paragraph attrs='{"backgroundColor":"#f0f0f0"}' -->
This paragraph has both text alignment and background color.
```

### Multiple Metadata with Spacing
```markdown
<!-- adf:paragraph attrs='{"textAlign":"left"}' -->

<!-- adf:paragraph attrs='{"backgroundColor":"#f0f0f0"}' -->



This paragraph has metadata with various spacing.
```

## Complex Metadata Scenarios

### Panel with Custom Styling
```markdown
<!-- adf:panel attrs='{"backgroundColor":"#e6f3ff","borderColor":"#0052cc","borderWidth":"2px"}' -->
~~~panel type=info title="Custom Styled Panel"
This panel has custom background, border color, and border width.
~~~
```

### Table with Custom Attributes
```markdown
<!-- adf:table attrs='{"layout":"full-width","borderColor":"#333"}' -->
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

### Nested Content with Metadata
```markdown
<!-- adf:expand attrs='{"defaultOpen":true,"titleColor":"#0052cc"}' -->
~~~expand title="Custom Expand"
<!-- adf:paragraph attrs='{"textAlign":"center","fontStyle":"italic"}' -->
This content inside the expand has custom styling.

<!-- adf:panel attrs='{"panelType":"note","backgroundColor":"#f8f9fa"}' -->
~~~panel type=note
Nested panel with custom background.
~~~
~~~
```

## Inline Metadata Examples

### Text with Custom Marks
```markdown
<!-- adf:strong attrs='{"color":"#ff0000"}' -->
**This bold text should be red**

<!-- adf:em attrs='{"backgroundColor":"#ffff00"}' -->
*This italic text should have yellow background*
```

### Links with Custom Attributes
```markdown
<!-- adf:link attrs='{"target":"_blank","rel":"noopener noreferrer"}' -->
[External Link](https://example.com)
```

### Code Blocks with Custom Styling
```markdown
<!-- adf:codeBlock attrs='{"theme":"dark","lineNumbers":true}' -->
```javascript
function customStyledCode() {
  return "This code block has custom styling";
}
```
```

## Edge Cases

### Malformed Metadata Comments
```markdown
<!-- adf:paragraph attrs='invalid-json' -->
This paragraph has malformed JSON in metadata.

<!-- not-adf:paragraph -->
This has a non-ADF comment that should be ignored.

<!-- adf: -->
Empty ADF comment should be ignored.
```

### Orphaned Metadata Comments
```markdown
<!-- adf:paragraph attrs='{"textAlign":"center"}' -->

<!-- adf:heading attrs='{"level":2}' -->

Some content without preceding metadata.
```

### Mixed Content with Metadata
```markdown
<!-- adf:heading attrs='{"id":"section-1"}' -->
# Section 1

Regular paragraph without metadata.

<!-- adf:paragraph attrs='{"textAlign":"center"}' -->
Centered paragraph with metadata.

Another regular paragraph.

<!-- adf:panel attrs='{"backgroundColor":"#fff3cd"}' -->
~~~panel type=warning
Panel with custom background color.
~~~

Final regular paragraph.
```

### Mixed Content with Irregular Spacing
```markdown
<!-- adf:heading attrs='{"id":"section-1","textAlign":"center"}' -->


# Section 1 with Center Alignment




Regular paragraph with multiple line breaks above.



<!-- adf:paragraph attrs='{"textAlign":"justify","lineHeight":"1.6"}' -->

Justified paragraph with custom line height.


<!-- adf:panel attrs='{"backgroundColor":"#e6f7ff","borderColor":"#1890ff"}' -->



~~~panel type=info
Info panel with custom styling and spacing.
~~~


Final paragraph.
```

## Round-Trip Preservation Examples

### Complex Document Structure
```markdown
<!-- adf:heading attrs='{"id":"intro","textAlign":"center"}' -->
# Introduction

<!-- adf:paragraph attrs='{"textAlign":"justify","lineHeight":"1.5"}' -->
This is a justified paragraph with custom line height that should be preserved in round-trip conversion.

<!-- adf:panel attrs='{"backgroundColor":"#e6f7ff","borderColor":"#1890ff","padding":"16px"}' -->
~~~panel type=info title="Important Note"
<!-- adf:paragraph attrs='{"fontWeight":"bold","color":"#1890ff"}' -->
This panel contains nested content with custom styling.

<!-- adf:bulletList attrs='{"bulletStyle":"square","indentLevel":1}' -->
- Custom bullet list
- With square bullets
- And custom indent
~~~

<!-- adf:table attrs='{"layout":"full-width","headerRowStyle":"bold"}' -->
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
<!-- adf:tableCell attrs='{"backgroundColor":"#f6f6f6"}' -->
| Gray cell | Normal cell | Normal cell |
| Normal | Normal | Normal |
```

## Validation Test Cases

### Valid Metadata Comments
```markdown
<!-- adf:paragraph attrs='{"textAlign":"center"}' -->
Valid metadata comment.

<!-- adf:heading -->
Simple metadata without attributes.

<!-- /adf:paragraph -->
Valid closing comment.
```

### Invalid Metadata Comments
```markdown
<!-- adf:invalid-node-type -->
Invalid node type with hyphens.

<!-- adf:123invalid -->
Node type starting with number.

<!-- adf: -->
Empty node type.

<!-- paragraph -->
Missing adf: prefix.
```