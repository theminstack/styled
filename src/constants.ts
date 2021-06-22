declare const process: undefined | { env: Record<string, string | undefined> };

export const isTest = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
export const isClient = typeof document !== 'undefined';
export const styledSelectorMarker = '$$tss';
export const styledElementAttribute = 'data-tss';
