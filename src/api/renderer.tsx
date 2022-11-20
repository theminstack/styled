import { type ComponentType, createElement } from 'react';

type Renderer = {
  readonly render: (
    component: ComponentType<any> | string,
    props: any,
    ...children: readonly any[]
  ) => JSX.Element | null;
};

const createRenderer = (): Renderer => {
  return {
    render: (component, props, ...children): JSX.Element | null => {
      return createElement(component as ComponentType<any> | keyof JSX.IntrinsicElements, props, children);
    },
  };
};

const defaultRenderer = createRenderer();

export { type Renderer, createRenderer, defaultRenderer };
