import { Defaults } from '../types/Utilities';

/**
 * Returns an object with all the props of `a`, replaced by the
 * defined props of `b` where the same prop in `a` was undefined.
 *
 * ```ts
 * merge({ foo: 1, bar: undefined }, { foo: 0, bar: 2 }); // { foo: 1, bar: 2 }
 * ```
 */
export function defaults<A extends {}, B extends Record<string, unknown>>(a: A, b: B): Defaults<A, B>;
export function defaults(a: Record<string, unknown>, b: Record<string, unknown>): Record<string, unknown> {
  a = { ...a };

  for (let i = 0, keys = Object.keys(b), length = keys.length; i < length; ++i) {
    const key = keys[i];

    if (a[key] === undefined) {
      const value = b[key];

      if (value !== undefined) {
        a[key] = value;
      }
    }
  }

  return a;
}
