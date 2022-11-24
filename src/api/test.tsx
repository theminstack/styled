import { type ReactNode, useLayoutEffect, useMemo, useRef } from 'react';

import { type StyledCache, createStyledCache } from './cache.js';
import { StyledProvider } from './context.js';
import { type StyledManager, type StyleElement } from './manager.js';
import { type StyledRenderer, createStyledRenderer } from './renderer.js';

type StyledTestProps = {
  readonly children?: ReactNode;
};

type TestReplacer = {
  readonly replace: (value: string) => string;
  readonly restore: (value: string) => string;
};

type TestStyledManager = StyledManager & {
  readonly getCss: () => readonly string[];
  onChange?: () => void;
};

const createTestClassReplacer = (): TestReplacer => {
  const cache = new Map<string, string>();
  const dynamicCount = { current: 0 };
  const staticCount = { current: 0 };

  return {
    replace: (value) => {
      return value.replace(/_rms([sd])[0-9a-z]{6}_/gu, (match, type) => {
        let className = cache.get(match);

        if (!className) {
          className =
            '_test' +
            (type === 's'
              ? '-static-' + (staticCount.current++).toString(36)
              : '-dynamic-' + (dynamicCount.current++).toString(36)) +
            '_';
          cache.set(match, className);
          cache.set(className, match);
        }

        return className;
      });
    },
    restore: (value) => {
      return value.replace(/_test-(?:static|dynamic)-[0-9a-z]+_/gu, (match) => cache.get(match) ?? match);
    },
  };
};

const createTestRenderer = (replacer: TestReplacer): StyledRenderer => {
  const base = createStyledRenderer();

  return {
    render: (component, props, ...children) => {
      const className = props.className && replacer.replace(props.className);
      return base.render(component, { ...props, className }, ...children);
    },
  };
};

const createTestCache = (replacer: TestReplacer): StyledCache => {
  const base = createStyledCache();

  return {
    has: (className) => base.has(replacer.restore(className)),
    resolve: (styleString, classNames) => {
      classNames = classNames && replacer.restore(classNames);
      const [cssText, className] = base.resolve(styleString, classNames);
      const testCssText = replacer.replace(cssText);
      const testClassName = replacer.replace(className);
      return [testCssText, testClassName];
    },
    resolveGlobal: (styleString) => {
      return replacer.replace(base.resolveGlobal(styleString));
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

const createTestManager = (): TestStyledManager => {
  const globals = new Set<StyleElement>();
  const components = new Map<string, { refCount: number; style: StyleElement }>();
  const self: TestStyledManager = {
    addComponentStyle: (dynamicClass, cssText) => {
      let value = components.get(dynamicClass);
      if (!value) {
        components.set(dynamicClass, (value = { refCount: 1, style: createTestStyleElement(() => self.onChange?.()) }));
      } else {
        ++value.refCount;
      }
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
      const value = components.get(dynamicClass);
      if (value) --value.refCount;
    },
  };

  return self;
};

const StyleView = (props: { manager: TestStyledManager }) => {
  const style = useRef<HTMLStyleElement | null>(null);

  useLayoutEffect(() => {
    const update = () => {
      if (style.current) {
        const cssTexts = props.manager.getCss();
        style.current.textContent = cssTexts.length
          ? '\n    ' + cssTexts.join('\n').replaceAll('\n', '\n    ') + '\n    '
          : '/* no styles */';
      }
    };

    props.manager.onChange = update;
    update();

    () => void (props.manager.onChange = undefined);
  }, [props.manager]);

  return <style ref={style}>{'/* no styles */'}</style>;
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
