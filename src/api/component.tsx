import {
  type ForwardRefExoticComponent,
  type JSXElementConstructor,
  type LegacyRef,
  type PropsWithoutRef,
  type RefAttributes,
  forwardRef,
} from 'react';

import { DYNAMIC_CLASS_PREFIX, STATIC_CLASS_PREFIX } from '../util/constants.js';
import { useStyleEffect } from '../util/effect.js';
import { getId } from '../util/id.js';
import { getAttributes } from './attributes.js';
import { useStyledContext } from './context.js';

type StyledRefAttributes<TProps> = TProps extends { readonly ref?: LegacyRef<infer TRef> }
  ? RefAttributes<TRef>
  : RefAttributes<unknown>;

type StyledExoticComponent<TProps> = ForwardRefExoticComponent<PropsWithoutRef<TProps> & StyledRefAttributes<TProps>>;

type StyledComponentOptions<TProps> = {
  readonly component:
    | string
    | (JSXElementConstructor<TProps> & { readonly displayName?: string; readonly name?: string });
  readonly useStyleString: (props: TProps) => string;
};

const getDisplayName = (type: string | { readonly displayName?: string; readonly name?: string }): string => {
  const original = typeof type === 'string' ? type : type.displayName || type.name;
  return original ? 'Styled(' + original + ')' : 'Styled';
};

const getClasses = (className?: string): [simpleClasses: string, dynamicClasses: string] => {
  const simpleClasses: string[] = [];
  const dynamicClasses: string[] = [];

  if (typeof className === 'string') {
    className.split(/\s+/g).forEach((value) => {
      if (value.startsWith(DYNAMIC_CLASS_PREFIX)) {
        dynamicClasses.push(value);
      } else if (value) {
        simpleClasses.push(value);
      }
    });
  }

  return [simpleClasses.join(' '), dynamicClasses.join(' ')];
};

const createStyledComponent = <TProps,>({
  component,
  useStyleString,
}: StyledComponentOptions<TProps>): StyledExoticComponent<TProps> => {
  const staticClass = STATIC_CLASS_PREFIX + getId();
  const selector = '.' + staticClass;
  const filterProps = typeof component === 'string' ? getAttributes : (value: Record<string, unknown>) => value;
  const Styled = forwardRef((props: any, ref) => {
    const { className, children, ...rest } = props;
    const { cache, manager, renderer } = useStyledContext();
    const styleString = useStyleString(props);
    const [simpleClasses, dynamicClasses] = getClasses(className);
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
      className: (simpleClasses + ' ' + dynamicClass + ' ' + staticClass).trim(),
      ref,
    };

    useStyleEffect(() => {
      manager.addComponentStyle(dynamicClass, cssText);
      return () => manager.unref(dynamicClass);
    }, [manager, dynamicClass, cssText]);

    return renderer.render(component, styledProps, children);
  });

  Styled.displayName = getDisplayName(component);
  Styled.toString = () => selector;

  return Styled as StyledExoticComponent<TProps>;
};

export { type StyledExoticComponent, createStyledComponent };
