import {
  type ComponentProps,
  type DetailedHTMLProps,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type JSXElementConstructor,
  type LegacyRef,
  type PropsWithoutRef,
  type RefAttributes,
  createElement,
  forwardRef,
} from 'react';

import { useStyleEffect } from '../util/effect.js';
import { getAttributes } from './attributes.js';
import { cache } from './cache.js';
import { getClasses, getIdClass } from './class.js';
import { dom } from './dom.js';
import { type StyledGlobal, createStyledGlobal } from './global.js';
import { type StyledString, type StyledStringValue, getStyleStringHook, string } from './string.js';

type StylableType =
  | keyof JSX.IntrinsicElements
  | (JSXElementConstructor<any> & {
      $$rms?: {
        idClass: string;
        template: readonly string[];
        type: StylableType;
        values: StyledStringValue<any, any>[];
      };
      readonly displayName?: string;
      readonly name?: string;
    });

type StylableTypeProps<TType extends StylableType | string> = TType extends StylableType
  ? ComponentProps<TType>
  : DetailedHTMLProps<HTMLAttributes<Element>, Element>;

type StyledRefAttributes<TProps> = TProps extends { ref?: LegacyRef<infer TRef> }
  ? RefAttributes<TRef>
  : RefAttributes<unknown>;

type StyledComponent<TProps> = ForwardRefExoticComponent<PropsWithoutRef<TProps> & StyledRefAttributes<TProps>> & {
  $$rms: { idClass: string; template: readonly string[]; type: StylableType; values: any[] };
};

type StyledTaggedTemplateFunction<TProps extends {}, TTheme extends {}> = {
  (template: TemplateStringsArray, ...values: [...StyledStringValue<TProps, TTheme>[]]): StyledComponent<TProps>;
  <TExtraProps extends {}>(
    template: TemplateStringsArray,
    ...values: [...StyledStringValue<TExtraProps & TProps, TTheme>[]]
  ): StyledComponent<TExtraProps & TProps>;
};

type Styled<TTheme extends {}> = {
  <TType extends StylableType | string>(type: TType): StyledTaggedTemplateFunction<StylableTypeProps<TType>, TTheme>;
  global: StyledGlobal<TTheme>;
  string: StyledString;
};

const EMPTY_THEME: any = {};

const getDisplayName = (type: string | { displayName?: string; name?: string }): string => {
  const original = typeof type === 'string' ? type : type.displayName || type.name;
  return original ? 'Styled(' + original + ')' : 'Styled';
};

const createStyled = <TTheme extends {}>(useTheme: () => TTheme = () => EMPTY_THEME): Styled<TTheme> => {
  const styled = <TType extends StylableType | string>(
    type_: TType,
  ): StyledTaggedTemplateFunction<StylableTypeProps<TType>, TTheme> => {
    const base = typeof type_ !== 'string' ? type_.$$rms : undefined;
    const type = base?.type ?? type_;
    const displayName = getDisplayName(type);
    const filterProps = typeof type === 'string' ? getAttributes : (value: Record<string, unknown>) => value;
    const taggedTemplateFunction = <TExtraProps extends {}>(
      template_: TemplateStringsArray,
      ...values_: [...StyledStringValue<StylableTypeProps<TType> & TExtraProps, TTheme>[]]
    ): StyledComponent<StylableTypeProps<TType> & TExtraProps> => {
      const idClass = getIdClass();
      const selector = '.' + idClass;
      const [template, values] = base
        ? [
            [...template_.raw, ...base.template],
            [...values_, '', ...base.values],
          ]
        : [template_.raw, values_];
      const useStyledString = getStyleStringHook(template, values, useTheme);

      const Styled = forwardRef((props: any, ref) => {
        const { className, children, ...rest } = props;
        const styleString = useStyledString(props);
        const [simpleClasses, styledClasses] = getClasses(className);

        // XXX: The cache has to be pre-populated so that we can render the
        //      generated class name immediately, and so that styled children
        //      can extend the cached styles. This a side effect, but it's an
        //      safe (idempotent) operation. There is an infinitesimal chance
        //      that this might result in a little extra _early_ work. But,
        //      given that the number of dynamic classes should be finite, it
        //      should not be _wasted_ work.
        const { cssText, styledClass } = cache.resolve(styleString, styledClasses);

        useStyleEffect(() => dom.addComponentStyle(styledClass, cssText), [styledClass, cssText]);

        return createElement(
          base?.type ?? type,
          {
            ...filterProps(rest),
            className: [simpleClasses, styledClass, idClass, base?.idClass].filter((value) => value).join(' '),
            ref,
          },
          children,
        );
      });

      Styled.displayName = displayName;
      Styled.toString = () => selector;

      return Object.assign(Styled, {
        $$rms: { idClass: [idClass, base?.idClass].filter((value) => value).join(' '), template, type, values },
      }) as StyledComponent<StylableTypeProps<TType> & TExtraProps>;
    };

    return taggedTemplateFunction as StyledTaggedTemplateFunction<StylableTypeProps<TType>, TTheme>;
  };

  styled.global = createStyledGlobal(useTheme);
  styled.string = string;

  return styled;
};

const styled = createStyled();

export { type Styled, createStyled, styled };
