# mention

## Description

Mention elements reference users, groups, or entities within ADF documents. They provide a way to tag or notify specific users and typically render as highlighted text with user information. Mentions support both user IDs and display text for flexible referencing.

## .md markdown syntax

### User Mention by ID
```markdown
{user:user-id-123}
```

### User Mention with Display Name
```markdown
{user:john.smith}
{user:alice.johnson}
```

### Mention with Custom Attributes
```markdown
<!-- adf:mention accessLevel="CONTAINER" userType="DEFAULT" -->
{user:team-lead-456}
```

### Group Mentions
```markdown
{user:@developers}
{user:@designers}
{user:@management}
```

## .adf-schema.json schema

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "const": "mention"
    },
    "attrs": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "description": "User or entity ID"
        },
        "text": {
          "type": "string",
          "description": "Display text for the mention"
        },
        "accessLevel": {
          "type": "string",
          "enum": ["NONE", "SITE", "APPLICATION", "CONTAINER"],
          "description": "Access level for the mention"
        },
        "userType": {
          "type": "string",
          "enum": ["DEFAULT", "SPECIAL", "APP"],
          "description": "Type of user being mentioned"
        }
      },
      "required": ["id"],
      "additionalProperties": true
    }
  },
  "required": ["type", "attrs"]
}
```

## Examples

### Team Communications
```markdown
Hey {user:sarah.wilson}, can you review this pull request?

{user:mike.chen}, please update the documentation when you have a chance.
```

### Project Assignments
```markdown
## Task Assignments

- **Frontend**: {user:alice.dev} and {user:bob.ui}
- **Backend**: {user:charlie.api} and {user:diana.db}
- **Testing**: {user:eve.qa}
```

### Meeting Minutes
```markdown
## Meeting Notes - March 15, 2023

**Attendees:** {user:john.manager}, {user:sarah.lead}, {user:mike.dev}

**Action Items:**
- {user:sarah.lead}: Finalize requirements by Friday
- {user:mike.dev}: Implement authentication module
```

### Code Review
```markdown
## Pull Request Review

{user:lead.developer}, this PR is ready for review.

Changes made:
- Updated authentication logic
- Fixed the bug reported by {user:qa.tester}
- Added tests as requested by {user:senior.dev}
```

### Issue Tracking
```markdown
## Bug Report #456

**Reporter:** {user:customer.support}
**Assigned to:** {user:backend.dev}
**Reviewer:** {user:tech.lead}

The login functionality is not working as expected.
```

### Group Notifications
```markdown
Attention {user:@all-developers}: 

The deployment will happen this Friday at 5 PM. Please ensure all features are tested by {user:@qa-team} before then.
```

### Document Reviews
```markdown
## Document Review Required

{user:product.manager}, please review the updated specification.
{user:ux.designer}, feedback needed on the user flow section.
```

### Approvals
```markdown
## Approval Request

This change requires approval from:
- {user:security.officer} for security review
- {user:architecture.lead} for technical review
- {user:product.owner} for business approval
```

### Customer Support
```markdown
## Customer Inquiry

**Customer:** John Doe (Premium Account)
**Assigned to:** {user:support.specialist}
**Escalated to:** {user:senior.support}

Issue: Unable to access premium features
```

### Release Notes
```markdown
## Version 2.1 Release Notes

**Release Manager:** {user:release.manager}
**Contributors:** {user:alice.dev}, {user:bob.dev}, {user:charlie.designer}

Special thanks to {user:@beta-testers} for their valuable feedback.
```

### Training Materials
```markdown
## New Employee Onboarding

Welcome to the team! Please reach out to:
- {user:hr.representative} for administrative questions
- {user:it.support} for technical setup
- {user:buddy.mentor} for general guidance
```

### Emergency Contacts
```markdown
## Emergency Contact List

- **On-call Engineer:** {user:oncall.dev}
- **Incident Manager:** {user:incident.manager}
- **System Administrator:** {user:sysadmin}
```