# horizontal-rules

## Description

Horizontal rule elements create visual dividers or section breaks in documents. They use the rule node in ADF and appear as horizontal lines that span the width of the content area. Useful for separating different sections or topics within a document.

## .md markdown syntax

### Standard Horizontal Rule Syntax
```markdown
---
```

### Alternative Syntax
```markdown
***
```

### Another Alternative
```markdown
___
```

### Horizontal Rule with Custom Attributes
```markdown
<!-- adf:rule color="#cccccc" thickness="2" -->
---
```

## .adf-schema.json schema

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "const": "rule"
    },
    "attrs": {
      "type": "object",
      "properties": {
        "color": {
          "type": "string",
          "pattern": "^#[0-9a-fA-F]{6}$",
          "description": "Rule color (hex)"
        },
        "thickness": {
          "type": "number",
          "description": "Rule thickness in pixels"
        },
        "style": {
          "type": "string",
          "enum": ["solid", "dashed", "dotted"],
          "description": "Rule line style"
        }
      },
      "additionalProperties": true
    }
  },
  "required": ["type"]
}
```

## Examples

### Section Separator
```markdown
# Introduction

This section introduces the main concepts.

---

# Implementation

This section covers the technical details.
```

### Chapter Breaks
```markdown
## Chapter 1: Getting Started

Content of the first chapter goes here.

---

## Chapter 2: Advanced Topics

Content of the second chapter follows.
```

### Before and After Examples
```markdown
### Before
Old implementation with legacy code.

---

### After  
New implementation with modern practices.
```

### Table of Contents Separator
```markdown
# Table of Contents

1. Introduction
2. Setup
3. Usage

---

# Content

The actual content begins here.
```

### FAQ Sections
```markdown
**Q: How do I install the software?**
A: Download the installer and follow the setup wizard.

---

**Q: What are the system requirements?**
A: Windows 10 or later, 4GB RAM minimum.
```

### Author Information
```markdown
This article was written by the development team.

---

*Published: January 2023*
*Last updated: March 2023*
```

### License Information
```markdown
This project is open source and available under the MIT License.

---

Copyright (c) 2023 Company Name
```

### Newsletter Sections
```markdown
## Top Stories

Latest news and updates from the industry.

---

## Featured Articles

In-depth analysis and expert opinions.

---

## Community Spotlight

Highlighting community contributions.
```

### Document Signatures
```markdown
Prepared by: Technical Writing Team
Reviewed by: Engineering Manager

---

Document ID: DOC-2023-001
Version: 1.2
```

### Multiple Rule Styles
```markdown
Standard rule:
---

Thick rule:
<!-- adf:rule thickness="3" -->
---

Colored rule:
<!-- adf:rule color="#1890ff" -->
---
```

### Meeting Minutes
```markdown
**Attendees:** John, Sarah, Mike
**Date:** March 15, 2023

---

## Agenda Items

1. Project updates
2. Budget review
3. Next steps

---

## Action Items

- [ ] Complete documentation
- [ ] Schedule follow-up meeting
```

### Recipe Sections
```markdown
## Ingredients

- 2 cups flour
- 1 cup sugar
- 3 eggs

---

## Instructions

1. Preheat oven to 350°F
2. Mix dry ingredients
3. Add wet ingredients
```