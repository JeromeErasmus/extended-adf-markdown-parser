# inline-card

## Description

Inline card elements display rich link previews and embedded content within ADF documents. They provide enhanced link presentations with metadata, thumbnails, and contextual information. Inline cards can reference external URLs, internal resources, or application-specific content.

## .md markdown syntax

### Basic Inline Card
```markdown
[Card Title](https://example.com)
```

### Inline Card with Metadata
```markdown
<!-- adf:inlineCard url="https://github.com/user/repo" title="Repository Name" -->
[GitHub Repository](https://github.com/user/repo)
```

### Application Cards
```markdown
<!-- adf:inlineCard url="jira:issue/ABC-123" title="Bug Report" -->
[ABC-123: Login issue](jira:issue/ABC-123)
```

### Rich Link Cards
```markdown
<!-- adf:inlineCard url="https://docs.example.com" title="Documentation" description="Complete API reference" -->
[API Documentation](https://docs.example.com)
```

## .adf-schema.json schema

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "const": "inlineCard"
    },
    "attrs": {
      "type": "object",
      "properties": {
        "url": {
          "type": "string",
          "format": "uri",
          "description": "Card target URL"
        },
        "data": {
          "type": "object",
          "properties": {
            "@type": {
              "type": "string",
              "description": "Card type identifier"
            },
            "@url": {
              "type": "string",
              "format": "uri",
              "description": "Card URL"
            },
            "generator": {
              "type": "object",
              "description": "Card generator information"
            }
          },
          "additionalProperties": true
        }
      },
      "required": ["url"],
      "additionalProperties": true
    }
  },
  "required": ["type", "attrs"]
}
```

## Examples

### External Links
```markdown
Check out this article: [The Future of Web Development](https://techblog.example.com/future-web-dev)

Reference documentation: [React Hooks Guide](https://react.dev/reference/react)

Useful tool: [JSON Formatter](https://jsonformatter.org)
```

### Jira Integration
```markdown
## Related Issues

- [ABC-123: User authentication fails](jira:issue/ABC-123)
- [ABC-124: Dashboard loading slowly](jira:issue/ABC-124)  
- [ABC-125: Mobile responsive fixes](jira:issue/ABC-125)
```

### Confluence Pages
```markdown
## Documentation Links

- [Project Requirements](confluence:page/requirements-doc)
- [Architecture Overview](confluence:page/architecture-guide)
- [API Specifications](confluence:page/api-specs)
```

### GitHub Integration  
```markdown
## Code References

- [Main Repository](https://github.com/company/main-app)
- [Pull Request #42](https://github.com/company/main-app/pull/42)
- [Recent Commit](https://github.com/company/main-app/commit/abc123)
```

### Design Resources
```markdown
## Design Assets

- [Figma Mockups](https://figma.com/file/project-mockups)
- [Style Guide](https://company.design/style-guide)
- [Icon Library](https://iconlib.company.com)
```

### Learning Resources
```markdown
## Training Materials

- [Git Tutorial](https://learngitbranching.js.org)
- [JavaScript Course](https://javascript.info)
- [React Documentation](https://react.dev)
```

### Tools and Services
```markdown
## Development Tools

- [Deployment Dashboard](https://deploy.company.com)
- [Monitoring Service](https://monitor.company.com)
- [Error Tracking](https://errors.company.com)
```

### Research Links
```markdown
## Market Research

- [Industry Report 2023](https://research.example.com/industry-2023)
- [Competitor Analysis](https://analysis.example.com/competitors)
- [User Survey Results](https://surveys.company.com/user-feedback)
```

### Support Resources
```markdown
## Help and Support

- [User Manual](https://help.company.com/user-manual)
- [FAQ Section](https://help.company.com/faq)
- [Contact Support](https://support.company.com/ticket)
```

### Social Media
```markdown
## Social Presence

- [Company Twitter](https://twitter.com/company)
- [LinkedIn Page](https://linkedin.com/company/company-name)
- [YouTube Channel](https://youtube.com/company-channel)
```

### Integration Examples
```markdown
## External Integrations

- [Slack Workspace](https://company.slack.com)
- [Trello Board](https://trello.com/b/project-board)
- [Google Drive](https://drive.google.com/drive/project-folder)
```

### News and Updates
```markdown
## Recent Updates

- [Release Notes v2.1](https://changelog.company.com/v2.1)
- [Security Update](https://security.company.com/update-march-2023)
- [Feature Announcement](https://blog.company.com/new-features)
```

### Compliance Documents
```markdown
## Legal and Compliance

- [Privacy Policy](https://company.com/privacy)
- [Terms of Service](https://company.com/terms)
- [GDPR Compliance](https://company.com/gdpr)
```