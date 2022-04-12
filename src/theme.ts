import { type ComponentType, type ProviderProps, createContext, createElement, useContext } from 'react';

/**
 * Create a theme context, with a hook for theme access, and a provider for
 * theme overriding.
 *
 * ```tsx
 * const [useTheme, ThemeProvider] = createTheme({ color: 'red' });
 * ```
 */
export function createTheme<TTheme extends {}>(
  defaultTheme: TTheme,
  providerDisplayName = '',
): [useTheme: () => TTheme, ThemeProvider: ComponentType<ProviderProps<TTheme>>] {
  const Context = createContext(defaultTheme);
  const useTheme = () => useContext(Context);
  const ThemeProvider = ({ children, ...props }: ProviderProps<TTheme>) =>
    createElement(Context.Provider, props, children);

  ThemeProvider.displayName = providerDisplayName || 'ThemeProvider';

  return [useTheme, ThemeProvider];
}
