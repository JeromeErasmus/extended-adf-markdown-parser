# media-group

## Description

MediaGroup elements contain multiple media items displayed together as a collection. They allow grouping related images, documents, or other media files for organized presentation. MediaGroups are useful for galleries, before/after comparisons, or related document collections.

## .md markdown syntax

### MediaGroup Fence Block
```markdown
~~~mediaGroup
![First image](media:image-1)
![Second image](media:image-2)
![Third image](media:image-3)
~~~
```

### MediaGroup with Custom Attributes
```markdown
<!-- adf:mediaGroup layout="grid" spacing="medium" -->
~~~mediaGroup
![Screenshot 1](media:screen-1)
![Screenshot 2](media:screen-2)
![Screenshot 3](media:screen-3)
![Screenshot 4](media:screen-4)
~~~
```

### Inline Media References
```markdown
~~~mediaGroup
{media:gallery-image-1}
{media:gallery-image-2}
{media:gallery-image-3}
~~~
```

## .adf-schema.json schema

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "const": "mediaGroup"
    },
    "attrs": {
      "type": "object",
      "properties": {
        "layout": {
          "type": "string",
          "enum": ["grid", "filmstrip"],
          "description": "Group layout style"
        },
        "spacing": {
          "type": "string",
          "enum": ["none", "small", "medium", "large"],
          "description": "Spacing between items"
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
            "const": "media"
          }
        }
      },
      "minItems": 1
    }
  },
  "required": ["type", "content"]
}
```

## Examples

### Image Gallery
```markdown
## Product Gallery

~~~mediaGroup
![Product front view](media:product-front)
![Product side view](media:product-side)  
![Product back view](media:product-back)
![Product detail view](media:product-detail)
~~~
```

### Before and After Comparison
```markdown
## Redesign Comparison

~~~mediaGroup
![Old interface design](media:design-before)
![New interface design](media:design-after)
~~~
```

### Screenshot Collection
```markdown
## Application Screenshots

~~~mediaGroup
![Login screen](media:app-login)
![Dashboard view](media:app-dashboard)
![Settings panel](media:app-settings)
![User profile](media:app-profile)
![Reports section](media:app-reports)
~~~
```

### Document Attachments
```markdown
## Related Documents

~~~mediaGroup
![Project proposal PDF](media:proposal-doc)
![Budget spreadsheet](media:budget-xls)
![Timeline presentation](media:timeline-ppt)
~~~
```

### Feature Showcase
```markdown
## Key Features

~~~mediaGroup
![Feature 1: Real-time sync](media:feature-sync)
![Feature 2: Collaboration tools](media:feature-collab)
![Feature 3: Advanced analytics](media:feature-analytics)
~~~
```

### Process Steps
```markdown
## Installation Process

~~~mediaGroup
![Step 1: Download installer](media:install-step1)
![Step 2: Run setup wizard](media:install-step2)
![Step 3: Configure settings](media:install-step3)
![Step 4: Complete installation](media:install-step4)
~~~
```

### Team Photos
```markdown
## Meet Our Team

~~~mediaGroup
![Alice Johnson - CEO](media:team-alice)
![Bob Smith - CTO](media:team-bob)
![Carol Davis - Lead Designer](media:team-carol)
![David Wilson - Developer](media:team-david)
~~~
```

### Architecture Diagrams
```markdown
## System Components

~~~mediaGroup
![Database layer](media:arch-database)
![Application layer](media:arch-application)
![API layer](media:arch-api)
![Frontend layer](media:arch-frontend)
~~~
```

### Event Photos
```markdown
## Conference Highlights

~~~mediaGroup
![Opening ceremony](media:event-opening)
![Keynote presentation](media:event-keynote)
![Panel discussion](media:event-panel)
![Networking session](media:event-networking)
![Closing remarks](media:event-closing)
~~~
```

### Comparison Charts
```markdown
## Performance Metrics

~~~mediaGroup
![Q1 performance chart](media:perf-q1)
![Q2 performance chart](media:perf-q2)
![Q3 performance chart](media:perf-q3)
![Q4 performance chart](media:perf-q4)
~~~
```

### Tutorial Screenshots
```markdown
## Getting Started Tutorial

~~~mediaGroup
![Create new project](media:tutorial-1)
![Add project details](media:tutorial-2)
![Invite team members](media:tutorial-3)
![Set up workflow](media:tutorial-4)
![Launch project](media:tutorial-5)
~~~
```

### Product Variations
```markdown
## Available Colors

~~~mediaGroup
![Blue variant](media:product-blue)
![Red variant](media:product-red)
![Green variant](media:product-green)
![Black variant](media:product-black)
~~~
```