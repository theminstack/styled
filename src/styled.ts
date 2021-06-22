import { createElement, Fragment, ReactElement } from 'react';
import { styledSelectorMarker } from './constants';
import { IStylableComponentProps } from './types/IStylableComponentProps';
import { IStyled } from './types/IStyled';
import { IStyledTemplate } from './types/IStyledTemplate';
import { IStyledTemplateBase } from './types/IStyledTemplateBase';
import { StylableComponent } from './types/StylableComponent';
import { StyleValue } from './types/StyleValue';
import { getId } from './utils/getId';
import { getStyleText } from './utils/getStyleText';
import { defaults } from './utils/defaults';
import { merge } from './utils/merge';
import { assign } from './utils/assign';
import { useStyleTokens } from './react/useStyleTokens';
import { useCssText } from './react/useCssText';
import { Stylesheet } from './react/Stylesheet';
import { isStyledComponent } from './utils/isStyledComponent';

type AnyProps = IStylableComponentProps & Record<string, unknown>;

function getStyledComponent(
  type: string | (StylableComponent<AnyProps> & { displayName?: string; name?: string }),
  displayName: string | undefined,
  mapFunctions: ((props: AnyProps) => AnyProps)[],
  template: TemplateStringsArray,
  values: StyleValue<AnyProps>[],
) {
  const isGlobal = type === 'style';
  const staticClassName = !isGlobal && displayName != null ? getId(displayName) : undefined;
  const staticClassNameSelector = staticClassName != null ? `.${staticClassName}` : undefined;

  if (displayName == null) {
    displayName = typeof type === 'string' ? `$$styled('${type}')` : `$$styled(${type.displayName || type.name || ''})`;
  }

  return assign(
    (props: AnyProps): ReactElement | null => {
      props = mapFunctions.reduce((acc, cb) => cb(acc), { ...props });

      const isGlobal = type === 'style';
      const styleText = getStyleText(template, values, props);
      const { styleTokens, dynamicClassName, otherClassNames } = useStyleTokens(
        styleText,
        props.className,
        displayName,
      );
      const cssText = useCssText(styleTokens, isGlobal ? undefined : dynamicClassName);
      const style = isStyledComponent(type)
        ? null
        : createElement(Stylesheet, { className: dynamicClassName, cssText });

      if (isGlobal) {
        return style;
      }

      const element = createElement(type, {
        ...props,
        className: [...otherClassNames, ...(staticClassName != null ? [staticClassName] : []), dynamicClassName].join(
          ' ',
        ),
      });

      return createElement(Fragment, {}, style, element);
    },
    {
      displayName,
      ...(staticClassNameSelector != null
        ? { [styledSelectorMarker]: true as const, toString: () => staticClassNameSelector }
        : {}),
    },
  );
}

function getStyledTemplateBase(
  type: string | StylableComponent<AnyProps>,
  displayName: string | undefined,
  mapFunctions: ((props: AnyProps) => AnyProps)[],
): IStyledTemplateBase<boolean, any> {
  return assign(
    (template: TemplateStringsArray, ...values: StyleValue<AnyProps>[]) => {
      return getStyledComponent(type, displayName, mapFunctions, template, values);
    },
    {
      use: (cb: (props: AnyProps) => AnyProps): IStyledTemplateBase<boolean, any> => {
        return getStyledTemplateBase(type, displayName, [...mapFunctions, (props) => defaults(props, cb(props))]);
      },
      set: (cb: (props: AnyProps) => AnyProps): IStyledTemplateBase<boolean, any> => {
        return getStyledTemplateBase(type, displayName, [...mapFunctions, (props) => merge(props, cb(props))]);
      },
      map: (cb: (props: AnyProps) => AnyProps): IStyledTemplateBase<boolean, any> => {
        return getStyledTemplateBase(type, displayName, [...mapFunctions, cb]);
      },
    },
  );
}

/**
 * Styled component factory.
 *
 * ```tsx
 * const StyledComponent = styled(MyComponent)`
 *   color: blue;
 * `;
 *
 * const StyledDiv = styled('div')`
 *   color: blue;
 * `;
 *
 * const GlobalStyle = styled('style')`
 *   color: blue;
 * `;
 * ```
 */
export const styled: IStyled = (
  type: string | StylableComponent<AnyProps>,
  displayName?: string,
): IStyledTemplate<boolean, any> => {
  return assign(getStyledTemplateBase(type, displayName, []), {
    props(cb?: (props: AnyProps) => AnyProps): IStyledTemplateBase<boolean, any> {
      return getStyledTemplateBase(type, displayName, cb ? [cb] : []);
    },
  });
};
