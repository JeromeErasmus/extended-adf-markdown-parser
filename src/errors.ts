/**
 * @file Error recovery entry point
 * @description Separate entry for users who only need error recovery functionality
 */

export { ErrorRecoveryManager } from './errors/ErrorRecovery.js';
export type {
  RecoveryOptions,
  RecoveryContext,
  RecoveryResult
} from './errors/ErrorRecovery.js';

// Re-export core error types
export { ParserError, ConversionError, ValidationError } from './errors/index.js';