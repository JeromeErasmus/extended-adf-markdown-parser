/**
 * @file Extended Markdown validator
 */

import type { ValidationResult } from '../types';

export class MarkdownValidator {
  validate(markdown: string): ValidationResult {
    const errors: Array<{ path?: string; message: string; code?: string }> = [];
    const warnings: string[] = [];
    
    // Check for basic markdown structure
    if (typeof markdown !== 'string') {
      return {
        valid: false,
        errors: [
          {
            message: 'Input must be a string',
            code: 'INVALID_TYPE'
          }
        ]
      };
    }
    
    // Split into lines for line-by-line validation
    const lines = markdown.split(/\r?\n/);
    
    // Validate fence blocks
    this.validateFenceBlocks(lines, errors, warnings);
    
    // Validate headings
    this.validateHeadings(lines, errors, warnings);
    
    // Validate ADF metadata comments
    this.validateAdfMetadata(lines, errors, warnings);
    
    // Validate frontmatter
    this.validateFrontmatter(lines, errors, warnings);
    
    // Validate lists
    this.validateLists(lines, errors, warnings);
    
    // Validate links and media
    this.validateLinksAndMedia(lines, errors, warnings);
    
    return {
      valid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }
  
  private validateFenceBlocks(
    lines: string[], 
    errors: Array<{ path?: string; message: string; code?: string }>, 
    warnings: string[]
  ): void {
    const fenceStack: Array<{type: string; line: number; content: string}> = [];
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // ADF fence blocks
      const adfFenceMatch = trimmed.match(/^~~~(\w+)(?:\s+(.*))?$/);
      if (adfFenceMatch) {
        const [, fenceType, attributes] = adfFenceMatch;
        
        // Validate known ADF fence types
        const validTypes = ['panel', 'expand', 'mediaSingle', 'mediaGroup'];
        if (!validTypes.includes(fenceType)) {
          warnings.push(`Unknown ADF fence type "${fenceType}" at line ${index + 1}`);
        }
        
        // Validate panel attributes
        if (fenceType === 'panel') {
          if (!attributes || !attributes.includes('type=')) {
            errors.push({
              message: `Panel fence block missing required "type" attribute at line ${index + 1}`,
              code: 'MISSING_PANEL_TYPE',
              path: `line:${index + 1}`
            });
          } else {
            const typeMatch = attributes.match(/type=(\w+)/);
            if (typeMatch) {
              const panelType = typeMatch[1];
              const validPanelTypes = ['info', 'warning', 'error', 'success', 'note'];
              if (!validPanelTypes.includes(panelType)) {
                errors.push({
                  message: `Invalid panel type "${panelType}" at line ${index + 1}. Valid types: ${validPanelTypes.join(', ')}`,
                  code: 'INVALID_PANEL_TYPE',
                  path: `line:${index + 1}`
                });
              }
            }
          }
        }
        
        fenceStack.push({type: fenceType, line: index + 1, content: line});
        return;
      }
      
      // Closing fence
      if (trimmed === '~~~') {
        if (fenceStack.length === 0) {
          errors.push({
            message: `Unmatched closing fence block at line ${index + 1}`,
            code: 'UNMATCHED_FENCE_CLOSE',
            path: `line:${index + 1}`
          });
        } else {
          fenceStack.pop();
        }
        return;
      }
      
      // Code blocks - both opening and closing
      if (trimmed.startsWith('```')) {
        // Check if we have an open code block
        if (fenceStack.length > 0 && fenceStack[fenceStack.length - 1].type === 'code') {
          // This is a closing fence
          fenceStack.pop();
        } else if (trimmed === '```') {
          // This is an unmatched closing fence (``` with no content after)
          errors.push({
            message: `Unmatched code block closing at line ${index + 1}`,
            code: 'UNMATCHED_CODE_CLOSE',
            path: `line:${index + 1}`
          });
        } else {
          // This is an opening fence (```javascript, etc.)
          fenceStack.push({type: 'code', line: index + 1, content: line});
        }
        return;
      }
    });
    
