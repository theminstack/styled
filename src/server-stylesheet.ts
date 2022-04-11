interface ServerStylesheet {
  readonly cssString: string;
  readonly data: string;
  update: (cssString: string, data: string) => ServerStylesheet;
}

function createServerStylesheet(): ServerStylesheet {
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
}

export { createServerStylesheet };
