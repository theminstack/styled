import { useLayoutEffect } from 'react';

import { createBrowserStylesheet } from './browser-stylesheet';
import { type Stylesheet } from './stylesheet';

interface BrowserContext {
  createStylesheet: () => Stylesheet;
  useLayoutEffect: (cb: () => (() => void) | void, deps?: unknown[]) => void;
  rehydrate: () => void;
}

function createBrowserContext(): BrowserContext {
  let isRehydrated = false;

  const context = {
    createStylesheet: createBrowserStylesheet,
    useLayoutEffect,
    rehydrate: () => {
      if (!isRehydrated) {
        isRehydrated = true;
        const styles = document.querySelectorAll('body style[data-tss]');

        requestAnimationFrame(() => {
          for (let i = styles.length - 1; i >= 0; --i) {
            const style = styles[i];
            style.parentElement?.removeChild(style);
          }
        });
      }
    },
  };

  return context;
}

export { createBrowserContext };
