import { environment } from '../util/environment.js';

type AstNode = {
  children: (AstNode | string)[];
  condition?: { readonly at: string } | { readonly selectors: [string, ...string[]] };
};

const compile = (styleString: string): AstNode => {
  let i = 0;

  const next = () => {
    const char = styleString[i++] ?? '';
    if (char === '/' && (styleString[i] === '*' || styleString[i] === '/')) return char + styleString[i++] ?? '';
    if (char === '\\') return i < styleString.length ? char + styleString[i++] : '';
    if (char === '\0') return '';
    return char;
  };

  const comment = (terminator: '*/' | '\n'): void => {
    while (i < styleString.length) {
      let char = next();
      if (char === '*') char += next();
      if (char === terminator) break;
    }
  };

  const quote = (terminator: '"' | "'"): string => {
    let slice = '';
    while (i < styleString.length) {
      const char = next();
      slice += char;
      if (char === '\r' || char === '\n') break;
      if (char === terminator) return slice;
    }
    throw new Error(`Styled parsing error (expected: ${terminator} )`);
  };

  const statement = <TTerminator extends string>(
    ...terminators: [TTerminator, ...TTerminator[]]
  ): [slice: string, terminator: TTerminator] => {
    let slice = '';
    let space = '';

    while (i <= styleString.length) {
      const char = next();

      if (terminators.includes(char as TTerminator)) {
        return [slice, char as TTerminator];
      }

      switch (char) {
        case ' ':
        case '\t':
        case '\r':
        case '\n':
          space = slice ? ' ' : '';
          continue;
        case '&':
          slice += space + '\0&\0';
          break;
        case '//':
          space = ' ';
          comment('\n');
          break;
        case '/*':
          space = ' ';
          comment('*/');
          break;
        case '(':
          slice += space + char + statement(')').join('');
          break;
        case '[':
          slice += space + char + statement(']').join('');
          break;
        case '"':
        case "'":
          slice += space + char + quote(char);
          break;
        default:
          slice += space + char;
          break;
      }

      space = '';
    }

    throw new Error(`Styled parsing error (expected: ${terminators.join(' ')} )`);
  };

  const node = (depth = 0): AstNode => {
    const current: AstNode = { children: [] };
    const csv: string[] = [];

    const block = () => {
      const child = node(depth + 1);

      if (child.children.length) {
        child.condition =
          csv[0]?.[0] === '@'
            ? { at: csv.join(', ').replaceAll('\0', '') }
            : csv.length
            ? { selectors: [...csv] as [string, ...string[]] }
            : undefined;
        current.children.push(child);
      }

      csv.length = 0;
    };

    const declaration = () => {
      const value = csv.join(', ').replaceAll('\0', '');
      value && !value.endsWith(':') && current.children.push(value);
      csv.length = 0;
    };

    while (i <= styleString.length) {
      const [slice, terminator] = statement(',', ';', '{', '}', '');

      slice && csv.push(slice);

      switch (terminator) {
        case '{':
          block();
          break;
        case ';':
        case '':
          declaration();
          break;
        case '}':
          declaration();
          if (depth > 0) return current;
          break;
      }
    }

    return current;
  };

  try {
    return node();
  } catch (error) {
    if (environment !== 'production') throw error;
    console.error(error);
    return { children: [] };
  }
};

export { type AstNode, compile };
