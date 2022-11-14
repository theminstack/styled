import { useMemo } from 'react';

import { createServerStylesheet } from './server-stylesheet.js';
import { type Stylesheet } from './stylesheet.js';

type ServerContext = {
  readonly createStylesheet: () => Stylesheet;
  readonly useLayoutEffect: (callback: () => (() => void) | void, deps?: readonly unknown[]) => void;
};

const createServerContext = (): ServerContext => {
  const context = {
    createStylesheet: createServerStylesheet,
    useLayoutEffect: (callback: () => void, deps?: readonly unknown[]) => useMemo(callback, deps),
  };

  return context;
};

export { createServerContext };
