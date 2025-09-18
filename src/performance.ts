/**
 * @file Performance monitoring entry point
 * @description Separate entry for users who only need performance monitoring
 */

export { 
  PerformanceMonitor, 
  globalPerformanceMonitor, 
  measureAsync, 
  measureSync 
} from './performance/PerformanceMonitor.js';

export type { 
  PerformanceMetrics, 
  BenchmarkResult, 
  PerformanceValidation 
} from './performance/PerformanceMonitor.js';