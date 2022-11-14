import { getHash } from './hash.js';

type StyleStringCache = {
  readonly register: (styleString: string) => readonly [isNew: boolean, hash: string];
};

const createStyleStringCache = (): StyleStringCache => {
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
};

export { type StyleStringCache, createStyleStringCache };
