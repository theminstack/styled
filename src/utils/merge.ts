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
  return Object.keys(b).reduce(
    (acc, key) => {
      const value = b[key];
      return value === undefined ? acc : { ...acc, [key]: value };
    },
    { ...a },
  );
}
