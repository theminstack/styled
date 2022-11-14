type AstNode = {
  children: (AstNode | string)[];
  condition?: { at: string } | { selectors: [string, ...string[]] };
};

const compile = (styleString: string): AstNode => {
  styleString = styleString.replaceAll('\0', '');

  let i = 0;

  const comment = (terminator: '*/' | '\n'): void => {
    const index = styleString.indexOf(terminator, (i += 2));
    i = index < 0 ? styleString.length + 1 : index + terminator.length;
  };

  const quoted = (terminator: '"' | "'"): string => {
    for (const start = i, length = styleString.length; i < length; ++i) {
      const char = styleString[i] ?? '';

      if (char === '\\') {
        ++i;
        continue;
      }
      if (char === '\r' || char === '\n') break;
      if (char === terminator) return styleString.slice(start, i + 1);
    }

    throw new Error(`Style parsing error (expected: ${terminator} )`);
  };

  const statement = <TTerminator extends string>(
    ...terminators: [TTerminator, ...TTerminator[]]
  ): [slice: string, terminator: TTerminator] => {
    let slice = '';
    let space = '';

    for (const length = styleString.length; i <= length; ++i) {
      const char = styleString[i] ?? '';

      // Escape sequence. Can't be terminators, brackets, or quotes.
      if (char === '\\') {
        // Only add the escape sequence if it's two characters long.
        if (++i < styleString.length) {
          slice += space + char + (styleString[i] ?? '');
        }
      } else {
        if (terminators.includes(char as TTerminator)) {
          ++i;
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
          case '/':
            switch (styleString[i + 1]) {
              case '/':
                space = ' ';
                comment('\n');
                break;
              case '*':
                space = ' ';
                comment('*/');
                break;
              default:
                slice += space + char;
                break;
            }
            break;
          case '(':
            ++i;
            slice += space + char + statement(')').join('');
            break;
          case '[':
            ++i;
            slice += space + char + statement(']').join('');
            break;
          case '"':
          case "'":
            ++i;
            slice += space + char + quoted(char);
            break;
          default:
            slice += space + char;
            break;
        }
      }

      space = '';
    }

    throw new Error(`Style parsing error (expected: ${terminators.join(' ')} )`);
  };

  const node = (): AstNode => {
    const current: AstNode = { children: [] };
    const csv: string[] = [];

    const block = () => {
      const child = node();

      if (child.children.length) {
        child.condition =
          csv[0]?.[0] === '@'
            ? { at: csv.join(',').replaceAll('\0', '') }
            : csv.length
            ? { selectors: [...csv] as [string, ...string[]] }
            : undefined;
        current.children.push(child);
      }

      csv.length = 0;
    };

    const prop = () => {
      const value = csv.join(',').replaceAll('\0', '');
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
          prop();
          break;
        case '}':
          prop();
          return current;
      }
    }

    if (i < styleString.length - 1) throw new Error(`Style parsing error (unexpected: } )`);

    return current;
  };

  return node();
};

export { type AstNode, compile };
