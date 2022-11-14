import { type AstNode, compile } from '../syntax/compile.js';
import { format } from '../syntax/format.js';
import { hash } from '../util/hash.js';
import { getStyleClass } from './class.js';

type Entry = { ast: AstNode; cssText: string; styledClass: string };

const entries = new Map<string, Entry>();

// Style strings have all NUL (\0) characters removed, so they are safe
// to use as separators.
const getKey = (id: { styledClass: string } | { styleString: string; styledClasses?: string }): string => {
  return 'styledClass' in id ? id.styledClass : (id.styledClasses ?? '') + '\0' + id.styleString;
};

const createEntry = (style: AstNode | string): Entry => {
  const ast = typeof style === 'string' ? compile(style) : style;
  const styledClass = getStyleClass(hash(JSON.stringify(ast)) >>> 0);
  const cssText = format(ast, '.' + styledClass);

  return { ast, cssText, styledClass };
};

const getOrCreateEntry = (styleString: string): Entry => {
  let entry = entries.get(styleString);

  if (!entry) {
    entry = createEntry(styleString);
    entries.set(getKey({ styleString }), entry);
    entries.set(getKey({ styledClass: entry.styledClass }), entry);
  }

  return entry;
};

const cache = {
  resolve: (styleString: string, styledClasses?: string): Entry => {
    const key = getKey({ styleString, styledClasses });
    const cached = entries.get(key);

    if (cached) return cached;

    const base = getOrCreateEntry(styleString);
    const styledClassArray = styledClasses?.split(/\s+/g).filter((value) => value);

    if (!styledClassArray?.length) return base;

    const concatenated = createEntry({
      children: styledClassArray.reduce((result, styledClass) => {
        const entry = entries.get(styledClass);
        return entry ? [...result, ...entry.ast.children] : result;
      }, base.ast.children),
    });

    entries.set(key, concatenated);
    entries.set(getKey({ styledClass: concatenated.styledClass }), concatenated);

    return concatenated;
  },
} as const;

export { cache };
