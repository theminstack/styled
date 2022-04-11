import { type ComponentType, type ProviderProps, createContext, createElement, useContext } from 'react';

/**
 * Create a theme hook and provider component.
 *
 * ```tsx
 * const [useTheme, ThemeProvider] = createTheme({ color: 'red' });
 * ```
 *
 * Use the theme in a styled component.
 *
 * ```tsx
 * const Styled = styled('div', () => ({ theme: useTheme() })`
 *   color: ${(props) => props.theme.color};
 * `;
 * ```
 *
 * Use the theme provider to override theme values. Using the provider
 * isn't necessary if you just want to use the default theme values.
 *
 * ```tsx
 * <ThemeProvider value={{ color: 'blue' }}>
 *   <StyledDiv />
 * </ThemeProvider>
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
