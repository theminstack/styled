import { type ComponentProps, type DetailedHTMLProps, type HTMLAttributes, type JSXElementConstructor } from 'react';

import { type StyledComponent, type StyledComponentConfig, createStyledComponent } from './component.js';
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
  withConfig: (config: StyledComponentConfig) => StyledTaggedTemplateFunction<TProps, TTheme>;
};

type Styled<TTheme extends {}> = {
  [P in keyof JSX.IntrinsicElements]: StyledTaggedTemplateFunction<StylableTypeProps<P>, TTheme>;
} & {
  <TType extends StylableType<any>>(type: TType): StyledTaggedTemplateFunction<StylableTypeProps<TType>, TTheme>;
  global: StyledGlobal<TTheme>;
  string: StyledString;
};

const EMPTY_THEME: any = {};

const createTaggedTemplateFunction = <
  TType extends StylableType<any>,
  TProps extends StylableTypeProps<TType>,
  TTheme extends {},
>(
  type: TType,
  useTheme: () => TTheme,
  config?: StyledComponentConfig,
): StyledTaggedTemplateFunction<TProps, TTheme> => {
  return Object.assign(
    <TExtraProps extends {}>(
      template: TemplateStringsArray,
      ...values: StyledStringValue<TExtraProps & TProps, TTheme>[]
    ): StyledComponent<TExtraProps & TProps> => createStyledComponent(type, template.raw, values, useTheme, config),
    {
      withConfig: (newConfig: StyledComponentConfig) =>
        createTaggedTemplateFunction(type, useTheme, { ...config, ...newConfig }),
    },
  ) as StyledTaggedTemplateFunction<TProps, TTheme>;
};

const createStyled = <TTheme extends {}>(useTheme: () => TTheme = () => EMPTY_THEME): Styled<TTheme> => {
  const styled = <TType extends StylableType<any>>(type: TType) => createTaggedTemplateFunction(type, useTheme);
  styled.global = createStyledGlobal(useTheme);
  styled.string = string;

  return new Proxy(styled, {
    apply: (target, _this, args: Parameters<typeof styled>) => target(...args),
    get: (target, prop) =>
      prop in target
        ? target[prop as keyof typeof target]
        : typeof prop === 'string' && prop !== 'then'
        ? target(prop)
        : undefined,
  }) as Styled<TTheme>;
};

const styled = createStyled();

export { type Styled, createStyled, styled };
