# Installation Guide

Complete installation instructions for the Extended Markdown ADF Parser across different environments and package managers.

## Prerequisites

### Node.js Requirements

- **Node.js**: Version 20.11.1 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Yarn**: Version 4.7.0 or higher (optional, but recommended)

### Development Prerequisites

This project uses [Volta](https://volta.sh/) for Node.js and Yarn version management. The required versions are automatically configured:

- **Node.js**: v20.11.1
- **Yarn**: v4.7.0

If you don't have Volta installed:

```bash
# Install Volta
curl https://get.volta.sh | bash

# Volta will automatically use the correct versions when you enter the project directory
cd extended-markdown-adf-parser
```

Check your current versions:
```bash
node --version
npm --version
yarn --version  # if using Yarn
```

### Module System Support

This package supports both **CommonJS** and **ES Modules (ESM)** for maximum compatibility across different Node.js environments and build systems.

#### ES Modules (Recommended)
- **Node.js**: Version 18.0.0 or higher with ES modules enabled
- Supports tree-shaking for optimal bundle sizes
- Native `import`/`export` syntax

#### CommonJS 
- **Node.js**: Version 16.0.0 or higher
- Traditional `require()`/`module.exports` syntax
- Full backward compatibility

### TypeScript Support

This package includes full TypeScript definitions. No additional `@types` packages are required.

- **TypeScript**: Version 4.5.0 or higher (if using TypeScript)
- Complete type definitions for all exports
- Full IntelliSense support in VS Code and other editors

## Package Installation

### Using npm

```bash
# Install the latest stable version
npm install extended-markdown-adf-parser

# Install a specific version
npm install extended-markdown-adf-parser@1.0.4

# Install as a development dependency
npm install --save-dev extended-markdown-adf-parser
```

### Using Yarn

```bash
# Install the latest stable version
yarn add extended-markdown-adf-parser

# Install a specific version
yarn add extended-markdown-adf-parser@1.0.4

# Install as a development dependency
yarn add --dev extended-markdown-adf-parser
```

### Using pnpm

```bash
# Install the latest stable version
pnpm add extended-markdown-adf-parser

# Install a specific version
pnpm add extended-markdown-adf-parser@1.0.4

# Install as a development dependency
pnpm add --save-dev extended-markdown-adf-parser
```

## Next Steps

After installation, you can:

- **[Verify Installation](./installation-verification.md)** - Test that everything is working correctly
- **[Advanced Setup](./installation-advanced.md)** - Environment-specific configurations and framework integration  
- **[Troubleshooting](./installation-troubleshooting.md)** - Solutions to common installation issues
- **[Quick Start Guide](./quick-start.md)** - Begin using the parser with examples
- **[Element Specifications](./element-specifications.md)** - Detailed syntax reference

## Support

If you encounter installation issues:

- **[Report Issues](https://github.com/JeromeErasmus/extended-markdown-adf-parser/issues)**
- **[Documentation](https://jeromeerasmus.gitbook.io/extended-markdown-adf-parser)**
- **[Discussions](https://github.com/JeromeErasmus/extended-markdown-adf-parser/discussions)**