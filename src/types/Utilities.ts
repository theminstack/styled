export type OptionalKeys<T> = { [K in keyof T]-?: T extends { [K1 in K]: any } ? never : K }[keyof T];
export type RequiredKeys<T> = { [K in keyof T]-?: T extends { [K1 in K]: any } ? K : never }[keyof T];

/**
 * Resolve the structure of a complex type, and also remove any index signature.
 */
export type Flat<T> = T extends {}
  ? { [P in keyof T as string extends P ? never : number extends P ? never : P]: T[P] }
  : T;

/**
 * Get the value type of an object property.
 */
export type PropValue<T, K extends string> = K extends keyof T ? T[K] : never;

export type Assign<L, R> = {
  [P in keyof L | keyof R]: P extends keyof L
    ? P extends RequiredKeys<R>
      ? R[P]
      : P extends OptionalKeys<R>
      ? L[P] | R[P]
      : L[P]
    : P extends keyof R
    ? R[P]
    : never;
};

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
