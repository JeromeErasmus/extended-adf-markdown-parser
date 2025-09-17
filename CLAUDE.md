# Claude Development Notes

## Package Manager

**IMPORTANT: This project uses Yarn 4.7.0 as the package manager, NOT npm.**

### Why Yarn?
- Specified in `package.json`: `"packageManager": "yarn@4.7.0"`
- Build scripts use yarn: `"prepublishOnly": "yarn test && yarn build"`
- Faster dependency resolution and installation
- Better workspace support for monorepos

### Makefile Commands (Recommended):
**Use the Makefile for standardized command execution:**
```bash
# Show all available commands
make help

# Install dependencies
make install

# Run tests
make test

# Run tests with coverage
make test-coverage

# Run tests in watch mode
make test-watch

# Build the project
make build

# Build and watch for changes
make dev

# Run linting
make lint

# Format code
make format

# Clean build artifacts
make clean

# Pre-publish checks
make prepublish
```

### Direct Yarn Commands (Alternative):
```bash
# Install dependencies
yarn install

# Run tests
yarn test

# Run tests with coverage
yarn test:coverage

# Run tests in watch mode
yarn test:watch

# Build the project
yarn build

# Run linting
yarn lint

# Format code
yarn format
```

### ❌ Don't Use:
```bash
npm install  # Use make install or yarn install instead
npm test     # Use make test or yarn test instead
npm run build # Use make build or yarn build instead
```

## Development Workflow

**Preferred workflow using Makefile:**
1. **Install dependencies**: `make install`
2. **Run tests**: `make test` (288 tests should pass)
3. **Build**: `make build`
4. **Lint**: `make lint`

**Alternative workflow using Yarn directly:**
1. **Install dependencies**: `yarn install`
2. **Run tests**: `yarn test` (288 tests should pass)
3. **Build**: `yarn build`
4. **Lint**: `yarn lint`

## Project Structure

- `src/` - Source code
- `src/__tests__/` - Test files
- `src/parser/` - Core parsing logic
- `src/types/` - TypeScript type definitions
- `dist/` - Built files (generated)

## Test Coverage

This project has 100% converter test coverage:
- **26 test suites**
- **288 tests** 
- **16 node converters** tested
- **7 mark converters** tested