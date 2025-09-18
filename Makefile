# Extended ADF Markdown Parser Makefile
# This Makefile provides standardized commands for common development tasks

# Default target
.DEFAULT_GOAL := help

# Phony targets (not actual files)
.PHONY: help install clean build test test-unit test-integration test-watch test-coverage lint format dev

# Help target - shows available commands
help:
	@echo "Extended ADF Markdown Parser - Available Commands:"
	@echo ""
	@echo "  make install       - Install dependencies using Yarn"
	@echo "  make clean         - Clean build artifacts"
	@echo "  make build         - Build the project"
	@echo "  make dev           - Build and watch for changes"
	@echo "  make test          - Run all tests (704 tests: unit + integration)"
	@echo "  make test-unit     - Run unit tests only (643 tests in tests/unit/)"
	@echo "  make test-integration - Run integration tests (tests/integration/)"
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

# Run unit tests only (tests/unit/ directory)
test-unit:
	@echo "Running unit tests only (643 tests)..."
	yarn test tests/unit/

# Run integration tests (tests/integration/ directory)
test-integration:
	@echo "Running integration tests..."
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