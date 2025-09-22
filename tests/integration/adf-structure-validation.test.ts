/**
 * @file ADF Format Compliance Validation Tests
 * 
 * Tests ensure all ADF fixtures adhere to Confluence's strict ADF format rules:
 * 1. Root object has type: "doc" and version: 1
 * 2. All nodes have required properties
 * 3. Content arrays contain valid node objects
 * 4. Text nodes have a "text" property
 * 
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/
 */

import { describe, it, expect } from '@jest/globals';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get all ADF fixture files
const fixturesDir = join(__dirname, '..', 'fixtures');
const adfDir = join(fixturesDir, 'adf');
const adfFiles = readdirSync(adfDir).filter(file => file.endsWith('.adf'));

describe('ADF Format Compliance Validation', () => {
  
  describe('Rule 1: Root object has type: "doc" and version: 1', () => {
    adfFiles.forEach(filename => {
      it(`${filename} should have valid root object`, () => {
        const filePath = join(adfDir, filename);
        const content = readFileSync(filePath, 'utf8');
        const adf = JSON.parse(content);
        
        // Must have version: 1
        expect(adf.version).toBe(1);
        
        // Must have type: "doc"
        expect(adf.type).toBe('doc');
        
        // Must have content array (can be empty)
        expect(Array.isArray(adf.content)).toBe(true);
      });
    });
  });
  
  describe('Rule 2: All nodes have required properties', () => {
    adfFiles.forEach(filename => {
      it(`${filename} should have all nodes with required properties`, () => {
        const filePath = join(adfDir, filename);
        const content = readFileSync(filePath, 'utf8');
        const adf = JSON.parse(content);
        
        function validateNode(node: any, path: string = 'root') {
          // Every node must have a type
          expect(node.type).toBeDefined();
          expect(typeof node.type).toBe('string');
          expect(node.type.length).toBeGreaterThan(0);
          
          // If node has content, it should be an array
          if (node.content !== undefined) {
            expect(Array.isArray(node.content)).toBe(true);
            
            // Recursively validate child nodes
            node.content.forEach((childNode: any, index: number) => {
              validateNode(childNode, `${path}.content[${index}]`);
            });
          }
          
          // If node has marks, it should be an array of mark objects
          if (node.marks !== undefined) {
            expect(Array.isArray(node.marks)).toBe(true);
            node.marks.forEach((mark: any) => {
              expect(mark.type).toBeDefined();
              expect(typeof mark.type).toBe('string');
            });
          }
          
          // If node has attrs, it should be an object
          if (node.attrs !== undefined) {
            expect(typeof node.attrs).toBe('object');
            expect(node.attrs).not.toBeNull();
          }
        }
        
        // Validate the document root
        validateNode(adf, 'document');
        
        // Validate all content nodes
        adf.content.forEach((node: any, index: number) => {
          validateNode(node, `content[${index}]`);
        });
      });
    });
  });
  
  describe('Rule 3: Content arrays contain valid node objects', () => {
    adfFiles.forEach(filename => {
      it(`${filename} should have valid content arrays`, () => {
        const filePath = join(adfDir, filename);
        const content = readFileSync(filePath, 'utf8');
        const adf = JSON.parse(content);
        
        function validateContentArray(node: any, path: string = 'root') {
          if (node.content !== undefined) {
            // Content must be an array
            expect(Array.isArray(node.content)).toBe(true);
            
            // Each item in content array must be a valid node object
            node.content.forEach((childNode: any, index: number) => {
              // Must be an object
              expect(typeof childNode).toBe('object');
              expect(childNode).not.toBeNull();
              
              // Must not be an array (common mistake)
              expect(Array.isArray(childNode)).toBe(false);
              
              // Must have a type property
              expect(childNode.type).toBeDefined();
              expect(typeof childNode.type).toBe('string');
              
              // Recursively validate child content arrays
              validateContentArray(childNode, `${path}.content[${index}]`);
            });
          }
        }
        
        validateContentArray(adf, 'document');
      });
    });
  });
  
  describe('Rule 4: Text nodes have "text" property', () => {
    adfFiles.forEach(filename => {
      it(`${filename} should have all text nodes with text property`, () => {
        const filePath = join(adfDir, filename);
        const content = readFileSync(filePath, 'utf8');
        const adf = JSON.parse(content);
        
        function validateTextNodes(node: any, path: string = 'root') {
          // If this is a text node, it must have a text property
          if (node.type === 'text') {
            expect(node.text).toBeDefined();
            expect(typeof node.text).toBe('string');
            // Text can be empty string, but property must exist
          }
          
          // Recursively check child nodes
          if (node.content && Array.isArray(node.content)) {
            node.content.forEach((childNode: any, index: number) => {
              validateTextNodes(childNode, `${path}.content[${index}]`);
            });
          }
        }
        
        validateTextNodes(adf, 'document');
      });
    });
  });
  
  describe('Additional ADF Structure Validation', () => {
    adfFiles.forEach(filename => {
      it(`${filename} should have proper document structure`, () => {
        const filePath = join(adfDir, filename);
        const content = readFileSync(filePath, 'utf8');
        const adf = JSON.parse(content);
        
        // Document should be valid JSON
        expect(typeof adf).toBe('object');
        expect(adf).not.toBeNull();
        
        // Should not have unexpected root properties
        const allowedRootProps = ['version', 'type', 'content'];
        const rootProps = Object.keys(adf);
        rootProps.forEach(prop => {
          expect(allowedRootProps).toContain(prop);
        });
        
        // Version should be exactly 1
        expect(adf.version).toStrictEqual(1);
        
        // Type should be exactly "doc"
        expect(adf.type).toStrictEqual('doc');
      });
    });
    
    it('should have consistent node types across fixtures', () => {
      const allNodeTypes = new Set<string>();
      
      adfFiles.forEach(filename => {
        const filePath = join(adfDir, filename);
        const content = readFileSync(filePath, 'utf8');
        const adf = JSON.parse(content);
        
        function collectNodeTypes(node: any) {
          if (node.type) {
            allNodeTypes.add(node.type);
          }
          
          if (node.content && Array.isArray(node.content)) {
            node.content.forEach((childNode: any) => {
              collectNodeTypes(childNode);
            });
          }
          
          if (node.marks && Array.isArray(node.marks)) {
            node.marks.forEach((mark: any) => {
              if (mark.type) {
                allNodeTypes.add(`mark:${mark.type}`);
              }
            });
          }
        }
        
        collectNodeTypes(adf);
      });
      
      // Log all discovered node types for reference
      console.log('All ADF node types found in fixtures:', Array.from(allNodeTypes).sort());
      
      // Basic validation that we have expected core types
      expect(allNodeTypes.has('doc')).toBe(true);
      expect(allNodeTypes.has('text')).toBe(true);
      expect(allNodeTypes.has('paragraph')).toBe(true);
      expect(allNodeTypes.has('heading')).toBe(true);
    });
  });
});