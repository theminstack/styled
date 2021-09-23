import { ComponentType, JSXElementConstructor } from 'react';
import { Resolve } from '../utilities/Resolve';
import { css, StyledTemplateProps, StyledTemplateValues } from '../utilities/css';
import { getDocument } from './Document';
import { createStyledCompiler } from './StyledCompiler';
import { createStyledComponent, StyledComponent, StyledComponentProps } from './StyledComponent';
import { StyledGlobalComponent, createStyledGlobalComponent } from './StyledGlobalComponent';
import { createStyledState } from './StyledState';

const doc = getDocument();

type StyledTemplate<TProps extends Record<string, unknown>, TTheme extends Record<string, unknown> | undefined> = <
  TExtraProps extends Partial<TProps> & Record<string, any> = {},
>(
  template: TemplateStringsArray,
  ...values: StyledTemplateValues<TProps & TExtraProps, TTheme>
) => StyledComponent<Resolve<TProps & TExtraProps>>;

type StyledGlobalTemplate<TTheme extends Record<string, unknown> | undefined> = <
  TExtraProps extends Record<string, unknown> = {},
>(
  template: TemplateStringsArray,
  ...values: StyledTemplateValues<TExtraProps, TTheme>
) => StyledGlobalComponent<TExtraProps>;

/**
 * Create a styled component.
 *
 * ```tsx
 * const Styled = styled('div')``;
 * const Styled = styled('div')<ExtraProps>``;
 * ```
 */
export type Styled<TTheme extends Record<string, unknown> | undefined> = {
  <TComponent extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>>(
    component: TComponent,
    displayName?: string,
  ): StyledTemplate<StyledComponentProps<TComponent>, TTheme>;

  /**
   * Create a global style component.
   *
   * ```tsx
   * const Global = styled.global``;
   * const Global = styled.global<Props>``;
   * ```
   */
  global: StyledGlobalTemplate<TTheme>;
};

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
export function createStyled<TTheme extends Record<string, unknown> | undefined>(
  useTheme: () => TTheme = () => undefined as TTheme,
): Styled<TTheme> {
  const compiler = createStyledCompiler();

  function styled<
    TComponent extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
    TProps extends StyledComponentProps<TComponent>,
  >(component: TComponent, displayName?: string): StyledTemplate<StyledComponentProps<TComponent>, TTheme> {
    const state = createStyledState();

    return <TExtraProps extends Partial<TProps> & Record<string, unknown>>(
      template: TemplateStringsArray,
      ...values: StyledTemplateValues<TProps & TExtraProps, TTheme>
    ): StyledComponent<Resolve<TProps & TExtraProps>> =>
      createStyledComponent<TComponent, TProps & TExtraProps, TTheme>(
        doc,
        compiler,
        state,
        useTheme,
        css<StyledTemplateProps<TProps & TExtraProps, TTheme>>(template, ...values),
        component,
        displayName,
      );
  }

  styled.global = <TProps extends Record<string, unknown>>(
    template: TemplateStringsArray,
    ...values: StyledTemplateValues<TProps, TTheme>
  ): ComponentType<TProps> => {
    const state = createStyledState();

    return createStyledGlobalComponent<TProps, TTheme>(
      doc,
      compiler,
      state,
      useTheme,
      css<StyledTemplateProps<TProps, TTheme>>(template, ...values),
    );
  };

  return styled;
}
