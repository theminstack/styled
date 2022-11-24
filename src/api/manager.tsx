type StyleElement = {
  readonly remove: () => void;
  textContent: string | null;
};

type StyledManager = {
  readonly addComponentStyle: (dynamicClass: string, cssText: string) => void;
  readonly addGlobalStyle: () => StyleElement;
  readonly unref: (dynamicClass: string) => void;
};

type SsrStyledManager = StyledManager & {
  readonly getCss: () => string[];
  readonly getStyleElement: () => JSX.Element[];
  readonly getStyleTags: () => string;
};

const createStyledManager = (): StyledManager => {
  const cache = new Set<string>();

  let initialized = false;

  const init = () => {
    if (initialized) return;
    initialized = true;
    setTimeout(() => {
      document.querySelectorAll('style[data-styled-ssr="rms"]').forEach((element) => element.remove());
    });
  };

  return {
    addComponentStyle: (dynamicClass, cssText) => {
      if (!cache.has(dynamicClass)) {
        init();
        cache.add(dynamicClass);
        const style = document.createElement('style');
        style.setAttribute('data-styled', 'rms');
        style.textContent = cssText;
        document.head.appendChild(style);
      }
    },
    addGlobalStyle: () => {
      init();
      const style = document.createElement('style');
      style.setAttribute('data-styled-global', 'rms');
      document.head.insertBefore(style, document.querySelector('style[data-styled="rms"]'));
      return style;
    },
    // XXX: Only used (currently) for testing purposes. It may be used for
    //      other optimizations in the future, like garbage collecting unused
    //      style sheets.
    unref: () => undefined,
  };
};

const createSsrStyleElement = (): StyleElement => {
  return {
    // Removal is a no-op on the server.
    remove: () => undefined,
    textContent: null,
  };
};

const createSsrStyledManager = (): SsrStyledManager => {
  const globals: StyleElement[] = [];
  const components = new Map<string, StyleElement>();

  const manager: SsrStyledManager = {
    addComponentStyle: (dynamicClass, cssText) => {
      if (!components.has(dynamicClass)) {
        const style = createSsrStyleElement();
        style.textContent = cssText;
        components.set(dynamicClass, style);
      }
    },
    addGlobalStyle: () => {
      const style = createSsrStyleElement();
      globals.push(style);
      return style;
    },
    getCss: () => {
      return [
        ...globals.flatMap((style) => (style.textContent ? [style.textContent] : [])),
        ...Array.from(components.values()).flatMap((style) => (style.textContent ? [style.textContent] : [])),
      ];
    },
    getStyleElement: () => {
      return manager.getCss().map((cssText, i) => (
        <style key={i} data-styled-ssr="rms">
          {cssText}
        </style>
      ));
    },
    getStyleTags: () => {
      return manager
        .getCss()
        .map((cssText) => '<style data-styled-ssr="rms">' + cssText + '</style>')
        .join('\n');
    },
    unref: () => undefined,
  };

  return manager;
};

const defaultStyledManager = createStyledManager();

export {
  type SsrStyledManager,
  type StyledManager,
  type StyleElement,
  createSsrStyledManager,
  createStyledManager,
  defaultStyledManager,
};
