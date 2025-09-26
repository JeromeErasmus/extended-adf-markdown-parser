#!/usr/bin/env node

import('./dist/index.mjs').then(({ Parser }) => {

// Test WITHOUT enableAdfExtensions - basic parser should now work
const parser = new Parser(); // No options - should use basic parser with new plugins

const testMarkdown = `# Test Document

| Name | Status | Date |
|------|--------|------|
| John | {status:active} | {date:2024-01-15} |
| Jane | {status:inactive} | {date:2024-01-10} |

User mention: {user:test.user} :rocket:

This tests basic parser with tables and social elements.`;

console.log('🔍 Testing basic parser (no enableAdfExtensions) with new plugins:');
console.log(testMarkdown);

try {
  const adf = parser.markdownToAdf(testMarkdown);
  
  console.log('\n📄 Converted ADF:');
  console.log(JSON.stringify(adf, null, 2));
  
  // Check for key elements
  const adfString = JSON.stringify(adf);
  const hasTable = adfString.includes('"type":"table"');
  const hasStatus = adfString.includes('"type":"status"');
  const hasDate = adfString.includes('"type":"date"');
  const hasMention = adfString.includes('"type":"mention"');
  const hasEmoji = adfString.includes('"type":"emoji"');
  
  console.log(`\n🎯 Basic parser results:`);
  console.log(`   - Tables: ${hasTable ? '✅ YES' : '❌ NO'}`);
  console.log(`   - Status: ${hasStatus ? '✅ YES' : '❌ NO'}`);  
  console.log(`   - Dates: ${hasDate ? '✅ YES' : '❌ NO'}`);
  console.log(`   - Mentions: ${hasMention ? '✅ YES' : '❌ NO'}`);
  console.log(`   - Emojis: ${hasEmoji ? '✅ YES' : '❌ NO'}`);
  
  if (hasTable && hasStatus && hasDate && hasMention && hasEmoji) {
    console.log('\n🎉 SUCCESS: Basic parser now supports all ADF elements!');
  } else {
    console.log('\n❌ Some elements still missing in basic parser');
  }
  
} catch (error) {
  console.error('❌ Error:', error.message);
}

}).catch(console.error);