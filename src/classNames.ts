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
  return values
    .reduce<string[]>((acc, value) => {
      if (!value) {
        return acc;
      } else if (typeof value === 'string') {
        return [...acc, value];
      } else if (value instanceof Array) {
        value = classNames(...value);
        return value ? [...acc, value] : acc;
      }

      for (const key of Object.keys(value)) {
        if (value[key]) {
          acc = [...acc, key];
        }
      }

      return acc;
    }, [])
    .join(' ');
}
