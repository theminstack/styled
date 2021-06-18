export const isTest = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
export const isBrowser = typeof document !== 'undefined';
export const styledComponentMarker = '$$tss';
export const styleElementCacheKeyAttr = 'data-tss';
