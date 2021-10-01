import { compareVersions } from '../utilities/compareVersions';
import { isTest } from '../utilities/isTest';

type ComponentStyle = {
  readonly update: (textContent: string, hash: string) => void;
};

type GlobalStyle = {
  readonly update: (textContent: string) => void;
  readonly remove: () => void;
};

export type Manager = {
  readonly version: string;
  readonly rehydrate: () => void;
  readonly createComponentStyle: () => ComponentStyle;
  readonly createGlobalStyle: () => GlobalStyle;
  readonly renderStyles: () => string;
};

type GlobalObject = {
  $$tss?: {
    styleManager?: Manager;
  };
};

//
// Everything above must remain backwards compatible to allow multiple
// versions of TSStyled to work side-by-side.
//

declare global {
  const global: unknown;
}

export function createDocumentManager(version: string, document: Document): Manager {
  let ssrStyles: NodeListOf<Element> | undefined = document.querySelectorAll('style[data-tss]');
  let first: HTMLStyleElement | undefined;
  let last: { value?: HTMLStyleElement } = {};

  const manager = {
    version,
    rehydrate(): void {
      if (ssrStyles != null) {
        const styles = ssrStyles;

        ssrStyles = undefined;
        manager.rehydrate = () => undefined;

        requestAnimationFrame(() => {
          for (let i = styles.length - 1; i >= 0; --i) {
            const style = styles[i];
            style.parentElement?.removeChild(style);
          }
        });
      }
    },
    createComponentStyle(): ComponentStyle {
      const _last: { value?: HTMLStyleElement } = (last = Object.create(last));

      return {
        update(textContent, hash) {
          const style = document.createElement('style');
          style.textContent = textContent;
          style.setAttribute('data-tss', hash);

          if (_last.value != null) {
            _last.value.insertAdjacentElement('afterend', style);
          } else {
            if (first != null) {
              first.insertAdjacentElement('beforebegin', style);
            } else {
              document.head.insertAdjacentElement('beforeend', style);
            }

            first = style;
          }

          _last.value = style;
        },
      };
    },
    createGlobalStyle(): GlobalStyle {
      let style: HTMLStyleElement | undefined;

      return {
        update(textContent): void {
          if (style == null) {
            style = document.createElement('style');
            style.setAttribute('data-tss', '');

            if (first != null) {
              first.insertAdjacentElement('beforebegin', style);
            } else {
              document.head.insertAdjacentElement('beforeend', style);
            }
          }

          style.textContent = textContent;
        },
        remove(): void {
          if (style != null) {
            style.parentElement?.removeChild(style);
            style = undefined;
          }
        },
      };
    },
    renderStyles(): string {
      return '';
    },
  };

  return manager;
}

function createVirtualManager(version: string): Manager {
  const styleSets: { textContent: string; hash?: string }[][] = [[]];
  const globalStyles = styleSets[0];

  return {
    version,
    rehydrate() {
      // no-op
    },
    createComponentStyle() {
      const styles: { textContent: string; hash: string }[] = [];

      styleSets.push(styles);

      return {
        update(textContent, hash) {
          styles.push({ textContent, hash });
        },
      };
    },
    createGlobalStyle() {
      const style: { textContent: string } = { textContent: '' };

      return {
        update(textContent) {
          style.textContent = textContent;

          if (globalStyles.indexOf(style) < 0) {
            globalStyles.push(style);
          }
        },
        remove() {
          const i = globalStyles.indexOf(style);

          if (i >= 0) {
            globalStyles.splice(i, 1);
          }
        },
      };
    },
    renderStyles() {
      let html = '';

      for (let i = styleSets.length - 1; i >= 0; --i) {
        const styles = styleSets[i];

        for (let j = styles.length - 1; j >= 0; --j) {
          const { hash = '', textContent } = styles[j];
          html = '<style data-tss="' + hash + '">\n' + textContent + '\n</style>\n' + html;
        }

        styles.length = 0;
      }

      return html.trim();
    },
  };
}

function createManager(version: string): Manager {
  return typeof document === 'undefined' || isTest()
    ? createVirtualManager(version)
    : createDocumentManager(version, document);
}

function initManager(): Manager {
  const version = '[VI]{version}[/VI]';
  const globalObject = (
    typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {}
  ) as GlobalObject;

  if (globalObject.$$tss == null) {
    globalObject.$$tss = {};
  }

  if (
    globalObject.$$tss.styleManager == null ||
    compareVersions(version, globalObject.$$tss.styleManager.version) > 0
  ) {
    globalObject.$$tss.styleManager = createManager(version);
  }

  return globalObject.$$tss.styleManager;
}

const singleton = initManager();

export function getManager(): Manager {
  return singleton;
}

/**
 * Get a string containing all the `<style>` elements which have been
 * generated during SSR or testing.
 *
 * ```tsx
 * const appHtml = renderToString(<App />);
 * const stylesHtml = renderStylesToString();
 * ```
 *
 * **Note**: This will reset and clear all previously mounted styles.
 */
export function renderStylesToString(): string {
  return singleton.renderStyles();
}
