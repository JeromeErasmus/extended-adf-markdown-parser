/**
 * @file Converter registry for managing node and mark converters
 */

import type { NodeConverter, MarkConverter } from './types';
import { safeJSONStringify } from '../utils/json-utils.js';

export class ConverterRegistry {
  private nodeConverters = new Map<string, NodeConverter>();
  private markConverters = new Map<string, MarkConverter>();

  registerNode(converter: NodeConverter): void {
    this.nodeConverters.set(converter.nodeType, converter);
  }

  registerMark(converter: MarkConverter): void {
    this.markConverters.set(converter.markType, converter);
  }

  registerNodes(converters: NodeConverter[]): void {
    converters.forEach(c => this.registerNode(c));
  }

  registerMarks(converters: MarkConverter[]): void {
    converters.forEach(c => this.registerMark(c));
  }

  getNodeConverter(nodeType: string): NodeConverter {
    const converter = this.nodeConverters.get(nodeType);
    if (!converter) {
      return this.getFallbackNodeConverter(nodeType);
    }
    return converter;
  }

  getMarkConverter(markType: string): MarkConverter {
    const converter = this.markConverters.get(markType);
    if (!converter) {
      return this.getFallbackMarkConverter(markType);
    }
    return converter;
  }

  private getFallbackNodeConverter(nodeType: string): NodeConverter {
    return {
      nodeType: 'unknown',
      toMarkdown: (node) => {
        // Preserve unknown nodes as raw JSON in comments
        return `<!-- adf:unknown type="${nodeType}" -->\n${safeJSONStringify(node, 2)}\n<!-- /adf:unknown -->`;
      }
    };
  }

  private getFallbackMarkConverter(markType: string): MarkConverter {
    return {
      markType: 'unknown',
      toMarkdown: (text, mark) => {
        // Preserve unknown marks with metadata comments
        return `${text}<!-- adf:mark type="${markType}" attrs='${safeJSONStringify(mark.attrs || {})}' -->`;
      }
    };
  }
}