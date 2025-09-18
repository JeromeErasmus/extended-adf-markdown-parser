#!/usr/bin/env node

/**
 * Bundle size analysis script
 * Analyzes the built files and provides insights for optimization
 */

import { readdir, stat } from 'fs/promises';
import { join } from 'path';

async function getDirectorySize(dirPath) {
  const files = await readdir(dirPath);
  let totalSize = 0;
  const fileStats = [];

  for (const file of files) {
    const filePath = join(dirPath, file);
    const stats = await stat(filePath);
    
    if (stats.isFile()) {
      totalSize += stats.size;
      fileStats.push({
        name: file,
        size: stats.size,
        sizeKB: Math.round(stats.size / 1024 * 100) / 100,
        type: file.split('.').pop()
      });
    }
  }

  return { totalSize, fileStats };
}

async function analyzeBundleSize() {
  try {
    const distPath = './dist';
    const { totalSize, fileStats } = await getDirectorySize(distPath);
    
    console.log('📦 Bundle Size Analysis');
    console.log('=====================');
    console.log(`Total bundle size: ${Math.round(totalSize / 1024 * 100) / 100} KB\n`);
    
    // Group files by type
    const byType = fileStats.reduce((acc, file) => {
      if (!acc[file.type]) acc[file.type] = [];
      acc[file.type].push(file);
      return acc;
    }, {});
    
    // Show JS files (main concern for bundle size)
    if (byType.js) {
      console.log('📄 JavaScript Files:');
      byType.js
        .sort((a, b) => b.size - a.size)
        .forEach(file => {
          console.log(`  ${file.name}: ${file.sizeKB} KB`);
        });
      console.log('');
    }
    
    // Show type definition files
    if (byType.ts) {
      console.log('📝 TypeScript Declaration Files:');
      byType.ts
        .sort((a, b) => b.size - a.size)
        .forEach(file => {
          console.log(`  ${file.name}: ${file.sizeKB} KB`);
        });
      console.log('');
    }

    // Optimization recommendations
    console.log('💡 Optimization Analysis:');
    const mainJs = byType.js?.find(f => f.name === 'index.js');
    if (mainJs) {
      if (mainJs.sizeKB > 300) {
        console.log('  ⚠️  Main bundle is large (>300KB) - consider more aggressive tree-shaking');
      } else if (mainJs.sizeKB > 200) {
        console.log('  ⚠️  Main bundle is moderately large (>200KB) - good but could be optimized');
      } else {
        console.log('  ✅ Main bundle size is reasonable (<200KB)');
      }
    }
    
    // Check if streaming parser is separate
    const streamingJs = byType.js?.find(f => f.name === 'streaming.js');
    if (streamingJs) {
      console.log('  ✅ Streaming parser is successfully separated for tree-shaking');
      console.log(`     - Streaming module: ${streamingJs.sizeKB} KB`);
    }
    
    // Check if performance monitor is separate
    const performanceJs = byType.js?.find(f => f.name === 'performance.js');
    if (performanceJs) {
      console.log('  ✅ Performance monitor is successfully separated for tree-shaking');
      console.log(`     - Performance module: ${performanceJs.sizeKB} KB`);
    }

    // Check if error recovery is separate
    const errorsJs = byType.js?.find(f => f.name === 'errors.js');
    if (errorsJs) {
      console.log('  ✅ Error recovery is successfully separated for tree-shaking');
      console.log(`     - Error recovery module: ${errorsJs.sizeKB} KB`);
    }

  } catch (error) {
    console.error('Error analyzing bundle size:', error.message);
    process.exit(1);
  }
}

analyzeBundleSize();