import {
  type ComponentProps,
  type ForwardRefExoticComponent,
  type JSXElementConstructor,
  type ReactElement,
  type ReactNode,
  createElement,
  forwardRef,
  useMemo,
} from 'react';

import { context } from './context';
import { getHtmlAttributes } from './html-attributes';
import { type Style } from './style';
import { type StyleStringCompiler } from './style-string-compiler';

type StyledComponent<TProps extends {}> = ForwardRefExoticComponent<TProps> & string;

function createStyledComponent<
  TComponent extends keyof JSX.IntrinsicElements | JSXElementConstructor<{}>,
  TProps extends ComponentProps<TComponent>,
  TTheme extends {} | undefined,
>(
  styleCompiler: StyleStringCompiler,
  style: Style<TProps, [TTheme]>,
  useTheme: () => TTheme,
  component: TComponent,
): StyledComponent<TProps> {
  const parent = typeof component !== 'string' ? context.styledComponentCache.get(component) : undefined;
  const [baseComponent, currentStyle] =
    parent != null ? [parent.component, parent.style.extend(style)] : [component, style];
  const staticClassName = context.ids.next('staticClassName');
  const selector = '.' + staticClassName;
  const getInnerProps = (typeof baseComponent === 'string' ? getHtmlAttributes : (props) => props) as (
    props: TProps,
  ) => TProps & { className?: string; children?: ReactNode };

  const styledComponent: StyledComponent<TProps> = Object.assign(
    // eslint-disable-next-line react/display-name
    forwardRef<unknown, TProps>((props, ref): ReactElement | null => {
      const theme = useTheme();
      const styleString = currentStyle.getString(props, theme);
      const { className, children, ...innerProps } = getInnerProps(props);
      const styleState = useMemo(() => {
        const [isNew, hash] = context.styleStringCache.register(styleString);
        const className = '_' + hash;
        return { isNew, className };
      }, [styleString]);

      context.useLayoutEffect(() => {
        if (styleState.isNew) {
          context.stylesheetCollection.add(
            context
              .createStylesheet()
              .update(styleCompiler.compile('.' + styleState.className, styleString), styleState.className),
          );
        }
      }, [styleState]);

      return createElement(
        baseComponent,
        {
          ...innerProps,
          className: (className ? className + ' ' : '') + staticClassName + ' ' + styleState.className,
          ref,
        } as TProps,
        children,
      );
    }) as StyledComponent<TProps>,
    {
      toString: () => selector,
    },
  );

  context.styledComponentCache.register(styledComponent, baseComponent, currentStyle);

  return styledComponent;
}

export { type StyledComponent, createStyledComponent };
