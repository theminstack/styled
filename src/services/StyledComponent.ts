import {
  ComponentPropsWithRef,
  createElement,
  forwardRef,
  ForwardRefExoticComponent,
  JSXElementConstructor,
  ReactElement,
  useMemo,
} from 'react';
import { StyledTemplateProps } from '../utilities/css';
import { getClassNamesString } from '../utilities/getClassNamesString';
import { getFilteredProps } from '../utilities/getFilteredProps';
import { getHash } from '../utilities/getHash';
import { PartialDocument } from './Document';
import { createStyleElement } from './StyleElement';
import { StyledCompiler } from './StyledCompiler';
import { applyStyledMetadata, getStyledMetadata } from './StyledMetadata';
import { StyledState } from './StyledState';

export type StyledComponentProps<TComponent extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
  ComponentPropsWithRef<TComponent>;

export type StyledComponent<TProps extends Record<string, unknown> = {}> = ForwardRefExoticComponent<TProps> & {
  selector: string;
  propDefaults?: Partial<TProps>;
};

export function createStyledComponent<
  TComponent extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
  TProps extends StyledComponentProps<TComponent>,
  TTheme extends Record<string, unknown> | undefined,
>(
  doc: PartialDocument,
  compiler: StyledCompiler,
  state: StyledState,
  useTheme: () => TTheme | undefined,
  getStyleString: (props: StyledTemplateProps<TProps, TTheme>) => string,
  component: TComponent,
  displayName?: string,
): StyledComponent<TProps> {
  const metadata = getStyledMetadata(component, displayName, getStyleString);
  const getProps =
    typeof metadata.component === 'string' ? getFilteredProps : (props: Record<string, unknown>) => ({ ...props });

  // eslint-disable-next-line react/display-name
  const Styled = forwardRef<unknown, TProps>((props, ref): ReactElement | null => {
    if (Styled.propDefaults != null) {
      props = { ...Styled.propDefaults, ...props };
    }

    const theme = useTheme();
    const styleString = metadata.getStyleString(theme != null ? { ...props, ref, theme } : { ...props, ref });

    // This is intentionally using useMemo for a side effect. This is against
    // the rules, but it seems like the most efficient solution here, and the
    // "unsafe" side effects are exactly the goal.
    const styleClassName = useMemo(() => {
      let className = state.styleStringToClassNameMap.get(styleString);

      if (!className) {
        const hash = getHash(metadata.id, styleString);

        className = '_' + hash;

        const cssString = compiler.compile('.' + className, styleString);
        const style = createStyleElement(doc, cssString, hash);

        if (state.prevStyle != null) {
          state.prevStyle.insertAdjacentElement('afterend', style);
        } else {
          if (state.headStyle.value != null) {
            state.headStyle.value.insertAdjacentElement('beforebegin', style);
          } else {
            doc.head.insertAdjacentElement('beforeend', style);
          }

          state.headStyle.value = style;
        }

        state.prevStyle = style;
        state.styleStringToClassNameMap.set(styleString, className);
      }

      return className;

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [styleString, state.styleStringToClassNameMap]);

    const elementProps = getProps(props);
    elementProps.ref = ref;
    elementProps.className = getClassNamesString(elementProps.className, metadata.staticClassNames, styleClassName);

    return createElement(metadata.component, elementProps);
  }) as StyledComponent<StyledComponentProps<TComponent>>;

  Styled.displayName = metadata.displayName;
  Styled.selector = '.' + metadata.id;

  if (typeof component !== 'string') {
    Styled.propTypes = (component as any).propTypes;
    Styled.propDefaults = (component as any).propDefaults;
    if ('defaultProps' in component) {
      Styled.defaultProps = (component as any).defaultProps;
    }
  }

  applyStyledMetadata(Styled, metadata);

  return Styled;
}
