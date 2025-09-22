# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.1] - 2025-01-22

### Fixed
- **TypeScript Compilation**: Resolved all TypeScript compilation errors
  - Fixed `MediaNode` interface to include optional `alt` property
  - Extended `ValidationError` interface to include optional `line` property for better error reporting
  - Fixed `Data` interface extension for ADF metadata handling in mdast nodes
  - Improved AJV validator function typing with proper `ValidateFunction` type
  - Fixed type assertions in metadata comment utilities

### Changed
- Enhanced type safety across the codebase
- Improved error reporting with line number information in validation errors
- Better TypeScript developer experience with complete type coverage

## [1.2.0] - 2025-01-21

### Added
- Metadata comments support to Basic Parser with smart detection

## [1.1.1] - 2025-01-20

### Fixed
- Centralized error handling improvements
- Documentation updates and conversion guides

## [1.1.0] - 2025-01-19

### Added
- Comprehensive testing documentation in README
- Enhanced error handling system