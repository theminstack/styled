type CssSelectors = readonly [string, ...(readonly string[])];

type CssSelectorBuilder = {
  readonly addToken: (value: string) => void;
  readonly build: () => CssSelectors;
};

const createCssSelectorBuilder = (parentSelectors: CssSelectors): CssSelectorBuilder => {
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

      for (
        let selectorTemplateIndex = selectorTemplates.length - 1;
        selectorTemplateIndex >= 0;
        --selectorTemplateIndex
      ) {
        const value = selectorTemplates[selectorTemplateIndex];

        for (let parentSelectorIndex = parentSelectors.length - 1; parentSelectorIndex >= 0; --parentSelectorIndex) {
          const parentValue = parentSelectors[parentSelectorIndex];

          selectors.unshift(
            value.length == 1
              ? parentValue === ':root'
                ? value[0]
                : `${parentSelectors[parentSelectorIndex]} ${value[0]}`
              : value.join(parentSelectors[parentSelectorIndex]),
          );
        }
      }

      return selectors as [string, ...string[]];
    },
  };
};

export { type CssSelectorBuilder, type CssSelectors, createCssSelectorBuilder };
