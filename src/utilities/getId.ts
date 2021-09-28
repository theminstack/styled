import { getHash } from './getHash';
import { isTest } from './isTest';

const version = '[VI]{version}[/VI]';
const namespaceCounters = new Map<string, number>();

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
  const count = namespaceCounters.get(namespace) ?? 0;
  namespaceCounters.set(namespace, count + 1);
  return 'tss_' + getHash(...(isTest() ? [] : [version, '/', count.toString(10)]), namespace);
}
