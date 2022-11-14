import { useLayoutEffect } from 'react';

import { createBrowserStylesheet } from './browser-stylesheet.js';
import { type Stylesheet } from './stylesheet.js';

type BrowserContext = {
  readonly createStylesheet: () => Stylesheet;
  readonly rehydrate: () => void;
  readonly useLayoutEffect: (callback: () => (() => void) | void, deps?: readonly unknown[]) => void;
};

const createBrowserContext = (): BrowserContext => {
  let isRehydrated = false;

  const context = {
    createStylesheet: createBrowserStylesheet,
    rehydrate: () => {
      if (!isRehydrated) {
        isRehydrated = true;
        const styles = document.querySelectorAll('body style[data-tss]');

        requestAnimationFrame(() => {
          for (let index = styles.length - 1; index >= 0; --index) {
            const style = styles[index];
            style.parentElement?.removeChild(style);
          }
        });
      }
    },
    useLayoutEffect,
  };

  return context;
};

export { createBrowserContext };