    // Check for unclosed fences
    fenceStack.forEach(fence => {
      errors.push({
        message: `Unclosed ${fence.type} fence block starting at line ${fence.line}`,
        code: 'UNCLOSED_FENCE_BLOCK',
        path: `line:${fence.line}`
      });
    });
  }
  
  private validateHeadings(
    lines: string[], 
    errors: Array<{ path?: string; message: string; code?: string }>, 
    warnings: string[]
  ): void {
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      const headingMatch = trimmed.match(/^(#+)\s*(.*)$/);
      
      if (headingMatch) {
        const [, hashes, content] = headingMatch;
        const level = hashes.length;
        
        // Validate heading levels (1-6)
        if (level > 6) {
          errors.push({
            message: `Invalid heading level ${level} at line ${index + 1}. Maximum level is 6.`,
            code: 'INVALID_HEADING_LEVEL',
            path: `line:${index + 1}`
          });
        }
        
        // Check for empty heading content
        if (!content.trim()) {
          warnings.push(`Empty heading at line ${index + 1}`);
        }
      }
    });
  }
  
  private validateAdfMetadata(
    lines: string[], 
    errors: Array<{ path?: string; message: string; code?: string }>, 
    warnings: string[]
  ): void {
    lines.forEach((line, index) => {
      // ADF metadata comments: <!-- adf:nodeType attrs='...' -->
      const metadataMatch = line.match(/<!--\s*adf:(\w+)\s+attrs='(.*)'\s*-->/);
      
      if (metadataMatch) {
        const [, nodeType, attrsJson] = metadataMatch;
        
        try {
          // Validate JSON structure
          const attrs = JSON.parse(attrsJson.replace(/'/g, '"'));
          
          if (typeof attrs !== 'object' || attrs === null) {
            errors.push({
              message: `ADF metadata attributes must be an object at line ${index + 1}`,
              code: 'INVALID_METADATA_ATTRS',
              path: `line:${index + 1}`
            });
          }
        } catch (error) {
          errors.push({
            message: `Invalid JSON in ADF metadata at line ${index + 1}`,
            code: 'INVALID_METADATA_JSON',
            path: `line:${index + 1}`
          });
        }
      }
    });
  }
  
  private validateFrontmatter(
    lines: string[], 
    errors: Array<{ path?: string; message: string; code?: string }>, 
    warnings: string[]
  ): void {
    if (lines.length === 0) return;
    
    // Check if document starts with frontmatter
    if (lines[0].trim() === '---') {
      let closingFound = false;
      let lineCount = 0;
      
      for (let i = 1; i < lines.length; i++) {
        lineCount++;
        if (lines[i].trim() === '---') {
          closingFound = true;
          break;
        }
        
        // Prevent infinite frontmatter
        if (lineCount > 50) {
          break;
        }
      }
      
      if (!closingFound) {
        errors.push({
          message: 'Unclosed YAML frontmatter block',
          code: 'UNCLOSED_FRONTMATTER',
          path: 'line:1'
        });
      }
    }
  }
  
  private validateLists(
    lines: string[], 
    errors: Array<{ path?: string; message: string; code?: string }>, 
    warnings: string[]
  ): void {
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Ordered list validation
      const orderedMatch = trimmed.match(/^(\d+)\.\s*(.*)$/);
      if (orderedMatch) {
        const [, number, content] = orderedMatch;
        
        if (!content.trim()) {
          warnings.push(`Empty list item at line ${index + 1}`);
        }
        
        // Check for reasonable list numbers (warn for very large numbers)
        if (parseInt(number) > 999) {
          warnings.push(`Very large list number (${number}) at line ${index + 1}`);
        }
      }
      
      // Bullet list validation
      const bulletMatch = trimmed.match(/^[-*+]\s*(.*)$/);
      if (bulletMatch) {
        const [, content] = bulletMatch;
        
        if (!content.trim()) {
          warnings.push(`Empty list item at line ${index + 1}`);
        }
      }
    });
  }
  
  private validateLinksAndMedia(
    lines: string[], 
    errors: Array<{ path?: string; message: string; code?: string }>, 
    warnings: string[]
  ): void {
    lines.forEach((line, index) => {
      // Validate media placeholders
      const mediaMatches = line.match(/\{media:([^}]*)\}/g);
      if (mediaMatches) {
        mediaMatches.forEach(match => {
          const id = match.slice(7, -1); // Remove {media: and }
          if (!id.trim()) {
            errors.push({
              message: `Empty media ID in placeholder at line ${index + 1}`,
              code: 'EMPTY_MEDIA_ID',
              path: `line:${index + 1}`
            });
          }
        });
      }
      
      // Validate user mentions
      const userMatches = line.match(/\{user:([^}]*)\}/g);
      if (userMatches) {
        userMatches.forEach(match => {
          const userId = match.slice(6, -1); // Remove {user: and }
          if (!userId.trim()) {
            errors.push({
              message: `Empty user ID in mention at line ${index + 1}`,
              code: 'EMPTY_USER_ID',
              path: `line:${index + 1}`
            });
          }
        });
      }
      
      // Validate markdown links
      const linkMatches = line.match(/\[([^\]]*)\]\(([^)]*)\)/g);
      if (linkMatches) {
        linkMatches.forEach(match => {
          const parts = match.match(/\[([^\]]*)\]\(([^)]*)\)/);
          if (parts) {
            const [, text, url] = parts;
            
            // Check for empty URLs
            if (!url.trim()) {
              errors.push({
                message: `Empty URL in link at line ${index + 1}`,
                code: 'EMPTY_LINK_URL',
                path: `line:${index + 1}`
              });
            }
            
            // Warn about empty link text
            if (!text.trim()) {
              warnings.push(`Empty link text at line ${index + 1}`);
            }
          }
        });
      }
    });
  }
}