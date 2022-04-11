import { getHash } from './hash';

interface StyleStringCache {
  register: (styleString: string) => [isNew: boolean, hash: string];
}

function createStyleStringCache(): StyleStringCache {
  const entries = new Map<string, string>();

  return {
    register: (styleString) => {
      let hash = entries.get(styleString);
      let isNew = false;

      if (hash == null) {
        hash = getHash(styleString);
        isNew = true;
        entries.set(styleString, hash);
      }

      return [isNew, hash];
    },
  };
}

export { type StyleStringCache, createStyleStringCache };
