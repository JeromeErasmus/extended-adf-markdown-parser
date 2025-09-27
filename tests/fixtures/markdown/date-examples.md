# Date Examples

This document demonstrates various ways to use dates in markdown.

## Standalone Dates

Project kickoff: 2025-01-15
Milestone review: 2025-03-30
Final delivery: 2025-06-30

## Dates in Different Contexts

### In Lists

- Design phase: 2025-02-14
- Development phase: 2025-04-01
- Testing phase: 2025-05-15
- Launch date: 2025-06-30

### In Tables

| Phase | Start Date | End Date | Duration |
|-------|------------|----------|----------|
| Planning | 2025-01-01 | 2025-01-31 | 30 days |
| Design | 2025-02-01 | 2025-02-28 | 28 days |
| Development | 2025-03-01 | 2025-04-30 | 60 days |
| Testing | 2025-05-01 | 2025-05-31 | 30 days |

### With Special Formats

Braced dates: {date:2025-09-27}
Mixed with text: The meeting on 2025-12-01 will be virtual.

## Edge Cases

### Leap Year
February 29th: 2024-02-29

### Year Boundaries  
New Year: 2025-01-01
Year end: 2025-12-31

### Unix Epoch
Historic date: 1970-01-01

## Dates with Other Inline Elements

**Important deadline**: 2025-06-15 *must not be missed*!

The {user:project.manager} scheduled 2025-04-01 for final review :calendar:

## Not Dates (Should Not Convert)

- Version numbers: v2025-01-15-beta
- File paths: /logs/2025-01-15/error.log  
- URLs: https://example.com/2025-01-15/report
- Partial matches: 2025-1-1 (wrong format)
- In code: `const date = "2025-01-15"`

## Complex Scenarios

### Multiple Dates in Paragraph
The project timeline spans from 2025-01-01 to 2025-12-31 with key milestones on 2025-03-15, 2025-06-15, and 2025-09-15.

### Dates in Blockquotes
> The deadline was moved from 2025-05-01 to 2025-05-15 due to requirements changes.

### Dates in Headings
## Q1 2025 Review (2025-03-31)

Last updated: 2024-12-01