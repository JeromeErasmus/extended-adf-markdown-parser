/**
 * @file PerformanceMonitor.ts
 * @description Performance monitoring and benchmarking utilities for parser operations
 */

export interface PerformanceMetrics {
  operation: string;
  duration: number; // milliseconds
  memoryUsage: {
    heapUsed: number;
    heapTotal: number;
    external: number;
  };
  documentSize: number; // bytes
  nodeCount?: number;
  timestamp: number;
}

export interface BenchmarkResult {
  operation: string;
  samples: number;
  metrics: {
    mean: number;
    min: number;
    max: number;
    p95: number;
    p99: number;
    standardDeviation: number;
  };
  memoryMetrics: {
    averageHeapUsed: number;
    peakHeapUsed: number;
    memoryEfficiency: number; // bytes per node
  };
  documentStats: {
    totalSize: number;
    averageSize: number;
    largestDocument: number;
    smallestDocument: number;
  };
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private enabled: boolean = true;

  constructor(options: { enabled?: boolean } = {}) {
    this.enabled = options.enabled ?? true;
  }

  /**
   * Start performance measurement for an operation
   */
  startMeasurement(operation: string): PerformanceMeasurement | NoOpMeasurement {
    if (!this.enabled) {
      return new NoOpMeasurement();
    }

    return new PerformanceMeasurement(operation, this);
  }

  /**
   * Record a performance measurement
   */
  recordMetric(metric: PerformanceMetrics): void {
    if (!this.enabled) return;
    
    this.metrics.push(metric);
    
    // Keep only the last 1000 measurements to prevent memory leaks
    if (this.metrics.length > 1000) {
      this.metrics.shift();
    }
  }

  /**
   * Get performance statistics for a specific operation
   */
  getStatistics(operation: string, samples: number = 100): BenchmarkResult | null {
    const operationMetrics = this.metrics
      .filter(m => m.operation === operation)
      .slice(-samples);

    if (operationMetrics.length === 0) {
      return null;
    }

    const durations = operationMetrics.map(m => m.duration);
    const heapUsages = operationMetrics.map(m => m.memoryUsage.heapUsed);
    const documentSizes = operationMetrics.map(m => m.documentSize);
    const nodeCounts = operationMetrics
      .filter(m => m.nodeCount !== undefined)
      .map(m => m.nodeCount!);

    durations.sort((a, b) => a - b);
    
    const mean = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const variance = durations.reduce((sum, d) => sum + Math.pow(d - mean, 2), 0) / durations.length;
    const standardDeviation = Math.sqrt(variance);

    const p95Index = Math.floor(durations.length * 0.95);
    const p99Index = Math.floor(durations.length * 0.99);

    return {
      operation,
      samples: operationMetrics.length,
      metrics: {
        mean,
        min: Math.min(...durations),
        max: Math.max(...durations),
        p95: durations[p95Index] || durations[durations.length - 1],
        p99: durations[p99Index] || durations[durations.length - 1],
        standardDeviation
      },
      memoryMetrics: {
        averageHeapUsed: heapUsages.reduce((sum, h) => sum + h, 0) / heapUsages.length,
        peakHeapUsed: Math.max(...heapUsages),
        memoryEfficiency: nodeCounts.length > 0 
          ? (heapUsages.reduce((sum, h) => sum + h, 0) / heapUsages.length) / 
            (nodeCounts.reduce((sum, n) => sum + n, 0) / nodeCounts.length)
          : 0
      },
      documentStats: {
        totalSize: documentSizes.reduce((sum, s) => sum + s, 0),
        averageSize: documentSizes.reduce((sum, s) => sum + s, 0) / documentSizes.length,
        largestDocument: Math.max(...documentSizes),
        smallestDocument: Math.min(...documentSizes)
      }
    };
  }

  /**
   * Get all performance metrics (for debugging)
   */
  getAllMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * Clear all recorded metrics
   */
  clear(): void {
    this.metrics = [];
  }

