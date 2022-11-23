import { type ComponentProps, type DetailedHTMLProps, type HTMLAttributes, type JSXElementConstructor } from 'react';

import { type StyledExoticComponent, createStyledComponent } from './component.js';
import { type StyledGlobal, createStyledGlobal } from './global.js';
import { type StyledString, type StyledStringValue, getStyleStringHook, string } from './string.js';

type StyledBase = {
  readonly component: StylableType<any>;
  readonly template: readonly string[];
  readonly values: readonly StyledStringValue<any, any>[];
};

type StylableType<TProps> = JSXElementConstructor<TProps> | string | keyof JSX.IntrinsicElements;

type StylableTypeProps<TType extends StylableType<any>> = TType extends
  | JSXElementConstructor<any>
  | keyof JSX.IntrinsicElements
  ? ComponentProps<TType>
  : DetailedHTMLProps<HTMLAttributes<Element>, Element>;

type StyledComponent<TProps> = StyledExoticComponent<TProps> & { readonly $$rms: StyledBase };

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
    const styledTaggedTemplateFunction = <TExtraProps extends {}>(
      template: TemplateStringsArray,
      ...values: StyledStringValue<StylableTypeProps<TType> & TExtraProps, TTheme>[]
    ): StyledComponent<StylableTypeProps<TType> & TExtraProps> => {
      const base = typeof type !== 'string' && '$$rms' in type ? (type as any).$$rms : undefined;
      const component = base?.component ?? type;
      const useStyleString = base
        ? getStyleStringHook([...template.raw, ...base.template], [...values, '', ...base.values], useTheme)
        : getStyleStringHook(template.raw, values, useTheme);

      const Styled = createStyledComponent({ component, useStyleString });

      return Object.assign(Styled as StyledExoticComponent<StylableTypeProps<TType> & TExtraProps>, {
        $$rms: { component, template, values },
      });
    };

    return styledTaggedTemplateFunction as StyledTaggedTemplateFunction<StylableTypeProps<TType>, TTheme>;
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

export { type Styled, type StyledComponent, createStyled, styled };
