/**
 * XOR version of the [DJB2](http://www.cse.yorku.ca/~oz/hash.html) string
 * hashing algorithm (sometimes referred to as DJB2a), originally written by
 * [Dan Bernstein](https://en.wikipedia.org/wiki/Daniel_J._Bernstein).
 */
const hash = (data: string): number => {
  let value = 5381;

  for (let index = 0, max = data.length; index < max; ++index) {
    value = ((value << 5) + value) ^ data.charCodeAt(index);
  }

  return value;
};

const getHashString = (value: number): string => (value >>> 0).toString(36);

export { getHashString, hash };