  /**
   * Check if performance meets targets
   */
  validatePerformanceTargets(operation: string): PerformanceValidation {
    const stats = this.getStatistics(operation);
    if (!stats) {
      return { 
        operation, 
        passed: false, 
        errors: ['No performance data available'] 
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    // Target: <100ms for average documents
    if (stats.metrics.mean > 100) {
      errors.push(`Average duration ${stats.metrics.mean.toFixed(2)}ms exceeds 100ms target`);
    }

    // Target: <1s for large documents (p99)
    if (stats.metrics.p99 > 1000) {
      errors.push(`99th percentile duration ${stats.metrics.p99.toFixed(2)}ms exceeds 1000ms target`);
    }

    // Memory efficiency warning
    if (stats.memoryMetrics.memoryEfficiency > 1000) {
      warnings.push(`Memory efficiency ${stats.memoryMetrics.memoryEfficiency.toFixed(2)} bytes/node may be suboptimal`);
    }

    // Large document handling warning
    if (stats.documentStats.largestDocument > 1024 * 1024 && stats.metrics.max > 1000) {
      warnings.push(`Large documents (>1MB) taking ${stats.metrics.max.toFixed(2)}ms may benefit from streaming`);
    }

    return {
      operation,
      passed: errors.length === 0,
      errors,
      warnings,
      stats
    };
  }

  /**
   * Generate performance report
   */
  generateReport(): string {
    const operations = [...new Set(this.metrics.map(m => m.operation))];
    const report: string[] = [];
    
    report.push('Performance Report');
    report.push('==================');
    report.push('');
    
    for (const operation of operations) {
      const validation = this.validatePerformanceTargets(operation);
      const stats = validation.stats;
      
      if (!stats) continue;
      
      report.push(`Operation: ${operation}`);
      report.push(`Samples: ${stats.samples}`);
      report.push(`Mean Duration: ${stats.metrics.mean.toFixed(2)}ms`);
      report.push(`P95 Duration: ${stats.metrics.p95.toFixed(2)}ms`);
      report.push(`P99 Duration: ${stats.metrics.p99.toFixed(2)}ms`);
      report.push(`Memory Efficiency: ${stats.memoryMetrics.memoryEfficiency.toFixed(2)} bytes/node`);
      report.push(`Performance Target: ${validation.passed ? '✅ PASSED' : '❌ FAILED'}`);
      
      if (validation.errors.length > 0) {
        report.push('Errors:');
        validation.errors.forEach(error => report.push(`  - ${error}`));
      }
      
      if (validation.warnings && validation.warnings.length > 0) {
        report.push('Warnings:');
        validation.warnings.forEach(warning => report.push(`  - ${warning}`));
      }
      
      report.push('');
    }
    
    return report.join('\n');
  }
}

export interface PerformanceValidation {
  operation: string;
  passed: boolean;
  errors: string[];
  warnings?: string[];
  stats?: BenchmarkResult;
}

export class PerformanceMeasurement {
  private startTime: number;
  private startMemory: NodeJS.MemoryUsage;
  private operation: string;
  private monitor: PerformanceMonitor;

  constructor(operation: string, monitor: PerformanceMonitor) {
    this.operation = operation;
    this.monitor = monitor;
    this.startTime = performance.now();
    this.startMemory = process.memoryUsage();
  }

  /**
   * End the measurement and record the result
   */
  end(documentSize: number = 0, nodeCount?: number): void {
    const endTime = performance.now();
    const endMemory = process.memoryUsage();
    
    const metric: PerformanceMetrics = {
      operation: this.operation,
      duration: endTime - this.startTime,
      memoryUsage: {
        heapUsed: endMemory.heapUsed - this.startMemory.heapUsed,
        heapTotal: endMemory.heapTotal,
        external: endMemory.external - this.startMemory.external
      },
      documentSize,
      nodeCount,
      timestamp: Date.now()
    };

    this.monitor.recordMetric(metric);
  }
}

class NoOpMeasurement {
  end(): void {
    // No-op
  }
}

// Global performance monitor instance
export const globalPerformanceMonitor = new PerformanceMonitor();

// Helper function to measure any async operation
export async function measureAsync<T>(
  operation: string,
  fn: () => Promise<T>,
  documentSize?: number,
  nodeCount?: number
): Promise<T> {
  const measurement = globalPerformanceMonitor.startMeasurement(operation);
  try {
    const result = await fn();
    measurement.end(documentSize, nodeCount);
    return result;
  } catch (error) {
    measurement.end(documentSize, nodeCount);
    throw error;
  }
}

// Helper function to measure any sync operation
export function measureSync<T>(
  operation: string,
  fn: () => T,
  documentSize?: number,
  nodeCount?: number
): T {
  const measurement = globalPerformanceMonitor.startMeasurement(operation);
  try {
    const result = fn();
    measurement.end(documentSize, nodeCount);
    return result;
  } catch (error) {
    measurement.end(documentSize, nodeCount);
    throw error;
  }
}