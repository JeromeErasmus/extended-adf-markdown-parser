/**
 * @file adf-fence.ts
 * @description Micromark extension for ADF fence blocks (~~~panel, ~~~expand, etc.)
 */

import { 
  Code, 
  Construct, 
  State, 
  Effects, 
  TokenizeContext 
} from 'micromark-util-types';
import { markdownLineEnding, markdownSpace } from 'micromark-util-character';
import { factorySpace } from 'micromark-factory-space';
import { AdfTokenizer, TokenizerState, AdfBlockContext } from './types.js';

// Known ADF block types
const ADF_BLOCK_TYPES = new Set([
  'panel', 'expand', 'nestedExpand', 'mediaSingle', 'mediaGroup'
]);

/**
 * Tokenizer function for ADF fence blocks
 */
const tokenizeAdfFence: AdfTokenizer = function (effects, ok, nok) {
  let size = 0;
  let marker = 126; // tilde
  let nodeType = '';
  let closingSize = 0;
  
  return start;

  function start(code: Code): State | void {
    if (code !== marker) return nok(code);
    
    effects.enter('adfFence');
    effects.enter('adfFenceSequence');
    
    return sequenceOpen(code);
  }

  function sequenceOpen(code: Code): State | void {
    if (code === marker && size < 3) {
      effects.consume(code);
      size++;
      return sequenceOpen;
    }

    if (size === 3) {
      effects.exit('adfFenceSequence');
      return factorySpace(effects, infoStart, 'whitespace')(code);
    }

    return nok(code);
  }

  function infoStart(code: Code): State | void {
    if (code === null || markdownLineEnding(code)) {
      return nok(code);
    }
    
    effects.enter('adfFenceType');
    nodeType = '';
    return info(code);
  }

  function info(code: Code): State | void {
    if (code === null || markdownLineEnding(code) || markdownSpace(code)) {
      if (!ADF_BLOCK_TYPES.has(nodeType)) {
        return nok(code);
      }
      
      effects.exit('adfFenceType');
      
      if (markdownSpace(code)) {
        return factorySpace(effects, metaStart, 'whitespace')(code);
      }
      
      return lineEndAfterInfo(code);
    }

    if ((code >= 97 && code <= 122) || (code >= 65 && code <= 90)) { // a-z or A-Z
      effects.consume(code);
      nodeType += String.fromCharCode(code);
      return info;
    }

    return nok(code);
  }

  function metaStart(code: Code): State | void {
    if (code === null || markdownLineEnding(code)) {
      return lineEndAfterInfo(code);
    }
    
    effects.enter('adfFenceAttributes');
    return meta(code);
  }

  function meta(code: Code): State | void {
    if (code === null || markdownLineEnding(code)) {
      effects.exit('adfFenceAttributes');
      return lineEndAfterInfo(code);
    }

    effects.consume(code);
    return meta;
  }

  function lineEndAfterInfo(code: Code): State | void {
    if (code === null) {
      return nok(code);
    }

    if (markdownLineEnding(code)) {
      effects.consume(code);
      effects.enter('adfFenceContent');
      return content;
    }

    return nok(code);
  }

  function content(code: Code): State | void {
    if (code === null) {
      effects.exit('adfFenceContent');
      return nok(code);
    }

    if (markdownLineEnding(code)) {
      effects.consume(code);
      return contentAfterEol;
    }

    effects.consume(code);
    return content;
  }

  function contentAfterEol(code: Code): State | void {
    if (code === marker) {
      closingSize = 0;
      return closingFence(code);
    }

    return content(code);
  }

  function closingFence(code: Code): State | void {
    if (code === marker && closingSize < 3) {
      effects.consume(code);
      closingSize++;
      return closingFence;
    }

    if (closingSize === 3) {
      return closingFenceEnd(code);
    }

    // Not enough markers - continue as content
    return content(code);
  }

  function closingFenceEnd(code: Code): State | void {
    if (markdownSpace(code)) {
      effects.consume(code);
      return closingFenceEnd;
    }

    if (code === null || markdownLineEnding(code)) {
      effects.exit('adfFenceContent');
      
      if (markdownLineEnding(code)) {
        effects.consume(code);
      }
      
      effects.exit('adfFence');
      return ok(code);
    }

    // Invalid content after closing fence - treat as regular content
    return content(code);
  }
};

/**
 * Main ADF fence construct - handles ~~~ blocks with ADF node types
 */
export const adfFence: Construct = {
  name: 'adfFence',
  tokenize: tokenizeAdfFence,
  concrete: true
};

/**
 * Parse ADF fence attributes from string like "type=info layout=wide"
 */
export function parseAdfAttributes(attributeString: string): Record<string, any> {
  const attributes: Record<string, any> = {};
  
  if (!attributeString.trim()) {
    return attributes;
  }

  // Simple key=value parser - handles both single and double quotes
  const pairs = attributeString.match(/(\w+)=([^"'\s]+|"[^"]*"|'[^']*')/g) || [];
  
  for (const pair of pairs) {
    const [, key, value] = pair.match(/(\w+)=([^"'\s]+|"[^"]*"|'[^']*')/) || [];
    if (key && value) {
      let parsedValue: any = value;
      
      // Remove quotes if present (both single and double)
      if ((parsedValue.startsWith('"') && parsedValue.endsWith('"')) ||
          (parsedValue.startsWith("'") && parsedValue.endsWith("'"))) {
        parsedValue = parsedValue.slice(1, -1);
      }
      
      // Try to parse as number or boolean
      if (parsedValue === 'true') parsedValue = true;
      else if (parsedValue === 'false') parsedValue = false;
      else if (/^\d+$/.test(parsedValue)) parsedValue = parseInt(parsedValue, 10);
      else if (/^\d*\.\d+$/.test(parsedValue)) parsedValue = parseFloat(parsedValue);
      
      attributes[key] = parsedValue;
    }
  }
  
  return attributes;
}

/**
 * Validate ADF fence context based on node type
 */
export function validateAdfContext(nodeType: string, attributes: Record<string, any>): boolean {
  switch (nodeType) {
    case 'panel':
      return !attributes.type || ['info', 'warning', 'error', 'success', 'note'].includes(attributes.type);
    
    case 'expand':
    case 'nestedExpand':
      return true; // Expand blocks are flexible
    
    case 'mediaSingle':
      return !attributes.layout || ['center', 'align-start', 'align-end', 'wide', 'full-width'].includes(attributes.layout);
    
    case 'mediaGroup':
      return true; // MediaGroup blocks don't have strict attribute requirements
    
    default:
      return false;
  }
}