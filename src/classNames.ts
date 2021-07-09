export type ClassName = undefined | null | false | string | Record<string, boolean> | ClassName[];

/**
 * Construct a space separated string of class names.
 *
 * ```tsx
 * const className = classNames('a', { b: true, c: false }, null);
 * // className = "a b"
 * ```
 */
export function classNames(...values: ClassName[]): string {
  let className = '';

  for (let i = 0, length = values.length; i < length; ++i) {
    const value = values[i];

    if (!value) {
      continue;
    }

    if (typeof value === 'string') {
      className = className ? className + ' ' + value : value;
    } else if (value instanceof Array) {
      className = classNames(className, ...value);
    } else {
      for (const key of Object.keys(value)) {
        if (key && value[key]) {
          className = className ? className + ' ' + key : key;
        }
      }
    }
  }

  return className;
}
