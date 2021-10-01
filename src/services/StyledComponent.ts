import {
  ComponentPropsWithRef,
  createElement,
  forwardRef,
  ForwardRefExoticComponent,
  JSXElementConstructor,
  ReactElement,
  useEffect,
  useLayoutEffect,
  useMemo,
} from 'react';
import { StyledTemplateProps } from '../utilities/css';
import { getClassNamesString } from '../utilities/getClassNamesString';
import { getFilteredProps } from '../utilities/getFilteredProps';
import { getHash } from '../utilities/getHash';
import { Compiler } from './Compiler';
import { Manager } from './Manager';
import { applyMetadata, getMetadata } from './Metadata';

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
  manager: Manager,
  compiler: Compiler,
  useTheme: () => TTheme | undefined,
  getStyleString: (props: StyledTemplateProps<TProps, TTheme>) => string,
  component: TComponent,
  displayName?: string,
): StyledComponent<TProps> {
  const useStyleEffect = typeof document === 'undefined' ? useMemo : useLayoutEffect;
  const cache = new Map<string, string>();
  const style = manager.createComponentStyle();
  const metadata = getMetadata(component, displayName, getStyleString);
  const getProps =
    typeof metadata.component === 'string' ? getFilteredProps : (props: Record<string, unknown>) => ({ ...props });

  // eslint-disable-next-line react/display-name
  const Styled = forwardRef<unknown, TProps>((props, ref): ReactElement | null => {
    if (Styled.propDefaults != null) {
      props = { ...Styled.propDefaults, ...props };
    }

    const theme = useTheme();
    const styleString = metadata.getStyleString(theme != null ? { ...props, ref, theme } : { ...props, ref });
    const [newCssString, hash] = useMemo(() => {
      const cachedHash = cache.get(styleString);

      if (cachedHash != null) {
        return [undefined, cachedHash];
      }

      const newHash = getHash(metadata.id, styleString);
      const cssString = compiler.compile('._' + newHash, styleString);

      cache.set(styleString, newHash);

      return [cssString, newHash];
    }, [styleString]);

    useStyleEffect(() => {
      if (newCssString != null) {
        style.update(newCssString, hash);
      }
    }, [newCssString, hash]);

    useEffect(() => manager.rehydrate(), []);

    const elementProps = getProps(props);
    elementProps.ref = ref;
    elementProps.className = getClassNamesString(elementProps.className, metadata.staticClassNames, '_' + hash);

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

  applyMetadata(Styled, metadata);

  return Styled;
}
