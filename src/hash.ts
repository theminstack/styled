/**
 * Get a fast string hash similar to the djb2 hash (Dan Bernstein).
 *
 * Original source: https://github.com/darkskyapp/string-hash.
 */
export function getHash(...values: readonly string[]): string {
  // let hash = 5381;
  let hash = 195220209; // tsstyled unique seed

  for (let i = values.length - 1; i >= 0; --i) {
    const value = values[i];

    for (let j = value.length - 1; j >= 0; --j) {
      hash = (hash * 33) ^ value.charCodeAt(j);
    }
  }

  return (hash >>> 0).toString(36);
}
