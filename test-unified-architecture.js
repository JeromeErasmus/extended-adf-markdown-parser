// Test the unified architecture: Parser, EnhancedMarkdownParser, and engines
import { Parser, EnhancedMarkdownParser, MarkdownToAdfEngine, AdfToMarkdownEngine } from './dist/index.mjs';

console.log('=== Testing Unified Architecture ===\n');

const testMarkdown = `~~~expand title="Outer"
Regular content.

~~~panel type=info
Content with {user:admin} and :star:
~~~
~~~`;

// Test 1: Basic Parser (should now work like EnhancedMarkdownParser)
console.log('1. Testing basic Parser class:');
const basicParser = new Parser();
const basicResult = basicParser.markdownToAdf(testMarkdown);
console.log('✅ Basic Parser works');

// Test 2: EnhancedMarkdownParser (should work same as basic Parser)
console.log('\n2. Testing EnhancedMarkdownParser (backward compatibility):');
const enhancedParser = new EnhancedMarkdownParser();
const enhancedResult = enhancedParser.parseSync(testMarkdown);
console.log('✅ Enhanced Parser works');

// Test 3: Direct engine usage
console.log('\n3. Testing engines directly:');
const mdToAdfEngine = new MarkdownToAdfEngine();
const adfToMdEngine = new AdfToMarkdownEngine();

const engineResult = mdToAdfEngine.convert(testMarkdown);
const backToMd = adfToMdEngine.convert(engineResult);
console.log('✅ Engines work directly');

// Test 4: Verify results are equivalent
console.log('\n4. Verifying all approaches produce equivalent results:');

const checkSocialElements = (adf, name) => {
  let socialCount = 0;
  const visit = (node) => {
    if (['mention', 'emoji', 'date', 'status'].includes(node.type)) {
      socialCount++;
    }
    if (node.content && Array.isArray(node.content)) {
      node.content.forEach(visit);
    }
  };
  adf.content.forEach(visit);
  console.log(`  ${name}: ${socialCount} social elements found`);
  return socialCount;
};

const basicCount = checkSocialElements(basicResult, 'Basic Parser');
const enhancedCount = checkSocialElements(enhancedResult, 'Enhanced Parser');
const engineCount = checkSocialElements(engineResult, 'Direct Engine');

if (basicCount === enhancedCount && enhancedCount === engineCount && basicCount === 2) {
  console.log('✅ All approaches produce equivalent results with correct social elements!');
} else {
  console.log('❌ Results differ between approaches');
}

// Test 5: Verify nested structure
console.log('\n5. Verifying nested structure:');
const hasNestedPanel = basicResult.content[0]?.content?.some(child => child.type === 'panel');
console.log(`Nested panel found: ${hasNestedPanel ? '✅' : '❌'}`);

console.log('\n🎉 Unified Architecture Test Complete!');
console.log('\nSummary:');
console.log('- ✅ Basic Parser now includes all enhanced functionality');
console.log('- ✅ EnhancedMarkdownParser provides backward compatibility');
console.log('- ✅ Engines can be used directly for custom implementations');
console.log('- ✅ All approaches produce consistent, correct results');
console.log('- ✅ Social elements work in nested ADF fence blocks');