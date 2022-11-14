import { type JSXElementConstructor } from 'react';

import { type Style } from './style.js';

type StyledComponentCacheItem = {
  readonly component: JSXElementConstructor<any> | keyof JSX.IntrinsicElements;
  readonly style: Style<any, any>;
};

type StyledComponentCache = {
  readonly get: (component: JSXElementConstructor<any>) => StyledComponentCacheItem | undefined;
  readonly register: (
    component: JSXElementConstructor<any>,
    baseComponent: JSXElementConstructor<any> | keyof JSX.IntrinsicElements,
    style: Style<any, any>,
  ) => void;
};

const createStyledComponentCache = (): StyledComponentCache => {
  const entries = new WeakMap<JSXElementConstructor<any>, StyledComponentCacheItem>();

  return {
    get: (component) => {
      return entries.get(component);
    },
    register: (styledComponent, component, style) => {
      entries.set(styledComponent, { component, style });
    },
  };
};

export { type StyledComponentCache, createStyledComponentCache };
