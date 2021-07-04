import { Component, createElement, forwardRef, Fragment, ReactElement } from 'react';
import { styledComponentMarker } from './constants';
import { classNames } from './classNames';
import { getId } from './getId';
import { isStyled } from './isStyled';
import { IStyledTemplate } from './types/IStyledTemplate';
import { IStyledTemplateMod } from './types/IStyledTemplateMod';
import { StyleValue } from './types/StyleValue';
import { IStyledComponent } from './types/IStyledComponent';
import { HtmlTag } from './types/HtmlTag';
import { InferProps } from './types/InferProps';
import { IStyledSelector } from './types/IStyledSelector';
import { InferInnerProps } from './types/InferInnerProps';
import { PropValue } from './types/Utilities';
import { getStyleText } from './utils/getStyleText';
import { defaults } from './utils/defaults';
import { merge } from './utils/merge';
import { assign } from './utils/assign';
import { useStyleTokens } from './react/useStyleTokens';
import { useCssText } from './react/useCssText';
import { Stylesheet } from './react/Stylesheet';

const staticClassNames: Record<string, true> = Object.create(null);

type AnyComponent<TProps> =
  | (new (props: TProps, context?: any) => Component<any>)
  | ((props: TProps) => ReactElement | null);

function getStyledComponent(
  base: string | (AnyComponent<{}> & { displayName?: string; name?: string }),
  displayName: string | undefined,
  mapFunctions: ((props: {}) => {})[],
  template: TemplateStringsArray,
  values: StyleValue<{}>[],
): IStyledComponent<{}> {
  const isGlobal = base === 'style';
  const id = !isGlobal && displayName != null ? getId(displayName) : undefined;
  const idSelector = id != null ? `.${id}` : undefined;

  if (displayName == null) {
    displayName = typeof base === 'string' ? `$$styled('${base}')` : `$$styled(${base.displayName || base.name || ''})`;
  }

  if (id != null) {
    staticClassNames[id] = true;
  }

  return assign(
    forwardRef<any, { className?: string; [key: string]: unknown }>((props, ref): ReactElement | null => {
      props = mapFunctions.reduce((acc, cb) => cb(acc), { ...props, ...(ref ? { ref } : {}) });

      const isGlobal = base === 'style';
      const styleText = getStyleText(template, values, props);
      const { styleTokens, dynamicClassName, staticClassName, otherClassNames } = useStyleTokens(
        styleText,
        props.className,
        displayName,
        staticClassNames,
      );
      const cssText = useCssText(styleTokens, isGlobal ? undefined : dynamicClassName);
      const style = cssText
        ? isStyled(base)
          ? null
          : createElement(Stylesheet, { className: dynamicClassName, cssText })
        : null;

      if (isGlobal) {
        return style;
      }

      if (typeof base === 'string') {
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

      const className =
        classNames(otherClassNames, staticClassName ?? id, cssText ? dynamicClassName : null) || undefined;
      const element = createElement<typeof props>(base, { ...props, className });

      return createElement(Fragment, {}, style, element);
    }),
    {
      displayName,
      [styledComponentMarker]: idSelector != null,
      ...(idSelector != null ? { toString: () => idSelector } : {}),
    },
  );
}

function getStyledTemplateBase(
  base: string | AnyComponent<{}>,
  displayName: string | undefined,
  mapFunctions: ((props: {}) => {})[],
): IStyledTemplateMod<{}, {}> {
  return assign(
    (template: TemplateStringsArray, ...values: StyleValue<{}>[]) => {
      return getStyledComponent(base, displayName, mapFunctions, template, values);
    },
    {
      use: (cb: (props: {}) => {}): IStyledTemplateMod<{}, any> => {
        return getStyledTemplateBase(base, displayName, [...mapFunctions, (props) => defaults(props, cb(props))]);
      },
      set: (cb: (props: {}) => {}): IStyledTemplateMod<{}, any> => {
        return getStyledTemplateBase(base, displayName, [...mapFunctions, (props) => merge(props, cb(props))]);
      },
      map: (cb: (props: {}) => {}): IStyledTemplateMod<{}, any> => {
        return getStyledTemplateBase(base, displayName, [...mapFunctions, cb]);
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
export function styled<TTag extends HtmlTag | string>(base: TTag): IStyledTemplate<{}, InferProps<TTag>>;
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
  base: TTag,
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
  base: string extends PropValue<InferProps<TComponent>, 'className'> ? TComponent : never,
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
  base: string extends PropValue<InferProps<TComponent>, 'className'> ? TComponent : never,
  displayName: string,
): IStyledTemplate<IStyledSelector, InferProps<TComponent>, InferInnerProps<TComponent>>;
export function styled<TType extends string | AnyComponent<{}>>(
  base: TType extends string ? TType : string extends PropValue<InferProps<TType>, 'className'> ? TType : never,
  displayName?: string,
): IStyledTemplate<{}, {}> {
  return assign(getStyledTemplateBase(base, displayName, []), {
    props(arg?: ((props: {}) => {}) | Record<string, unknown>): IStyledTemplateMod<{}, any> {
      const map = typeof arg === 'function' ? arg : undefined;
      return getStyledTemplateBase(base, displayName, map ? [map] : []);
    },
  });
}
