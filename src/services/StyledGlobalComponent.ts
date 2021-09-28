import { ComponentType, useEffect, useMemo, useRef } from 'react';
import { StyledTemplateProps } from '../utilities/css';
import { getHash } from '../utilities/getHash';
import { getId } from '../utilities/getId';
import { PartialDocument, PartialElement } from './Document';
import { createStyleElement } from './StyleElement';
import { StyledCompiler } from './StyledCompiler';
import { StyledState } from './StyledState';

const displayName = '$$tssGlobalStyle';

export type StyledGlobalComponent<TProps> = ComponentType<TProps> & {
  propDefaults?: Partial<TProps>;
};

export function createStyledGlobalComponent<
  TProps extends Record<string, unknown>,
  TTheme extends Record<string, unknown> | undefined,
>(
  doc: PartialDocument,
  compiler: StyledCompiler,
  state: StyledState,
  useTheme: () => TTheme | undefined,
  getStyleString: (props: StyledTemplateProps<TProps, TTheme>) => string,
): StyledGlobalComponent<TProps> {
  const id = getId(displayName);

  const StyledGlobal = ((props: TProps): null => {
    if (StyledGlobal.propDefaults != null) {
      props = { ...StyledGlobal.propDefaults, ...props };
    }

    const theme = useTheme();
    const styleElement = useRef<PartialElement>();
    const styleProps = (theme != null ? { ...props, theme } : props) as StyledTemplateProps<TProps, TTheme>;
    const styleString = getStyleString(styleProps);

    // This is intentionally using useMemo for a side effect. This is against
    // the rules, but it seems like the most efficient solution here, and the
    // "unsafe" side effects are exactly the goal.
    useMemo(() => {
      const cssString = compiler.compile(':root', styleString);
      const hash = getHash(id, styleString);
      const style = createStyleElement(doc, cssString, hash);

      doc.head.insertAdjacentElement('beforeend', style);

      if (state.headStyle.value === styleElement.current) {
        state.headStyle.value = style;
      }

      styleElement.current?.parentElement?.removeChild(styleElement.current);
      styleElement.current = style;
    }, [styleString]);

    // Global styles are removed when unmounted.
    useEffect(() => () => styleElement.current?.parentElement?.removeChild(styleElement.current), []);

    return null;
  }) as StyledGlobalComponent<TProps>;

  StyledGlobal.displayName = displayName;

  return StyledGlobal;
}
