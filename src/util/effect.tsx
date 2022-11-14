import * as React from 'react';

import { isBrowser } from './environment.js';

const useStyleEffect = isBrowser
  ? // Use an insertion (React >= 18) or layout effect in the browser.
    React.useInsertionEffect || React.useLayoutEffect
  : // Invoke immediately for SSR.
    (callback: () => void) => callback();

export { useStyleEffect };
