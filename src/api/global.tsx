import { type FC, type ReactNode, useRef } from 'react';

import { compile } from '../syntax/compile.js';
import { format } from '../syntax/format.js';
import { useStyleEffect } from '../util/effect.js';
import { type StyleElement, dom } from './dom.js';
import { type StyledStringValue, getStyleStringHook } from './string.js';

type StyledGlobalComponent<TProps extends {}> = FC<TProps>;

type StyledGlobal<TTheme extends {}> = <TProps extends {}>(
  template: TemplateStringsArray,
  ...values: StyledStringValue<TProps, TTheme>[]
) => StyledGlobalComponent<TProps>;

const createStyledGlobal = <TTheme extends {}>(useTheme: () => TTheme): StyledGlobal<TTheme> => {
  const global = <TProps extends {}>(
    template: TemplateStringsArray,
    ...values: StyledStringValue<TProps, TTheme>[]
  ) => {
    const useStyleString = getStyleStringHook(template.raw, values, useTheme);
    const StyledGlobal = (props: TProps & { children?: ReactNode }): JSX.Element => {
      const styleElement = useRef<StyleElement | undefined>();
      const styleString = useStyleString(props);

      useStyleEffect(() => {
        const style = (styleElement.current = dom.addGlobalStyle());
        return () => style.remove();
      }, []);

      useStyleEffect(() => {
        if (styleElement.current) {
          // Not using a cache (aside from the effect deps) because...
          // - Large numbers of global styles are not expected.
          // - Frequent global styles changes are not expected.
          // - Parallel instances of one global style are not expected.
          styleElement.current.textContent = format(compile(styleString));
        }
      }, [styleString]);

      return <>{props.children}</>;
    };

    StyledGlobal.displayName = 'StyledGlobal';

    return StyledGlobal;
  };

  return global;
};

export { type StyledGlobal, createStyledGlobal };
