import {
  type ComponentProps,
  type ForwardRefExoticComponent,
  type JSXElementConstructor,
  type ReactElement,
  type ReactNode,
  createElement,
  forwardRef,
  useState,
} from 'react';

import { context } from './context.js';
import { getHtmlAttributes } from './html-attributes.js';
import { type Style } from './style.js';
import { type StyleStringCompiler } from './style-string-compiler.js';

const createStyledComponent = <
  TComponent extends JSXElementConstructor<{}> | keyof JSX.IntrinsicElements,
  TProps extends ComponentProps<TComponent>,
  TTheme extends {} | undefined,
>(
  styleCompiler: StyleStringCompiler,
  style: Style<TProps, readonly [TTheme]>,
  useTheme: () => TTheme,
  component: TComponent,
): ForwardRefExoticComponent<TProps> => {
  const parent = typeof component !== 'string' ? context.styledComponentCache.get(component) : undefined;
  const [baseComponent, currentStyle] =
    parent != null ? [parent.component, parent.style.extend(style)] : [component, style];
  const staticClassName = context.ids.next('staticClassName');
  const selector = '.' + staticClassName;
  const getInnerProps = (typeof baseComponent === 'string' ? getHtmlAttributes : (props) => props) as (
    props: TProps,
  ) => TProps & { children?: ReactNode; className?: string };

  const styledComponent: ForwardRefExoticComponent<TProps> = Object.assign(
    // eslint-disable-next-line react/display-name
    forwardRef<unknown, TProps>((props, ref): ReactElement | null => {
      const theme = useTheme();
      const styleString = currentStyle.getString(props, theme);
      const { className, children, ...innerProps } = getInnerProps(props);
      const [classNameSuffix, setClassNameSuffix] = useState('');

      context.useLayoutEffect(() => {
        const [isNew, hash] = context.styleStringCache.register(styleString + staticClassName);
        const styleClassName = '_' + hash;

        setClassNameSuffix(' ' + styleClassName);

        if (isNew) {
          context.stylesheetCollection.add(
            context.createStylesheet().update(styleCompiler.compile('.' + styleClassName, styleString), styleClassName),
          );
        }
      }, [styleString]);

      return createElement(
        baseComponent,
        {
          ...innerProps,
          className: (className ? className + ' ' : '') + staticClassName + classNameSuffix,
          ref,
        } as TProps,
        children,
      );
    }) as ForwardRefExoticComponent<TProps>,
    {
      toString: () => selector,
    },
  );

  context.styledComponentCache.register(styledComponent, baseComponent, currentStyle);

  return styledComponent;
};

export { createStyledComponent };
