type CssSelectors = readonly [string, ...string[]];

interface CssSelectorBuilder {
  addToken: (value: string) => void;
  build: () => CssSelectors;
}

function createCssSelectorBuilder(parentSelectors: CssSelectors): CssSelectorBuilder {
  const selectorTemplates: string[][] = [];

  let selectorTemplate: string[] = [];
  let buffer = '';
  let space = '';
  let allowSpaceOrComma = false;

  return {
    addToken: (token) => {
      if (token === ' ') {
        if (allowSpaceOrComma) {
          space = ' ';
        }
      } else if (token === ',') {
        if (allowSpaceOrComma) {
          selectorTemplate.push(buffer);
          buffer = '';
          selectorTemplates.push(selectorTemplate);
          selectorTemplate = [];
          allowSpaceOrComma = false;
        }
      } else {
        if (token === '&') {
          selectorTemplate.push(buffer + space);
          buffer = '';
        } else {
          buffer += space + token;
        }

        space = '';
        allowSpaceOrComma = true;
      }
    },
    build: () => {
      const selectors: string[] = [];

      selectorTemplate.push(buffer);
      selectorTemplates.push(selectorTemplate);

      for (let i = selectorTemplates.length - 1; i >= 0; --i) {
        const value = selectorTemplates[i];

        for (let j = parentSelectors.length - 1; j >= 0; --j) {
          const parentValue = parentSelectors[j];

          selectors.unshift(
            value.length == 1
              ? parentValue === ':root'
                ? value[0]
                : `${parentSelectors[j]} ${value[0]}`
              : value.join(parentSelectors[j]),
          );
        }
      }

      return selectors as [string, ...string[]];
    },
  };
}

export { type CssSelectorBuilder, type CssSelectors, createCssSelectorBuilder };
