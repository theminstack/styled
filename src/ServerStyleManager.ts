import { createElement, ReactElement } from 'react';
import { version, styledElementAttribute } from './constants';
import { IStyle } from './types/IStyle';
import { IStyleManager } from './types/IStyleManager';

declare const __webpack_nonce__: string | undefined;

/**
 * A style manager for collecting styles during server side
 * rendering (SSR).
 *
 * ```tsx
 * const manager = new ServerStyleManager();
 * const html = renderToString(
 *   <StyleConfig serverManager={serverManager}>
 *     <App />
 *   </StyleConfig>
 * );
 * const styles = manager.getStyleTags(); // or manager.getStyleElements();
 * ```
 */
export class ServerStyleManager implements IStyleManager {
  private readonly _styles: IStyle[] = [];

  add({ key, cssText }: IStyle): void {
    this._styles.push({ key, cssText });
  }

  remove(key: string): void {
    for (let i = this._styles.length - 1; i >= 0; --i) {
      if (this._styles[i].key === key) {
        this._styles.splice(i, 1);
      }
    }
  }

  /**
   * Get the raw data for all active (added and not removed) styles.
   */
  getStyleData(): IStyle[] {
    return JSON.parse(JSON.stringify(this._styles));
  }

  /**
   * Get an HTML string containing a _single_ `<style>` tag which
   * contains the _concatenation_ of all active (added and not
   * removed) styles.
   */
  getStyleTag(): string {
    const cssText = this._getCssText();
    const props = this._getProps();
    const keys = Object.keys(props);
    let propsString = '';

    for (let i = 0, length = keys.length; i < length; ++i) {
      const key = keys[i];
      const value = props[key];
      const prop = value ? `${key}="${value}"` : key;

      propsString = propsString ? propsString + ' ' + prop : prop;
    }

    return `<style ${propsString}>${cssText}</style>`;
  }

  /**
   * Get a _single_ React "style" element which contains the
   * _concatenation_ of all active (added and not removed) styles.
   */
  getStyleElement(): ReactElement {
    return createElement('style', this._getProps(), this._getCssText());
  }

  private _getProps(): Record<string, string> {
    const nonce = typeof __webpack_nonce__ !== 'undefined' ? __webpack_nonce__ : null;

    return {
      [styledElementAttribute]: '',
      [`${styledElementAttribute}-version`]: version,
      ...(nonce != null ? { [`${styledElementAttribute}-nonce`]: nonce } : {}),
    };
  }

  private _getCssText(): string {
    return this._styles.map(({ cssText }) => cssText).join('\n');
  }
}
