import { type CssBuilder, createCssBuilder } from './css-builder.js';
import { createCssSelectorBuilder } from './css-selector-builder.js';
import { createCssStatementBuilder } from './css-statement-builder.js';
import { type StyleTokenizer, createStyleTokenizer } from './style-tokenizer.js';

const isConditionalGroup = (atRuleKey: string): atRuleKey is '@document' | '@media' | '@supports' => {
  return atRuleKey === '@media' || atRuleKey === '@supports' || atRuleKey === '@document';
};

const compileBlock = (
  cssBuilder: CssBuilder,
  tokenizer: StyleTokenizer,
  parentSelectors: readonly [string, ...(readonly string[])],
  isAt: boolean,
): boolean => {
  let statementBuilder = createCssStatementBuilder();
  let selectorBuilder = createCssSelectorBuilder(parentSelectors);

  for (const [literal, comment, terminator, whitespace] of tokenizer) {
    if (comment) {
      continue;
    }

    if (terminator) {
      if (terminator === '{') {
        if (!isAt) {
          cssBuilder.closeBlock();
        }

        if (statementBuilder.isAt()) {
          const [identifier, value] = statementBuilder.build();

          cssBuilder.openAtBlock(identifier, value);

          if (isConditionalGroup(identifier)) {
            cssBuilder.openBlock(parentSelectors);
            compileBlock(cssBuilder, tokenizer, parentSelectors, false);
            cssBuilder.closeBlock();
          } else {
            compileBlock(cssBuilder, tokenizer, parentSelectors, true);
          }

          cssBuilder.closeBlock();
        } else {
          const selectors = selectorBuilder.build();

          cssBuilder.openBlock(selectors);
          compileBlock(cssBuilder, tokenizer, selectors, false);
          cssBuilder.closeBlock();
        }

        if (!isAt) {
          cssBuilder.openBlock(parentSelectors);
        }
      } else {
        if (statementBuilder.isAt()) {
          const [identifier, value] = statementBuilder.build();

          cssBuilder.addAtDeclaration(identifier, value);
        } else {
          const [prop, value] = statementBuilder.build();

          cssBuilder.addDeclaration(prop, value);
        }

        if (terminator === '}') {
          return true;
        }
      }

      statementBuilder = createCssStatementBuilder();
      selectorBuilder = createCssSelectorBuilder(parentSelectors);
    } else if (whitespace) {
      statementBuilder.addToken(' ');

      if (!statementBuilder.isAt()) {
        selectorBuilder.addToken(' ');
      }
    } else {
      statementBuilder.addToken(literal);

      if (!statementBuilder.isAt()) {
        selectorBuilder.addToken(literal);
      }
    }
  }

  return false;
};

type StyleStringCompiler = {
  readonly compile: (selector: string, styleString: string) => string;
};

const createStyleStringCompiler = (): StyleStringCompiler => {
  return {
    compile: (styleSelector: string, styleString: string): string => {
      const cssBuilder = createCssBuilder();
      const tokenizer = createStyleTokenizer(styleString);

      cssBuilder.openBlock([styleSelector]);
      compileBlock(cssBuilder, tokenizer, [styleSelector], false);
      cssBuilder.closeBlock();

      return cssBuilder.build().trim();
    },
  };
};

export { type StyleStringCompiler, createStyleStringCompiler };
