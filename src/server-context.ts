import { createServerStylesheet } from './server-stylesheet';
import { type Stylesheet } from './stylesheet';

type ServerContext = {
  readonly createStylesheet: () => Stylesheet;
  readonly useLayoutEffect: (callback: () => (() => void) | void, deps?: readonly unknown[]) => void;
};

const createServerContext = (): ServerContext => {
  const context = {
    createStylesheet: createServerStylesheet,
    useLayoutEffect: (callback: () => void) => callback(),
  };

  return context;
};

export { createServerContext };
