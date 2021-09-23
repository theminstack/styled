export function isTest(): boolean {
  return typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
}
