import { type ReactElement, type VFC, useMemo, useState } from 'react';

import { context } from './context';
import { type Style } from './style';
import { type StyleStringCompiler } from './style-string-compiler';

const createStyledGlobalComponent = <TProps extends {}, TTheme extends {} | undefined>(
  styleCompiler: StyleStringCompiler,
  style: Style<TProps, readonly [TTheme]>,
  useTheme: () => TTheme,
): VFC<TProps> => {
  const StyledGlobal = (props: TProps & { readonly children?: unknown }): ReactElement | null => {
    const theme = useTheme();
    const stylesheet = useMemo(() => context.createStylesheet(), []);
    const styleString = style.getString(props, theme);
    const [isStylesheetAdded, setIsStylesheetAdded] = useState(false);

    context.useLayoutEffect(() => {
      stylesheet.update(styleCompiler.compile(':root', styleString), 'global');
    }, [styleString]);

    context.useLayoutEffect(() => {
      context.stylesheetCollection.add(stylesheet);
      setIsStylesheetAdded(true);
      return () => context.stylesheetCollection.remove(stylesheet);
    }, []);

    return isStylesheetAdded ? <>{props.children}</> : null;
  };

  return StyledGlobal;
};

export { createStyledGlobalComponent };
