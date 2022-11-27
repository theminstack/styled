import {
  type ForwardRefExoticComponent,
  type JSXElementConstructor,
  type LegacyRef,
  type PropsWithoutRef,
  type RefAttributes,
  forwardRef,
} from 'react';

import { getHashString, hash } from '../util/hash.js';
import { getId } from '../util/id.js';
import { getAttributes } from './attributes.js';
import { type StyledCache } from './cache.js';
import { useStyledContext } from './context.js';
import { type StyledStringValue, getSimplifiedTemplateData, getStyleStringHook } from './string.js';

type StyledRefAttributes<TProps> = TProps extends { readonly ref?: LegacyRef<infer TRef> }
  ? RefAttributes<TRef>
  : RefAttributes<unknown>;

type StyledBase = {
  readonly staticClass: string;
  readonly templateRaw: readonly string[];
  readonly templateValues: readonly StyledStringValue<any, any>[];
  readonly type: string | (JSXElementConstructor<any> & { readonly displayName?: string; readonly name?: string });
};

type StyledComponent<TProps> = ForwardRefExoticComponent<PropsWithoutRef<TProps> & StyledRefAttributes<TProps>> & {
  readonly $$rms: StyledBase;
};

type StyledComponentConfig = {
  readonly displayName?: string;
};

const isStyledComponent = (type: JSXElementConstructor<any> | string): type is StyledComponent<any> => {
  return typeof type !== 'string' && '$$rms' in type;
};

const getDisplayName = (
  type: string | (JSXElementConstructor<any> & { readonly displayName?: string; readonly name?: string }),
): string => {
  const original = typeof type === 'string' ? type : type.displayName || type.name;
  return original ? 'Styled(' + original + ')' : 'Styled';
};

const getClasses = (cache: StyledCache, className?: string): [dynamicClasses: string, otherClasses: string] => {
  const otherClasses: string[] = [];
  const dynamicClasses: string[] = [];

  if (typeof className === 'string') {
    className.split(/\s+/g).forEach((value) => {
      if (cache.has(value)) {
        dynamicClasses.push(value);
      } else if (value) {
        otherClasses.push(value);
      }
    });
  }

  return [dynamicClasses.join(' '), otherClasses.join(' ')];
};

const createStyledComponent = <TProps, TTheme>(
  type: string | (JSXElementConstructor<TProps> & { readonly displayName?: string; readonly name?: string }),
  templateRaw: readonly string[],
  templateValues: readonly StyledStringValue<TProps, TTheme>[],
  useTheme: () => TTheme,
  config: StyledComponentConfig | undefined,
): StyledComponent<TProps> => {
  let baseStaticClass = '';

  if (isStyledComponent(type)) {
    [type, templateRaw, templateValues, baseStaticClass] = [
      type.$$rms.type,
      [...type.$$rms.templateRaw, ...templateRaw],
      [...type.$$rms.templateValues, '', ...templateValues],
      type.$$rms.staticClass,
    ];
  }

  const templateData = getSimplifiedTemplateData(templateRaw, templateValues);
  const displayName = config?.displayName || getDisplayName(type);
  const newStaticClass = getId(
    '$$rms/staticClass/' +
      getHashString(hash(JSON.stringify(templateData))) +
      '/' +
      baseStaticClass +
      '/' +
      displayName,
  );
  const staticClass = (newStaticClass + ' ' + baseStaticClass).trim();
  const selector = '.' + newStaticClass;
  const filterProps = typeof type === 'string' ? getAttributes : (value: Record<string, unknown>) => value;
  const useStyleString = getStyleStringHook(templateData, useTheme);

  const Styled = forwardRef((props: TProps & { children?: unknown; className?: string }, ref) => {
    const { className, children, ...rest } = props;
    const { cache, manager, renderer } = useStyledContext();
    const useEffect = manager.useEffect;
    const styleString = useStyleString(props);
    const [dynamicClasses, otherClasses] = getClasses(cache, className);
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
      className: (dynamicClass + ' ' + staticClass + ' ' + otherClasses).trimEnd(),
      ref,
    };

    useEffect(() => {
      manager.addComponentStyle(dynamicClass, cssText);
      return () => manager.unref(dynamicClass);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dynamicClass]);

    return renderer.render(type, styledProps, ...(children ? [children] : []));
  });

  Styled.displayName = displayName;
  Styled.toString = () => selector;

  return Object.assign(Styled as ForwardRefExoticComponent<PropsWithoutRef<TProps> & StyledRefAttributes<TProps>>, {
    $$rms: { staticClass, templateRaw, templateValues, type },
  });
};

export { type StyledComponent, type StyledComponentConfig, createStyledComponent };
