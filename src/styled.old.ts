/* eslint-disable */
/*import { ComponentType, createElement, ReactHTML, ReactNode } from 'react';
import { styledComponentMarker } from './constants';
import getId from './utils/getId';
import getStyleText from './utils/getStyleText';
import { IStyledComponent } from './types/IStyledComponent';
import { StyleValue } from './types/StyleValue';

type UnknownProps = { className?: string; [key: string]: unknown };

function getStyledTaggedTemplateFunction(
  type: string | ComponentType,
  displayName?: string,
  partialProps: (Record<string, unknown> | ((props: Record<string, unknown>) => Record<string, unknown>))[] = [],
): StyledTaggedTemplateFunction<any> {
  return Object.assign(
    (template: TemplateStringsArray, ...values: unknown[]): IStyledComponent<Record<string, unknown>> => {
      const id = getId(displayName);
      const StyledComponent = (props: Record<string, unknown>) => {
        props = partialProps.reduce<Record<string, unknown>>(
          (current, next) => (typeof next === 'function' ? next(current) : { ...current, ...next }),
          props,
        );
        props.className = props.className ? `${props.className} ${id}` : id;

        const element = createElement(type, props);

        return element;
      };

      return Object.assign(StyledComponent, { [styledComponentMarker]: true as const });
    },
    {
      attrs(partialProps: UnknownProps | ((props: UnknownProps) => {})): StyledTaggedTemplateFunction<any>;,
    },
  );
}

function getStyledComponent(
  type: string | ComponentType,
  styleText: string,
  partialProps: any[] = [],
): IStyledComponent<any> {
  const wrapper = (props: { className?: string; children: ReactNode }) => {
    const componentProps = partialProps.reduce<{ className?: string }>(
      (acc, value) => (typeof value === 'function' ? { ...acc, ...value(acc) } : { ...acc, ...value }),
      props,
    );

    return createElement<{ className?: string }>(type, componentProps, children);
  };

  wrapper.displayName = `$$styled_${typeof type === 'string' ? type : type.displayName ?? type.name}`;
  wrapper.props = (newPartialProps: any) => getStyledComponent(type, styleText, [...partialProps, newPartialProps]);

  return wrapper;
}

export interface StyledFunction {
  <TTag extends keyof ReactHTML>(tag: TTag, displayName?: string): StyledTaggedTemplateFunction<HTMLProps<TTag>>;
  <TProps extends {}>(
    component: keyof ReactHTML | ComponentType<TProps>,
    displayName?: string,
  ): StyledTaggedTemplateFunction<TProps>;
  global: StyleTemplateFunction;
}

const styled: StyledFunction = Object.assign(
  (type: string | ComponentType, displayName?: string): StyledTaggedTemplateFunction<any> => {
    return (template: TemplateStringsArray, ...values: unknown[]) => {
      const styleText = getStyleText(template, values);
      const styleText = String.raw(template, ...values.map((value) => (value == null ? '' : value)));
      return getStyledComponent(type, styleText);
    };
  },
  {
    global: <TProps>(template: TemplateStringsArray, ...values: StyleValue<TProps>[]): string => {
      return '';
    },
  },
);

export default styled;
*/
export {};