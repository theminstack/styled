type CssBuilder = {
  readonly addAtDeclaration: (identifier: string, value?: string) => void;
  readonly addDeclaration: (property: string, value?: string) => void;
  readonly build: () => string;
  readonly closeBlock: () => void;
  readonly openAtBlock: (identifier: string, rule?: string) => void;
  readonly openBlock: (selectors: readonly [string, ...(readonly string[])]) => void;
};

const createCssBuilder = (): CssBuilder => {
  const openBlockBuffer: string[] = [];

  let atImports = '';
  let atNamespaces = '';
  let atOthers = '';
  let cssString = '';
  let indent = '';

  const builder: CssBuilder = {
    addAtDeclaration: (identifier, value = '') => {
      if (identifier.length < 2 || identifier === '@charset' || !value) {
        return;
      }

      const declaration = identifier + ' ' + value + ';\n';

      if (identifier === '@import') {
        atImports += declaration;
      } else if (identifier === '@namespace') {
        atNamespaces += declaration;
      } else {
        atOthers += declaration;
      }
    },
    addDeclaration: (key, value) => {
      if (!key || value == null || value === 'false' || value === 'null' || value === 'undefined') {
        return;
      }

      while (openBlockBuffer.length) {
        cssString += openBlockBuffer.shift();
      }

      cssString += indent + key + ': ' + (value === 'true' ? '1' : value) + ';\n';
    },
    build: () => {
      return atImports + atNamespaces + atOthers + cssString;
    },
    closeBlock: () => {
      indent = indent.slice(0, -2);

      if (openBlockBuffer.length) {
        openBlockBuffer.pop();
      } else {
        cssString += indent + '}\n';
      }
    },
    openAtBlock: (identifier, rule) => {
      openBlockBuffer.push(indent + (rule ? identifier + ' ' + rule : identifier) + ' {\n');
      indent += '  ';
    },
    openBlock: (selectors) => {
      openBlockBuffer.push(indent + selectors.join(',\n' + indent) + ' {\n');
      indent += '  ';
    },
  };

  return builder;
};

export { type CssBuilder, createCssBuilder };
