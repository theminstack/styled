import { styleElementCacheKeyAttr } from './constants';
import { IStyleManager } from './types/IStyleManager';

/**
 * Default style manager.
 */
export class DefaultStyleManager implements IStyleManager {
  readonly _cache = new Map<string, HTMLStyleElement>();

  register(cacheKey: string, cssText: string, replacedCacheKey: string | undefined): void {
    const style = document.createElement('style');
    const replacedStyle = replacedCacheKey != null ? this._cache.get(replacedCacheKey) : null;

    style.setAttribute(styleElementCacheKeyAttr, cacheKey);
    style.textContent = cssText;
    document.head.insertBefore(style, replacedStyle?.nextSibling ?? null);
    this._cache.set(cacheKey, style);
  }

  unregister(cacheKey: string): void {
    const style = this._cache.get(cacheKey);

    if (style) {
      this._cache.delete(cacheKey);
      style.remove();
    }
  }
}

/**
 * Singleton instance of the `DefaultStyleManager` class.
 */
export const defaultStyleManager = new DefaultStyleManager();
