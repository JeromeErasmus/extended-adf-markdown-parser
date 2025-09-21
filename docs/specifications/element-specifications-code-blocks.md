# code-blocks

## Description

Code blocks display formatted code with syntax highlighting and preserve formatting including indentation and line breaks. They support language specification for syntax highlighting and can include custom attributes for theming and display options.

## .md markdown syntax

### Fenced Code Blocks
```markdown
```javascript
function example() {
  console.log('Hello, world!');
  return 'success';
}
```
```

### Code Blocks without Language
```markdown
```
Plain text code block
No syntax highlighting
```
```

### Indented Code Blocks
```markdown
    function indented() {
        return 'This is indented code';
    }
```

### Code Blocks with Custom Attributes
```markdown
<!-- adf:codeBlock theme="dark" lineNumbers="true" -->
```python
def greet(name):
    print(f'Hello, {name}!')
```
```

## .adf-schema.json schema

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "const": "codeBlock"
    },
    "attrs": {
      "type": "object",
      "properties": {
        "language": {
          "type": "string",
          "description": "Programming language for syntax highlighting"
        },
        "theme": {
          "type": "string",
          "enum": ["light", "dark"],
          "description": "Code block theme"
        },
        "lineNumbers": {
          "type": "boolean",
          "description": "Show line numbers"
        },
        "wrap": {
          "type": "boolean",
          "description": "Enable line wrapping"
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
            "const": "text"
          },
          "text": {
            "type": "string"
          }
        }
      },
      "minItems": 1
    }
  },
  "required": ["type", "content"]
}
```

## Examples

### JavaScript Code
```markdown
```javascript
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

const total = calculateTotal([
  { name: 'Widget', price: 10 },
  { name: 'Gadget', price: 25 }
]);
```
```

### Python Code
```markdown
```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Generate first 10 numbers
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
```
```

### Shell Commands
```markdown
```bash
# Install dependencies
npm install

# Run tests
npm test

# Build for production
npm run build
```
```

### Plain Text Block
```markdown
```
Configuration file content:
server.port=8080
database.url=localhost:5432
cache.enabled=true
```
```

### SQL Query
```markdown
```sql
SELECT u.name, p.title, p.created_at
FROM users u
JOIN posts p ON u.id = p.user_id
WHERE p.published = true
ORDER BY p.created_at DESC
LIMIT 10;
```
```

### Code with Line Numbers
```markdown
<!-- adf:codeBlock lineNumbers="true" theme="dark" -->
```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

class UserService {
  private users: User[] = [];
  
  addUser(user: User): void {
    this.users.push(user);
  }
  
  findUser(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }
}
```
```

### Multi-language Example
```markdown
**JavaScript:**
```javascript
const greeting = name => `Hello, ${name}!`;
```

**Python:**
```python
def greeting(name):
    return f"Hello, {name}!"
```

**Rust:**
```rust
fn greeting(name: &str) -> String {
    format!("Hello, {}!", name)
}
```
```