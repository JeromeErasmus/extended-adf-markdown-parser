/**
 * Utilities for test comparisons that are resilient to whitespace variations
 */

/**
 * Normalizes markdown text for test comparisons by:
 * - Trimming leading/trailing whitespace  
 * - Removing trailing spaces on lines
 * - Converting tabs to spaces
 * - Standardizing spacing between markdown elements
 * - Removing extra spacing between list items while preserving block structure
 */
export function normalizeMarkdownForComparison(text: string): string {
  // Step 1: Basic cleanup
  let cleaned = text
    .trim()
    .replace(/ +$/gm, '') // Remove trailing spaces
    .replace(/^\s*$/gm, ''); // Normalize empty lines
  
  // Step 2: Process line by line to handle indentation and tabs
  const normalizedLines = cleaned.split('\n').map(line => {
    if (line.trim() === '') return '';
    
    // Convert tabs to spaces
    const tabsConverted = line.replace(/\t/g, '  ');
    
    // Normalize leading whitespace based on content type
    if (tabsConverted.match(/^[\s]*[-*+]\s/) || // bullet lists  
        tabsConverted.match(/^[\s]*\d+\.\s*.*$/)) { // numbered lists (including empty ones)
      // For lists, preserve meaningful indentation but normalize accidental whitespace
      const indent = tabsConverted.match(/^(\s*)/)?.[1] || '';
      if (indent.length >= 2 && indent.length % 2 === 0) {
        // Looks like intentional 2-space indentation - preserve it
        const normalizedIndent = '  '.repeat(Math.floor(indent.length / 2));
        return normalizedIndent + tabsConverted.trim();
      } else if (indent.length === 1 || indent.length === 3) {
        // Odd indentation likely accidental - normalize to 2 spaces if >1, else remove
        const normalizedIndent = indent.length > 1 ? '  ' : '';
        return normalizedIndent + tabsConverted.trim();
      } else {
        // No indentation or very small - remove it
        return tabsConverted.trim();
      }
    } else {
      // For headers, paragraphs, etc., remove leading whitespace
      return tabsConverted.trim();
    }
  });
  
  // Step 3: Process spacing between elements  
  const processedLines: string[] = [];
  
  let i = 0;
  while (i < normalizedLines.length) {
    const currentLine = normalizedLines[i];
    
    if (currentLine.trim() === '') {
      // This is an empty line - decide if we keep it
      const prevLine = i > 0 ? normalizedLines[i - 1] : '';
      
      // Find next non-empty line
      let j = i + 1;
      while (j < normalizedLines.length && normalizedLines[j].trim() === '') {
        j++;
      }
      const nextLine = j < normalizedLines.length ? normalizedLines[j] : '';
      
      if (prevLine && nextLine) {
        // Comprehensive list item detection (including empty list items like "6. ")
        const prevIsListItem = prevLine.match(/^[\s]*[-*+]\s/) || prevLine.match(/^[\s]*\d+\.\s*.*$/);
        const nextIsListItem = nextLine.match(/^[\s]*[-*+]\s/) || nextLine.match(/^[\s]*\d+\.\s*.*$/);
        
        // If both are list items, remove spacing between them
        if (prevIsListItem && nextIsListItem) {
          // Skip this empty line and any additional empty lines
          i = j - 1; // j-1 because we'll increment at end of loop
        } else {
          // Keep spacing between different element types
          const prevIsHeader = prevLine.match(/^#+\s/);
          const nextIsHeader = nextLine.match(/^#+\s/);
          const prevIsBlockElement = prevLine.match(/^(~~~|```|>)/);
          const nextIsBlockElement = nextLine.match(/^(~~~|```|>)/);
          
          // Keep spacing between structural elements
          if (prevIsHeader || nextIsHeader || prevIsBlockElement || nextIsBlockElement || 
              (!prevIsListItem && nextIsListItem) || 
              (prevIsListItem && !nextIsListItem)) {
            processedLines.push('');
          }
          // For regular paragraph to paragraph, keep one empty line
          else if (!prevIsListItem && !nextIsListItem) {
            processedLines.push('');
          }
        }
      }
    } else {
      // Non-empty line - add it
      processedLines.push(currentLine);
    }
    
    i++;
  }
  
  return processedLines
    .join('\n')
    // Final cleanup: normalize multiple consecutive empty lines
    .replace(/\n{3,}/g, '\n\n');
}

/**
 * Compares two markdown strings with whitespace normalization
 * This makes tests resilient to extra line breaks, tabs, trailing spaces, etc.
 */
export function expectMarkdownEqual(actual: string, expected: string): void {
  const normalizedActual = normalizeMarkdownForComparison(actual);
  const normalizedExpected = normalizeMarkdownForComparison(expected);
  
  if (normalizedActual !== normalizedExpected) {
    // Provide helpful diff information
    console.log('=== EXPECTED (normalized) ===');
    console.log(JSON.stringify(normalizedExpected));
    console.log('=== ACTUAL (normalized) ==='); 
    console.log(JSON.stringify(normalizedActual));
    
    throw new Error(`Markdown content does not match after normalization.\nExpected: ${JSON.stringify(normalizedExpected)}\nActual: ${JSON.stringify(normalizedActual)}`);
  }
}

/**
 * Jest matcher for normalized markdown comparison
 */
export function toMatchMarkdown(actual: string, expected: string): { pass: boolean; message: () => string } {
  const normalizedActual = normalizeMarkdownForComparison(actual);
  const normalizedExpected = normalizeMarkdownForComparison(expected);
  
  const pass = normalizedActual === normalizedExpected;
  
  return {
    pass,
    message: () => {
      if (pass) {
        return `Expected markdown not to match after normalization`;
      } else {
        return `Expected markdown to match after normalization.\nExpected: ${JSON.stringify(normalizedExpected)}\nActual: ${JSON.stringify(normalizedActual)}`;
      }
    }
  };
}