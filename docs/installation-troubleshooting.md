# Installation Troubleshooting

Common issues and solutions when installing and using the Extended Markdown ADF Parser.

## Common Issues

### "Cannot use import statement outside a module"

**Solution 1:** Add `"type": "module"` to package.json
```json
{
  "type": "module"
}
```

**Solution 2:** Use dynamic import in CommonJS
```javascript
const { Parser } = await import('extended-markdown-adf-parser');
```

**Solution 3:** Use .mjs file extension
```bash
mv script.js script.mjs
```

### "Module not found" in TypeScript

**Solution:** Check your tsconfig.json module resolution:
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

### Performance Issues with Large Documents

**Solution:** Use the streaming parser:
```javascript
import { StreamingParser } from 'extended-markdown-adf-parser/streaming';

const streamingParser = new StreamingParser({
  chunkSize: 1000
});

const result = await streamingParser.parseAsync(largeMarkdown);
```

### Volta Version Management Issues

If you're having trouble with Volta automatically switching versions:

**Check Volta Configuration:**
```bash
# Verify Volta is installed
volta --version

# Check pinned versions in project
volta list

# Re-pin versions if needed
volta pin node@20.11.1
volta pin yarn@4.7.0
```

**Restart Shell:**
```bash
# Restart your shell session
exec $SHELL

# Or source your profile
source ~/.bashrc  # or ~/.zshrc
```

### Package Installation Failures

#### Network/Registry Issues

**Solution 1:** Clear npm cache
```bash
npm cache clean --force
yarn cache clean
```

**Solution 2:** Use different registry
```bash
npm install extended-markdown-adf-parser --registry https://registry.npmjs.org/
```

#### Permission Issues

**Solution 1:** Use npx for global installs
```bash
npx extended-markdown-adf-parser --version
```

**Solution 2:** Fix npm permissions (Unix/macOS)
```bash
# Create global directory for npm
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
source ~/.profile
```

### TypeScript Compilation Errors

#### Missing Type Definitions

The package includes built-in TypeScript definitions, but if you encounter issues:

```bash
# Verify TypeScript version compatibility
npx tsc --version

# Check if types are properly resolved
npx tsc --traceResolution | grep extended-markdown-adf-parser
```

#### Module Resolution Issues

Update your tsconfig.json:
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true
  }
}
```

### ESM/CommonJS Compatibility

#### Mixing Module Systems

**Error:** `require() of ES modules is not supported`

**Solution:** Use dynamic imports consistently:
```javascript
// Instead of mixing require and import
const parser = require('extended-markdown-adf-parser'); // ❌

// Use dynamic import
const { Parser } = await import('extended-markdown-adf-parser'); // ✅
```

#### Jest Testing Issues

For Jest testing with ESM:

**jest.config.js:**
```javascript
export default {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapping: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true
    }]
  }
};
```

### Memory Issues with Large Files

#### Heap Out of Memory

**Solution:** Increase Node.js memory limit
```bash
node --max-old-space-size=4096 your-script.js
```

#### Use Streaming Parser

```javascript
import { StreamingParser } from 'extended-markdown-adf-parser/streaming';

const streamingParser = new StreamingParser({
  chunkSize: 500,
  enableGarbageCollection: true
});
```

## Getting Help

If you encounter installation issues not covered here:

- **[Report Issues](https://github.com/JeromeErasmus/extended-markdown-adf-parser/issues)**
- **[Documentation](https://jeromeerasmus.gitbook.io/extended-markdown-adf-parser)**
- **[Discussions](https://github.com/JeromeErasmus/extended-markdown-adf-parser/discussions)**

### Information to Include

When reporting installation issues, please include:
- Node.js version (`node --version`)
- npm/Yarn version  
- Operating system and version
- Complete error messages
- Package.json configuration
- Steps to reproduce the issue

### Environment Debugging

**System Information:**
```bash
# Node.js and npm versions
node --version && npm --version

# Operating system
uname -a  # Unix/macOS
systeminfo  # Windows

# Check PATH and environment
echo $PATH
env | grep -i node
```

**Package Information:**
```bash
# Check installed version
npm list extended-markdown-adf-parser

# Check package dependencies
npm ls --depth=0

# Verify package integrity
npm audit
```