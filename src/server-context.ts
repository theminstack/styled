import { useMemo } from 'react';

import { createServerStylesheet } from './server-stylesheet';
import { type Stylesheet } from './stylesheet';

interface ServerContext {
  useLayoutEffect: (cb: () => (() => void) | void, deps?: unknown[]) => void;
  createStylesheet: () => Stylesheet;
}

function createServerContext(): ServerContext {
  const context = {
    useLayoutEffect: useMemo,
    createStylesheet: createServerStylesheet,
  };

  return context;
}

export { createServerContext };
