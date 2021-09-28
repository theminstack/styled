import { ComponentType, createContext, createElement, ReactElement, ReactNode, useContext } from 'react';

export type ThemeProviderProps<TTheme extends Record<string, unknown>> = {
  value: Partial<TTheme> | ((current: TTheme) => Partial<TTheme>);
  children?: ReactNode;
};

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
export function createTheme<TTheme extends Record<string, unknown>>(
  value: TTheme,
  providerDisplayName = '',
): [useTheme: () => TTheme, ThemeProvider: ComponentType<ThemeProviderProps<TTheme>>] {
  const Context = createContext(value);
  const useTheme = () => useContext(Context);

  function ThemeProvider(props: ThemeProviderProps<TTheme>): ReactElement {
    const { value: newThemeOrFactory, children } = props;
    const theme = useTheme();
    const newPartialTheme = typeof newThemeOrFactory === 'function' ? newThemeOrFactory(theme) : newThemeOrFactory;
    const newTheme = { ...theme } as TTheme;
    const keys = Object.keys(newPartialTheme);

    for (let i = keys.length - 1; i >= 0; --i) {
      const key = keys[i];
      const newValue = newPartialTheme[key];

      if (newValue !== undefined) {
        newTheme[key as keyof TTheme] = newValue;
      }
    }

    return createElement(Context.Provider, { value: newTheme }, children);
  }

  ThemeProvider.displayName = providerDisplayName || 'ThemeProvider';

  return [useTheme, ThemeProvider];
}
