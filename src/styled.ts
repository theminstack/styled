import { type ComponentProps, type ComponentType, type JSXElementConstructor } from 'react';

import { type StyleTemplateValues, createStyle } from './style';
import { createStyleStringCompiler } from './style-string-compiler';
import { type StyledComponent, createStyledComponent } from './styled-component';
import { createStyledGlobalComponent } from './styled-global-component';

type StyledTemplate<TProps extends {}, TTheme extends {} | undefined> = <TExtraProps extends {} = {}>(
  template: TemplateStringsArray,
  ...values: StyleTemplateValues<TProps & TExtraProps, [TTheme]>
) => StyledComponent<TProps & TExtraProps>;

type StyledMixin<TProps extends {}> = {} extends TProps ? (props?: TProps) => string : (props: TProps) => string;

/**
 * Create a styled component.
 *
 * ```tsx
 * const Styled = styled('div')``;
 * const Styled = styled('div')<ExtraProps>``;
 * ```
 */
interface Styled<TTheme extends {} | undefined> {
  <TComponent extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>>(
    component: TComponent,
    displayName?: string,
  ): StyledTemplate<ComponentProps<TComponent>, TTheme>;

  /**
   * Create a global style component.
   *
   * ```tsx
   * const Global = styled.global``;
   * const Global = styled.global<Props>``;
   * ```
   */
  global: <TExtraProps extends {} = {}>(
    template: TemplateStringsArray,
    ...values: StyleTemplateValues<TExtraProps, [TTheme]>
  ) => ComponentType<TExtraProps>;

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
  mixin: <TProps extends {}>(
    template: TemplateStringsArray,
    ...values: StyleTemplateValues<TProps>
  ) => StyledMixin<TProps>;
}

/**
 * Create a `styled` function/namespace, with an optional theme.
 *
 * ```tsx
 * const styled = createStyled();
 * const styled = createStyled(useTheme);
 * ```
 *
 * Once created, use the API as follows.
 *
 * ```tsx
 * const Styled = styled('div')``;
 * const Styled = styled('div')<ExtraProps>``;
 * const Global = styled.global``;
 * const Global = styled.global<ExtraProps>``;
 * ```
 */
function createStyled<TTheme extends {} | undefined>(
  useTheme: () => TTheme = () => undefined as TTheme,
): Styled<TTheme> {
  const styleCompiler = createStyleStringCompiler();

  function styled<
    TComponent extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
    TProps extends ComponentProps<TComponent>,
  >(baseComponent: TComponent): StyledTemplate<ComponentProps<TComponent>, TTheme> {
    return <TExtraProps extends Partial<TProps>>(
      template: TemplateStringsArray,
      ...values: StyleTemplateValues<TProps & TExtraProps, [TTheme]>
    ): StyledComponent<TProps & TExtraProps> => {
      const style = createStyle(template, values);
      const component = createStyledComponent(styleCompiler, style, useTheme, baseComponent);

      return component;
    };
  }

  styled.global = <TProps extends {}>(
    template: TemplateStringsArray,
    ...values: StyleTemplateValues<TProps, [TTheme]>
  ): ComponentType<TProps> => {
    const style = createStyle(template, values);
    const component = createStyledGlobalComponent(styleCompiler, style, useTheme);

    return component;
  };

  styled.mixin = <TProps extends {}>(
    template: TemplateStringsArray,
    ...values: StyleTemplateValues<TProps>
  ): StyledMixin<TProps> => {
    const style = createStyle(template, values);
    const mixin: StyledMixin<TProps> = (props = {} as TProps) => style.getString(props);

    return mixin;
  };

  return styled;
}

export { type Styled, type StyledMixin, type StyledTemplate, createStyled };
