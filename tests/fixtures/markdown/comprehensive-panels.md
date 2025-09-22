# Comprehensive Panel Elements Testing

## Basic Panel Types

~~~panel type=info
This is an info panel with basic content. It provides general information that might be helpful to know.
~~~

~~~panel type=warning title="Important Warning"
This is a warning panel with a custom title. Make sure you have backed up your data before proceeding with this operation.
~~~

~~~panel type=error
This is an error panel for critical information. This operation cannot be completed due to insufficient permissions.
~~~

~~~panel type=success
This is a success panel for positive feedback. Your changes have been saved successfully!
~~~

~~~panel type=note
This is a note panel for additional context. Please refer to the documentation for more details.
~~~

## Panels with Custom Attributes

<!-- adf:panel backgroundColor="#e6f3ff" borderColor="#0052cc" padding="16px" -->
~~~panel type=info title="Custom Styled Panel"
This panel has custom background, border, and padding attributes applied.
~~~

<!-- adf:panel backgroundColor="#fff3cd" borderColor="#ffc107" -->
~~~panel type=warning title="Custom Warning"
This panel uses custom yellow styling to match our brand colors.
~~~

## Panels with Rich Content

~~~panel type=warning title="Development Guidelines"
Please follow these **important** guidelines:

1. Always test your code thoroughly
2. Write clear and comprehensive documentation
3. Use meaningful commit messages
4. Follow the established code style

```javascript
// Example code validation
function validate(input) {
  if (!input || input.length === 0) {
    throw new Error('Input cannot be empty');
  }
  return input.trim();
}
```

For more information, visit our [style guide](https://example.com/style-guide).
~~~

~~~panel type=note title="Technical Details"
**Implementation Notes:**

The following considerations apply:
- Performance impact is minimal
- Backward compatibility is maintained
- Unit tests cover 98% of code paths

```bash
# Run tests
npm test
# Check coverage
npm run coverage
```

> **Note**: These settings only apply to production environments.
~~~

~~~panel type=error title="Critical Issue"
❌ **System Error Detected**

The following errors need immediate attention:

- Database connection timeout
- Memory usage exceeds 90% threshold
- SSL certificate expires in 3 days

**Immediate Actions Required:**
1. Contact system administrator
2. Review error logs in `/var/log/app/`
3. Schedule maintenance window

~~~

~~~panel type=success title="Deployment Complete"
✅ **Successful Deployment**

Your application has been successfully deployed to production:

- **Version**: 2.1.4
- **Build ID**: #1234
- **Deployment Time**: 2023-03-15T14:30:00Z
- **Environment**: Production

**Features Included:**
- Enhanced security protocols
- Improved performance optimizations
- Bug fixes for user authentication

~~~

## Nested Content in Panels

~~~panel type=info title="Complex Content Structure"
This panel contains various types of content:

### Subheading Example

Regular paragraph text with **bold** and *italic* formatting.

| Feature | Status | Notes |
|---------|---------|-------|
| Authentication | ✅ Complete | OAuth 2.0 implemented |
| Dashboard | 🔄 In Progress | UI components ready |
| Reports | ⏳ Planned | Backend API needed |

```json
{
  "status": "active",
  "features": {
    "auth": true,
    "dashboard": false,
    "reports": false
  }
}
```

> This is a blockquote within a panel to demonstrate nested content handling.

Final paragraph with a [link to documentation](https://example.com/docs).
~~~

## Panel Combinations

~~~panel type=warning title="Prerequisites"
Before proceeding, ensure you have:

~~~panel type=note
**System Requirements:**
- Node.js 20.11.1 or higher
- npm 8.0 or higher
- Git 2.30 or higher
~~~

~~~panel type=error title="Common Issues"
If you encounter problems:
1. Clear your npm cache: `npm cache clean --force`
2. Delete `node_modules` and reinstall
3. Check file permissions
~~~
~~~