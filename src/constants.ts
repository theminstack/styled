declare const process: undefined | { env: Record<string, string | undefined> };

export const version = '[VI]{version}[/VI]';
export const isTest = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
export const isClient = typeof document !== 'undefined';
export const styledComponentMetadataKey = '$$tss';
export const styledElementAttribute = 'data-tss';
