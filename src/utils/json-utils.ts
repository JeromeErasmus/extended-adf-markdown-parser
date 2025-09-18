/**
 * @file JSON utilities for safe serialization
 * @description Utilities for handling JSON serialization with circular reference protection
 */

/**
 * Safely calculate the approximate size of an object without JSON.stringify
 * Handles circular references gracefully
 */
export function calculateObjectSize(obj: any, visited = new WeakSet()): number {
  if (obj === null || obj === undefined) return 4; // "null" or "undefined"
  
  if (typeof obj === 'string') return obj.length + 2; // Add quotes
  if (typeof obj === 'number') return obj.toString().length;
  if (typeof obj === 'boolean') return obj ? 4 : 5; // "true" or "false"
  
  if (typeof obj === 'object') {
    // Circular reference detection
    if (visited.has(obj)) {
      return 20; // Approximate size of "[Circular]" placeholder
    }
    
    visited.add(obj);
    
    try {
      if (Array.isArray(obj)) {
        let size = 2; // []
        for (let i = 0; i < obj.length; i++) {
          if (i > 0) size += 1; // comma
          size += calculateObjectSize(obj[i], visited);
        }
        return size;
      } else {
        let size = 2; // {}
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
          if (i > 0) size += 1; // comma
          size += keys[i].length + 3; // "key":
          size += calculateObjectSize(obj[keys[i]], visited);
        }
        return size;
      }
    } finally {
      visited.delete(obj);
    }
  }
  
  return 0;
}

/**
 * Safely stringify JSON with circular reference handling
 */
export function safeJSONStringify(obj: any, space?: number): string {
  const seen = new WeakSet();
  
  try {
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]';
        }
        seen.add(value);
      }
      return value;
    }, space);
  } catch (error) {
    // Fallback if still problematic
    return `[Error serializing object: ${error instanceof Error ? error.message : 'Unknown error'}]`;
  }
}

/**
 * Get the byte length of a safely stringified object
 */
export function getSafeJSONLength(obj: any): number {
  try {
    // First try fast path
    return calculateObjectSize(obj);
  } catch (error) {
    // Fallback to safe stringify
    try {
      return safeJSONStringify(obj).length;
    } catch (fallbackError) {
      // Ultimate fallback
      return 50; // Reasonable default
    }
  }
}