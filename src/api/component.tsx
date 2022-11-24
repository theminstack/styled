import {
  type ForwardRefExoticComponent,
  type JSXElementConstructor,
  type LegacyRef,
  type PropsWithoutRef,
  type RefAttributes,
  forwardRef,
} from 'react';

import { useStyleEffect } from '../util/effect.js';
import { getId } from '../util/id.js';
import { getAttributes } from './attributes.js';
import { type StyledCache } from './cache.js';
import { useStyledContext } from './context.js';
import { type StyledStringSelectable, type StyledStringValue, getStyleStringHook } from './string.js';

type StyledRefAttributes<TProps> = TProps extends { readonly ref?: LegacyRef<infer TRef> }
  ? RefAttributes<TRef>
  : RefAttributes<unknown>;

type StyledComponent<TProps> = ForwardRefExoticComponent<PropsWithoutRef<TProps> & StyledRefAttributes<TProps>> &
  StyledStringSelectable;

type StyledBase = {
  readonly staticClass: string;
  readonly templateRaw: readonly string[];
  readonly templateValues: readonly StyledStringValue<any, any>[];
  readonly type: string | (JSXElementConstructor<any> & { readonly displayName?: string; readonly name?: string });
};

const isStyledComponent = (
  type: JSXElementConstructor<any> | string,
): type is JSXElementConstructor<any> & { readonly $$rms: StyledBase } => {
  return typeof type !== 'string' && '$$rms' in type;
};

const getDisplayName = (
  type: string | (JSXElementConstructor<any> & { readonly displayName?: string; readonly name?: string }),
): string => {
  const original = typeof type === 'string' ? type : type.displayName || type.name;
  return original ? 'Styled(' + original + ')' : 'Styled';
};

const getClasses = (cache: StyledCache, className?: string): [dynamicClasses: string, staticClasses: string] => {
  const staticClasses: string[] = [];
  const dynamicClasses: string[] = [];

  if (typeof className === 'string') {
    className.split(/\s+/g).forEach((value) => {
      if (cache.has(value)) {
        dynamicClasses.push(value);
      } else if (value) {
        staticClasses.push(value);
      }
    });
  }

  return [dynamicClasses.join(' '), staticClasses.join(' ')];
};

const createStyledComponent = <TProps, TTheme>(
  type: string | (JSXElementConstructor<TProps> & { readonly displayName?: string; readonly name?: string }),
  templateRaw: readonly string[],
  templateValues: readonly StyledStringValue<TProps, TTheme>[],
  useTheme: () => TTheme,
): StyledComponent<TProps> & { readonly $$rms: StyledBase } => {
  let staticClass: string;

  [type, templateRaw, templateValues, staticClass] = isStyledComponent(type)
    ? [
        type.$$rms.type,
        [...type.$$rms.templateRaw, ...templateRaw],
        [...type.$$rms.templateValues, '', ...templateValues],
        getId() + ' ' + type.$$rms.staticClass,
      ]
    : [type, templateRaw, templateValues, getId()];

  const filterProps = typeof type === 'string' ? getAttributes : (value: Record<string, unknown>) => value;
  const useStyleString = getStyleStringHook(templateRaw, templateValues, useTheme);
  const selector = '.' + staticClass;

  const Styled = forwardRef((props: TProps & { children?: unknown; className?: string }, ref) => {
    const { className, children, ...rest } = props;
    const { cache, manager, renderer } = useStyledContext();
    const styleString = useStyleString(props);
    const [dynamicClasses, staticClasses] = getClasses(cache, className);
    // XXX: The cache has to be pre-populated so that we can render the
    //      generated class name immediately, and so that styled children
    //      can extend the cached styles. This a side effect, but it's an
    //      safe (idempotent) operation. There is an infinitesimal chance
    //      that this might result in a little extra _early_ work. But,
    //      given that the number of dynamic classes should be finite, it
    //      should not be _wasted_ work.
    const [cssText, dynamicClass] = cache.resolve(styleString, dynamicClasses);
    const styledProps = {
      ...filterProps(rest),
      className: (dynamicClass + ' ' + staticClass + ' ' + staticClasses).trim(),
      ref,
    };

    useStyleEffect(() => {
      manager.addComponentStyle(dynamicClass, cssText);
      return () => manager.unref(dynamicClass);
    }, [manager, dynamicClass, cssText]);

    return renderer.render(type, styledProps, ...(children ? [children] : []));
  });

  Styled.displayName = getDisplayName(type);
  Styled.toString = () => selector;

  return Object.assign(Styled as StyledComponent<TProps>, {
    $$rms: { staticClass, templateRaw, templateValues, type },
  });
};

export { type StyledComponent, createStyledComponent };
