type StyleToken = readonly [
  literal: string,
  comment: string | undefined,
  terminator: string | undefined,
  whitespace: string | undefined,
];

type StyleTokenizer = Iterable<StyleToken> & Iterator<StyleToken, null>;

const createStyleTokenizer = (value: string): StyleTokenizer => {
  const rx =
    /\\.|(\s+\/{2}(?:[\s\S]*?(?:(?=\n)\s+|\s+$))|\/\*(?:[\s\S]*?\*\/\s+|[\s\S]*$))|([;{}])|(\s+)|'(?:(?:\\.|[^'])*(?:'|$))|"(?:(?:\\.|[^"])*(?:"|$))|[&@,:]|[^&@,:;{}'"\s]+/g;

  let done = false;

  const tokenizer: StyleTokenizer = {
    next() {
      if (!done) {
        const match = rx.exec(value);

        if (match != null) {
          return { done: false, value: match as unknown as StyleToken };
        }

        done = true;
      }

      return { done: true, value: null };
    },
    [Symbol.iterator]: () => tokenizer,
  };

  return tokenizer;
};

export { type StyleToken, type StyleTokenizer, createStyleTokenizer };
