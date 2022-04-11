type StyleToken = readonly [
  literal: string,
  comment: string | undefined,
  terminator: string | undefined,
  whitespace: string | undefined,
];

interface StyleTokenizer {
  next: () => null | StyleToken;
}

function createStyleTokenizer(value: string): StyleTokenizer {
  const rx =
    /\\.|(\s+\/{2}(?:[\s\S]*?(?:(?=\n)\s+|\s+$))|\/\*(?:[\s\S]*?\*\/\s+|[\s\S]*$))|([;{}])|(\s+)|'(?:(?:\\.|[^'])*(?:'|$))|"(?:(?:\\.|[^"])*(?:"|$))|[&@,:]|[^&@,:;{}'"\s]+/g;

  let isDone = false;

  return {
    next() {
      if (isDone) {
        return null;
      }

      const match = rx.exec(value);

      if (match == null) {
        isDone = true;
        return null;
      }

      return match as unknown as StyleToken;
    },
  };
}

export { type StyleToken, type StyleTokenizer, createStyleTokenizer };
