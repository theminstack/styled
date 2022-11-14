import { isBrowser } from '../util/environment.js';

type StyleElement = {
  remove: () => void;
  textContent: string | null;
};

type Dom = {
  addComponentStyle: (styledClass: string, cssText: string) => void;
  addGlobalStyle: () => StyleElement;
};

const cache = new Set<string>();
const ssrCaches = new WeakMap<object, Set<string>>();

const isCached = (styledClass: string): boolean => {
  if (!cache.has(styledClass)) {
    cache.add(styledClass);
    return false;
  }
  return true;
};

const isSsrCached = (key: object, styledClass: string): boolean => {
  let ssrCache = ssrCaches.get(key);
  if (!ssrCache) ssrCaches.set(key, (ssrCache = new Set()));
  if (!ssrCache.has(styledClass)) {
    ssrCache.add(styledClass);
    return false;
  }
  return true;
};

const createSsrStyleElement = (): StyleElement => {
  return {
    // Removal is a no-op on the server.
    remove: () => undefined,
    textContent: null,
  };
};

const createDom = (): Dom => {
  if (isBrowser) {
    const globalTrailer = document.head.appendChild(document.createElement('style'));
    globalTrailer.textContent = '/* react-micro-styled global marker */';

    return {
      addComponentStyle: (styledClass, cssText) => {
        if (!isCached(styledClass)) {
          const style = document.createElement('style');
          style.textContent = cssText;
          document.head.appendChild(style);
        }
      },
      addGlobalStyle: () => document.head.insertBefore(document.createElement('style'), globalTrailer),
    };
  }

  return {
    addComponentStyle: (styledClass, cssText) => {
      if (globalThis.$$rmsSsr && !isSsrCached(globalThis.$$rmsSsr, styledClass)) {
        const style = createSsrStyleElement();
        style.textContent = cssText;
        globalThis.$$rmsSsr?.c?.push(style);
      }
    },
    addGlobalStyle: () => {
      const style = createSsrStyleElement();
      globalThis.$$rmsSsr?.g?.push(style);
      return style;
    },
  };
};

const dom = createDom();

export { type StyleElement, dom };
