type ServerStylesheet = {
  readonly cssString: string;
  readonly data: string;
  readonly update: (cssString: string, data: string) => ServerStylesheet;
};

const createServerStylesheet = (): ServerStylesheet => {
  let cssString = '';
  let data = '';

  const stylesheet: ServerStylesheet = {
    get cssString() {
      return cssString;
    },
    get data() {
      return data;
    },
    update: (newCssString, newData) => {
      cssString = newCssString;
      data = newData;
      return stylesheet;
    },
  };

  return stylesheet;
};

export { createServerStylesheet };
