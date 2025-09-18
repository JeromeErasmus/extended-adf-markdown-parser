/**
 * @file types.ts
 * @description Type definitions for micromark ADF extensions
 */

import { Code, Construct, State, Effects, TokenizeContext } from 'micromark-util-types';

export interface AdfTokenizer {
  (effects: Effects, ok: State, nok: State): State;
}

export interface AdfConstruct extends Construct {
  name: string;
  tokenize: AdfTokenizer;
  concrete?: boolean;
}

export interface AdfFenceContext {
  nodeType: string;
  attributes: Record<string, any>;
  depth: number;
  opening: string;
  closing?: string;
}

export interface PanelContext extends AdfFenceContext {
  nodeType: 'panel';
  attributes: {
    panelType: 'info' | 'warning' | 'error' | 'success' | 'note';
    [key: string]: any;
  };
}

export interface ExpandContext extends AdfFenceContext {
  nodeType: 'expand' | 'nestedExpand';
  attributes: {
    title?: string;
    [key: string]: any;
  };
}

export interface MediaSingleContext extends AdfFenceContext {
  nodeType: 'mediaSingle';
  attributes: {
    layout?: 'center' | 'align-start' | 'align-end' | 'wide' | 'full-width';
    width?: number;
    [key: string]: any;
  };
}

export interface MediaGroupContext extends AdfFenceContext {
  nodeType: 'mediaGroup';
}

export type AdfBlockContext = PanelContext | ExpandContext | MediaSingleContext | MediaGroupContext;

export interface TokenizerState {
  marker: Code;
  size: number;
  nodeType: string;
  attributeData: string;
  content: string;
  nested: AdfFenceContext[];
}