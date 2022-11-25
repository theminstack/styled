import { type PropsWithChildren, createContext, useContext, useMemo, useRef } from 'react';

import { environment } from '../util/environment.js';
import { type StyledCache, defaultStyledCache } from './cache.js';
import { type StyledManager, defaultStyledManager } from './manager.js';
import { type StyledRenderer, defaultStyledRenderer } from './renderer.js';

type StyleContextValue = {
  readonly cache: StyledCache;
  readonly manager: StyledManager;
  readonly renderer: StyledRenderer;
};

const StyledContext = createContext<StyleContextValue>({
  cache: defaultStyledCache,
  manager: defaultStyledManager,
  renderer: defaultStyledRenderer,
});

const StyledProvider = ({
  children,
  cache,
  manager,
  renderer,
}: PropsWithChildren<Partial<StyleContextValue>>): JSX.Element => {
  const defaultValue = useContext(StyledContext);
  const memoizedValue = useMemo(
    () => ({
      cache: cache ?? defaultValue.cache,
      manager: manager ?? defaultValue.manager,
      renderer: renderer ?? defaultValue.renderer,
    }),
    [defaultValue, cache, manager, renderer],
  );

  return <StyledContext.Provider value={memoizedValue}>{children}</StyledContext.Provider>;
};

const useStyledContext = () => {
  const context = useContext(StyledContext);
  const initial = useRef(context).current;

  if (context !== initial) {
    const error = new Error('Styled context mutation is not allowed');
    if (environment !== 'production') throw error;
    console.error(error);
  }

  return initial;
};

export { StyledContext, StyledProvider, useStyledContext };
