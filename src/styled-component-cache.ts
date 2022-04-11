import { type JSXElementConstructor } from 'react';

import { type Style } from './style';

interface StyledComponentCacheItem {
  component: keyof JSX.IntrinsicElements | JSXElementConstructor<any>;
  style: Style<any, any>;
}

interface StyledComponentCache {
  register: (
    component: JSXElementConstructor<any>,
    baseComponent: keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
    style: Style<any, any>,
  ) => void;
  get: (component: JSXElementConstructor<any>) => StyledComponentCacheItem | undefined;
}

function createStyledComponentCache(): StyledComponentCache {
  const entries = new WeakMap<JSXElementConstructor<any>, StyledComponentCacheItem>();

  return {
    register: (styledComponent, component, style) => {
      entries.set(styledComponent, { component, style });
    },
    get: (component) => {
      return entries.get(component);
    },
  };
}

export { type StyledComponentCache, createStyledComponentCache };
