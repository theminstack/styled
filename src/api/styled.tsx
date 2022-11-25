import { type ComponentProps, type DetailedHTMLProps, type HTMLAttributes, type JSXElementConstructor } from 'react';

import { type StyledComponent, createStyledComponent } from './component.js';
import { type StyledGlobal, createStyledGlobal } from './global.js';
import { type StyledString, type StyledStringValue, string } from './string.js';

type StylableType<TProps> = JSXElementConstructor<TProps> | string | keyof JSX.IntrinsicElements;

type StylableTypeProps<TType extends StylableType<any>> = TType extends
  | JSXElementConstructor<any>
  | keyof JSX.IntrinsicElements
  ? ComponentProps<TType>
  : DetailedHTMLProps<HTMLAttributes<Element>, Element>;

type StyledTaggedTemplateFunction<TProps extends {}, TTheme extends {}> = {
  (template: TemplateStringsArray, ...values: readonly StyledStringValue<TProps, TTheme>[]): StyledComponent<TProps>;
  <TExtraProps extends {}>(
    template: TemplateStringsArray,
    ...values: readonly StyledStringValue<TExtraProps & TProps, TTheme>[]
  ): StyledComponent<TExtraProps & TProps>;
};

type Styled<TTheme extends {}> = {
  [P in keyof JSX.IntrinsicElements]: StyledTaggedTemplateFunction<StylableTypeProps<P>, TTheme>;
} & {
  <TType extends StylableType<any>>(type: TType): StyledTaggedTemplateFunction<StylableTypeProps<TType>, TTheme>;
  global: StyledGlobal<TTheme>;
  string: StyledString;
};

const EMPTY_THEME: any = {};

const createStyled = <TTheme extends {}>(useTheme: () => TTheme = () => EMPTY_THEME): Styled<TTheme> => {
  const styled = <TType extends StylableType<any>>(
    type: TType,
  ): StyledTaggedTemplateFunction<StylableTypeProps<TType>, TTheme> => {
    return (<TExtraProps extends {}>(
      template: TemplateStringsArray,
      ...values: StyledStringValue<StylableTypeProps<TType> & TExtraProps, TTheme>[]
    ): StyledComponent<StylableTypeProps<TType> & TExtraProps> => {
      return createStyledComponent(type, template.raw, values, useTheme);
    }) as StyledTaggedTemplateFunction<StylableTypeProps<TType>, TTheme>;
  };

  styled.global = createStyledGlobal(useTheme);
  styled.string = string;

  return new Proxy(styled, {
    apply: (target, _this, args: Parameters<typeof styled>) => {
      return target(...args);
    },
    get: (target, prop) => {
      return prop in target
        ? target[prop as keyof typeof target]
        : typeof prop === 'string' && prop !== 'then'
        ? target(prop)
        : undefined;
    },
  }) as Styled<TTheme>;
};

const styled = createStyled();

export { type Styled, createStyled, styled };
