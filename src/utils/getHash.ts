/**
 * Get a fast string hash similar to the djb2 hash (Dan Bernstein).
 *
 * Original source: https://github.com/darkskyapp/string-hash.
 */
export function getHash(...values: readonly (string | number)[]): string {
  let hash = 5381;

  for (let i = values.length - 1; i >= 0; --i) {
    const value = values[i];
    const str = typeof value === 'string' ? value : value.toString(10);

    for (let j = str.length - 1; j >= 0; --j) {
      hash = (hash * 33) ^ str.charCodeAt(j);
    }
  }

  return (hash >>> 0).toString(36);
}
