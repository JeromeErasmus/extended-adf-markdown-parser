/**
 * @file Streaming parser entry point
 * @description Separate entry for users who only need streaming functionality
 */

export { StreamingParser } from './parser/StreamingParser.js';
export type { 
  StreamingOptions, 
  StreamingResult 
} from './parser/StreamingParser.js';

// Re-export core types needed for streaming
export type { ADFDocument, ADFNode } from './types/index.js';