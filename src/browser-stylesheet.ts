interface BrowserStylesheet {
  readonly cssString: string;
  readonly data: string;
  update: (cssString: string, data: string) => BrowserStylesheet;
  mount: () => void;
  unmount: () => void;
}

function createBrowserStylesheet(): BrowserStylesheet {
  const styleElement = document.createElement('style');
  const stylesheet: BrowserStylesheet = {
    get cssString() {
      return styleElement?.textContent ?? '';
    },
    get data() {
      return styleElement?.getAttribute('data-tss') ?? '';
    },
    update: (newCssString, newData) => {
      styleElement.textContent = newCssString;
      styleElement.setAttribute('data-tss', newData);
      return stylesheet;
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
  };

  return stylesheet;
}

export { createBrowserStylesheet };
