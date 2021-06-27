import { createContext, createElement, ReactElement, ReactNode, useContext } from 'react';

export interface IThemeProviderProps<TTheme extends Record<string, any>> {
  value: TTheme | ((current: TTheme) => TTheme);
  children?: ReactNode;
}
export type ThemeHook<TTheme> = () => TTheme;
export type ThemeProvider<TTheme> = (props: IThemeProviderProps<TTheme>) => ReactElement;

/**
 * Create a theme hook and provider component.
 *
 * ```tsx
 * const [useTheme, ThemeProvider] = createTheme({
 *   color: 'red',
 * });
 *
 * const Foo = styled('div')
 *   .use(() => ({
 *     theme: useTheme()
 *   })`
 *     color: ${(props) => props.theme.color};
 *   `;
 *
 * render(
 *   <ThemeProvider value={{ color: 'blue' }}>
 *     <Foo />
 *   </ThemeProvider>
 * );
 * ```
 */
export function createTheme<TTheme extends Record<string, any>>(
  defaultValue: TTheme,
): [ThemeHook<TTheme>, ThemeProvider<TTheme>] {
  const Context = createContext(defaultValue);
  const useTheme = () => useContext(Context);

  function Provider(props: IThemeProviderProps<TTheme>): ReactElement {
    const { value, children } = props;
    const theme = useTheme();

    return createElement(
      Context.Provider,
      { value: typeof value === 'function' ? (value as Function)(theme) : value },
      children,
    );
  }

  return [useTheme, Provider];
}
