import { type ComponentType, createElement } from 'react';

type StyledRenderer = {
  readonly render: (
    component: ComponentType<any> | string,
    props: any,
    ...children: readonly any[]
  ) => JSX.Element | null;
};

const createStyledRenderer = (): StyledRenderer => {
  return {
    render: (component, props, ...children): JSX.Element | null => {
      return createElement(component as ComponentType<any> | keyof JSX.IntrinsicElements, props, children);
    },
  };
};

const defaultStyledRenderer = createStyledRenderer();

export { type StyledRenderer, createStyledRenderer, defaultStyledRenderer };
