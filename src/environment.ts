declare const process: { readonly env: Record<string, string> } | undefined;

type Environment = {
  readonly isBrowser: boolean;
  readonly isTest: boolean;
};

const environment: Environment = {
  isBrowser: typeof document !== 'undefined',
  isTest: typeof process !== 'undefined' && process.env.NODE_ENV === 'test',
};

export { environment };
