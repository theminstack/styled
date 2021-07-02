export type OptionalKeys<T> = { [K in keyof T]-?: T extends { [K1 in K]: any } ? never : K }[keyof T];
export type RequiredKeys<T> = { [K in keyof T]-?: T extends { [K1 in K]: any } ? K : never }[keyof T];

/**
 * Like `Pick`, but the key (`K`) generic paramter type does not
 * have to extend `keyof T`.
 */
export type NonStrictPick<T, K extends string | number | symbol> = {
  [P in keyof T as K extends P ? P : never]: T[P];
};

/**
 * Choose a type based on whether type `A` is exactly type `B`.
 */
export type IfEquals<A, B, TEqualResult = A, TNotEqualResult = never> = (<T>() => T extends A ? 1 : 2) extends <
  T,
>() => T extends B ? 1 : 2
  ? TEqualResult
  : TNotEqualResult;

/**
 * Resolve the structure of an object type with intersections.
 */
export type Flat<T> = T extends {} ? { [P in keyof T]: T[P] } : T;

/**
 * Resolve the structure of an object type with intersections, and
 * strip properties that can only be set to undefined.
 */
export type FlatClean<T> = T extends {}
  ? { [P in keyof T as P extends P ? IfEquals<T[P], undefined, never, P> : never]: T[P] }
  : T;

/**
 * Get the value type of an object property.
 */
export type PropValue<T, K extends string | number | symbol> = K extends keyof T ? T[K] : never;

export type Defaults<L, R> = {
  [P in keyof L | keyof R]: P extends keyof L
    ? undefined extends L[P]
      ? P extends keyof R
        ? Exclude<L[P], undefined> | R[P]
        : L[P]
      : L[P]
    : P extends keyof R
    ? R[P]
    : never;
};

export type Merge<L, R> = {
  [P in keyof L | keyof R]: P extends keyof R
    ? undefined extends R[P]
      ? P extends keyof L
        ? Exclude<L[P], undefined> | R[P]
        : R[P]
      : R[P]
    : P extends keyof L
    ? L[P]
    : never;
};
