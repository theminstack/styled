import { type ComponentProps, type ForwardRefExoticComponent, type JSXElementConstructor, type VFC } from 'react';

import { type StyleTemplateValues, createStyle } from './style.js';
import { createStyleStringCompiler } from './style-string-compiler.js';
import { createStyledComponent } from './styled-component.js';
import { createStyledGlobalComponent } from './styled-global-component.js';

/**
 * Intermediate tagged template function returned by the {@link Styled styled}
 * function.
 */
type StyleTaggedTemplateFunction<TProps extends {}, TTheme extends {} | undefined> = <TExtraProps extends {} = {}>(
  template: TemplateStringsArray,
  ...values: StyleTemplateValues<TExtraProps & TProps, readonly [TTheme]>
) => ForwardRefExoticComponent<TExtraProps & TProps>;

/**
 * Style mixin functions returned by the
 * {@link Styled.mixin styled.mixin} method.
 */
type StyleMixin<TProps extends {}> = {} extends TProps ? (props?: TProps) => string : (props: TProps) => string;

/**
 * The `styled` API returned by the {@link createStyled} factory function.
 *
 * Create's a styled component when called as a function.
 *
 * ```tsx
 * const StyledComponent = styled('div')``;
 * const StyledComponent = styled('div')<ExtraProps>``;
 * ```
 *
 * See also:
 *
 * - {@link Styled.global styled.global} for creating global styles
 * - {@link Styled.mixin styled.mixin} for creating style mixins.
 */
type Styled<TTheme extends {} | undefined> = {
  <TComponent extends JSXElementConstructor<any> | keyof JSX.IntrinsicElements>(
    component: TComponent,
    displayName?: string,
  ): StyleTaggedTemplateFunction<ComponentProps<TComponent>, TTheme>;

  /**
   * Create a global style component.
   *
   * ```tsx
   * const GlobalStyle = styled.global``;
   * const GlobalStyle = styled.global<Props>``;
   * ```
   */
  readonly global: <TExtraProps extends {} = {}>(
    template: TemplateStringsArray,
    ...values: StyleTemplateValues<TExtraProps, readonly [TTheme]>
  ) => VFC<TExtraProps>;

  /**
   * Create a style mixin function.
   *
   * A style "mixin" is a function which returns a style string.
   *
   * ```tsx
   * const mixin = styled.mixin``;
   * const mixin = styled.mixin<Props>``;
   * ```
   */
  readonly mixin: <TProps extends {}>(
    template: TemplateStringsArray,
    ...values: StyleTemplateValues<TProps>
  ) => StyleMixin<TProps>;
};

/**
 * Create a {@link Styled styled} API, with an optional theme.
 */
const createStyled = <TTheme extends {} | undefined>(
  useTheme: () => TTheme = () => undefined as TTheme,
): Styled<TTheme> => {
  const styleCompiler = createStyleStringCompiler();

  const styled = <
    TComponent extends JSXElementConstructor<any> | keyof JSX.IntrinsicElements,
    TProps extends ComponentProps<TComponent>,
  >(
    baseComponent: TComponent,
  ): StyleTaggedTemplateFunction<ComponentProps<TComponent>, TTheme> => {
    return <TExtraProps extends Partial<TProps>>(
      template: TemplateStringsArray,
      ...values: StyleTemplateValues<TExtraProps & TProps, readonly [TTheme]>
    ): ForwardRefExoticComponent<TExtraProps & TProps> => {
      const style = createStyle(template, values);
      const component = createStyledComponent(styleCompiler, style, useTheme, baseComponent);

      return component;
    };
  };

  styled.global = <TProps extends {}>(
    template: TemplateStringsArray,
    ...values: StyleTemplateValues<TProps, readonly [TTheme]>
  ): VFC<TProps> => {
    const style = createStyle(template, values);
    const component = createStyledGlobalComponent(styleCompiler, style, useTheme);

    return component;
  };

  styled.mixin = <TProps extends {}>(
    template: TemplateStringsArray,
    ...values: StyleTemplateValues<TProps>
  ): StyleMixin<TProps> => {
    const style = createStyle(template, values);
    const mixin: StyleMixin<TProps> = (props = {} as TProps) => style.getString(props);

    return mixin;
  };

  return styled;
};

const styled = createStyled();

export { type Styled, type StyleMixin, type StyleTaggedTemplateFunction, createStyled, styled };
