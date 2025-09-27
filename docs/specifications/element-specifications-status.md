# status

## Description

Status elements display status indicators with customizable text and colors within ADF documents. They provide visual cues for project states, task completion, approval workflows, and other categorical information. Status elements support various color schemes as defined in the Atlassian Document Format specification.

## .md markdown syntax

### Basic Status
```markdown
Status: {status:Complete}
Status: {status:In Progress}
Status: {status:Blocked}
```

### Status with Color
```markdown
<!-- adf:status color="green" -->
{status:Ready for Review}

<!-- adf:status color="red" -->
{status:Needs Attention}
```

### Multiple Status Types
```markdown
Priority: {status:High} {status:Medium} {status:Low}
Phase: {status:Planning} {status:Development} {status:Testing} {status:Complete}
```

## .adf-schema.json schema

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "const": "status"
    },
    "attrs": {
      "type": "object",
      "properties": {
        "text": {
          "type": "string",
          "description": "Status display text"
        },
        "color": {
          "type": "string",
          "enum": ["neutral", "purple", "blue", "red", "yellow", "green"],
          "description": "Status color theme"
        },
        "localId": {
          "type": "string",
          "description": "Unique identifier, auto-generated"
        }
      },
      "required": ["text", "color"],
      "additionalProperties": true
    }
  },
  "required": ["type", "attrs"]
}
```

## Examples

### Project Status
```markdown
## Project Dashboard

**Authentication Module**: [Complete]
**Dashboard UI**: [In Progress]  
**API Integration**: [Planning]
**Testing**: [Not Started]
```

### Task Management
```markdown
## Sprint Backlog

- Implement user login [In Progress]
- Design dashboard wireframes [Complete]
- Set up CI/CD pipeline [Blocked]
- Write API documentation [To Do]
```

### Approval Workflow
```markdown
## Document Review

**Technical Review**: [Approved]
**Legal Review**: [Pending]
**Management Sign-off**: [Waiting]
```

### Quality Assurance
```markdown
## Test Results

**Unit Tests**: [Pass]
**Integration Tests**: [Pass]
**Performance Tests**: [Fail]  
**Security Scan**: [Warning]
```

### Release Pipeline
```markdown
## Deployment Status

**Development**: [Deployed]
**Staging**: [Ready]
**Production**: [Scheduled]
```

### Bug Tracking
```markdown
## Open Issues

- Login timeout issue [Critical]
- Dashboard loading slow [Medium]
- Typo in help text [Low]
- Search not working [High]
```

### Feature Flags
```markdown
## Feature Status

**Dark Mode**: [Beta]
**New Dashboard**: [Experimental]  
**Mobile App**: [Coming Soon]
**API v2**: [Deprecated]
```

### Team Availability
```markdown
## Team Status

**Alice Johnson**: [Available]
**Bob Smith**: [Busy]
**Carol Davis**: [Vacation]
**David Wilson**: [Meeting]
```

### Environment Health
```markdown
## System Status

**Database**: [Healthy]
**API Server**: [Warning]
**File Storage**: [Critical]
**CDN**: [Operational]
```

### Content Status
```markdown
## Documentation Status

**User Guide**: [Current]
**API Docs**: [Outdated]
**FAQs**: [In Review]
**Tutorials**: [Draft]
```

### Priority Levels
```markdown
## Issue Priorities

**Server Down**: [P0 - Critical]
**Feature Bug**: [P1 - High]
**UI Polish**: [P2 - Medium]
**Documentation**: [P3 - Low]
```

### Compliance Status
```markdown
## Regulatory Compliance

**GDPR**: [Compliant]
**SOX**: [In Progress]
**HIPAA**: [Not Applicable]
**PCI DSS**: [Pending Audit]
```

### Training Progress
```markdown
## Employee Training

**Security Training**: [Complete]
**Git Workshop**: [Scheduled]
**React Course**: [In Progress]
**Leadership Program**: [Enrolled]
```

### Inventory Status
```markdown
## Equipment Status

**Laptops**: [In Stock]
**Monitors**: [Low Stock]
**Keyboards**: [Out of Stock]
**Mice**: [Ordered]
```