import { IStyleManager } from './types/IStyleManager';
import { DomElement } from './utils/getDomElement';

/**
 * Default style manager.
 */
export class DefaultStyleManager implements IStyleManager {
  readonly _cache: Record<string, DomElement<'style'> | undefined> = Object.create(null);

  add(key: string, style: DomElement<'style'>): void {
    this._cache[key] = style.mount(document.head);
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
