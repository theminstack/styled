import { type AstNode, compile } from '../syntax/compile.js';
import { format } from '../syntax/format.js';
import { DYNAMIC_CLASS_PREFIX } from '../util/constants.js';
import { getHashString, hash } from '../util/hash.js';

type Entry = { readonly ast: AstNode; readonly className: string; readonly cssText: string };

type Source = { readonly classNames?: string; readonly styleString: string };

type Key = Source | { readonly className: string; readonly styleString?: never };

type EntryCollection = {
  readonly get: (key: Key) => Entry | undefined;
  readonly set: (source: Source, entry: Entry) => Entry;
};

type StyleCache = {
  readonly resolve: (styleString: string, classNames?: string) => [cssText: string, className: string];
};

// Style strings have all NUL (\0) characters removed, so they are safe
// to use as separators.
const getKeyString = (key: Key): string => {
  return 'className' in key ? key.className : (key.classNames ?? '') + '\0' + key.styleString;
};

const createEntry = (style: AstNode | string): Entry => {
  const ast = typeof style === 'string' ? compile(style) : style;
  const className = DYNAMIC_CLASS_PREFIX + getHashString(hash(JSON.stringify(ast)));
  const cssText = format(ast, '.' + className);

  return { ast, className, cssText };
};

const createEntryCollection = (): EntryCollection => {
  const entries = new Map<string, Entry>();

  const self: EntryCollection = {
    get: (key: Key): Entry | undefined => entries.get(getKeyString(key)),
    set: (source: { classNames?: string; styleString: string }, entry: Entry): Entry => {
      entries.set(getKeyString({ classNames: source.classNames, styleString: source.styleString }), entry);
      entries.set(getKeyString({ className: entry.className }), entry);
      return entry;
    },
  };

  return self;
};

const createStyleCache = (): StyleCache => {
  const entries = createEntryCollection();

  return {
    resolve: (styleString, classNames) => {
      const cached = entries.get({ classNames, styleString });

      if (cached) return [cached.cssText, cached.className];

      const base = entries.get({ styleString }) || entries.set({ styleString }, createEntry(styleString));
      const classNameArray = classNames?.split(/\s+/g).filter((value) => value);

      if (!classNameArray?.length) return [base.cssText, base.className];

      const merged = createEntry({
        children: classNameArray.reduce((result, className) => {
          const entry = entries.get({ className });
          return entry ? [...result, ...entry.ast.children] : result;
        }, base.ast.children),
      });

      entries.set({ classNames, styleString }, merged);

      return [merged.cssText, merged.className];
    },
  };
};

const defaultStyleCache = createStyleCache();

export { type StyleCache, createStyleCache, defaultStyleCache };
