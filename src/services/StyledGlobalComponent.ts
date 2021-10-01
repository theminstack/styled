import { ComponentType, useEffect, useLayoutEffect, useMemo } from 'react';
import { StyledTemplateProps } from '../utilities/css';
import { Compiler } from './Compiler';
import { Manager } from './Manager';

export type StyledGlobalComponent<TProps> = ComponentType<TProps> & {
  propDefaults?: Partial<TProps>;
};

export function createStyledGlobalComponent<
  TProps extends Record<string, unknown>,
  TTheme extends Record<string, unknown> | undefined,
>(
  manager: Manager,
  compiler: Compiler,
  useTheme: () => TTheme | undefined,
  getStyleString: (props: StyledTemplateProps<TProps, TTheme>) => string,
): StyledGlobalComponent<TProps> {
  const useStyleEffect = typeof document === 'undefined' ? useMemo : useLayoutEffect;
  const StyledGlobal = ((props: TProps): null => {
    if (StyledGlobal.propDefaults != null) {
      props = { ...StyledGlobal.propDefaults, ...props };
    }

    const theme = useTheme();
    const style = useMemo(() => manager.createGlobalStyle(), []);
    const styleProps = (theme != null ? { ...props, theme } : props) as StyledTemplateProps<TProps, TTheme>;
    const styleString = getStyleString(styleProps);

    useStyleEffect(() => style.update(compiler.compile(':root', styleString)), [style, styleString]);
    useEffect(() => style.remove, [style]);
    useEffect(() => manager.rehydrate(), []);

    return null;
  }) as StyledGlobalComponent<TProps>;

  StyledGlobal.displayName = '$$tss(style)';

  return StyledGlobal;
}
