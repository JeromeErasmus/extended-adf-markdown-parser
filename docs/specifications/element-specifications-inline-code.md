# inline-code

## Description

Inline code formatting highlights code snippets, variable names, function names, and technical terms within text. It uses the code mark in ADF and backtick syntax in Markdown, providing monospace formatting and visual distinction from regular text.

## .md markdown syntax

### Standard Inline Code Syntax
```markdown
`inline code`
```

### Code in Context
```markdown
Use the `useState` hook to manage component state.
```

### Code with Backticks Inside
```markdown
To display a backtick, use ``backtick ` inside``.
```

### Multiple Code Spans
```markdown
The `map()`, `filter()`, and `reduce()` methods are essential.
```

## .adf-schema.json schema

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "const": "text"
    },
    "text": {
      "type": "string",
      "description": "Code content"
    },
    "marks": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "const": "code"
          },
          "attrs": {
            "type": "object",
            "properties": {
              "color": {
                "type": "string",
                "pattern": "^#[0-9a-fA-F]{6}$",
                "description": "Text color (hex)"
              },
              "backgroundColor": {
                "type": "string",
                "pattern": "^#[0-9a-fA-F]{6}$",
                "description": "Background color (hex)"
              }
            },
            "additionalProperties": true
          }
        }
      },
      "minItems": 1
    }
  },
  "required": ["type", "text", "marks"]
}
```

## Examples

### Function Names
```markdown
Call the `getUserData()` function to retrieve user information.
```

### Variable Names
```markdown
Set the `apiKey` variable to your API key.
The `baseUrl` should point to your server.
```

### File Names and Paths
```markdown
Edit the `package.json` file in your project root.
The configuration is stored in `/etc/config/app.conf`.
```

### Command Line Instructions
```markdown
Run `npm install` to install dependencies.
Use `git status` to check repository status.
```

### HTTP Methods and Status Codes
```markdown
Send a `POST` request to the `/api/users` endpoint.
The server returned a `404` status code.
```

### HTML Elements and Attributes
```markdown
Use the `<div>` element with `class="container"`.
The `href` attribute contains the link URL.
```

### CSS Properties
```markdown
Set `display: flex` to create a flex container.
Use `margin: 0 auto` to center the element.
```

### Database and SQL
```markdown
Query the `users` table with `SELECT * FROM users`.
The `user_id` column is the primary key.
```

### Configuration Keys
```markdown
Set `debug: true` in your configuration file.
The `timeout` value should be in milliseconds.
```

### Code with Other Formatting
```markdown
The **`render()`** method is **required**.
*Important:* Always call `cleanup()` when done.
```

### API Responses
```markdown
The response includes a `data` object and `status` field.
Check the `error` property if `success` is `false`.
```

### Keyboard Shortcuts
```markdown
Press `Ctrl+C` to copy the selection.
Use `Cmd+Shift+P` to open the command palette.
```

### Regular Expressions
```markdown
Use the pattern `/^[a-zA-Z0-9]+$/` to match alphanumeric strings.
```

### Environment Variables
```markdown
Set the `NODE_ENV` variable to `production`.
The `DATABASE_URL` should contain your connection string.
```

### Code in Lists
```markdown
Common React hooks:
- `useState` - for state management
- `useEffect` - for side effects
- `useContext` - for context consumption
- `useMemo` - for memoization
```

### Code in Tables
```markdown
| Method | Description | Example |
|--------|-------------|---------|
| `GET` | Retrieve data | `fetch('/api/users')` |
| `POST` | Create data | `fetch('/api/users', {...})` |
| `PUT` | Update data | `fetch('/api/users/1', {...})` |
| `DELETE` | Delete data | `fetch('/api/users/1', {method: 'DELETE'})` |
```