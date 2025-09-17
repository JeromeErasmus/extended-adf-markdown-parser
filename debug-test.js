import { MarkdownParser } from './src/parser/markdown-to-adf/MarkdownParser.js';

const parser = new MarkdownParser();
const markdown = `Paragraph with **bold**, *italic*, \`code\`, ~~strikethrough~~, and __underline__ text.`;
const adf = parser.parse(markdown);

console.log('ADF result:');
console.log(JSON.stringify(adf, null, 2));

const paragraph = adf.content[0];
const textNodes = paragraph.content?.filter(node => node.type === 'text') || [];
const markTypes = new Set();

textNodes.forEach(node => {
  console.log('Text node:', node);
  if (node.marks) {
    node.marks.forEach(mark => markTypes.add(mark.type));
  }
});

console.log('Mark types found:', Array.from(markTypes));