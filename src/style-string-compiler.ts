import { type CssBuilder, createCssBuilder } from './css-builder';
import { createCssSelectorBuilder } from './css-selector-builder';
import { createCssStatementBuilder } from './css-statement-builder';
import { type StyleToken, type StyleTokenizer, createStyleTokenizer } from './style-tokenizer';

function isConditionalGroup(atRuleKey: string): atRuleKey is '@media' | '@supports' | '@document' {
  return atRuleKey === '@media' || atRuleKey === '@supports' || atRuleKey === '@document';
}

function compileBlock(
  cssBuilder: CssBuilder,
  tokenizer: StyleTokenizer,
  parentSelectors: readonly [string, ...string[]],
  isAt: boolean,
): boolean {
  let statementBuilder = createCssStatementBuilder();
  let selectorBuilder = createCssSelectorBuilder(parentSelectors);
  let match: StyleToken | null;

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
          const [property, value] = statementBuilder.build();

          cssBuilder.addDeclaration(property, value);
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
}

interface StyleStringCompiler {
  compile: (selector: string, styleString: string) => string;
}

function createStyleStringCompiler(): StyleStringCompiler {
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
}

export { type StyleStringCompiler, createStyleStringCompiler };
