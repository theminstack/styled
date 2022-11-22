import { type PropsWithChildren, createContext, useContext } from 'react';

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

const StyledProvider = ({ children, ...value }: PropsWithChildren<Partial<StyleContextValue>>): JSX.Element => {
  const defaultValue = useContext(StyledContext);
  return <StyledContext.Provider value={{ ...defaultValue, ...value }}>{children}</StyledContext.Provider>;
};

const useStyledContext = () => useContext(StyledContext);

export { StyledContext, StyledProvider, useStyledContext };
