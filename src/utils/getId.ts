import version from '../version.json';
import { getHash } from './getHash';
import { isTest } from '../constants';
import { idCounters } from '../globals';

/**
 * Get a stable ID string which is safe to use as a CSS class name.
 *
 * _When `process.env.NODE_ENV` is "test" (eg. during Jest testing),
 * this function returns a stable value for the given display name.
 * This value is **NOT** unique per invocation like it would be at
 * runtime._
 */
export function getId(name = 'tss'): string {
  return `${name.replace(/[^a-z0-9_-]+/gi, '-').replace(/(^-|-$)/g, '')}-${getHash(
    ...(isTest ? [] : [version, (idCounters[name] = (idCounters[name] ?? 0) + 1)]),
    name,
  )}`;
}
