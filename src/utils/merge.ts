import { Merge } from '../types/Utilities';

/**
 * Returns a new object with all of the props of `a`, replaced by
 * the defined props of `b`.
 *
 * ```ts
 * merge({ foo: 1, bar: undefined, baz: 3 }, { foo: 0, bar: 2, baz: undefined }); // { foo: 0, bar: 2, baz: 3 }
 * ```
 */
export function merge<A extends {}, B extends Record<string, unknown>>(a: A, b: B): Merge<A, B>;
export function merge(a: Record<string, unknown>, b: Record<string, unknown>): Record<string, unknown> {
  a = { ...a };

  for (let i = 0, keys = Object.keys(b), len = keys.length; i < len; ++i) {
    const key = keys[i];
    const value = b[key];

    if (value !== undefined) {
      a[key] = value;
    }
  }

  return a;
}
