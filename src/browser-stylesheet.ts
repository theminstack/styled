type BrowserStylesheet = {
  readonly cssString: string;
  readonly data: string;
  readonly mount: () => void;
  readonly unmount: () => void;
  readonly update: (cssString: string, data: string) => BrowserStylesheet;
};

const createBrowserStylesheet = (): BrowserStylesheet => {
  const styleElement = document.createElement('style');
  const stylesheet: BrowserStylesheet = {
    get cssString() {
      return styleElement?.textContent ?? '';
    },
    get data() {
      return styleElement?.getAttribute('data-tss') ?? '';
    },
    mount: () => {
      if (!styleElement.parentElement) {
        document.head.appendChild(styleElement);
      }
    },
    unmount: () => {
      if (styleElement.parentElement) {
        styleElement.parentElement.removeChild(styleElement);
      }
    },
    update: (newCssString, newData) => {
      styleElement.textContent = newCssString;
      styleElement.setAttribute('data-tss', newData);
      return stylesheet;
    },
  };

  return stylesheet;
};

export { createBrowserStylesheet };
