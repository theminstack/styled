import { type FC, type ReactNode, useRef } from 'react';

import { useStyledContext } from './context.js';
import { type StyleElement } from './manager.js';
import { type StyledStringValue, getStyleStringHook } from './string.js';

type StyledGlobalComponent<TProps extends {}> = FC<TProps>;

type StyledGlobal<TTheme> = <TProps extends {}>(
  template: TemplateStringsArray,
  ...values: readonly StyledStringValue<TProps, TTheme>[]
) => StyledGlobalComponent<TProps>;

const createStyledGlobal = <TTheme,>(useTheme: () => TTheme): StyledGlobal<TTheme> => {
  const global = <TProps,>(template: TemplateStringsArray, ...values: StyledStringValue<TProps, TTheme>[]) => {
    const useStyleString = getStyleStringHook(template.raw, values, useTheme);
    const StyledGlobal = (props: TProps & { children?: ReactNode }): JSX.Element => {
      const styleElement = useRef<StyleElement | undefined>();
      const styleString = useStyleString(props);
      const { cache, manager } = useStyledContext();
      const useEffect = manager.useEffect;

      useEffect(() => {
        const style = (styleElement.current = manager.addGlobalStyle());
        return () => style.remove();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      useEffect(() => {
        if (styleElement.current) {
          styleElement.current.textContent = cache.resolveGlobal(styleString);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [styleString]);

      return <>{props.children}</>;
    };

    StyledGlobal.displayName = 'StyledGlobal';

    return StyledGlobal;
  };

  return global;
};

export { type StyledGlobal, type StyledGlobalComponent, createStyledGlobal };
