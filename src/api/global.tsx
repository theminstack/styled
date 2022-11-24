import { type FC, type ReactNode, useRef } from 'react';

import { useStyleEffect } from '../util/effect.js';
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
      const { cache, manager } = useStyledContext();
      const styleString = useStyleString(props);

      useStyleEffect(() => {
        const style = (styleElement.current = manager.addGlobalStyle());
        return () => style.remove();
      }, []);

      useStyleEffect(() => {
        if (styleElement.current) {
          // Not using a cache (aside from the effect deps) because...
          // - Large numbers of global styles are not expected.
          // - Frequent global styles changes are not expected.
          // - Parallel instances of one global style are not expected.
          styleElement.current.textContent = cache.resolveGlobal(styleString);
        }
      }, [styleString]);

      return <>{props.children}</>;
    };

    StyledGlobal.displayName = 'StyledGlobal';

    return StyledGlobal;
  };

  return global;
};

export { type StyledGlobal, type StyledGlobalComponent, createStyledGlobal };
