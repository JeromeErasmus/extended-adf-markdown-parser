# media

## Description

Media elements represent individual media items such as images, videos, or files in ADF. They contain references to media stored in Atlassian's media services with attributes for dimensions, alternative text, and display properties.

## .md markdown syntax

### Standard Media Reference
```markdown
![Alt text](media:media-id-123)
```

### Media with Dimensions
```markdown
<!-- adf:media width="500" height="300" -->
![Product screenshot](media:screenshot-456)
```

### Media with Custom Attributes
```markdown
<!-- adf:media collection="MediaServicesSample" occurrenceKey="occurrence-key" -->
![Document preview](media:document-789)
```

## .adf-schema.json schema

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "const": "media"
    },
    "attrs": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "description": "Unique media identifier"
        },
        "type": {
          "type": "string",
          "enum": ["file", "link", "external"],
          "description": "Media type"
        },
        "collection": {
          "type": "string",
          "description": "Media collection name"
        },
        "occurrenceKey": {
          "type": "string",
          "description": "Media occurrence key"
        },
        "width": {
          "type": "number",
          "description": "Media width in pixels"
        },
        "height": {
          "type": "number",
          "description": "Media height in pixels"
        },
        "alt": {
          "type": "string",
          "description": "Alternative text for accessibility"
        }
      },
      "required": ["id", "type", "collection"],
      "additionalProperties": true
    }
  },
  "required": ["type", "attrs"]
}
```

## Examples

### Image References
```markdown
![Company logo](media:logo-2023)
![Product screenshot](media:app-interface-v2)
![User avatar](media:profile-pic-john)
```

### Document Attachments
```markdown
![PDF document](media:user-manual-pdf)
![Spreadsheet](media:quarterly-report-xlsx)
![Presentation](media:project-slides-pptx)
```

### Media with Alt Text
```markdown
![Flowchart showing the user authentication process](media:auth-flowchart)
![Bar chart displaying quarterly sales data](media:sales-chart-q4)
```

### Media Collections
```markdown
<!-- adf:media collection="ProjectAssets" -->
![Architecture diagram](media:system-architecture)

<!-- adf:media collection="UserUploads" -->
![Meeting whiteboard photo](media:brainstorm-session)
```

### Sized Media
```markdown
<!-- adf:media width="800" height="600" -->
![High resolution screenshot](media:desktop-app-full)

<!-- adf:media width="400" height="300" -->
![Thumbnail preview](media:video-thumbnail)
```

### Video Media
```markdown
![Training video thumbnail](media:onboarding-video-2023)
![Product demo recording](media:feature-walkthrough)
```

### Media in Documentation
```markdown
Follow these steps to configure the application:

1. Open the settings panel
   ![Settings panel](media:settings-screen)

2. Navigate to the preferences tab  
   ![Preferences tab](media:preferences-view)

3. Save your configuration
   ![Save confirmation](media:save-dialog)
```

### Media with Captions
```markdown
![System architecture overview](media:architecture-diagram)
*Figure 1: Complete system architecture showing all components*

![Performance metrics](media:performance-chart)
*Figure 2: Application performance over the last quarter*
```

### External Media References
```markdown
<!-- adf:media type="external" -->
![External image](media:external-graphic-url)

<!-- adf:media type="link" -->
![Linked document](media:shared-document-link)
```

### Media in Lists
```markdown
Required documents:
- ![Identity document](media:id-card-scan)
- ![Proof of address](media:utility-bill)
- ![Bank statement](media:bank-statement-pdf)
```

### Media Galleries
```markdown
Project screenshots:

![Login screen](media:login-ui)
![Dashboard view](media:dashboard-main)  
![Profile settings](media:profile-page)
![Reports section](media:reports-view)
```

### Media with Error Handling
```markdown
![Image unavailable](media:missing-image-id)
*Note: Image may not be available in all environments*
```