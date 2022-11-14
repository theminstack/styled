/* eslint-disable no-var */

import { isBrowser } from '../util/environment.js';

declare global {
  var $$rmsSsr:
    | {
        c: StyleElement[] | undefined;
        g: StyleElement[] | undefined;
      }
    | undefined;
}

type StyleElement = { textContent: string | null };

if (!('$$rmsSsr' in globalThis)) {
  Object.defineProperty(globalThis, '$$rmsSsr', {
    configurable: false,
    enumerable: false,
    value: undefined,
    writable: true,
  });
}

const ssr = <TRendered,>(renderToString: () => TRendered): [rendered: TRendered, styles: string[]] => {
  if (globalThis.$$rmsSsr) throw new Error('Nested ssr() calls are not supported');
  if (isBrowser) throw new Error('SSR is not supported in the browser');

  const c: StyleElement[] = [];
  const g: StyleElement[] = [];

  globalThis.$$rmsSsr = { c, g };

  try {
    const rendered = renderToString();

    return [
      rendered,
      [
        ...g.flatMap((style) => (style.textContent ? [style.textContent] : [])),
        ...c.flatMap((style) => (style.textContent ? [style.textContent] : [])),
      ],
    ];
  } finally {
    globalThis.$$rmsSsr = undefined;
  }
};

export { ssr };
