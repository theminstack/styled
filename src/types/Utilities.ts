/**
 * Resolve the structure of a complex type, and also remove any index signature.
 */
export type Id<T> = T extends {}
  ? { [P in keyof T as string extends P ? never : number extends P ? never : P]: T[P] }
  : T;

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
 * Recursive type which for non-greedy assignment, where the "right"
 * value is only assigned if the "left" value is undefined.
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
