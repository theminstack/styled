import { CssBuilder } from './createCssBuilder';
import { createKeyValueBuilder } from './createKeyValueBuilder';
import { createSelectorsBuilder } from './createSelectorsBuilder';
import { ITokenizer, Token } from './createTokenizer';
import { isConditionalGroup } from './isConditionalGroup';

export function processStyleBlock(
  cssBuilder: CssBuilder,
  tokenizer: ITokenizer,
  parentSelectors: readonly [string, ...string[]],
  isAt: boolean,
): boolean {
  let keyValueBuilder = createKeyValueBuilder();
  let selectorsBuilder = createSelectorsBuilder(parentSelectors);
  let match: Token | null;

  while (null != (match = tokenizer.next())) {
    const [literal, comment, terminator, whitespace] = match;

    if (comment) {
      continue;
    }

    if (terminator) {
      if (terminator === '{') {
        if (!isAt) {
          cssBuilder.closeBlock();
        }

        if (keyValueBuilder.isAt()) {
          const [identifier, value] = keyValueBuilder.build();

          cssBuilder.openBlockAt(identifier, value);

          if (isConditionalGroup(identifier)) {
            cssBuilder.openBlock(parentSelectors);
            processStyleBlock(cssBuilder, tokenizer, parentSelectors, false);
            cssBuilder.closeBlock();
          } else {
            processStyleBlock(cssBuilder, tokenizer, parentSelectors, true);
          }

          cssBuilder.closeBlock();
        } else {
          const selectors = selectorsBuilder.build();

          cssBuilder.openBlock(selectors);
          processStyleBlock(cssBuilder, tokenizer, selectors, false);
          cssBuilder.closeBlock();
        }

        if (!isAt) {
          cssBuilder.openBlock(parentSelectors);
        }
      } else {
        if (keyValueBuilder.isAt()) {
          const [identifier, value] = keyValueBuilder.build();

          cssBuilder.addDecAt(identifier, value);
        } else {
          const [property, value] = keyValueBuilder.build();

          cssBuilder.addDec(property, value);
        }

        if (terminator === '}') {
          return true;
        }
      }

      keyValueBuilder = createKeyValueBuilder();
      selectorsBuilder = createSelectorsBuilder(parentSelectors);
    } else if (whitespace) {
      keyValueBuilder.addToken(' ');

      if (!keyValueBuilder.isAt()) {
        selectorsBuilder.addToken(' ');
      }
    } else {
      keyValueBuilder.addToken(literal);

      if (!keyValueBuilder.isAt()) {
        selectorsBuilder.addToken(literal);
      }
    }
  }

  return false;
}
