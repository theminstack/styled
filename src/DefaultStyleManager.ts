import { styledElementAttribute } from './constants';
import { IStyle } from './types/IStyle';
import { IStyleManager } from './types/IStyleManager';

/**
 * Default style manager.
 */
export class DefaultStyleManager implements IStyleManager {
  private readonly _cache: Record<string, HTMLStyleElement | undefined> = Object.create(null);

  add({ key, cssText }: IStyle): void {
    const style = document.createElement('style');
    style.setAttribute(styledElementAttribute, key);
    style.textContent = cssText;
    this._cache[key] = document.head.appendChild(style);
  }

  remove(key: string): void {
    const style = this._cache[key];

    if (style) {
      delete this._cache[key];
      style.parentNode?.removeChild(style);
    }
  }
}

/**
 * Singleton instance of the `DefaultStyleManager` class.
 */
export const defaultStyleManager = new DefaultStyleManager();
