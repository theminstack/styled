import { type Context, type ProviderProps, type VFC, createContext, useContext } from 'react';

/**
 * Create a React theme hook function and provider component.
 *
 * ```tsx
 * const [useTheme, ThemeProvider, ThemeContext] = createReactTheme({ color: 'red' });
 * ```
 */
function createReactTheme<TTheme extends {}>(
  defaultTheme: TTheme,
): readonly [useTheme: () => TTheme, ThemeProvider: VFC<ProviderProps<TTheme>>, ThemeContext: Context<TTheme>];
/**
 * @deprecated `displayName` is no longer supported and has no effect.
 * @ignore
 */
function createReactTheme<TTheme extends {}>(
  defaultTheme: TTheme,
  displayName?: string,
): readonly [useTheme: () => TTheme, ThemeProvider: VFC<ProviderProps<TTheme>>, ThemeContext: Context<TTheme>];
// eslint-disable-next-line func-style
function createReactTheme<TTheme extends {}>(
  defaultTheme: TTheme,
): readonly [useTheme: () => TTheme, ThemeProvider: VFC<ProviderProps<TTheme>>, ThemeContext: Context<TTheme>] {
  const ThemeContext = createContext(defaultTheme);
  const useTheme = () => useContext(ThemeContext);

  return [useTheme, ThemeContext.Provider, ThemeContext];
}

/**
 * @deprecated Use {@link createReactTheme} instead.
 * @ignore
 */
const createTheme = createReactTheme;

export { createReactTheme, createTheme };
