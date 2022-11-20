import { type ReactNode, useEffect, useMemo, useState } from 'react';

import { DYNAMIC_CLASS_PREFIX, STATIC_CLASS_PREFIX } from '../util/constants.js';
import { type StyleCache, createStyleCache } from './cache.js';
import { StyledProvider } from './context.js';
import { type StyleElement, type StyleManager } from './manager.js';
import { type Renderer, createRenderer } from './renderer.js';

type StyledTestProps = {
  readonly children?: ReactNode;
};

type TestReplacer = {
  readonly replace: (value: string) => string;
  readonly restore: (value: string) => string;
};

type TestStyleManager = StyleManager & {
  readonly getCss: () => readonly string[];
  onChange?: () => void;
};

const createTestClassReplacer = (): TestReplacer => {
  const cache = new Map<string, string>();
  const dynamicCount = { current: 0 };
  const staticCount = { current: 0 };

  return {
    replace: (value) => {
      const matcher = new RegExp(`\\b(${DYNAMIC_CLASS_PREFIX}|${STATIC_CLASS_PREFIX})[0-9a-z]+\\b`, 'gu');

      return value.replace(matcher, (match, prefix) => {
        let className = cache.get(match);

        if (!className) {
          const count = prefix === DYNAMIC_CLASS_PREFIX ? dynamicCount : staticCount;
          className = prefix + 'test_' + (count.current++).toString(36);
          cache.set(match, className);
          cache.set(className, match);
        }

        return className;
      });
    },
    restore: (value) => {
      const matcher = new RegExp(`\\b(?:${DYNAMIC_CLASS_PREFIX}|${STATIC_CLASS_PREFIX})test_[0-9a-z]+\\b`, 'gu');

      return value.replace(matcher, (match) => cache.get(match) ?? match);
    },
  };
};

const createTestRenderer = (replacer: TestReplacer): Renderer => {
  const base = createRenderer();

  return {
    render: (component, props, ...children) => {
      const className = props.className && replacer.replace(props.className);
      return base.render(component, { ...props, className }, ...children);
    },
  };
};

const createTestCache = (replacer: TestReplacer): StyleCache => {
  const base = createStyleCache();

  return {
    resolve: (styleString, classNames) => {
      classNames = classNames && replacer.restore(classNames);
      const [cssText, className] = base.resolve(styleString, classNames);
      const testCssText = replacer.replace(cssText);
      const testClassName = replacer.replace(className);
      return [testCssText, testClassName];
    },
  };
};

const createTestStyleElement = (onChange?: () => void, onRemove?: () => void): StyleElement => {
  let textContent: string | null;

  const self: StyleElement = {
    remove: () => onRemove?.(),
    get textContent() {
      return textContent;
    },
    set textContent(value: string | null) {
      textContent = value;
      onChange?.();
    },
  };

  return self;
};

const createTestManager = (): TestStyleManager => {
  const globals = new Set<StyleElement>();
  const components = new Map<string, { refCount: number; style: StyleElement }>();
  const self: TestStyleManager = {
    addComponentStyle: (dynamicClass, cssText) => {
      let value = components.get(dynamicClass);
      if (!value)
        components.set(dynamicClass, (value = { refCount: 1, style: createTestStyleElement(() => self.onChange?.()) }));
      value.style.textContent = cssText;
    },
    addGlobalStyle: () => {
      const style = createTestStyleElement(
        () => self.onChange?.(),
        () => globals.delete(style),
      );
      globals.add(style);
      return style;
    },
    getCss: () => {
      return [
        ...Array.from(globals.values()).flatMap((style) => (style.textContent ? [style.textContent] : [])),
        ...Array.from(components.values()).flatMap(({ refCount, style }) =>
          refCount > 0 && style.textContent ? [style.textContent] : [],
        ),
      ];
    },
    unref: (dynamicClass) => {
      const style = components.get(dynamicClass);
      if (style) --style.refCount;
    },
  };

  return self;
};

const StyleView = (props: { manager: TestStyleManager }) => {
  const [, setCount] = useState(0);

  useEffect(() => {
    props.manager.onChange = () => setCount((current) => current + 1);
    () => void (props.manager.onChange = undefined);
    setCount((current) => current + 1);
  }, [props.manager]);

  const cssText = '\n    ' + props.manager.getCss().join('\n').replaceAll('\n', '\n    ') + '\n    ';

  return <style>{cssText}</style>;
};

const StyledTest = ({ children }: StyledTestProps): JSX.Element => {
  const replacer = useMemo(() => createTestClassReplacer(), []);
  const cache = useMemo(() => createTestCache(replacer), [replacer]);
  const renderer = useMemo(() => createTestRenderer(replacer), [replacer]);
  const manager = useMemo(() => createTestManager(), []);

  return (
    <>
      <StyledProvider cache={cache} renderer={renderer} manager={manager}>
        {children}
      </StyledProvider>
      <StyleView manager={manager} />
    </>
  );
};

export { StyledTest };
