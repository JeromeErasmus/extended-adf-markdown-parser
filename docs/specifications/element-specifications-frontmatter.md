# frontmatter

## Description

Frontmatter provides document metadata and configuration at the beginning of Markdown files. It uses YAML format enclosed by triple dashes and supports various metadata fields including title, author, tags, and custom properties. Frontmatter is preserved during ADF conversion.

## .md markdown syntax

### Basic Frontmatter
```markdown
---
title: "Document Title"
author: "Author Name"
date: "2023-03-15"
---
```

### Extended Frontmatter
```markdown
---
title: "Complete Project Documentation"
author: "Technical Writing Team"
date: "2023-03-15"
version: "1.2.0"
status: "draft"
tags: 
  - documentation
  - api
  - guide
metadata:
  department: "Engineering"
  project: "Platform API"
  reviewers:
    - "alice.johnson"
    - "bob.smith"
---
```

### ADF Configuration
```markdown
---
title: "ADF Document"
adf:
  version: 1
  convertToAdf: true
  preserveFormatting: true
---
```

## .adf-schema.json schema

```json
{
  "type": "object",
  "properties": {
    "frontmatter": {
      "type": "object",
      "properties": {
        "title": {
          "type": "string",
          "description": "Document title"
        },
        "author": {
          "type": "string",
          "description": "Document author"
        },
        "date": {
          "type": "string",
          "description": "Creation or publication date"
        },
        "version": {
          "type": "string",
          "description": "Document version"
        },
        "status": {
          "type": "string",
          "enum": ["draft", "review", "approved", "published"],
          "description": "Document status"
        },
        "tags": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Document tags"
        }
      },
      "additionalProperties": true
    }
  }
}
```

## Examples

### API Documentation
```markdown
---
title: "User Authentication API"
author: "Platform Team"
version: "2.1.0"
date: "2023-03-15"
status: "published"
tags:
  - api
  - authentication
  - security
  - rest
api:
  version: "v2"
  baseUrl: "https://api.example.com"
  authentication: "Bearer token"
---

# User Authentication API

This document describes the authentication endpoints for the platform API.
```

### Project Requirements
```markdown
---
title: "Mobile App Requirements"
author: "Product Team"
date: "2023-02-20"
status: "review"
stakeholders:
  - "product.manager"
  - "ui.designer"
  - "mobile.developer"
priority: "high"
deadline: "2023-04-30"
budget: "$50,000"
tags:
  - requirements
  - mobile
  - ios
  - android
---

# Mobile Application Requirements

## Overview
This document outlines the requirements for the new mobile application.
```

### Meeting Minutes
```markdown
---
title: "Sprint Planning Meeting"
date: "2023-03-15"
time: "09:00 AM"
duration: "2 hours"
attendees:
  - "scrum.master"
  - "product.owner"
  - "dev.team.lead"
  - "ux.designer"
meeting:
  type: "sprint-planning"
  sprint: "Sprint 15"
  quarter: "Q1 2023"
action_items: 5
---

# Sprint 15 Planning Meeting

## Meeting Summary
Planning session for the upcoming two-week sprint.
```

### Tutorial Document
```markdown
---
title: "Getting Started with React Hooks"
author: "Development Team"
difficulty: "intermediate"
duration: "45 minutes"
prerequisites:
  - "JavaScript ES6+"
  - "React Basics"
  - "Component Lifecycle"
tools:
  - "Node.js 18+"
  - "VS Code"
  - "Chrome DevTools"
tags:
  - tutorial
  - react
  - hooks
  - javascript
---

# React Hooks Tutorial

Learn how to use React Hooks to manage state and side effects.
```

### Policy Document
```markdown
---
title: "Remote Work Policy"
author: "Human Resources"
effective_date: "2023-01-01"
review_date: "2024-01-01"
approval:
  approved_by: "hr.director"
  approval_date: "2022-12-15"
category: "hr-policy"
applies_to: "all-employees"
confidentiality: "internal"
tags:
  - policy
  - remote-work
  - hr
  - guidelines
---

# Remote Work Policy

This policy outlines the guidelines for remote work arrangements.
```

### Release Notes
```markdown
---
title: "Version 2.3.0 Release Notes"
version: "2.3.0"
release_date: "2023-03-20"
release_type: "minor"
previous_version: "2.2.1"
contributors:
  - "alice.dev"
  - "bob.qa"
  - "charlie.pm"
highlights:
  - "Performance improvements"
  - "New dashboard design"
  - "Mobile responsiveness"
tags:
  - release-notes
  - version-2.3.0
  - features
  - bugfixes
---

# Release Notes v2.3.0

## What's New
This release includes significant performance improvements and UI updates.
```

### Research Report
```markdown
---
title: "User Experience Research Report"
author: "UX Research Team"
study_period: "2023-01-15 to 2023-02-28"
participants: 150
methodology: "Mixed methods"
confidence_level: "95%"
research:
  type: "user-experience"
  focus: "mobile-app-usability"
  demographics:
    - "18-65 years"
    - "Mobile users"
    - "Urban/Rural mix"
tags:
  - research
  - ux
  - mobile
  - usability
---

# User Experience Research Report

## Executive Summary
This report presents findings from our mobile app usability study.
```

### Training Material
```markdown
---
title: "Git and GitHub Workshop"
instructor: "Senior Developer"
duration: "3 hours"
format: "hands-on"
skill_level: "beginner"
max_participants: 20
materials:
  - "Laptop with Git installed"
  - "GitHub account"
  - "Text editor"
learning_objectives:
  - "Understand version control basics"
  - "Create and manage repositories"
  - "Collaborate using pull requests"
tags:
  - training
  - git
  - github
  - workshop
---

# Git and GitHub Workshop

## Prerequisites
Basic command line knowledge is recommended but not required.
```