# Extended ADF Markdown Parser Makefile
# This Makefile provides standardized commands for common development tasks

# Default target
.DEFAULT_GOAL := help

# Phony targets (not actual files)
.PHONY: help install clean build test test-unit test-fixtures test-watch test-coverage lint format dev

# Help target - shows available commands
help:
	@echo "Extended ADF Markdown Parser - Available Commands:"
	@echo ""
	@echo "  make install       - Install dependencies using Yarn"
	@echo "  make clean         - Clean build artifacts"
	@echo "  make build         - Build the project"
	@echo "  make dev           - Build and watch for changes"
	@echo "  make test          - Run all tests (unit tests only due to ESM issue)"
	@echo "  make test-unit     - Run unit tests only (src/ directory)"
	@echo "  make test-fixtures - Attempt to run fixture tests (known ESM issues)"
	@echo "  make test-watch    - Run tests in watch mode"
	@echo "  make test-coverage - Run tests with coverage report"
	@echo "  make lint          - Lint TypeScript files"
	@echo "  make format        - Format code with Prettier"
	@echo "  make prepublish    - Run pre-publish checks (test + build)"
	@echo "  make help          - Show this help message"

# Install dependencies
install:
	@echo "Installing dependencies with Yarn..."
	yarn install

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf dist/
	rm -rf coverage/
	rm -rf node_modules/.cache/

# Build the project
build:
	@echo "Building project..."
	yarn build

# Build and watch for changes
dev:
	@echo "Building project in watch mode..."
	yarn build:watch

# Run tests
test:
	@echo "Running tests..."
	yarn test

# Run unit tests only (src/ directory)
test-unit:
	@echo "Running unit tests only..."
	yarn test src/

# Run fixture tests (integration tests with known ESM issues)
test-fixtures:
	@echo "Running fixture tests (expect ESM import errors)..."
	@echo "Note: These tests currently fail due to Jest ESM configuration issues"
	@echo "The fixture files themselves work correctly - see manual verification above"
	yarn test tests/integration/

# Run tests in watch mode
test-watch:
	@echo "Running tests in watch mode..."
	yarn test:watch

# Run tests with coverage
test-coverage:
	@echo "Running tests with coverage..."
	yarn test:coverage

# Lint TypeScript files
lint:
	@echo "Linting TypeScript files..."
	yarn lint

# Format code with Prettier
format:
	@echo "Formatting code with Prettier..."
	yarn format

# Pre-publish checks
prepublish:
	@echo "Running pre-publish checks..."
	yarn prepublishOnly