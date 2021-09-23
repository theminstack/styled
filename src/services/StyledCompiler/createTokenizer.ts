export type Token = readonly [
  literal: string,
  comment: string | undefined,
  terminator: string | undefined,
  whitespace: string | undefined,
];

export interface ITokenizer {
  next(): null | Token;
}

export function createTokenizer(value: string): ITokenizer {
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

      return match as unknown as Token;
    },
  };
}
