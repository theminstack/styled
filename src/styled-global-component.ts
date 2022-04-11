import { type ComponentType, useMemo } from 'react';

import { context } from './context';
import { type Style } from './style';
import { type StyleStringCompiler } from './style-string-compiler';

function createStyledGlobalComponent<TProps extends {}, TTheme extends {} | undefined>(
  styleCompiler: StyleStringCompiler,
  style: Style<TProps, [TTheme]>,
  useTheme: () => TTheme,
): ComponentType<TProps> {
  function StyledGlobal(props: TProps): null {
    const theme = useTheme();
    const stylesheet = useMemo(() => context.createStylesheet(), []);
    const styleString = style.getString(props, theme);

    context.useLayoutEffect(() => {
      stylesheet.update(styleCompiler.compile(':root', styleString), 'global');
    }, [styleString]);

    context.useLayoutEffect(() => {
      context.stylesheetCollection.add(stylesheet);
      return () => context.stylesheetCollection.remove(stylesheet);
    }, []);

    return null;
  }

  return StyledGlobal;
}

export { createStyledGlobalComponent };
