type Printer = {
  close: () => void;
  open: (condition: string) => void;
  prop: (value: string) => void;
  toString: () => string;
};

const createPrettyPrinter = (indentString = '  '): Printer => {
  let css = '';
  let indent = '';

  return {
    close: () => {
      indent = indent.slice(indentString.length);
      css += indent + '}\n';
    },
    open: (condition) => {
      css += indent + condition + ' {\n';
      indent += indentString;
    },
    prop: (value) => {
      css += indent + value + ';\n';
    },
    toString: () => css,
  };
};

const createMinifiedPrinter = (): Printer => {
  let css = '';

  return {
    close: () => void (css += '}'),
    open: (condition) => void (css += condition + '{'),
    prop: (value) => void (css += value + ';'),
    toString: () => css,
  };
};

export { type Printer, createMinifiedPrinter, createPrettyPrinter };
