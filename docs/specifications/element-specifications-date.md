# date

## Description

Date elements represent temporal information within ADF documents. They can display dates in various formats and provide timestamp functionality for deadlines, events, and time-sensitive content. Date elements support localization and different display formats.

## .md markdown syntax

### Standard Date Format
```markdown
{date:2023-12-25}
2023-12-25
```

> **Note**: Both `{date:YYYY-MM-DD}` format and standalone `YYYY-MM-DD` format are supported and convert to Unix timestamps in ADF.

### ISO Date Format
```markdown
{date:2023-03-15T10:30:00Z}
```

### Date with Custom Format
```markdown
<!-- adf:date timestamp="1703462400000" format="DD/MM/YYYY" -->
{date:2023-12-25}
```

### Date with Timezone
```markdown
<!-- adf:date timestamp="1703462400000" timezone="America/New_York" -->
{date:2023-12-25T15:00:00}
```

### Relative Date
```markdown
<!-- adf:date timestamp="1703462400000" displayMode="relative" -->
{date:2023-12-25}
```

## .adf-schema.json schema

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "const": "date"
    },
    "attrs": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "string",
          "description": "Unix timestamp in milliseconds (string format)"
        },
        "displayMode": {
          "type": "string",
          "enum": ["date", "datetime", "relative"],
          "description": "How to display the date"
        },
        "format": {
          "type": "string",
          "description": "Custom date format string"
        },
        "timezone": {
          "type": "string",
          "description": "Timezone identifier"
        }
      },
      "required": ["timestamp"],
      "additionalProperties": true
    }
  },
  "required": ["type", "attrs"]
}
```

## Conversion Behavior

### Markdown to ADF
- `2023-12-25` (standalone) → `{"type": "date", "attrs": {"timestamp": "1703462400000"}}`
- `{date:2023-12-25}` (braced) → `{"type": "date", "attrs": {"timestamp": "1703462400000"}}`
- Dates are converted to Unix timestamps in milliseconds (UTC, 00:00:00)

### ADF to Markdown  
- `{"type": "date", "attrs": {"timestamp": "1703462400000"}}` → `2023-12-25<!-- adf:date attrs='{"timestamp":"1703462400000"}' -->`
- Timestamps are converted back to `YYYY-MM-DD` format
- Additional attributes are preserved in metadata comments for round-trip accuracy

### Round-trip Conversion
The parser ensures that dates maintain accuracy through multiple conversion cycles:
```
2023-12-25 → ADF (timestamp) → 2023-12-25 (identical)
```

## Examples

### Project Deadlines
```markdown
## Project Milestones

- **Design Phase**: Due {date:2023-04-15}
- **Development**: Due {date:2023-06-30}
- **Testing**: Due {date:2023-07-15}  
- **Launch**: Scheduled for {date:2023-08-01}
```

### Meeting Schedules
```markdown
## Upcoming Meetings

**Weekly Standup**: Every Monday at {date:2023-03-20T09:00:00}
**Sprint Review**: {date:2023-03-24T14:00:00}
**Retrospective**: {date:2023-03-24T15:30:00}
```

### Document Timestamps
```markdown
**Document Created**: {date:2023-01-15T10:30:00}
**Last Updated**: {date:2023-03-10T16:45:00}
**Next Review**: {date:2023-06-15}
```

### Event Planning
```markdown
## Company Events

**Q1 All-Hands**: {date:2023-03-30T10:00:00}
**Team Building**: {date:2023-04-14T09:00:00}
**Conference**: {date:2023-05-20T08:00:00} - {date:2023-05-22T18:00:00}
```

### Release Schedule
```markdown
## Release Timeline

- **Beta Release**: {date:2023-04-01}
- **Release Candidate**: {date:2023-04-15}
- **General Availability**: {date:2023-05-01}
- **Feature Freeze**: {date:2023-03-25}
```

### Training Calendar
```markdown
## Training Sessions

**Git Workshop**: {date:2023-03-22T13:00:00}
**API Development**: {date:2023-03-29T10:00:00}
**Security Best Practices**: {date:2023-04-05T14:00:00}
```

### Maintenance Windows
```markdown
## Scheduled Maintenance

**Database Upgrade**: {date:2023-03-25T02:00:00} - {date:2023-03-25T06:00:00}
**Server Migration**: {date:2023-04-01T20:00:00} - {date:2023-04-02T04:00:00}
```

### Historical Records
```markdown
## Version History

- **v1.0**: Released {date:2022-01-15}
- **v1.1**: Released {date:2022-04-10}
- **v2.0**: Released {date:2022-09-20}
- **v2.1**: Released {date:2023-01-25}
```

### Due Dates in Tasks
```markdown
## Action Items

- [ ] Complete user research - Due: {date:2023-03-30}
- [ ] Finalize wireframes - Due: {date:2023-04-05}
- [ ] Develop prototype - Due: {date:2023-04-20}
- [ ] Conduct user testing - Due: {date:2023-05-01}
```

### Billing Cycles
```markdown
## Payment Schedule

**Invoice Date**: {date:2023-03-01}
**Payment Due**: {date:2023-03-31}
**Next Billing Cycle**: {date:2023-04-01}
```

### Anniversary Dates
```markdown
## Important Dates

**Company Founded**: {date:2018-06-15}
**Product Launch**: {date:2019-03-10}
**IPO Date**: {date:2021-11-22}
```

### Compliance Deadlines
```markdown
## Regulatory Compliance

**GDPR Review**: Due {date:2023-05-25}
**Security Audit**: Scheduled {date:2023-06-15}
**Annual Report**: Due {date:2023-12-31}
```

### Vacation Schedule
```markdown
## Team Vacation Calendar

**Alice**: {date:2023-07-10} - {date:2023-07-24}
**Bob**: {date:2023-08-01} - {date:2023-08-15}
**Carol**: {date:2023-09-15} - {date:2023-09-22}
```