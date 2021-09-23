export type CssBuilder = {
  openBlock(selectors: readonly [string, ...string[]]): void;
  openBlockAt(identifier: string, rule?: string): void;
  closeBlock(): void;
  addDec(property: string, value?: string): void;
  addDecAt(identifier: string, value?: string): void;
  build(): string;
};

export function createCssBuilder(): CssBuilder {
  const openBlockBuffer: string[] = [];

  let atImports = '';
  let atNamespaces = '';
  let atOthers = '';
  let cssString = '';
  let indent = '';

  const builder: CssBuilder = {
    openBlock: (selectors) => {
      openBlockBuffer.push(indent + selectors.join(',\n' + indent) + ' {\n');
      indent += '  ';
    },
    openBlockAt: (identifier, rule) => {
      openBlockBuffer.push(indent + (rule ? identifier + ' ' + rule : identifier) + ' {\n');
      indent += '  ';
    },
    closeBlock: () => {
      indent = indent.slice(0, -2);

      if (openBlockBuffer.length) {
        openBlockBuffer.pop();
      } else {
        cssString += indent + '}\n';
      }
    },
    addDec: (key, value = '') => {
      if (!key || !value) {
        return;
      }

      while (openBlockBuffer.length) {
        cssString += openBlockBuffer.shift();
      }

      cssString += indent + key + ': ' + value + ';\n';
    },
    addDecAt: (identifier, value = '') => {
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
    build: () => {
      return atImports + atNamespaces + atOthers + cssString;
    },
  };

  return builder;
}
