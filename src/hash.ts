/**
 * Get a fast string hash similar to the djb2 hash (Dan Bernstein).
 *
 * Original source: https://github.com/darkskyapp/string-hash.
 */
const getHash = (...values: readonly string[]): string => {
  // let hash = 5381;
  let hash = 195_220_209; // unique seed

  for (let valueIndex = values.length - 1; valueIndex >= 0; --valueIndex) {
    const value = values[valueIndex];

    for (let charIndex = value.length - 1; charIndex >= 0; --charIndex) {
      hash = (hash * 33) ^ value.charCodeAt(charIndex);
    }
  }

  return (hash >>> 0).toString(36);
};

export { getHash };
