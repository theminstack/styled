import { isBrowser, styleElementCacheKeyAttr } from './constants';

/**
 * Move all SSR inlined `<style>` elements from the `<body>` to the
 * `<head>`.
 *
 * _This is a no-op if used outside of a browser context._
 */
export function rehydrate(): void {
  if (!isBrowser) {
    return;
  }

  const cacheKeys: Record<string, true> = Object.create(null);

  document.body.querySelectorAll<HTMLStyleElement>('style[' + styleElementCacheKeyAttr + ']').forEach((element) => {
    const cacheKey = element.getAttribute(styleElementCacheKeyAttr) as string;

    if (!cacheKeys[cacheKey]) {
      document.head.appendChild(element);
      cacheKeys[cacheKey] = true;
    }
  });
}
