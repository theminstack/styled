import { createContext, createElement, ReactElement, ReactNode, useContext } from 'react';

export interface IThemeProviderProps<TTheme extends Record<string, any>> {
  value: TTheme | ((current: TTheme) => TTheme);
  children?: ReactNode;
}
export type ThemeHook<TTheme> = () => TTheme;
export type ThemeProvider<TTheme> = (props: IThemeProviderProps<TTheme>) => ReactElement;

/**
 * Create a theme hook and provider component.
 */
export function createTheme<TTheme extends Record<string, any>>(
  defaultValue: TTheme,
): [ThemeHook<TTheme>, ThemeProvider<TTheme>] {
  const Context = createContext(defaultValue);
  const useTheme = () => useContext(Context);

  function Provider({ value, children }: IThemeProviderProps<TTheme>): ReactElement {
    const theme = useTheme();

    return createElement(Context.Provider, { value: typeof value === 'function' ? value(theme) : value }, children);
  }

  return [useTheme, Provider];
}
