// Jest test setup file
// Add any global test setup here

import { expect } from '@jest/globals';

// Add custom matchers if needed
expect.extend({
  toBeValidADF(received: any) {
    const pass = received?.type === 'doc' && Array.isArray(received?.content);
    return {
      pass,
      message: () => pass 
        ? `expected ${JSON.stringify(received)} not to be valid ADF`
        : `expected ${JSON.stringify(received)} to be valid ADF`
    };
  }
});