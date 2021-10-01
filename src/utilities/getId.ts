import { getHash } from './getHash';
import { isTest } from './isTest';

/**
 * Get a stable ID string which is safe to use as a CSS identifier.
 *
 * ```tsx
 * const id = getId('namespace');
 * ```
 *
 * **Note**: When `process.env.NODE_ENV` is "test" (eg. during Jest testing),
 * this function returns a stable value for the given display name. This value
 * is *NOT* unique per invocation like it would be at runtime.
 */
export function getId(namespace: string): string {
  const count = getId.counters.get(namespace) ?? 0;
  getId.counters.set(namespace, count + 1);
  return 'tss_' + getHash(...(isTest() ? [] : ['[VI]{version}[/VI]/', count.toString(10)]), namespace);
}
getId.counters = new Map<string, number>();
