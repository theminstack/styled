import { createCssBuilder } from './createCssBuilder';
import { createTokenizer } from './createTokenizer';
import { processStyleBlock } from './processStyleBlock';

export type StyledCompiler = {
  compile(styleSelector: string, styleString: string): string;
};

export function createStyledCompiler(): StyledCompiler {
  return {
    compile(styleSelector, styleString) {
      const cssBuilder = createCssBuilder();
      const tokenizer = createTokenizer(styleString);

      cssBuilder.openBlock([styleSelector]);
      processStyleBlock(cssBuilder, tokenizer, [styleSelector], false);
      cssBuilder.closeBlock();

      return cssBuilder.build().trim();
    },
  };
}
