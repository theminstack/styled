import { type PropsWithChildren, createContext, useContext } from 'react';

import { type StyleCache, defaultStyleCache } from './cache.js';
import { type StyleManager, defaultStyleManager } from './manager.js';
import { type Renderer, defaultRenderer } from './renderer.js';

type StyleContextValue = {
  readonly cache: StyleCache;
  readonly manager: StyleManager;
  readonly renderer: Renderer;
};

const StyledContext = createContext<StyleContextValue>({
  cache: defaultStyleCache,
  manager: defaultStyleManager,
  renderer: defaultRenderer,
});

const StyledProvider = ({ children, ...value }: PropsWithChildren<Partial<StyleContextValue>>): JSX.Element => {
  const defaultValue = useContext(StyledContext);
  return <StyledContext.Provider value={{ ...defaultValue, ...value }}>{children}</StyledContext.Provider>;
};

const useStyledContext = () => useContext(StyledContext);

export { StyledContext, StyledProvider, useStyledContext };
