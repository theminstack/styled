type CssStatementBuilder = {
  readonly addToken: (token: string) => void;
  readonly build: () => readonly [key: string, value?: string];
  readonly isAt: () => boolean;
};

const createCssStatementBuilder = (): CssStatementBuilder => {
  let separator: ' ' | ':' = ':';
  let key = '';
  let value = '';
  let space = '';
  let allowSpace = false;
  let isKey = true;
  let isAt = false;

  return {
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
    isAt: () => isAt,
  };
};

export { type CssStatementBuilder, createCssStatementBuilder };
