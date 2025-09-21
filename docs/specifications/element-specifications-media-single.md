# media-single

## Description

MediaSingle elements wrap individual media items with layout and positioning attributes. They provide control over media alignment, width, and spacing within documents. MediaSingle is commonly used for standalone images, diagrams, and other media that need specific positioning.

## .md markdown syntax

### MediaSingle Fence Block
```markdown
~~~mediaSingle layout=center width=80
![Image description](media:image-id)
~~~
```

### MediaSingle with Alignment
```markdown
~~~mediaSingle layout=align-start
![Left-aligned image](media:left-image)
~~~

~~~mediaSingle layout=align-end
![Right-aligned image](media:right-image)
~~~
```

### MediaSingle with Custom Attributes
```markdown
<!-- adf:mediaSingle layout="full-width" width="100" -->
~~~mediaSingle layout=full-width
![Full width banner](media:banner-image)
~~~
```

## .adf-schema.json schema

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "const": "mediaSingle"
    },
    "attrs": {
      "type": "object",
      "properties": {
        "layout": {
          "type": "string",
          "enum": ["wrap-right", "center", "wrap-left", "wide", "full-width", "align-start", "align-end"],
          "description": "Media layout position"
        },
        "width": {
          "type": "number",
          "minimum": 0,
          "maximum": 100,
          "description": "Width as percentage"
        },
        "widthType": {
          "type": "string",
          "enum": ["percentage", "pixel"],
          "description": "Width unit type"
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
      "minItems": 1,
      "maxItems": 1
    }
  },
  "required": ["type", "content"]
}
```

## Examples

### Centered Images
```markdown
~~~mediaSingle layout=center width=60
![Product showcase image](media:product-hero)
~~~
```

### Left-Aligned Media
```markdown
~~~mediaSingle layout=align-start width=40
![Author profile photo](media:author-pic)
~~~

This text flows around the left-aligned image, creating a nice layout for profile information or author bios.
```

### Right-Aligned Media
```markdown
~~~mediaSingle layout=align-end width=50
![Diagram showing the process flow](media:process-diagram)
~~~

The content wraps around this right-aligned diagram, making efficient use of page space.
```

### Full-Width Banners
```markdown
~~~mediaSingle layout=full-width
![Company event banner photo](media:event-banner)
~~~
```

### Wide Layout
```markdown
~~~mediaSingle layout=wide width=85
![Detailed architecture diagram](media:system-overview)
~~~
```

### Text Wrap Layouts
```markdown
~~~mediaSingle layout=wrap-left width=30
![Small icon or logo](media:feature-icon)
~~~

This paragraph flows around the wrapped media on the left side, creating an engaging layout for feature descriptions or callout boxes.

~~~mediaSingle layout=wrap-right width=35
![Screenshot of the interface](media:ui-screenshot)
~~~

Similarly, this content wraps around the right-side media, perfect for showing interface elements alongside explanatory text.
```

### Documentation Images
```markdown
Follow these steps:

1. Open the application

~~~mediaSingle layout=center width=70
![Application startup screen](media:startup-screen)
~~~

2. Navigate to settings

~~~mediaSingle layout=center width=70  
![Settings menu location](media:settings-menu)
~~~

3. Configure your preferences

~~~mediaSingle layout=center width=70
![Preferences dialog box](media:preferences-dialog)
~~~
```

### Comparison Images
```markdown
### Before and After

**Before:**
~~~mediaSingle layout=align-start width=45
![Old interface design](media:old-design)
~~~

**After:**
~~~mediaSingle layout=align-end width=45
![New interface design](media:new-design)
~~~
```

### Product Gallery
```markdown
## Product Images

~~~mediaSingle layout=center width=80
![Main product image](media:product-main)
~~~

~~~mediaSingle layout=align-start width=40
![Product detail view 1](media:product-detail-1)
~~~

~~~mediaSingle layout=align-end width=40
![Product detail view 2](media:product-detail-2)
~~~
```

### Technical Diagrams
```markdown
## System Architecture

~~~mediaSingle layout=wide width=90
![Complete system architecture](media:architecture-full)
~~~

The diagram above shows the complete system architecture including all major components and their interactions.
```

### Mobile-Friendly Layout
```markdown
~~~mediaSingle layout=center width=60
![Mobile app screenshot](media:mobile-screen)
~~~

This layout ensures images display well on both desktop and mobile devices.
```