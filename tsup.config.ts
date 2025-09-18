import { defineConfig } from 'tsup'

export default defineConfig([
  // Main entry point - full bundle
  {
    entry: {
      index: 'src/index.ts'
    },
    format: ['esm'],
    dts: true,
    clean: true,
    sourcemap: true,
    treeshake: true,
    splitting: true,
    minify: false, // Keep readable for debugging
    outDir: 'dist',
    target: 'es2020',
    external: [
      'unified',
      'remark-parse',
      'remark-stringify', 
      'remark-gfm',
      'remark-frontmatter',
      'micromark',
      'ajv',
      'ajv-formats'
    ]
  },
  
  // Modular exports for tree-shaking
  {
    entry: {
      streaming: 'src/parser/StreamingParser.ts',
      performance: 'src/performance/PerformanceMonitor.ts',
      errors: 'src/errors/ErrorRecovery.ts'
    },
    format: ['esm'],
    dts: true,
    clean: false, // Don't clean since main build runs first
    sourcemap: true,
    treeshake: true,
    splitting: false, // Keep modules separate
    minify: false,
    outDir: 'dist',
    target: 'es2020',
    external: [
      'unified',
      'remark-parse',
      'remark-stringify', 
      'remark-gfm',
      'remark-frontmatter',
      'micromark',
      'ajv',
      'ajv-formats'
    ]
  },
  
  // Test utilities (separate from main bundle)
  {
    entry: {
      'test-utils': 'src/utils/test-utils.ts'
    },
    format: ['esm'],
    dts: true,
    clean: false,
    sourcemap: true,
    treeshake: true,
    splitting: false,
    minify: false,
    outDir: 'dist',
    target: 'es2020'
  }
])