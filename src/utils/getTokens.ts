import { Token } from '../types/Token';
import { Tokens } from '../types/Tokens';

/**
 * Tokenize the style string.
 *
 * The following tokens will be omitted.
 * - extra spaces
 * - empty blocks
 *
 * The following tokens will be added.
 * - missing semicolons
 * - missing closing curly braces
 * - missing block selectors (&)
 *
 * It should be safe to concatenate token arrays.
 */
export function getTokens(styleText: string): Tokens {
  const re =
    /\\[\s\S]|[@:]|(?:\s*([,;{}])\s*)|(['"])(?:[\s\S]*?\2|[\s\S]*$)|((\s+)?\/\*(?:[\s\S]*?\*\/(\s+)?|[\s\S]*$))|(\/{2}(?:[\s\S]*?(?:(?=\n)|$)))|(\s+)/g;
  const tokens: Token[] = [];

  let match: RegExpExecArray | null;
  let lastIndex = 0;
  let colonIndex: null | number = null;
  let separator = '';
  let depth = 0;
  let buffer: Token[] = [];

  function space() {
    buffer.length && !separator && (separator = ' ');
  }

  function comma() {
    if (buffer.length) {
      separator = ',';
    }
  }

  function colon() {
    colonIndex = colonIndex ?? buffer.length;
    other(':');
  }

  function other(value: string) {
    buffer.push(...(buffer.length && separator ? [separator] : []), value);
    separator = '';
  }

  function property() {
    if (buffer.length) {
      if (colonIndex != null) {
        tokens.push(
          ...buffer.slice(0, colonIndex + (buffer[colonIndex - 1] === ' ' ? -1 : 0)),
          ':',
          ...buffer.slice(colonIndex + 1 + (buffer[colonIndex + 1] === ' ' ? 1 : 0)),
          ';',
        );
      } else {
        tokens.push(...buffer, ';');
      }
    }

    reset();
  }

  function openBlock() {
    depth++;
    tokens.push(...(buffer.length ? buffer : ['&']), '{');
    reset();
  }

  function closeBlock() {
    depth--;

    if (tokens[tokens.length - 1] === '{') {
      // Discard the empty block.
      tokens.splice(-2);
    } else {
      tokens.push('}');
    }
  }

  function reset() {
    colonIndex = null;
    separator = '';
    buffer = [];
  }

  while (null != (match = re.exec(styleText))) {
    match.index > lastIndex && other(styleText.substring(lastIndex, match.index));
    lastIndex = re.lastIndex;

    const [token, terminator, , blockComment, blockCommentLeader, blockCommentTrailer, lineComment, blank] = match;

    if (blockComment) {
      (blockCommentLeader || blockCommentTrailer) && space();
    } else if (blank) {
      space();
    } else if (token === ':') {
      colon();
    } else if (terminator === ',') {
      comma();
    } else if (terminator === '{') {
      openBlock();
    } else if (terminator) {
      property();
      terminator === '}' && closeBlock();
    } else if (!lineComment) {
      other(token);
    }
  }

  lastIndex < styleText.length && other(styleText.substring(lastIndex));
  property();

  for (; depth > 0; depth--) {
    closeBlock();
  }

  return tokens;
}
