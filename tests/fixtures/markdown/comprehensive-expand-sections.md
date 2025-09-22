# Comprehensive Expand Section Elements Testing

## Basic Expand Sections

~~~expand title="Click to expand this section"
This content is hidden by default and revealed when clicked.
It supports **rich formatting** and [links](https://example.com).
~~~

~~~expand title="Technical Details"
This section contains detailed technical information that most users don't need to see immediately.

- System requirements
- Configuration details
- Advanced options
~~~

~~~expand title="FAQ Section"
**Q: How do I install this package?**
A: You can install using npm or yarn:

```bash
npm install extended-markdown-adf-parser
# or
yarn add extended-markdown-adf-parser
```

**Q: What Node.js versions are supported?**
A: This package requires Node.js version 20.11.1 or higher.
~~~

## Expand with Custom Attributes

<!-- adf:expand defaultOpen="true" titleColor="#0052cc" -->
~~~expand title="Auto-opened Section"
This expand section opens automatically with a blue title color applied.

**Key Features:**
- Automatic expansion on page load
- Custom title styling
- Rich content support
~~~

<!-- adf:expand defaultOpen="false" titleColor="#d04437" -->
~~~expand title="Important Warning Section"
This section uses red title color to indicate important warnings.

⚠️ **Warning**: This action cannot be undone.
~~~

## HTML Details Syntax Alternative

<details>
<summary>Click to expand this section</summary>

This content uses the standard HTML details/summary syntax.

**Benefits:**
- Native HTML support
- Semantic markup
- Accessibility friendly

```javascript
function toggleDetails(element) {
  element.open = !element.open;
}
```

</details>

<details open>
<summary>This section starts open</summary>

Content that is visible by default using the `open` attribute.

</details>

## Expand with Rich Content

~~~expand title="Code Examples"
Here are some code examples for this feature:

**JavaScript:**
```javascript
function toggleExpand(element) {
  element.classList.toggle('open');
  
  const content = element.querySelector('.content');
  if (element.classList.contains('open')) {
    content.style.display = 'block';
  } else {
    content.style.display = 'none';
  }
}
```

**CSS:**
```css
.expand-section {
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 1rem 0;
}

.expand-section.open .content {
  display: block;
  animation: slideDown 0.3s ease-out;
}
```

**HTML:**
```html
<div class="expand-section">
  <button class="expand-trigger">Click to expand</button>
  <div class="content">Hidden content here</div>
</div>
```
~~~

## Nested Expand Sections

~~~expand title="Parent Section"
This is the parent content with nested expandable sections.

### Database Configuration

<details>
<summary>Connection Settings</summary>

Configure your database connection:

```json
{
  "host": "localhost",
  "port": 5432,
  "database": "myapp",
  "ssl": true
}
```

</details>

<details>
<summary>Performance Tuning</summary>

Optimize your database performance:

- Set appropriate connection pool size
- Configure query timeouts
- Enable query caching
- Monitor slow queries

</details>

### API Configuration

~~~expand title="Authentication Setup"
Configure API authentication methods:

1. **API Keys**: For server-to-server communication
2. **OAuth 2.0**: For user authentication
3. **JWT Tokens**: For session management
~~~

More parent content here with additional configuration details.
~~~

## FAQ-Style Expand Sections

~~~expand title="How do I install the package?"
You can install using npm or yarn:

```bash
npm install extended-markdown-adf-parser
# or
yarn add extended-markdown-adf-parser
```

**System Requirements:**
- Node.js 20.11.1+
- npm 8.0+
- Modern browser support
~~~

~~~expand title="What features are supported?"
This parser supports:

- ✅ Standard Markdown syntax
- ✅ ADF-specific extensions
- ✅ Custom panels and expand sections
- ✅ Media attachments
- ✅ Status indicators
- ✅ Date and time elements
- ✅ User mentions
- ✅ Emoji support
~~~

~~~expand title="How do I report bugs?"
Please create an issue on our [GitHub repository](https://github.com/example/repo/issues).

**Include the following information:**
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Environment details
5. Code samples (if applicable)
~~~

~~~expand title="Can I contribute to the project?"
Yes! We welcome contributions:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

See our [CONTRIBUTING.md](https://github.com/example/repo/blob/main/CONTRIBUTING.md) for detailed guidelines.
~~~

## Documentation Structure Example

~~~expand title="API Documentation"
This section covers our complete API reference.

## Authentication
All API calls require authentication using one of these methods:

<details>
<summary>API Key Method</summary>

Include your API key in the request header:

```http
GET /api/v1/users
Authorization: Bearer your-api-key-here
Content-Type: application/json
```

</details>

<details>
<summary>OAuth 2.0 Method</summary>

Use OAuth 2.0 flow for user authentication:

1. Redirect user to authorization URL
2. Handle callback with authorization code
3. Exchange code for access token
4. Use access token in API requests

</details>

## Endpoints

Available API endpoints organized by category:

~~~expand title="User Management"
### Users

- `GET /users` - List all users
- `POST /users` - Create new user
- `GET /users/{id}` - Get user by ID
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

### Profiles

- `GET /users/{id}/profile` - Get user profile
- `PUT /users/{id}/profile` - Update profile
~~~

~~~expand title="Data Operations"
### Data Management

- `GET /data` - List data objects
- `POST /data` - Create data object
- `PUT /data/{id}` - Update data object
- `DELETE /data/{id}` - Delete data object

### Search and Filtering

- `GET /data/search?q={query}` - Search data
- `GET /data?filter={filter}` - Filter data
~~~
~~~

## Configuration Examples

<!-- adf:expand titleColor="#0052cc" defaultOpen="false" -->
~~~expand title="Advanced Configuration Options"
Customize the behavior with these configuration options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `timeout` | number | 5000 | Request timeout in milliseconds |
| `retries` | number | 3 | Number of retry attempts |
| `debug` | boolean | false | Enable debug logging |
| `cache` | boolean | true | Enable response caching |
| `validateSSL` | boolean | true | Validate SSL certificates |

**Example Configuration:**

```json
{
  "timeout": 10000,
  "retries": 5,
  "debug": true,
  "cache": false,
  "validateSSL": true,
  "headers": {
    "User-Agent": "MyApp/1.0",
    "Accept": "application/json"
  }
}
```

**Environment Variables:**
```bash
API_TIMEOUT=10000
API_RETRIES=5
API_DEBUG=true
API_CACHE=false
```
~~~