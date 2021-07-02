import { Component, createElement, forwardRef, Fragment, ReactElement } from 'react';
import { styledComponentMarker } from './constants';
import { IStyledTemplate } from './types/IStyledTemplate';
import { IStyledTemplateMod } from './types/IStyledTemplateMod';
import { StyleValue } from './types/StyleValue';
import { IStyledComponent } from './types/IStyledComponent';
import { HtmlTag } from './types/HtmlTag';
import { InferProps } from './types/InferProps';
import { IStyledSelector } from './types/IStyledSelector';
import { InferInnerProps } from './types/InferInnerProps';
import { PropValue } from './types/Utilities';
import { getId } from './utils/getId';
import { getStyleText } from './utils/getStyleText';
import { defaults } from './utils/defaults';
import { merge } from './utils/merge';
import { assign } from './utils/assign';
import { isStyled } from './utils/isStyled';
import { useStyleTokens } from './react/useStyleTokens';
import { useCssText } from './react/useCssText';
import { Stylesheet } from './react/Stylesheet';

type AnyComponent<TProps> =
  | (new (props: TProps, context?: any) => Component<any>)
  | ((props: TProps) => ReactElement | null);

function getStyledComponent(
  type: string | (AnyComponent<{}> & { displayName?: string; name?: string }),
  displayName: string | undefined,
  mapFunctions: ((props: {}) => {})[],
  template: TemplateStringsArray,
  values: StyleValue<{}>[],
): IStyledComponent<{}> {
  const isGlobal = type === 'style';
  const staticClassName = !isGlobal && displayName != null ? getId(displayName) : undefined;
  const staticClassNameSelector = staticClassName != null ? `.${staticClassName}` : undefined;

  if (displayName == null) {
    displayName = typeof type === 'string' ? `$$styled('${type}')` : `$$styled(${type.displayName || type.name || ''})`;
  }

  return assign(
    forwardRef<any, { className?: string; [key: string]: unknown }>((props, ref): ReactElement | null => {
      props = mapFunctions.reduce((acc, cb) => cb(acc), { ...props, ...(ref ? { ref } : {}) });

      const isGlobal = type === 'style';
      const styleText = getStyleText(template, values, props);
      const { styleTokens, dynamicClassName, otherClassNames } = useStyleTokens(
        styleText,
        props.className,
        displayName,
      );
      const cssText = useCssText(styleTokens, isGlobal ? undefined : dynamicClassName);
      const style = isStyled(type) ? null : createElement(Stylesheet, { className: dynamicClassName, cssText });

      if (isGlobal) {
        return style;
      }

      if (typeof type === 'string') {
        for (const prop of Object.keys(props)) {
          if (
            prop[0] === '$' ||
            (prop !== 'ref' &&
              prop !== 'style' &&
              prop !== 'children' &&
              typeof props[prop] !== 'string' &&
              typeof props[prop] !== 'number' &&
              typeof props[prop] !== 'boolean' &&
              (typeof props[prop] !== 'function' || prop.slice(0, 2) !== 'on'))
          ) {
            delete props[prop];
          }
        }
      }

      const element = createElement<typeof props>(type, {
        ...props,
        className: [...otherClassNames, ...(staticClassName != null ? [staticClassName] : []), dynamicClassName].join(
          ' ',
        ),
      });

      return createElement(Fragment, {}, style, element);
    }),
    {
      displayName,
      [styledComponentMarker]: staticClassNameSelector != null,
      ...(staticClassNameSelector != null ? { toString: () => staticClassNameSelector } : {}),
    },
  );
}

