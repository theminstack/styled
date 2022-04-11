interface CssStatementBuilder {
  isAt: () => boolean;
  addToken: (token: string) => void;
  build: () => [key: string, value?: string];
}

function createCssStatementBuilder(): CssStatementBuilder {
  let separator: ':' | ' ' = ':';
  let key = '';
  let value = '';
  let space = '';
  let allowSpace = false;
  let isKey = true;
  let isAt = false;

  return {
    isAt: () => isAt,
    addToken: (token) => {
      if (token === separator && isKey) {
        isKey = false;
        space = '';
        allowSpace = false;
      } else if (token === ' ') {
        if (allowSpace) {
          space = ' ';
        }
      } else {
        if (isKey) {
          if (!key && token === '@') {
            isAt = true;
            separator = ' ';
          }

          key += space + token;
        } else {
          value += space + token;
        }

        space = '';
        allowSpace = true;
      }
    },
    build: () => {
      return value ? [key, value] : [key];
    },
  };
}

export { type CssStatementBuilder, createCssStatementBuilder };
