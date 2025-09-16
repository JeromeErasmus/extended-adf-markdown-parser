/**
 * @file Custom error classes for the parser
 */

export class ParserError extends Error {
  constructor(
    message: string,
    public code: string,
    public line?: number,
    public column?: number,
    public recoverable: boolean = true
  ) {
    super(message);
    this.name = 'ParserError';
  }
}

export class ValidationError extends ParserError {
  constructor(
    message: string, 
    public errors: Array<{ path?: string; message: string; code?: string }>,
    public partialResult?: any
  ) {
    super(message, 'VALIDATION_ERROR');
  }
}

export class ConversionError extends ParserError {
  constructor(
    message: string,
    public nodeType: string,
    public fallback?: string
  ) {
    super(message, 'CONVERSION_ERROR');
  }
}

// Error recovery strategies
export interface ParseResult<T> {
  success: boolean;
  data?: T;
  errors: ParserError[];
  warnings: string[];
}