function getStyledTemplateBase(
  type: string | AnyComponent<{}>,
  displayName: string | undefined,
  mapFunctions: ((props: {}) => {})[],
): IStyledTemplateMod<{}, {}> {
  return assign(
    (template: TemplateStringsArray, ...values: StyleValue<{}>[]) => {
      return getStyledComponent(type, displayName, mapFunctions, template, values);
    },
    {
      use: (cb: (props: {}) => {}): IStyledTemplateMod<{}, any> => {
        return getStyledTemplateBase(type, displayName, [...mapFunctions, (props) => defaults(props, cb(props))]);
      },
      set: (cb: (props: {}) => {}): IStyledTemplateMod<{}, any> => {
        return getStyledTemplateBase(type, displayName, [...mapFunctions, (props) => merge(props, cb(props))]);
      },
      map: (cb: (props: {}) => {}): IStyledTemplateMod<{}, any> => {
        return getStyledTemplateBase(type, displayName, [...mapFunctions, cb]);
      },
    },
  );
}

/**
 * Style an HTML element. If the component will be used a selector,
 * add a display name (second argument).
 *
 * ```tsx
 * const Foo = styled('div')`
 *   color: blue;
 * `;
 * ```
 */
export function styled<TTag extends HtmlTag | string>(tag: TTag): IStyledTemplate<{}, InferProps<TTag>>;
/**
 * Create a styled HTML element with component selection support.
 *
 * ```tsx
 * const Foo = styled('div', 'Foo')`
 *   color: blue;
 * `;
 *
 * const Bar = styled('div')`
 *   ${Foo} {
 *     color: red;
 *   }
 * `;
 * ```
 */
export function styled<TTag extends HtmlTag | string>(
  tag: TTag,
  displayName: string,
): IStyledTemplate<IStyledSelector, InferProps<TTag>>;
/**
 * Create a global style.
 *
 * ```tsx
 * const GlobalStyle = styled('style')`
 *   color: blue;
 * `;
 * ```
 */
export function styled(tag: 'style', displayName?: string): IStyledTemplate<{}, { className?: string }>;
/**
 * Style an React component. If the component will be used a
 * selector, add a display name (second argument).
 *
 * _Do not explicitly set the generic parameters of this function,
 * unless you are sure you know what you are doing. Explicitly
 * overriding the props type of the styled component this way can
 * lead to props of the wrong type being passed to the wrapped
 * component. Use the `props` method instead._
 *
 * ```tsx
 * const Foo = styled(SomeComponent)`
 *   color: blue;
 * `;
 * ```
 */
export function styled<TComponent extends AnyComponent<any>, _ extends 'IKnowWhatIAmDoing'>(
  component: string extends PropValue<InferProps<TComponent>, 'className'> ? TComponent : never,
): IStyledTemplate<{}, InferProps<TComponent>, InferInnerProps<TComponent>>;
/**
 * Create a styled React component with component selection support.
 *
 * _Do not explicitly set the generic parameters of this function,
 * unless you are sure you know what you are doing. Explicitly
 * overriding the props type of the styled component this way can
 * lead to props of the wrong type being passed to the wrapped
 * component. Use the {@link IStyledTemplate.props props} method
 * instead._
 *
 * ```tsx
 * const Foo = styled(SomeComponent, 'Foo')`
 *   color: blue;
 * `;
 *
 * const Bar = styled('div')`
 *   ${Foo} {
 *     color: red;
 *   }
 * `;
 * ```
 */
export function styled<TComponent extends AnyComponent<any>, _ extends 'IKnowWhatIAmDoing'>(
  component: string extends PropValue<InferProps<TComponent>, 'className'> ? TComponent : never,
  displayName: string,
): IStyledTemplate<IStyledSelector, InferProps<TComponent>, InferInnerProps<TComponent>>;
export function styled<TType extends string | AnyComponent<{}>>(
  type: TType extends string ? TType : string extends PropValue<InferProps<TType>, 'className'> ? TType : never,
  displayName?: string,
): IStyledTemplate<{}, {}> {
  return assign(getStyledTemplateBase(type, displayName, []), {
    props(arg?: ((props: {}) => {}) | Record<string, unknown>): IStyledTemplateMod<{}, any> {
      const map = typeof arg === 'function' ? arg : undefined;
      return getStyledTemplateBase(type, displayName, map ? [map] : []);
    },
  });
}
