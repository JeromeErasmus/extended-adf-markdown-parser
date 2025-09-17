# Integration Tests

## ADF Fixture Tests

This directory contains comprehensive integration tests using real ADF documents:

### Fixtures Available:
Located in `tests/fixtures/adf/` (`.adf` files) and `tests/fixtures/markdown/` (`.adfmd` files):
- **simple-document**: Basic ADF with headings, paragraphs, and lists
- **rich-content**: Panels, code blocks, blockquotes with complex formatting
- **table-document**: Tables with headers, text color, and various marks
- **media-expand**: Media nodes and expandable sections
- **edge-cases**: Complex scenarios with overlapping marks and edge cases

### Test Files:
- **adf-fixtures.test.ts**: Tests conversion of all fixture files
- **round-trip.test.ts**: Tests consistency and reliability of conversions

## Current Status

⚠️ **Note**: These integration tests currently have ESM import issues with Jest when importing from the built `dist/` files. The unit tests in `src/__tests__/` work perfectly and provide 100% converter coverage.

### Running Tests

Currently working:
```bash
# Run all unit tests (288 tests pass)
make test

# Run specific unit test suites
yarn test src/__tests__/converters/
```

### Future Improvements

The integration tests need Jest configuration updates to properly handle:
1. ESM modules in the built `dist/` output
2. Dynamic imports for ESM-only packages
3. Proper module resolution for fixture-based testing

The fixture files themselves are valuable test assets and can be used for:
- Manual testing of conversions
- External test runners that support ESM
- Documentation and examples
- Validation of real-world ADF documents