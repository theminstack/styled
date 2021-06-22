export type OptionalKeys<T> = { [K in keyof T]-?: T extends { [K1 in K]: any } ? never : K }[keyof T];
export type RequiredKeys<T> = { [K in keyof T]-?: T extends { [K1 in K]: any } ? K : never }[keyof T];

/**
 * Resolve the structure of a complex type, and also remove any index signature.
 */
export type Id<T> = T extends {}
  ? { [P in keyof T as string extends P ? never : number extends P ? never : P]: T[P] }
  : T;

type Assign2<L, R> = Id<
  {
    [P in keyof L | keyof R]: P extends keyof L
      ? P extends RequiredKeys<R>
        ? R[P]
        : P extends OptionalKeys<R>
        ? L[P] | R[P]
        : L[P]
      : P extends keyof R
      ? R[P]
      : never;
  }
>;
/**
 * Recursive type for unconditional assignment, where the "right"
 * (own property) value overwrites the "left".
 */
export type Assign<A extends readonly [...any]> = A extends [infer L, ...infer R] ? Assign2<L, Assign<R>> : unknown;

type Defaults2<L, R> = Id<
  {
    [P in keyof L | keyof R]: P extends keyof L
      ? undefined extends L[P]
        ? P extends keyof R
          ? Exclude<L[P], undefined> | R[P]
          : L[P]
        : L[P]
      : P extends keyof R
      ? R[P]
      : never;
  }
>;
/**
 * Recursive type for non-greedy assignment, where the "right" value
 * is only assigned if the "left" value is undefined.
 */
export type Defaults<A extends readonly [...any]> = A extends [infer L, ...infer R]
  ? Defaults2<L, Defaults<R>>
  : unknown;

type Merge2<L, R> = Id<
  {
    [P in keyof L | keyof R]: P extends keyof R
      ? undefined extends R[P]
        ? P extends keyof L
          ? Exclude<L[P], undefined> | R[P]
          : R[P]
        : R[P]
      : P extends keyof L
      ? L[P]
      : never;
  }
>;
/**
 * Recursive type for greedy assignment, where the "right" value
 * always overwrites the "left" value, unless the "right" value is
 * undefined.
 */
export type Merge<A extends readonly [...any]> = A extends [infer L, ...infer R] ? Merge2<L, Merge<R>> : unknown;
