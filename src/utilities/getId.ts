import { getHash } from './getHash';
import { isTest } from './isTest';

function _getId(namespace: string): string {
  const count = _getId._counters.get(namespace) ?? 0;
  _getId._counters.set(namespace, count + 1);
  return 'tss_' + getHash(...(isTest() ? [] : ['[VI]{version}[/VI]/', count.toString(10)]), namespace);
}
_getId._counters = new Map<string, number>();

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
export const getId: (namespace: string) => string = _getId;
